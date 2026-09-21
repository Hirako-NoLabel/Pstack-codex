param()
$ErrorActionPreference = 'Stop'
$gitRoot = & git -C $PSScriptRoot rev-parse --show-toplevel
if ($LASTEXITCODE -ne 0 -or [IO.Path]::GetFullPath($gitRoot) -ne [IO.Path]::GetFullPath($PSScriptRoot)) { throw 'Run from the root of a dedicated PStack checkout.' }
& git -C $PSScriptRoot diff --quiet
if ($LASTEXITCODE -ne 0) { throw 'Local edits present; review before updating.' }
& git -C $PSScriptRoot diff --cached --quiet
if ($LASTEXITCODE -ne 0) { throw 'Staged edits present; review before updating.' }
& git -C $PSScriptRoot pull --ff-only
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
& codex plugin marketplace add $PSScriptRoot
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
& codex plugin add 'pstack-openai@personal'
exit $LASTEXITCODE
