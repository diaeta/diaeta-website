param(
  [int]$Port = 5174,
  [string]$UserId = $env:BYTEROVER_USER_ID,
  [string]$ApiKey = $env:BYTEROVER_PUBLIC_API_KEY
)

if (-not $UserId -or $UserId.Trim().Length -eq 0) { $UserId = 'codex-local' }

$cmd = Get-Command byterover-mcp -ErrorAction SilentlyContinue
if (-not $cmd) {
  Write-Error "byterover-mcp is not installed or not in PATH. Install with: npm i -g byterover-mcp"
  exit 1
}

$argList = @('--port', $Port, '--user-id', $UserId)
if ($ApiKey -and $ApiKey.Trim().Length -gt 0) {
  $argList += @('--byterover-public-api-key', $ApiKey)
}

Write-Host "Starting byterover-mcp on port $Port for user '$UserId'..."
$proc = Start-Process -FilePath 'powershell.exe' -ArgumentList @('-NoProfile','-ExecutionPolicy','Bypass','-File', $cmd.Source) + $argList -WindowStyle Hidden -PassThru
Write-Host "PID: $($proc.Id)"

# Wait for port to listen
$maxWait = 20
for ($i=0; $i -lt $maxWait; $i++) {
  try {
    if (Test-NetConnection -ComputerName '127.0.0.1' -Port $Port -InformationLevel Quiet) { break }
  } catch {}
  Start-Sleep -Milliseconds 800
}

if (Test-NetConnection -ComputerName '127.0.0.1' -Port $Port -InformationLevel Quiet) {
  Write-Host "Server is listening on 127.0.0.1:$Port"
} else {
  Write-Warning "Port $Port not open yet. If startup stalls, set BYTEROVER_PUBLIC_API_KEY or pass -ApiKey."
}

