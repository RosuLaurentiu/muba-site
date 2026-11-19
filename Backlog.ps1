# Use the owner's checked Backlog build and bind every command to this project folder.
# Same wrapper as Warehouse (PMA-111); set up by PMA-127.
$backlogExe = 'C:\Users\rosu_\Desktop\Development\Project Manager Agent\.tools\backlog\current\backlog.exe'
if (-not (Test-Path -LiteralPath $backlogExe -PathType Leaf)) {
    throw 'The checked Backlog executable is missing. Check the Project Manager Agent installation.'
}
$backlogDigest = (Get-Content -LiteralPath (Join-Path (Split-Path -Parent $backlogExe) 'release.json') -Raw | ConvertFrom-Json).sha256
if ((Get-FileHash -LiteralPath $backlogExe -Algorithm SHA256).Hash.ToLowerInvariant() -ne $backlogDigest) {
    throw 'Backlog executable identity mismatch. Check the installation before use.'
}
# PowerShell strips quotes inside values, drops empty values and splits a,b lists when it starts a
# program, so the arguments travel as one JSON list in PMA_ARGS (backlog.exe rc.31 or later).
$backlogArgs = @(foreach ($a in $args) {
    if ($null -eq $a) { throw "An argument is empty: PowerShell read an unquoted @name or `$name as a variable. Quote it, for example -a '@codex'." }
    if ($a -is [array]) { $a -join ',' } else { [string]$a }
})
$backlogJson = ConvertTo-Json -InputObject $backlogArgs -Compress
$backlogPreviousCwd = [Environment]::GetEnvironmentVariable('BACKLOG_CWD', 'Process')
Push-Location -LiteralPath $PSScriptRoot
try {
    $env:BACKLOG_CWD = $PSScriptRoot
    # An environment value holds at most 32,767 characters; a longer list goes on the command line as before.
    if ($backlogJson.Length -le 32000) { $env:PMA_ARGS = $backlogJson; & $backlogExe --args-from-env } else { & $backlogExe @args }
    if ($LASTEXITCODE -ne 0) { throw "Backlog failed: exit $LASTEXITCODE" }
}
finally {
    $env:BACKLOG_CWD = $backlogPreviousCwd
    Remove-Item Env:PMA_ARGS -ErrorAction SilentlyContinue
    Pop-Location
}
