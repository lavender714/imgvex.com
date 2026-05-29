# Test KIE model IDs
# Run: .\scripts\test-kie-models.ps1

$baseUrl = "https://api.kie.ai/api/v1"
$apiKey = $env:KIE_API_KEY

if (-not $apiKey) {
    Write-Host "ERROR: KIE_API_KEY not set" -ForegroundColor Red
    Write-Host "Set it first: `$env:KIE_API_KEY = 'your-key'"
    exit 1
}

$headers = @{
    "Authorization" = "Bearer $apiKey"
    "Content-Type"  = "application/json"
}

# Models to test: @("modelId", "endpoint", @{body})
$tests = @(
    # Flux Kontext - dedicated endpoint
    @{
        name     = "Flux Kontext (dedicated endpoint)"
        endpoint = "$baseUrl/flux/kontext/generate"
        body     = @{ prompt = "test"; model = "flux-kontext-pro" } | ConvertTo-Json -Depth 3 -Compress
    },
    # Flux Kontext - universal endpoint
    @{
        name     = "Flux Kontext (universal endpoint)"
        endpoint = "$baseUrl/jobs/createTask"
        body     = @{ model = "flux-kontext-pro"; input = @{ prompt = "test" } } | ConvertTo-Json -Depth 3 -Compress
    },
    # Nano Banana 2 - image-to-image
    @{
        name     = "Nano Banana 2 (image-to-image)"
        endpoint = "$baseUrl/jobs/createTask"
        body     = @{ model = "nano-banana-2"; input = @{ prompt = "test"; image_input = @("https://static.aiquickdraw.com/tools/example/1772164675129_TZfXY2Sn.png") } } | ConvertTo-Json -Depth 3 -Compress
    }
)

foreach ($test in $tests) {
    Write-Host "`n--- Testing: $($test.name) ---" -ForegroundColor Cyan
    Write-Host "POST $($test.endpoint)"
    Write-Host "Body: $($test.body)"

    try {
        $response = Invoke-WebRequest -Uri $test.endpoint -Method POST -Headers $headers -Body $test.body -TimeoutSec 15 -ErrorAction Stop
        $data = $response.Content | ConvertFrom-Json
        Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
        Write-Host "Response: $($data | ConvertTo-Json -Depth 2)" -ForegroundColor Green
    }
    catch {
        $err = $_.Exception.Response
        if ($err) {
            $reader = New-Object System.IO.StreamReader($err.GetResponseStream())
            $reader.BaseStream.Position = 0
            $body = $reader.ReadToEnd()
            Write-Host "Status: $($err.StatusCode.value__)" -ForegroundColor Red
            Write-Host "Error: $body" -ForegroundColor Red
        }
        else {
            Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
        }
    }
}

Write-Host "`n--- Done ---" -ForegroundColor Cyan
