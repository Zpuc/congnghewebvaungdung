#!/bin/bash

TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJUS0FETUlOIiwidXNlcm5hbWUiOiJhZG1pbiIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlF14bqjbiB0cuG7iyIsImp0aSI6IjQ5N2QyNWNjLTE4NjUtNDg3MC1hMjEyLTk2NTQwYTc3NTBkOSIsImV4cCI6MTc3ODAxMTA5NiwiaXNzIjoiTXlXZWJBUEkiLCJhdWQiOiJNeVdlYkFQSUNsaWVudCJ9.hcI0kv6u-OXgAs4RGluARYmcZILjIys1B4CGBCgzMkA"
API_URL="http://127.0.0.1:5001/api"

AUTH_HEADER="Authorization: Bearer $TOKEN"

# Thêm 10 thể loại
curl -X POST "$API_URL/TheLoai" -H "Content-Type: application/json" -H "$AUTH_HEADER" -d '{"maTheLoai":"TL001","tenTheLoai":"Công nghệ thông tin","moTa":"Sách về lập trình, máy tính"}'
curl -X POST "$API_URL/TheLoai" -H "Content-Type: application/json" -H "$AUTH_HEADER" -d '{"maTheLoai":"TL002","tenTheLoai":"Văn học","moTa":"Tiểu thuyết, truyện ngắn, thơ"}'
curl -X POST "$API_URL/TheLoai" -H "Content-Type: application/json" -H "$AUTH_HEADER" -d '{"maTheLoai":"TL003","tenTheLoai":"Khoa học","moTa":"Sách khoa học tự nhiên, xã hội"}'
curl -X POST "$API_URL/TheLoai" -H "Content-Type: application/json" -H "$AUTH_HEADER" -d '{"maTheLoai":"TL004","tenTheLoai":"Lịch sử","moTa":"Sách lịch sử, biography"}'
curl -X POST "$API_URL/TheLoai" -H "Content-Type: application/json" -H "$AUTH_HEADER" -d '{"maTheLoai":"TL005","tenTheLoai":"Triết học","moTa":"Sách triết học, tư duy"}'
curl -X POST "$API_URL/TheLoai" -H "Content-Type: application/json" -H "$AUTH_HEADER" -d '{"maTheLoai":"TL006","tenTheLoai":"Kinh tế","moTa":"Sách kinh tế, quản trị, marketing"}'
curl -X POST "$API_URL/TheLoai" -H "Content-Type: application/json" -H "$AUTH_HEADER" -d '{"maTheLoai":"TL007","tenTheLoai":"Y học","moTa":"Sách y học, sức khỏe"}'
curl -X POST "$API_URL/TheLoai" -H "Content-Type: application/json" -H "$AUTH_HEADER" -d '{"maTheLoai":"TL008","tenTheLoai":"Ngoại ngữ","moTa":"Sách học ngoại ngữ"}'
curl -X POST "$API_URL/TheLoai" -H "Content-Type: application/json" -H "$AUTH_HEADER" -d '{"maTheLoai":"TL009","tenTheLoai":"Nghệ thuật","moTa":"Sách về hội họa, âm nhạc, nhiếp ảnh"}'
curl -X POST "$API_URL/TheLoai" -H "Content-Type: application/json" -H "$AUTH_HEADER" -d '{"maTheLoai":"TL010","tenTheLoai":"Thiếu nhi","moTa":"Sách cho trẻ em, thiếu niên"}'

echo ""

