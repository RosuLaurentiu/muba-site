#Requires -Version 7.4

function New-BookingArchiveProcess($program, $arguments, [switch]$capture) {
    $info = [Diagnostics.ProcessStartInfo]::new($program)
    $info.UseShellExecute = $false
    $info.RedirectStandardOutput = $capture.IsPresent
    $info.RedirectStandardInput = !$capture.IsPresent
    foreach ($argument in $arguments) { $info.ArgumentList.Add($argument) }
    [Diagnostics.Process]::Start($info)
}

function Export-BookingArchive {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)][string]$Directory,
        [Parameter(Mandatory)][ValidateCount(32, 32)][byte[]]$Key,
        [datetime]$Date = [TimeZoneInfo]::ConvertTimeBySystemTimeZoneId([DateTimeOffset]::Now, 'Europe/Paris').Date,
        [string]$Program = 'pg_dump',
        [string[]]$Arguments = @('--format=custom', '--no-password')
    )
    $ErrorActionPreference = 'Stop'
    $folder = (Resolve-Path -LiteralPath $Directory).ProviderPath
    $name = 'muba-' + $Date.ToString('yyyy-MM-dd', [Globalization.CultureInfo]::InvariantCulture) + '.dump.enc'
    $archive = Join-Path $folder $name
    $temp = Join-Path $folder ([guid]::NewGuid().ToString('N') + '.part')
    $memory = [IO.MemoryStream]::new()
    $cipher = [Security.Cryptography.AesGcm]::new($Key, 16)
    try {
        $dump = New-BookingArchiveProcess $Program $Arguments -capture
        try {
            $dump.StandardOutput.BaseStream.CopyTo($memory)
            $dump.WaitForExit()
            if ($dump.ExitCode -ne 0 -or $memory.Length -eq 0) { throw 'Booking database export failed.' }
        } finally {
            $dump.Dispose()
        }
        $plain = $memory.ToArray()
        try {
            $nonce = [Security.Cryptography.RandomNumberGenerator]::GetBytes(12)
            $tag = [byte[]]::new(16)
            $encrypted = [byte[]]::new($plain.Length)
            $cipher.Encrypt($nonce, $plain, $encrypted, $tag)
        } finally {
            [Array]::Clear($plain)
        }
        $output = [IO.File]::Open($temp, [IO.FileMode]::CreateNew)
        try {
            $output.Write($nonce, 0, $nonce.Length)
            $output.Write($tag, 0, $tag.Length)
            $output.Write($encrypted, 0, $encrypted.Length)
        } finally {
            $output.Dispose()
        }
        [IO.File]::Move($temp, $archive, $true)
    } finally {
        $cipher.Dispose()
        [Array]::Clear($memory.GetBuffer())
        $memory.Dispose()
        [IO.File]::Delete($temp)
    }

    foreach ($file in Get-ChildItem -LiteralPath $folder -File -Filter 'muba-*.dump.enc') {
        if ($file.Name -notmatch '^muba-(\d{4}-\d{2}-\d{2})\.dump\.enc$') { continue }
        $archiveDate = [DateOnly]::MinValue
        if ([DateOnly]::TryParseExact($Matches[1], 'yyyy-MM-dd', [Globalization.CultureInfo]::InvariantCulture,
                [Globalization.DateTimeStyles]::None, [ref]$archiveDate) -and
            $archiveDate -lt [DateOnly]::FromDateTime($Date.AddDays(-6))) {
            Remove-Item -LiteralPath $file.FullName
        }
    }
    $archive
}

function Restore-BookingArchive {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)][string]$Path,
        [Parameter(Mandatory)][ValidateCount(32, 32)][byte[]]$Key,
        [string]$Program = 'pg_restore',
        [Parameter(Mandatory)][string[]]$Arguments
    )
    $ErrorActionPreference = 'Stop'
    $stored = [IO.File]::ReadAllBytes((Resolve-Path -LiteralPath $Path).ProviderPath)
    if ($stored.Length -le 28) { throw 'The booking archive is incomplete.' }
    $plain = [byte[]]::new($stored.Length - 28)
    $encrypted = [byte[]]::new($plain.Length)
    [Array]::Copy($stored, 28, $encrypted, 0, $encrypted.Length)
    $cipher = [Security.Cryptography.AesGcm]::new($Key, 16)
    try {
        $cipher.Decrypt([byte[]]$stored[0..11], $encrypted, [byte[]]$stored[12..27], $plain)
        $restore = New-BookingArchiveProcess $Program $Arguments
        try {
            try {
                $restore.StandardInput.BaseStream.Write($plain, 0, $plain.Length)
            } finally {
                $restore.StandardInput.Close()
            }
            $restore.WaitForExit()
            if ($restore.ExitCode -ne 0) { throw 'Booking database restore failed.' }
        } finally {
            $restore.Dispose()
        }
    } finally {
        $cipher.Dispose()
        [Array]::Clear($plain)
    }
}
