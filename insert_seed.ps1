$connectionString = "Data Source=DESKTOP-NTJKGTE\SQLEXPRESS;Initial Catalog=QuanLyThuVien;Integrated Security=True;TrustServerCertificate=True;Encrypt=False;"

$sql = Get-Content "c:\hdv\ptpmhuongdichvu\seed_data.sql" -Raw

$sqlCommands = $sql -split "GO"

foreach ($cmd in $sqlCommands) {
    $trimmedCmd = $cmd.Trim()
    if ($trimmedCmd -and !$trimmedCmd.StartsWith("--") -and !$trimmedCmd.StartsWith("PRINT")) {
        try {
            Invoke-Sqlcmd -ConnectionString $connectionString -Query $trimmedCmd
            Write-Host "✅ Executed command successfully"
        }
        catch {
            Write-Host "❌ Error: $_"
        }
    }
}

Write-Host "✅ Seed data insertion completed!"
