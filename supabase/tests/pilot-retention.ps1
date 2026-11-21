$ErrorActionPreference = 'Stop'
$PSNativeCommandUseErrorActionPreference = $true
if ($PSVersionTable.PSVersion -lt [version]'7.4') { throw 'PowerShell 7.4 or newer is required for AES-GCM.' }

$container = 'supabase_db_muba-site'
$root = Split-Path -Parent $PSScriptRoot
$testRoot = Join-Path $root '.temp'
$case = [guid]::NewGuid().ToString('N')
$source = "muba_pilot_$case"
$recovery = "muba_restore_$case"
$work = Join-Path $testRoot "pilot-$case"
$null = New-Item -ItemType Directory -Path $work
$key = [Security.Cryptography.RandomNumberGenerator]::GetBytes(32)
$cipher = [Security.Cryptography.AesGcm]::new($key, 16)
$created = @()

function Invoke-PilotSql($database, $statement) {
    $statement | docker exec -i $container psql -X -qAt -U postgres -d $database -v ON_ERROR_STOP=1 -f -
}
function Assert-Pilot($condition, $message) {
    if (!$condition) { throw $message }
}
function Start-PilotProcess($arguments, [switch]$capture) {
    $info = [Diagnostics.ProcessStartInfo]::new('docker')
    $info.UseShellExecute = $false
    $info.RedirectStandardOutput = $capture
    $info.RedirectStandardInput = !$capture
    foreach ($argument in $arguments) { $info.ArgumentList.Add($argument) }
    return [Diagnostics.Process]::Start($info)
}

