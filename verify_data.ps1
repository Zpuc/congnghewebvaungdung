$connectionString = "Data Source=DESKTOP-NTJKGTE\SQLEXPRESS;Initial Catalog=QuanLyThuVien;Integrated Security=True;TrustServerCertificate=True;Encrypt=False;"

$queries = @(
    "SELECT TOP 5 MaTheLoai, TenTheLoai FROM TheLoai",
    "SELECT TOP 5 MaKe, ViTri FROM KeSach",
    "SELECT TOP 5 MaSach, TieuDe, TacGia FROM Sach",
    "SELECT TOP 5 MaBanSao, MaVach, TrangThai FROM BanSao"
)

foreach ($query in $queries) {
    Write-Host "`n=== Executing: $query ===`n" -ForegroundColor Cyan
    try {
        $result = Invoke-Sqlcmd -ConnectionString $connectionString -Query $query
        $result | Format-Table -AutoSize
    }
    catch {
        Write-Host "Error: $_" -ForegroundColor Red
    }
}
