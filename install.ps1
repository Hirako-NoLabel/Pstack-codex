param([string]$Source = $PSScriptRoot)
$ErrorActionPreference = 'Stop'
. (Join-Path $PSScriptRoot 'scripts/windows-git.ps1')
Invoke-PstackLongPathGit {
& codex plugin marketplace add $Source
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
& codex plugin add 'pstack-codex@personal'
exit $LASTEXITCODE

}