# Thêm 10 kệ sách
curl -X POST "$API_URL/KeSach" -H "Content-Type: application/json" -H "$AUTH_HEADER" -d '{"maKe":"KS001","viTri":"Tầng 1 - Khu A"}'
curl -X POST "$API_URL/KeSach" -H "Content-Type: application/json" -H "$AUTH_HEADER" -d '{"maKe":"KS002","viTri":"Tầng 1 - Khu B"}'
curl -X POST "$API_URL/KeSach" -H "Content-Type: application/json" -H "$AUTH_HEADER" -d '{"maKe":"KS003","viTri":"Tầng 2 - Khu A"}'
curl -X POST "$API_URL/KeSach" -H "Content-Type: application/json" -H "$AUTH_HEADER" -d '{"maKe":"KS004","viTri":"Tầng 2 - Khu B"}'
curl -X POST "$API_URL/KeSach" -H "Content-Type: application/json" -H "$AUTH_HEADER" -d '{"maKe":"KS005","viTri":"Tầng 3 - Khu A"}'
curl -X POST "$API_URL/KeSach" -H "Content-Type: application/json" -H "$AUTH_HEADER" -d '{"maKe":"KS006","viTri":"Tầng 3 - Khu B"}'
curl -X POST "$API_URL/KeSach" -H "Content-Type: application/json" -H "$AUTH_HEADER" -d '{"maKe":"KS007","viTri":"Tầng 4 - Khu A"}'
curl -X POST "$API_URL/KeSach" -H "Content-Type: application/json" -H "$AUTH_HEADER" -d '{"maKe":"KS008","viTri":"Tầng 4 - Khu B"}'
curl -X POST "$API_URL/KeSach" -H "Content-Type: application/json" -H "$AUTH_HEADER" -d '{"maKe":"KS009","viTri":"Tầng 5 - Khu A"}'
curl -X POST "$API_URL/KeSach" -H "Content-Type: application/json" -H "$AUTH_HEADER" -d '{"maKe":"KS010","viTri":"Tầng 5 - Khu B"}'

echo ""

# Thêm 10 sách
curl -X POST "$API_URL/Sach" -H "Content-Type: application/json" -H "$AUTH_HEADER" -d '{"maSach":"S001","tieuDe":"Lập trình C# cơ bản","tacGia":"Nguyễn Văn An","namXuatBan":2024,"maTheLoai":"TL001","ngonNgu":"Tiếng Việt","tomTat":"Sách hướng dẫn lập trình C# từ cơ bản đến nâng cao"}'
curl -X POST "$API_URL/Sach" -H "Content-Type: application/json" -H "$AUTH_HEADER" -d '{"maSach":"S002","tieuDe":"Python cho người mới bắt đầu","tacGia":"Trần Thị Bình","namXuatBan":2023,"maTheLoai":"TL001","ngonNgu":"Tiếng Việt","tomTat":"Giới thiệu ngôn ngữ Python và ứng dụng"}'
curl -X POST "$API_URL/Sach" -H "Content-Type: application/json" -H "$AUTH_HEADER" -d '{"maSach":"S003","tieuDe":"Đắc Nhân Tâm","tacGia":"Dale Carnegie","namXuatBan":2020,"maTheLoai":"TL006","ngonNgu":"Tiếng Việt","tomTat":"Sách về kỹ năng giao tiếp và tác động con người"}'
curl -X POST "$API_URL/Sach" -H "Content-Type: application/json" -H "$AUTH_HEADER" -d '{"maSach":"S004","tieuDe":"Tuổi Trẻ Đáng Giá Bao Nhiêu","tacGia":"Rosie Nguyễn","namXuatBan":2022,"maTheLoai":"TL005","ngonNgu":"Tiếng Việt","tomTat":"Triết lý sống cho giới trẻ"}'
curl -X POST "$API_URL/Sach" -H "Content-Type: application/json" -H "$AUTH_HEADER" -d '{"maSach":"S005","tieuDe":"Lão Hạc","tacGia":"Nam Cao","namXuatBan":2019,"maTheLoai":"TL002","ngonNgu":"Tiếng Việt","tomTat":"Tác phẩm văn học kinh điển"}'
curl -X POST "$API_URL/Sach" -H "Content-Type: application/json" -H "$AUTH_HEADER" -d '{"maSach":"S006","tieuDe":"Sapiens: Lược sử loài người","tacGia":"Yuval Noah Harari","namXuatBan":2021,"maTheLoai":"TL003","ngonNgu":"Tiếng Việt","tomTat":"Sách lịch sử về sự phát triển của nhân loại"}'
curl -X POST "$API_URL/Sach" -H "Content-Type: application/json" -H "$AUTH_HEADER" -d '{"maSach":"S007","tieuDe":"Người Giàu Có Nhất Thành Babylon","tacGia":"George S. Clason","namXuatBan":2018,"maTheLoai":"TL006","ngonNgu":"Tiếng Việt","tomTat":"Nguyên tắc tài chính cá nhân"}'
curl -X POST "$API_URL/Sach" -H "Content-Type: application/json" -H "$AUTH_HEADER" -d '{"maSach":"S008","tieuDe":"Đánh Thức Trái Tim","tacGia":"John Gray","namXuatBan":2020,"maTheLoai":"TL005","ngonNgu":"Tiếng Việt","tomTat":"Hiểu về giới tính trong tình yêu"}'
curl -X POST "$API_URL/Sach" -H "Content-Type: application/json" -H "$AUTH_HEADER" -d '{"maSach":"S009","tieuDe":"Toán Lớp 1","tacGia":"Nguyễn Văn Minh","namXuatBan":2023,"maTheLoai":"TL010","ngonNgu":"Tiếng Việt","tomTat":"Sách giáo khoa toán lớp 1"}'
curl -X POST "$API_URL/Sach" -H "Content-Type: application/json" -H "$AUTH_HEADER" -d '{"maSach":"S010","tieuDe":"Tiếng Anh Giao Tiếp","tacGia":"Michael Đỗ","namXuatBan":2024,"maTheLoai":"TL008","ngonNgu":"Tiếng Anh - Việt","tomTat":"Sách học tiếng Anh cơ bản"}'