try {
    Invoke-PilotSql postgres "create database $source template template0;"
    $created += $source
    Invoke-PilotSql postgres "create database $recovery template template0;"
    $created += $recovery

    Invoke-PilotSql $source @'
create schema auth;
create table auth.users (id uuid primary key);
create table auth.identities (id uuid primary key, user_id uuid, provider text, identity_data jsonb, last_sign_in_at timestamptz);
create function auth.uid() returns uuid language sql as 'select null::uuid';
'@
    Get-ChildItem -LiteralPath (Join-Path $root 'migrations') -Filter '*.sql' -File |
        Sort-Object Name | ForEach-Object {
            Invoke-PilotSql $source (Get-Content -LiteralPath $_.FullName -Raw)
        }

    $requestKey = [guid]::NewGuid()
    $active = Invoke-PilotSql $source @"
select public.save_ride('$requestKey', jsonb_build_object(
  'language', 'en', 'pickup', 'Fictional station', 'destination', 'Fictional airport',
  'pickup_time', to_char(now() at time zone 'Europe/Paris' + interval '2 days', 'YYYY-MM-DD"T"HH24:MI'),
  'passengers', 1, 'passenger_name', 'Fictional Rider', 'passenger_phone', '+33000000000',
  'passenger_email', 'pilot@example.test'
))->>'reference';
"@
    Assert-Pilot ($active -match '^\d+$') 'Could not save the fictional active booking.'
    $result = Invoke-PilotSql $source @'
begin;
insert into booking_private.ride
  (request_key_hash, request_hash, source, status, language, pickup, destination,
   pickup_at, return_at, estimated_minutes, passengers, passenger_name, passenger_phone)
select sha256(uuid_send(gen_random_uuid())), sha256(uuid_send(gen_random_uuid())), 'web', status, 'en',
  label, 'Fictional endpoint', pickup_at, return_at, minutes, 1, 'Fictional rider', '+33000000000'
from (values
  ('expired-finish', 'confirmed', now() - interval '90 days 30 minutes', null::timestamptz, 30),
  ('recent-return', 'confirmed', now() - interval '91 days', now() - interval '90 days', 30),
  ('expired-decision', 'pending', now() + interval '2 days', null, null),
  ('recent-decision', 'pending', now() - interval '93 days', null, null)
) as fixtures(label, status, pickup_at, return_at, minutes);
update booking_private.ride set status='declined' where pickup in ('expired-decision','recent-decision');
do $check$
begin
  if not exists (select from booking_private.ride where pickup='recent-decision' and final_decision_at=now()) then
    raise exception 'Final decision timestamp was not recorded';
  end if;
end;
$check$;
update booking_private.ride set final_decision_at=now() - interval '90 days' where pickup='expired-decision';
insert into booking_private.rider_email(reference,address)
select reference, 'expired@example.test' from booking_private.ride where pickup='expired-finish';
select booking_private.queue_rider_email(ride, 'receipt') from booking_private.ride where pickup='expired-finish';
select booking_private.purge_expired_rides();
select string_agg(pickup, ',' order by pickup) from booking_private.ride;
select count(*) from booking_private.rider_email where address='expired@example.test';
select count(*) from booking_private.booking_email where recipient='expired@example.test';
select count(*) from booking_private.calendar_job j
where not active and not exists (select from booking_private.ride r where r.reference=j.ride_reference);
select booking_private.purge_expired_rides();
commit;
'@
    $actual = @($result | Where-Object { $_ -ne '' }) -join '|'
    Assert-Pilot ($actual -eq '2|Fictional station,recent-decision,recent-return|0|0|1|0') 'Retention boundary, cascade, Calendar removal queue or idempotency failed.'

    $today = [TimeZoneInfo]::ConvertTimeBySystemTimeZoneId([DateTimeOffset]::Now, 'Europe/Paris').Date
    $archive = Join-Path $work ("muba-{0:yyyy-MM-dd}.dump.enc" -f $today)
    $dump = Start-PilotProcess @('exec', $container, 'pg_dump', '-U', 'postgres', '-Fc', $source) -capture
    $memory = [IO.MemoryStream]::new()
    try {
        $dump.StandardOutput.BaseStream.CopyTo($memory)
        $dump.WaitForExit()
        Assert-Pilot ($dump.ExitCode -eq 0) 'Fictional database export failed.'
        $plain = $memory.ToArray()
    } finally {
        $dump.Dispose()
        $memory.Dispose()
    }
    $nonce = [Security.Cryptography.RandomNumberGenerator]::GetBytes(12)
    $tag = [byte[]]::new(16)
    $encrypted = [byte[]]::new($plain.Length)
    $cipher.Encrypt($nonce, $plain, $encrypted, $tag)
    [Array]::Clear($plain)
    [IO.File]::WriteAllBytes($archive, $nonce + $tag + $encrypted)

    $stored = [IO.File]::ReadAllBytes($archive)
    $cipher.Decrypt([byte[]]$stored[0..11], [byte[]]$stored[28..($stored.Length-1)], [byte[]]$stored[12..27], $plain)
    $restore = Start-PilotProcess @('exec', '-i', $container, 'pg_restore', '-U', 'postgres', '--exit-on-error', '-d', $recovery)
    try {
        $restore.StandardInput.BaseStream.Write($plain, 0, $plain.Length)
        $restore.StandardInput.Close()
        $restore.WaitForExit()
        Assert-Pilot ($restore.ExitCode -eq 0) 'Fictional database restore failed.'
    } finally {
        [Array]::Clear($plain)
        $restore.Dispose()
    }

    $restored = Invoke-PilotSql $recovery "set role anon; select public.get_ride('$requestKey')->>'reference';"
    Assert-Pilot ($restored -eq $active) 'Private booking lookup failed after restore.'
    $restoredMail = Invoke-PilotSql $recovery "select count(*) from booking_private.rider_email where reference=$active and address='pilot@example.test';"
    Assert-Pilot ($restoredMail -eq '1') 'Opt-in recipient was not restored.'

    foreach ($daysAgo in 1..8) {
        $sample = Join-Path $work ("muba-{0:yyyy-MM-dd}.dump.enc" -f $today.AddDays(-$daysAgo))
        Copy-Item -LiteralPath $archive -Destination $sample
    }
    $archives = @(Get-ChildItem -LiteralPath $work -File -Filter 'muba-*.dump.enc')
    foreach ($file in $archives) {
        $date = [DateTime]::ParseExact($file.Name.Substring(5,10), 'yyyy-MM-dd', [Globalization.CultureInfo]::InvariantCulture)
        if ($date -lt $today.AddDays(-6)) { Remove-Item -LiteralPath $file.FullName }
    }
    Assert-Pilot (@(Get-ChildItem -LiteralPath $work -File -Filter 'muba-*.dump.enc').Count -eq 7) 'Seven-day archive window failed.'
    'PASS 90-day rider purge, encrypted daily archive window, and restored private booking.'
} finally {
    $cipher.Dispose()
    [Array]::Clear($key)
    foreach ($database in $created) {
        Invoke-PilotSql postgres "drop database $database;"
    }
    $parent = (Resolve-Path -LiteralPath $testRoot).Path
    $resolved = (Resolve-Path -LiteralPath $work).Path
    if ([IO.Path]::GetDirectoryName($resolved) -ne $parent -or [IO.Path]::GetFileName($resolved) -ne "pilot-$case") {
        throw 'Unexpected pilot scratch path.'
    }
    Remove-Item -LiteralPath $resolved -Recurse -Force
}
