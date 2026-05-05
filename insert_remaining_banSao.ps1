$token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJUS0FETUlOIiwidXNlcm5hbWUiOiJhZG1pbiIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlF14bqjbiB0cuG7iyIsImp0aSI6IjQ5N2QyNWNjLTE4NjUtNDg3MC1hMjEyLTk2NTQwYTc3NTBkOSIsImV4cCI6MTc3ODAxMTA5NiwiaXNzIjoiTXlXZWJBUEkiLCJhdWQiOiJNeVdlYkFQSUNsaWVudCJ9.hcI0kv6u-OXgAs4RGluARYmcZILjIys1B4CGBCgzMkA"
$apiUrl = "http://127.0.0.1:5001/api"

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

# Missing BanSao records to add (BS002 to BS010)
$banSaoToAdd = @(
    @{maBanSao="BS002"; maVach="VACH002"; maSach="S001"; maKe="KS002"; trangThai="Có sẵn"},
    @{maBanSao="BS003"; maVach="VACH003"; maSach="S002"; maKe="KS001"; trangThai="Có sẵn"},
    @{maBanSao="BS004"; maVach="VACH004"; maSach="S002"; maKe="KS003"; trangThai="Có sẵn"},
    @{maBanSao="BS005"; maVach="VACH005"; maSach="S003"; maKe="KS002"; trangThai="Có sẵn"},
    @{maBanSao="BS006"; maVach="VACH006"; maSach="S003"; maKe="KS004"; trangThai="Có sẵn"},
    @{maBanSao="BS007"; maVach="VACH007"; maSach="S004"; maKe="KS003"; trangThai="Có sẵn"},
    @{maBanSao="BS008"; maVach="VACH008"; maSach="S004"; maKe="KS005"; trangThai="Có sẵn"},
    @{maBanSao="BS009"; maVach="VACH009"; maSach="S005"; maKe="KS004"; trangThai="Có sẵn"},
    @{maBanSao="BS010"; maVach="VACH010"; maSach="S005"; maKe="KS006"; trangThai="Có sẵn"}
)

foreach ($item in $banSaoToAdd) {
    $body = $item | ConvertTo-Json
    try {
        $response = Invoke-RestMethod -Uri "$apiUrl/BanSao" -Method Post -Headers $headers -Body $body
        if ($response.success) {
            Write-Host "✅ Added $($item.maBanSao)"
        } else {
            Write-Host "❌ Failed to add $($item.maBanSao): $($response.message)"
        }
    }
    catch {
        $err = $_.ErrorDetails.Message | ConvertFrom-Json
        Write-Host "❌ Error adding $($item.maBanSao): $($err.message)"
    }
}

Write-Host ""
Write-Host "✅ Seed data insertion completed!"
