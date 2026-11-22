$ErrorActionPreference = 'Stop'
$PSNativeCommandUseErrorActionPreference = $true
. (Join-Path (Split-Path -Parent $PSScriptRoot) "booking-archive.ps1")

$container = 'supabase_db_muba-site'
$root = Split-Path -Parent $PSScriptRoot
$testRoot = Join-Path $root '.temp'
$case = [guid]::NewGuid().ToString('N')
$source = "muba_pilot_$case"
$recovery = "muba_restore_$case"
$work = Join-Path $testRoot "pilot-$case"
$null = New-Item -ItemType Directory -Path $work
$key = [Security.Cryptography.RandomNumberGenerator]::GetBytes(32)
$created = @()

function Invoke-PilotSql($database, $statement) {
    $statement | docker exec -i $container psql -X -qAt -U postgres -d $database -v ON_ERROR_STOP=1 -f -
}
function Assert-Pilot($condition, $message) {
    if (!$condition) { throw $message }
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
create function auth.uid() returns uuid language sql
as $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
'@
    Get-ChildItem -LiteralPath (Join-Path $root 'migrations') -Filter '*.sql' -File |
        Sort-Object Name | ForEach-Object {
            Invoke-PilotSql $source (Get-Content -LiteralPath $_.FullName -Raw)
        }

    $requestKey = [guid]::NewGuid()
    $active = Invoke-PilotSql $source @"
insert into booking_private.booking_code (address, language, source_hash, code_hash)
values ('pilot@example.test', 'en', '', sha256(convert_to('fixture-pilot','UTF8')));
select public.save_ride('$requestKey', jsonb_build_object(
  'language', 'en', 'pickup', 'Fictional station', 'destination', 'Fictional airport',
  'pickup_time', to_char(now() at time zone 'Europe/Paris' + interval '2 days', 'YYYY-MM-DD"T"HH24:MI'),
  'passengers', 1, 'passenger_name', 'Fictional Rider', 'passenger_phone', '+33000000000',
  'passenger_email', 'pilot@example.test', 'email_code', 'fixture-pilot'
))->>'reference';
"@
    Assert-Pilot ($active -match '^\d+$') 'Could not save the fictional active booking.'
    $pauseTest = @'
begin;
insert into booking_private.booking_code (address, language, source_hash, code_hash)
values ('pause-rider@example.test', 'en', '', sha256(convert_to('fixture-resume','UTF8'))),
       ('pause-rider@example.test', 'en', '', sha256(convert_to('fixture-notice','UTF8')));
select set_config('muba.fixture_key', '__REQUEST_KEY__', true);
select set_config('muba.fixture_trip', jsonb_build_object(
  'language', 'en', 'pickup', 'Fictional checkpoint', 'destination', 'Fictional airport',
  'pickup_time', to_char(now() at time zone 'Europe/Paris' + interval '3 days', 'YYYY-MM-DD"T"HH24:MI'),
  'passengers', 1, 'passenger_name', 'Fictional Rider', 'passenger_phone', '+33000000000',
  'passenger_email', 'pause-rider@example.test', 'email_code', 'fixture-resume'
)::text, true);
insert into auth.users (id) values ('b6b55d5a-5823-49c8-bdec-508544bf66e3');
insert into booking_private.driver (user_id) values ('b6b55d5a-5823-49c8-bdec-508544bf66e3');
revoke execute on function public.save_ride(uuid, jsonb, text),
  booking_private.save_ride(uuid, jsonb, text) from anon;
set local role anon;
do $check$
begin
  if public.get_ride(current_setting('muba.fixture_key')::uuid)->>'reference' is null then
    raise exception 'Private status stopped working during the intake pause';
  end if;
  begin
    perform public.save_ride(gen_random_uuid(), current_setting('muba.fixture_trip')::jsonb);
    raise exception 'Anonymous web intake could still save during the pause';
  exception when insufficient_privilege then
    null;
  end;
end;
$check$;
set local role authenticated;
set local request.jwt.claim.sub = 'b6b55d5a-5823-49c8-bdec-508544bf66e3';
do $check$
begin
  if (select count(*) from public.list_rides()) <> 1
      or public.save_ride(gen_random_uuid(), current_setting('muba.fixture_trip')::jsonb, 'phone')->>'status'
         is distinct from 'confirmed' then
    raise exception 'The assigned driver could not list or save rides during the pause';
  end if;
end;
$check$;
reset role;
grant execute on function public.save_ride(uuid, jsonb, text),
  booking_private.save_ride(uuid, jsonb, text) to anon;
set local role anon;
do $check$
begin
  if public.save_ride(gen_random_uuid(), current_setting('muba.fixture_trip')::jsonb)->>'status'
      is distinct from 'pending' then
    raise exception 'Anonymous web intake did not resume';
  end if;
  begin
    perform public.save_ride(gen_random_uuid(), current_setting('muba.fixture_trip')::jsonb ||
      jsonb_build_object('email_code', 'fixture-notice', 'pickup_time', to_char(
        (date_trunc('minute', now()) + interval '119 minutes') at time zone 'Europe/Paris', 'YYYY-MM-DD"T"HH24:MI')));
    raise exception 'Web intake accepted a pickup inside the two-hour notice window';
  exception when sqlstate 'PT422' then
    if sqlerrm <> 'WEB_NOTICE_REQUIRED' then raise; end if;
  end;
  if public.save_ride(gen_random_uuid(), current_setting('muba.fixture_trip')::jsonb ||
        jsonb_build_object('email_code', 'fixture-notice', 'pickup_time', to_char(
          (date_trunc('minute', now()) + interval '121 minutes') at time zone 'Europe/Paris', 'YYYY-MM-DD"T"HH24:MI')))->>'status'
      is distinct from 'pending' then
    raise exception 'Web intake did not accept a pickup outside the notice window';
  end if;
end;
$check$;
rollback;
'@
    Invoke-PilotSql $source ($pauseTest.Replace('__REQUEST_KEY__', $requestKey.ToString())) | Out-Null
    'PASS anonymous intake pause and resume, private status, and assigned driver operations.'

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
    $archive = Export-BookingArchive -Directory $work -Key $key -Date $today -Program docker -Arguments @('exec', $container, 'pg_dump', '-U', 'postgres', '-Fc', $source)
    $wrongKey = [byte[]]::new(32)
    try {
        Restore-BookingArchive -Path $archive -Key $wrongKey -Program 'restore-must-not-run' -Arguments @('--single-transaction')
        throw 'The archive accepted the wrong key.'
    } catch [Security.Cryptography.AuthenticationTagMismatchException] {
        # An archive must authenticate before pg_restore runs.
    }
    Restore-BookingArchive -Path $archive -Key $key -Program docker -Arguments @('exec', '-i', $container, 'pg_restore', '-U', 'postgres', '--single-transaction', '-d', $recovery)

    $restored = Invoke-PilotSql $recovery "set role anon; select public.get_ride('$requestKey')->>'reference';"
    Assert-Pilot ($restored -eq $active) 'Private booking lookup failed after restore.'
    $restoredMail = Invoke-PilotSql $recovery "select count(*) from booking_private.rider_email where reference=$active and address='pilot@example.test';"
    Assert-Pilot ($restoredMail -eq '1') 'Opt-in recipient was not restored.'

    foreach ($daysAgo in 1..8) {
        $sample = Join-Path $work ("muba-{0:yyyy-MM-dd}.dump.enc" -f $today.AddDays(-$daysAgo))
        Copy-Item -LiteralPath $archive -Destination $sample
    }
    $goodArchive = (Get-FileHash -LiteralPath $archive).Hash
    try {
        Export-BookingArchive -Directory $work -Key $key -Date $today -Program node -Arguments @('-e', 'process.exit(1)')
        throw 'A failed dump was accepted.'
    } catch {
        if ($_.Exception.Message -ne 'Booking database export failed.') { throw }
    }
    Assert-Pilot ((Get-FileHash -LiteralPath $archive).Hash -eq $goodArchive) 'A failed dump replaced the good archive.'
    Assert-Pilot (@(Get-ChildItem -LiteralPath $work -File -Filter 'muba-*.dump.enc').Count -eq 9) 'A failed dump pruned the existing archive window.'
    $null = Export-BookingArchive -Directory $work -Key $key -Date $today -Program docker -Arguments @('exec', $container, 'pg_dump', '-U', 'postgres', '-Fc', $source)
    Assert-Pilot (@(Get-ChildItem -LiteralPath $work -File -Filter 'muba-*.dump.enc').Count -eq 7) 'Seven-day archive window failed.'
    'PASS 90-day rider purge, encrypted daily archive window, and restored private booking.'
} finally {
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
