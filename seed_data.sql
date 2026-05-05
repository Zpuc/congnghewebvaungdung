-- Seed data: Thêm 10 thể loại
INSERT INTO TheLoai (MaTheLoai, TenTheLoai, MoTa)
SELECT * FROM (VALUES
    ('TL001', N'Công nghệ thông tin', N'Sách về lập trình, máy tính'),
    ('TL002', N'Văn học', N'Tiểu thuyết, truyện ngắn, thơ'),
    ('TL003', N'Khoa học', N'Sách khoa học tự nhiên, xã hội'),
    ('TL004', N'Lịch sử', N'Sách lịch sử, biography'),
    ('TL005', N'Triết học', N'Sách triết học, tư duy'),
    ('TL006', N'Kinh tế', N'Sách kinh tế, quản trị, marketing'),
    ('TL007', N'Y học', N'Sách y học, sức khỏe'),
    ('TL008', N'Ngoại ngữ', N'Sách học ngoại ngữ'),
    ('TL009', N'Nghệ thuật', N'Sách về hội họa, âm nhạc, nhiếp ảnh'),
    ('TL010', N'Thiếu nhi', N'Sách cho trẻ em, thiếu niên')
) AS Source(MaTheLoai, TenTheLoai, MoTa)
WHERE NOT EXISTS (SELECT 1 FROM TheLoai WHERE TheLoai.MaTheLoai = Source.MaTheLoai);
GO

-- Seed data: Thêm 10 kệ sách
INSERT INTO KeSach (MaKe, ViTri)
SELECT * FROM (VALUES
    ('KS001', N'Tầng 1 - Khu A'),
    ('KS002', N'Tầng 1 - Khu B'),
    ('KS003', N'Tầng 2 - Khu A'),
    ('KS004', N'Tầng 2 - Khu B'),
    ('KS005', N'Tầng 3 - Khu A'),
    ('KS006', N'Tầng 3 - Khu B'),
    ('KS007', N'Tầng 4 - Khu A'),
    ('KS008', N'Tầng 4 - Khu B'),
    ('KS009', N'Tầng 5 - Khu A'),
    ('KS010', N'Tầng 5 - Khu B')
) AS Source(MaKe, ViTri)
WHERE NOT EXISTS (SELECT 1 FROM KeSach WHERE KeSach.MaKe = Source.MaKe);
GO

-- Seed data: Thêm 10 sách
INSERT INTO Sach (MaSach, TieuDe, TacGia, NamXuatBan, MaTheLoai, NgonNgu, TomTat)
SELECT * FROM (VALUES
    ('S001', N'Lập trình C# cơ bản', N'Nguyễn Văn An', 2024, 'TL001', N'Tiếng Việt', N'Sách hướng dẫn lập trình C# từ cơ bản đến nâng cao'),
    ('S002', N'Python cho người mới bắt đầu', N'Trần Thị Bình', 2023, 'TL001', N'Tiếng Việt', N'Giới thiệu ngôn ngữ Python và ứng dụng'),
    ('S003', N'Đắc Nhân Tâm', N'Dale Carnegie', 2020, 'TL006', N'Tiếng Việt', N'Sách về kỹ năng giao tiếp và tác động con người'),
    ('S004', N'Tuổi Trẻ Đáng Giá Bao Nhiêu', N'Rosie Nguyễn', 2022, 'TL005', N'Tiếng Việt', N'Triết lý sống cho giới trẻ'),
    ('S005', N'Lão Hạc', N'Nam Cao', 2019, 'TL002', N'Tiếng Việt', N'Tác phẩm văn học kinh điển'),
    ('S006', N'Sapiens: Lược sử loài người', N'Yuval Noah Harari', 2021, 'TL003', N'Tiếng Việt', N'Sách lịch sử về sự phát triển của nhân loại'),
    ('S007', N'Người Giàu Có Nhất Thành Babylon', N'George S. Clason', 2018, 'TL006', N'Tiếng Việt', N'Nguyên tắc tài chính cá nhân'),
    ('S008', N'Đánh Thức Trái Tim', N'John Gray', 2020, 'TL005', N'Tiếng Việt', N'Hiểu về giới tính trong tình yêu'),
    ('S009', N'Toán Lớp 1', N'Nguyễn Văn Minh', 2023, 'TL010', N'Tiếng Việt', N'Sách giáo khoa toán lớp 1'),
    ('S010', N'Tiếng Anh Giao Tiếp', N'Michael Đỗ', 2024, 'TL008', N'Tiếng Anh - Việt', N'Sách học tiếng Anh cơ bản')
) AS Source(MaSach, TieuDe, TacGia, NamXuatBan, MaTheLoai, NgonNgu, TomTat)
WHERE NOT EXISTS (SELECT 1 FROM Sach WHERE Sach.MaSach = Source.MaSach);
GO

-- Seed data: Thêm 10 bản sao
INSERT INTO BanSao (MaBanSao, MaVach, MaSach, MaKe, TrangThai)
SELECT * FROM (VALUES
    ('BS001', 'VACH001', 'S001', 'KS001', N'Có sẵn'),
    ('BS002', 'VACH002', 'S001', 'KS002', N'Có sẵn'),
    ('BS003', 'VACH003', 'S002', 'KS001', N'Có sẵn'),
    ('BS004', 'VACH004', 'S002', 'KS003', N'Có sẵn'),
    ('BS005', 'VACH005', 'S003', 'KS002', N'Có sẵn'),
    ('BS006', 'VACH006', 'S003', 'KS004', N'Có sẵn'),
    ('BS007', 'VACH007', 'S004', 'KS003', N'Có sẵn'),
    ('BS008', 'VACH008', 'S004', 'KS005', N'Có sẵn'),
    ('BS009', 'VACH009', 'S005', 'KS004', N'Có sẵn'),
    ('BS010', 'VACH010', 'S005', 'KS006', N'Có sẵn')
) AS Source(MaBanSao, MaVach, MaSach, MaKe, TrangThai)
WHERE NOT EXISTS (SELECT 1 FROM BanSao WHERE BanSao.MaBanSao = Source.MaBanSao);
GO

PRINT '✅ Đã thêm dữ liệu mẫu: 10 thể loại, 10 kệ sách, 10 sách, 10 bản sao';