echo ""

# Thêm 10 bản sao
curl -X POST "$API_URL/BanSao" -H "Content-Type: application/json" -H "$AUTH_HEADER" -d '{"maBanSao":"BS001","maVach":"VACH001","maSach":"S001","maKe":"KS001","trangThai":"Co san"}'
curl -X POST "$API_URL/BanSao" -H "Content-Type: application/json" -H "$AUTH_HEADER" -d '{"maBanSao":"BS002","maVach":"VACH002","maSach":"S001","maKe":"KS002","trangThai":"Co san"}'
curl -X POST "$API_URL/BanSao" -H "Content-Type: application/json" -H "$AUTH_HEADER" -d '{"maBanSao":"BS003","maVach":"VACH003","maSach":"S002","maKe":"KS001","trangThai":"Co san"}'
curl -X POST "$API_URL/BanSao" -H "Content-Type: application/json" -H "$AUTH_HEADER" -d '{"maBanSao":"BS004","maVach":"VACH004","maSach":"S002","maKe":"KS003","trangThai":"Co san"}'
curl -X POST "$API_URL/BanSao" -H "Content-Type: application/json" -H "$AUTH_HEADER" -d '{"maBanSao":"BS005","maVach":"VACH005","maSach":"S003","maKe":"KS002","trangThai":"Co san"}'
curl -X POST "$API_URL/BanSao" -H "Content-Type: application/json" -H "$AUTH_HEADER" -d '{"maBanSao":"BS006","maVach":"VACH006","maSach":"S003","maKe":"KS004","trangThai":"Co san"}'
curl -X POST "$API_URL/BanSao" -H "Content-Type: application/json" -H "$AUTH_HEADER" -d '{"maBanSao":"BS007","maVach":"VACH007","maSach":"S004","maKe":"KS003","trangThai":"Co san"}'
curl -X POST "$API_URL/BanSao" -H "Content-Type: application/json" -H "$AUTH_HEADER" -d '{"maBanSao":"BS008","maVach":"VACH008","maSach":"S004","maKe":"KS005","trangThai":"Co san"}'
curl -X POST "$API_URL/BanSao" -H "Content-Type: application/json" -H "$AUTH_HEADER" -d '{"maBanSao":"BS009","maVach":"VACH009","maSach":"S005","maKe":"KS004","trangThai":"Co san"}'
curl -X POST "$API_URL/BanSao" -H "Content-Type: application/json" -H "$AUTH_HEADER" -d '{"maBanSao":"BS010","maVach":"VACH010","maSach":"S005","maKe":"KS006","trangThai":"Co san"}'

echo ""
echo "✅ Đã thêm dữ liệu mẫu: 10 thể loại, 10 kệ sách, 10 sách, 10 bản sao"
