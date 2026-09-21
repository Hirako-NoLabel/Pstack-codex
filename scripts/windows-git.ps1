function Invoke-PstackLongPathGit {
    param([scriptblock]$Action)
    $savedCount = [Environment]::GetEnvironmentVariable('GIT_CONFIG_COUNT', 'Process')
    $count = 0
    if ($null -ne $savedCount -and (-not [int]::TryParse($savedCount, [ref]$count) -or $count -lt 0)) { throw 'Invalid GIT_CONFIG_COUNT.' }
    $key = "GIT_CONFIG_KEY_$count"
    $value = "GIT_CONFIG_VALUE_$count"
    $savedKey = [Environment]::GetEnvironmentVariable($key, 'Process')
    $savedValue = [Environment]::GetEnvironmentVariable($value, 'Process')
    try {
        [Environment]::SetEnvironmentVariable($key, 'core.longpaths', 'Process')
        [Environment]::SetEnvironmentVariable($value, 'true', 'Process')
        [Environment]::SetEnvironmentVariable('GIT_CONFIG_COUNT', [string]($count + 1), 'Process')
        & $Action
    } finally {
        [Environment]::SetEnvironmentVariable('GIT_CONFIG_COUNT', $savedCount, 'Process')
        [Environment]::SetEnvironmentVariable($key, $savedKey, 'Process')
        [Environment]::SetEnvironmentVariable($value, $savedValue, 'Process')
    }
}
