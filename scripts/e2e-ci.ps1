# Run full E2E suite: start backend -> wait -> run tests -> teardown
# Usage: pwsh scripts/e2e-ci.ps1

$ErrorActionPreference = "Stop"
$BackendDir = Resolve-Path "../Backend"

Write-Host "Starting E2E containers..."
Push-Location $BackendDir
docker compose --profile e2e up -d --build
Pop-Location

Write-Host "Waiting for E2E backend on http://localhost:8081..."
$maxWait = 60
$waited = 0
while ($waited -lt $maxWait) {
    try {
        $res = Invoke-WebRequest -Uri "http://localhost:8081" -TimeoutSec 2 -ErrorAction Stop
        Write-Host "Backend ready."
        break
    } catch {
        Start-Sleep -Seconds 2
        $waited += 2
    }
}
if ($waited -ge $maxWait) {
    Write-Error "E2E backend did not start in time."
    exit 1
}

Write-Host "Starting Next.js dev server with E2E backend..."
$env:BACKEND_URL = "http://127.0.0.1:8081"
$devServer = Start-Process -PassThru -FilePath "npm" -ArgumentList "run dev" -NoNewWindow

Write-Host "Waiting for frontend on http://localhost:3000..."
$waited = 0
while ($waited -lt 60) {
    try {
        Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 2 -ErrorAction Stop | Out-Null
        Write-Host "Frontend ready."
        break
    } catch {
        Start-Sleep -Seconds 2
        $waited += 2
    }
}

Write-Host "Running Playwright tests..."
$env:E2E_API_URL = "http://localhost:8081"
npx playwright test

$exitCode = $LASTEXITCODE

Write-Host "Stopping dev server..."
Stop-Process -Id $devServer.Id -Force -ErrorAction SilentlyContinue

Write-Host "Stopping E2E containers..."
Push-Location $BackendDir
docker compose --profile e2e down
Pop-Location

exit $exitCode
