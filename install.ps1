param([string]$Source = $PSScriptRoot)
$ErrorActionPreference = 'Stop'
& codex plugin marketplace add $Source
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
& codex plugin add 'pstack-codex@personal'
exit $LASTEXITCODE
