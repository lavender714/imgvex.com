# Test Hailuo Text-to-Video KIE IDs
# Run: .\scripts\test-hailuo-text2video.ps1

$apiKey = $env:KIE_API_KEY
if (-not $apiKey) {
    Write-Host "ERROR: Set `$env:KIE_API_KEY first" -ForegroundColor Red
    exit 1
}

$headers = @{
    "Authorization" = "Bearer $apiKey"
    "Content-Type"  = "application/json"
}

# Test IDs to verify
$tests = @(
    @{ name = "Hailuo 02 text-to-video"; model = "hailuo/02-text-to-video-standard" },
    @{ name = "Hailuo 02 Pro text-to-video"; model = "hailuo/02-text-to-video-pro" }
)

foreach ($test in $tests) {
    Write-Host "`n--- Testing: $($test.name) ---" -ForegroundColor Cyan
    Write-Host "Model ID: $($test.model)"

    $body = @{
        model = $test.model
        input = @{
            prompt = "test"
        }
    } | ConvertTo-Json -Depth 3 -Compress

    try {
        $res = Invoke-WebRequest -Uri "https://api.kie.ai/api/v1/jobs/createTask" `
            -Method POST -Headers $headers -Body $body -TimeoutSec 15 -ErrorAction Stop
        $data = $res.Content | ConvertFrom-Json
        Write-Host "Status: $($res.StatusCode) ✅" -ForegroundColor Green
        Write-Host "Response: $($data | ConvertTo-Json -Depth 2)" -ForegroundColor Green
    }
    catch {
        $err = $_.Exception.Response
        if ($err) {
            $reader = New-Object System.IO.StreamReader($err.GetResponseStream())
            $reader.BaseStream.Position = 0
            $bodyText = $reader.ReadToEnd()
            Write-Host "Status: $($err.StatusCode.value__) ❌" -ForegroundColor Red
            Write-Host "Error: $bodyText" -ForegroundColor Red
        } else {
            Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
        }
    }
}

Write-Host "`n--- Done ---" -ForegroundColor Cyan
