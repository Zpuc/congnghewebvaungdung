USE [QuanLyThuVien];
GO

-- Store Procedure Sach
CREATE OR ALTER PROCEDURE sp_GetAllSach
AS
BEGIN
    SELECT
        s.MaSach,
        s.TieuDe,
        s.TacGia,
        s.NamXuatBan,
        s.MaTheLoai,
        tl.TenTheLoai AS TheLoai,
        s.NgonNgu,
        s.TomTat,
        CAST(NULL AS NVARCHAR(MAX)) AS AnhBiaUrl
    FROM dbo.Sach s
    LEFT JOIN dbo.TheLoai tl ON s.MaTheLoai = tl.MaTheLoai;
END


GO
CREATE OR ALTER PROCEDURE sp_GetSachById
    @MaSach NVARCHAR(20)
AS
BEGIN
    SELECT
        s.MaSach,
        s.TieuDe,
        s.TacGia,
        s.NamXuatBan,
        s.MaTheLoai,
        tl.TenTheLoai AS TheLoai,
        s.NgonNgu,
        s.TomTat,
        CAST(NULL AS NVARCHAR(MAX)) AS AnhBiaUrl
    FROM dbo.Sach s
    LEFT JOIN dbo.TheLoai tl ON s.MaTheLoai = tl.MaTheLoai
    WHERE s.MaSach = @MaSach;
END

GO
CREATE OR ALTER PROCEDURE sp_InsertSach
    @MaSach NVARCHAR(20),
    @TieuDe NVARCHAR(255),
    @TacGia NVARCHAR(255),
    @NamXuatBan INT = NULL,
    @MaTheLoai NVARCHAR(20) = NULL,
    @NgonNgu NVARCHAR(50) = NULL,
    @TomTat NVARCHAR(MAX) = NULL,
    @LienKetAnh NVARCHAR(MAX) = NULL
AS
BEGIN
    INSERT INTO dbo.Sach (MaSach, TieuDe, TacGia, NamXuatBan, MaTheLoai, NgonNgu, TomTat)
    VALUES (@MaSach, @TieuDe, @TacGia, @NamXuatBan, @MaTheLoai, @NgonNgu, @TomTat);
END


GO
CREATE OR ALTER PROCEDURE sp_UpdateSach
    @MaSach NVARCHAR(20),
    @TieuDe NVARCHAR(255),
    @TacGia NVARCHAR(255),
    @NamXuatBan INT = NULL,
    @MaTheLoai NVARCHAR(20) = NULL,
    @NgonNgu NVARCHAR(50) = NULL,
    @TomTat NVARCHAR(MAX) = NULL,
    @LienKetAnh NVARCHAR(MAX) = NULL
AS
BEGIN
    UPDATE Sach
    SET TieuDe = @TieuDe,
        TacGia = @TacGia,
        NamXuatBan = @NamXuatBan,
        MaTheLoai = @MaTheLoai,
        NgonNgu = @NgonNgu,
        TomTat = @TomTat
    WHERE MaSach = @MaSach;
END

GO
CREATE OR ALTER PROCEDURE sp_DeleteSach
    @MaSach NVARCHAR(20)
AS
BEGIN
    DELETE FROM Sach
    WHERE MaSach = @MaSach;
END

-- SP TaiKhoan
GO
CREATE OR ALTER PROCEDURE sp_GetAllTaiKhoan
AS 
BEGIN
	SELECT MaTaiKhoan, TenDangNhap, MatKhau, VaiTro
	FROM TaiKhoan
END

GO
CREATE OR ALTER PROCEDURE sp_Register
	@MaTaiKhoan NVARCHAR(20),
	@TenDangNhap NVARCHAR(100),
	@MatKhau NVARCHAR(255),
	@VaiTro NVARCHAR(20),
	@MaBanDoc NVARCHAR(20) = NULL
AS
BEGIN
	INSERT INTO TaiKhoan(MaTaiKhoan, TenDangNhap, MatKhau, VaiTro, MaBanDoc)
	VALUES (@MaTaiKhoan, @TenDangNhap, @MatKhau, @VaiTro, @MaBanDoc)
END

GO
CREATE OR ALTER PROCEDURE sp_GetTaiKhoanById
	@MaTaiKhoan NVARCHAR(20)
AS
BEGIN
	SELECT MaTaiKhoan, TenDangNhap, MatKhau, VaiTro, MaBanDoc
	FROM TaiKhoan
	WHERE MaTaiKhoan = @MaTaiKhoan
END

GO
CREATE OR ALTER PROCEDURE sp_UpdateTaiKhoan
	@MaTaiKhoan NVARCHAR(20),
	@TenDangNhap NVARCHAR(100),
	@MatKhau NVARCHAR(255),
	@VaiTro NVARCHAR(20),
	@MaBanDoc NVARCHAR(20) = NULL
AS
BEGIN
	UPDATE TaiKhoan
	SET TenDangNhap = @TenDangNhap,
		MatKhau = @MatKhau,
		VaiTro = @VaiTro,
		MaBanDoc = @MaBanDoc
	WHERE MaTaiKhoan = @MaTaiKhoan
END

GO
CREATE OR ALTER PROCEDURE sp_DeleteTaiKhoan
	@MaTaiKhoan NVARCHAR(20)
AS
BEGIN
	DELETE FROM TaiKhoan
	WHERE MaTaiKhoan = @MaTaiKhoan
END

-- SP BanDoc
GO
CREATE OR ALTER PROCEDURE sp_GetAllBanDoc
AS
BEGIN
	SELECT MaBanDoc, HoTen, SoThe, Email, DienThoai, HanThe, TrangThaiThe, DuNo
	FROM BanDoc
END

GO
CREATE OR ALTER PROCEDURE sp_GetBanDocById
	@MaBanDoc NVARCHAR(20)
AS
BEGIN
	SELECT MaBanDoc, HoTen, SoThe, Email, DienThoai, HanThe, TrangThaiThe, DuNo
	FROM BanDoc
	WHERE MaBanDoc = @MaBanDoc
END

GO
CREATE OR ALTER PROCEDURE sp_CreateBanDoc
	@MaBanDoc NVARCHAR(20),
	@SoThe NVARCHAR(10),
	@HoTen NVARCHAR(100),
	@Email NVARCHAR(100),
	@DienThoai NVARCHAR(10),
	@HanThe Date,
	@TrangThaiThe NVARCHAR(20),
	@DuNo DECIMAL(12, 2)
AS
BEGIN
	INSERT INTO BanDoc(MaBanDoc, SoThe, HoTen, Email, DienThoai, HanThe, TrangThaiThe, DuNo)
	VALUES(@MaBanDoc, @SoThe, @HoTen, @Email, @DienThoai, @HanThe, @TrangThaiThe, @DuNo)
END

GO
CREATE OR ALTER PROCEDURE sp_UpdateBanDoc
	@MaBanDoc NVARCHAR(20),
	@SoThe NVARCHAR(10),
	@HoTen NVARCHAR(100),
	@Email NVARCHAR(100),
	@DienThoai NVARCHAR(10),
	@HanThe Date,
	@TrangThaiThe NVARCHAR(20),
	@DuNo DECIMAL(12, 2)
AS
BEGIN
	UPDATE BanDoc
	SET SoThe = @SoThe,
		HoTen = @HoTen,
		Email = @Email,
		DienThoai = @DienThoai,
		HanThe = @HanThe,
		TrangThaiThe = @TrangThaiThe,
		DuNo = @DuNo
	WHERE MaBanDoc = @MaBanDoc;
END

GO
CREATE OR ALTER PROCEDURE sp_DeleteBanDoc
	@MaBanDoc NVARCHAR(20)
AS
BEGIN
	DELETE FROM BanDoc
	WHERE MaBanDoc = @MaBanDoc;
END

-- =========================================================
-- Phiếu mượn (PhieuMuon) - stored procedures cho DAL gọi
-- =========================================================
GO
CREATE OR ALTER PROCEDURE sp_GetAllPhieuMuon
AS
BEGIN
    SET NOCOUNT ON;
    SELECT MaPhieuMuon, MaBanSao, MaBanDoc, NgayMuon, HanTra, NgayTraThucTe, SoLanGiaHan, TrangThai
    FROM dbo.PhieuMuon
    ORDER BY NgayMuon DESC;
END

GO
CREATE OR ALTER PROCEDURE sp_GetPhieuMuonById
    @MaPhieuMuon NVARCHAR(20)
AS
BEGIN
    SET NOCOUNT ON;
    SELECT MaPhieuMuon, MaBanSao, MaBanDoc, NgayMuon, HanTra, NgayTraThucTe, SoLanGiaHan, TrangThai
    FROM dbo.PhieuMuon
    WHERE MaPhieuMuon = @MaPhieuMuon;
END

GO
CREATE OR ALTER PROCEDURE sp_TaoPhieuMuon
    @MaPhieuMuon  NVARCHAR(20),
    @MaBanSao     NVARCHAR(20),
    @MaBanDoc     NVARCHAR(20),
    @NgayMuon     DATE,
    @HanTra       DATE,
    @NgayTraThucTe DATE = NULL,
    @SoLanGiaHan  INT = 0,
    @TrangThai    NVARCHAR(20) = N'Đang mở'
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO dbo.PhieuMuon (MaPhieuMuon, MaBanSao, MaBanDoc, NgayMuon, HanTra, NgayTraThucTe, SoLanGiaHan, TrangThai)
    VALUES (@MaPhieuMuon, @MaBanSao, @MaBanDoc, @NgayMuon, @HanTra, @NgayTraThucTe, @SoLanGiaHan, @TrangThai);
END

GO
CREATE OR ALTER PROCEDURE sp_UpdatePhieuMuon
    @MaPhieuMuon  NVARCHAR(20),
    @MaBanSao     NVARCHAR(20),
    @MaBanDoc     NVARCHAR(20),
    @NgayMuon     DATE,
    @HanTra       DATE,
    @NgayTraThucTe DATE = NULL,
    @SoLanGiaHan  INT = 0,
    @TrangThai    NVARCHAR(20) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE dbo.PhieuMuon
    SET MaBanSao = @MaBanSao,
        MaBanDoc = @MaBanDoc,
        NgayMuon = @NgayMuon,
        HanTra = @HanTra,
        NgayTraThucTe = @NgayTraThucTe,
        SoLanGiaHan = @SoLanGiaHan,
        TrangThai = @TrangThai
    WHERE MaPhieuMuon = @MaPhieuMuon;
END

GO
CREATE OR ALTER PROCEDURE sp_DeletePhieuMuon
    @MaPhieuMuon NVARCHAR(20)
AS
BEGIN
    SET NOCOUNT ON;
    DELETE FROM dbo.PhieuMuon
    WHERE MaPhieuMuon = @MaPhieuMuon;
END

-- Đăng nhập
GO
CREATE OR ALTER PROCEDURE sp_Login
  @TenDangNhap NVARCHAR(100)
AS
BEGIN
  SET NOCOUNT ON;
  SELECT TOP (1)
    MaTaiKhoan,
    TenDangNhap,
    VaiTro,
    MaBanDoc,
    MatKhau          
  FROM dbo.TaiKhoan
  WHERE TenDangNhap = @TenDangNhap;
END
GO

-- =========================================================
-- Thể loại (TheLoai) - stored procedure cho DAL gọi
-- =========================================================
USE QuanLyThuVien;
GO

CREATE OR ALTER PROCEDURE sp_GetAllTheLoai
AS
BEGIN
    SET NOCOUNT OFF;
    SELECT MaTheLoai, TenTheLoai
    FROM dbo.TheLoai;
END
GO

CREATE OR ALTER PROCEDURE sp_GetTheLoaiById
    @MaTheLoai NVARCHAR(20)
AS
BEGIN
    SET NOCOUNT OFF;
    SELECT MaTheLoai, TenTheLoai
    FROM dbo.TheLoai
    WHERE MaTheLoai = @MaTheLoai;
END
GO

CREATE OR ALTER PROCEDURE sp_CreateTheLoai
    @MaTheLoai NVARCHAR(20),
    @TenTheLoai NVARCHAR(100)
AS
BEGIN
    SET NOCOUNT OFF;
    INSERT INTO dbo.TheLoai (MaTheLoai, TenTheLoai)
    VALUES (@MaTheLoai, @TenTheLoai);
END
GO

CREATE OR ALTER PROCEDURE sp_UpdateTheLoai
    @MaTheLoai NVARCHAR(20),
    @TenTheLoai NVARCHAR(100)
AS
BEGIN
    SET NOCOUNT OFF;
    UPDATE dbo.TheLoai
    SET TenTheLoai = @TenTheLoai
    WHERE MaTheLoai = @MaTheLoai;
END
GO

CREATE OR ALTER PROCEDURE sp_DeleteTheLoai
    @MaTheLoai NVARCHAR(20)
AS
BEGIN
    SET NOCOUNT OFF;
    DELETE FROM dbo.TheLoai
    WHERE MaTheLoai = @MaTheLoai;
END
GO

/* ====== DatCho indexes + stored procedures ====== */

IF NOT EXISTS (
  SELECT 1 FROM sys.indexes
  WHERE name = 'UX_DatCho_Pending' AND object_id = OBJECT_ID('dbo.DatCho')
)
BEGIN
  CREATE UNIQUE INDEX UX_DatCho_Pending
  ON dbo.DatCho (MaBanDoc, MaSach, TrangThai)
  WHERE TrangThai = N'Chờ hàng';
END
GO

IF NOT EXISTS (
  SELECT 1 FROM sys.indexes
  WHERE name = 'IX_DatCho_SachTrangThai' AND object_id = OBJECT_ID('dbo.DatCho')
)
BEGIN
  CREATE INDEX IX_DatCho_SachTrangThai
  ON dbo.DatCho (MaSach, TrangThai, NgayTao);
END
GO

CREATE OR ALTER PROCEDURE dbo.sp_DatCho_Insert
  @MaDatCho NVARCHAR(20),
  @MaSach    NVARCHAR(20),
  @MaBanDoc  NVARCHAR(20)
AS
BEGIN
  SET NOCOUNT ON;
  INSERT INTO dbo.DatCho(MaDatCho, MaSach, MaBanDoc, TrangThai)
  VALUES(@MaDatCho, @MaSach, @MaBanDoc, N'Chờ hàng');
END
GO

CREATE OR ALTER PROCEDURE dbo.sp_DatCho_GetById
  @MaDatCho NVARCHAR(20)
AS
BEGIN
  SET NOCOUNT ON;
  SELECT * FROM dbo.DatCho WHERE MaDatCho = @MaDatCho;
END
GO

CREATE OR ALTER PROCEDURE dbo.sp_DatCho_List
  @MaBanDoc  NVARCHAR(20) = NULL,
  @MaSach    NVARCHAR(20) = NULL,
  @TrangThai NVARCHAR(20) = NULL
AS
BEGIN
  SET NOCOUNT ON;
  SELECT *
  FROM dbo.DatCho
  WHERE (@MaBanDoc  IS NULL OR MaBanDoc  = @MaBanDoc)
    AND (@MaSach    IS NULL OR MaSach    = @MaSach)
    AND (@TrangThai IS NULL OR TrangThai = @TrangThai)
  ORDER BY NgayTao ASC;
END
GO

CREATE OR ALTER PROCEDURE dbo.sp_DatCho_Cancel
  @MaDatCho NVARCHAR(20)
AS
BEGIN
  SET NOCOUNT ON;
  UPDATE dbo.DatCho
  SET TrangThai = N'Đã hủy', GiuDen = NULL
  WHERE MaDatCho = @MaDatCho
    AND TrangThai IN (N'Chờ hàng', N'Đang giữ');
END
GO

CREATE OR ALTER PROCEDURE dbo.sp_DatCho_SetReady
  @MaSach      NVARCHAR(20),
  @GiuTrongGio INT = 48
AS
BEGIN
  SET NOCOUNT ON;

  DECLARE @Id NVARCHAR(20);

  SELECT TOP 1 @Id = MaDatCho
  FROM dbo.DatCho WITH (UPDLOCK, ROWLOCK)
  WHERE MaSach = @MaSach AND TrangThai = N'Chờ hàng'
  ORDER BY NgayTao ASC;

  IF @Id IS NOT NULL
  BEGIN
    UPDATE dbo.DatCho
    SET TrangThai = N'Đang giữ',
        GiuDen    = DATEADD(HOUR, @GiuTrongGio, SYSUTCDATETIME())
    WHERE MaDatCho = @Id;

    SELECT @Id AS MaDatChoReady;
  END
  ELSE
    SELECT CAST(NULL AS NVARCHAR(20)) AS MaDatChoReady;
END
GO

CREATE OR ALTER PROCEDURE dbo.sp_DatCho_ExpireReady
AS
BEGIN
  SET NOCOUNT ON;

  UPDATE dbo.DatCho
  SET TrangThai = N'Hết hạn',
      GiuDen    = NULL
  WHERE TrangThai = N'Đang giữ'
    AND GiuDen IS NOT NULL
    AND GiuDen < SYSUTCDATETIME();

  SELECT @@ROWCOUNT AS SoDongCapNhat;
END
GO

/* ====== Seed dữ liệu mẫu (không làm lỗi khi chạy lại) ====== */

IF NOT EXISTS (SELECT 1 FROM TheLoai WHERE MaTheLoai='TL01')
  INSERT INTO TheLoai(MaTheLoai, TenTheLoai) VALUES('TL01', N'Sách tham khảo');

IF NOT EXISTS (SELECT 1 FROM Sach WHERE MaSach='S001')
  INSERT INTO Sach(MaSach, TieuDe, TacGia, MaTheLoai, NamXuatBan, NgonNgu, TomTat)
  VALUES('S001', N'Lập trình C# cơ bản', N'Nguyễn Văn A', 'TL01', 2024, N'vi', N'Sách mẫu');

IF NOT EXISTS (SELECT 1 FROM BanDoc WHERE MaBanDoc='BD05')
  INSERT INTO BanDoc(MaBanDoc, SoThe, HoTen, Email, DienThoai, HanThe, TrangThaiThe, DuNo)
  VALUES('BD05','ST00000005',N'Phạm B','b@example.com','0900000005','2026-12-31',N'Hoạt động',0);
-- Bản sao
GO
CREATE OR ALTER PROCEDURE sp_GetAllBanSao
AS
BEGIN
	SELECT MaBanSao, MaVach, MaSach, MaKe, TrangThai
	FROM BanSao
END

GO
CREATE OR ALTER PROCEDURE sp_GetBanSaoById
	@MaBanSao NVARCHAR(20)
AS
BEGIN
	SELECT MaBanSao, MaVach, MaSach, MaKe, TrangThai
	FROM BanSao
	WHERE MaBanSao = @MaBanSao
END

GO
CREATE OR ALTER PROCEDURE sp_InsertBanSao
	@MaBanSao NVARCHAR(20),
	@MaVach NVARCHAR(64),
	@MaSach NVARCHAR(20),
	@MaKe NVARCHAR(20),
	@TrangThai NVARCHAR(20)
AS
BEGIN
	INSERT INTO BanSao(MaBanSao, MaVach, MaSach, MaKe, TrangThai)
	VALUES(@MaBanSao,@MaVach, @MaSach, @MaKe, @TrangThai)
END

 GO

-- Alias tương thích legacy code: một số bản code cũ gọi sp_CreateBanSao
-- (có thể kèm SoLuong dù bảng BanSao không lưu SoLuong).
CREATE OR ALTER PROCEDURE sp_CreateBanSao
	@MaBanSao NVARCHAR(20),
	@MaVach NVARCHAR(64),
	@MaSach NVARCHAR(20),
	@MaKe NVARCHAR(20),
	@SoLuong INT = NULL,
	@TrangThai NVARCHAR(20)
AS
BEGIN
	EXEC dbo.sp_InsertBanSao @MaBanSao, @MaVach, @MaSach, @MaKe, @TrangThai;
END
GO

CREATE OR ALTER PROCEDURE sp_UpdateBanSao
	@MaBanSao NVARCHAR(20),
	@MaVach NVARCHAR(64),
	@MaSach NVARCHAR(20),
	@MaKe NVARCHAR(20),
	@TrangThai NVARCHAR(20)
AS
BEGIN
	UPDATE BanSao
	SET MaBanSao = @MaBanSao,
		MaVach = @MaVach,
		MaSach = @MaSach,
		MaKe = @MaKe,
		TrangThai = @TrangThai
	WHERE MaBanSao = @MaBanSao;
END

GO
CREATE OR ALTER PROCEDURE sp_DeleteBanSao
	@MaBanSao NVARCHAR(20)
AS
BEGIN
	DELETE FROM BanSao
	WHERE MaBanSao = @MaBanSao;
END
-- KeSach
GO
CREATE OR ALTER PROCEDURE sp_GetAllKeSach
AS
BEGIN
	SELECT MaKe, ViTri
	FROM KeSach
END
GO
GO
CREATE OR ALTER PROCEDURE sp_GetKeSachById
	@MaKe NVARCHAR(20)
AS
BEGIN
	SELECT MaKe, ViTri
	FROM KeSach
	WHERE MaKe = @MaKe	
END
GO
GO
CREATE OR ALTER PROCEDURE sp_CreateKeSach
	@MaKe NVARCHAR(20),
	@ViTri NVARCHAR(100)
	
AS
BEGIN
	INSERT INTO KeSach(MaKe, ViTri)
	VALUES(@MaKe, @ViTri)
END
GO
GO
CREATE OR ALTER PROCEDURE sp_UpdateKeSach
	@MaKe NVARCHAR(20),
	@ViTri NVARCHAR(100)
AS
BEGIN
	UPDATE KeSach
	SET MaKe = @MaKe,
		ViTri = @ViTri
	WHERE MaKe = @MaKe;
END
GO
GO
CREATE OR ALTER PROCEDURE sp_DeleteKeSach
	@MaKe NVARCHAR(20)
AS
BEGIN
	DELETE FROM KeSach
	WHERE MaKe = @MaKe;
END
GO

GO
CREATE OR ALTER PROCEDURE sp_ThanhToan
  @MaPhieuMuon NVARCHAR(20),
  @NgayTraThucTe DATETIME = NULL,
  @PhiTreHanMoiNgay DECIMAL(12,2) 
AS
BEGIN
  SET NOCOUNT ON;
  SET XACT_ABORT ON;

  BEGIN TRY
    BEGIN TRAN;


/* ====== INDEX cần có cho DatCho ====== */
/*
IF NOT EXISTS (
  SELECT 1 FROM sys.indexes
  WHERE name = 'UX_DatCho_Pending' AND object_id = OBJECT_ID('dbo.DatCho')
)
 

IF NOT EXISTS (
  SELECT 1 FROM sys.indexes
  WHERE name = 'IX_DatCho_SachTrangThai' AND object_id = OBJECT_ID('dbo.DatCho')
)
BEGIN
  CREATE INDEX IX_DatCho_SachTrangThai
  ON dbo.DatCho (MaSach, TrangThai, NgayTao);
END
GO

*/

/* ====== STORED PROCEDURES cho Storage ====== */

/*
-- Thêm đặt chỗ (ID do ứng dụng phát sinh)
CREATE OR ALTER PROCEDURE dbo.sp_DatCho_Insert
  @MaDatCho NVARCHAR(20),
  @MaSach    NVARCHAR(20),
  @MaBanDoc  NVARCHAR(20)
AS
BEGIN
  SET NOCOUNT ON;
  INSERT INTO dbo.DatCho(MaDatCho, MaSach, MaBanDoc, TrangThai)
  VALUES(@MaDatCho, @MaSach, @MaBanDoc, N'Chờ hàng');
END
GO

-- Lấy theo Id
CREATE OR ALTER PROCEDURE dbo.sp_DatCho_GetById
  @MaDatCho NVARCHAR(20)
AS
BEGIN
  SET NOCOUNT ON;
  SELECT * FROM dbo.DatCho WHERE MaDatCho = @MaDatCho;
END
GO

-- Danh sách (lọc tuỳ chọn)
CREATE OR ALTER PROCEDURE dbo.sp_DatCho_List
  @MaBanDoc  NVARCHAR(20) = NULL,
  @MaSach    NVARCHAR(20) = NULL,
  @TrangThai NVARCHAR(20) = NULL
AS
BEGIN
  SET NOCOUNT ON;
  SELECT *
  FROM dbo.DatCho
  WHERE (@MaBanDoc  IS NULL OR MaBanDoc  = @MaBanDoc)
    AND (@MaSach    IS NULL OR MaSach    = @MaSach)
    AND (@TrangThai IS NULL OR TrangThai = @TrangThai)
  ORDER BY NgayTao ASC; -- FIFO
END
GO

-- Hủy đặt chỗ ('Chờ hàng' hoặc 'Đang giữ')
CREATE OR ALTER PROCEDURE dbo.sp_DatCho_Cancel
  @MaDatCho NVARCHAR(20)
AS
BEGIN
  SET NOCOUNT ON;
  UPDATE dbo.DatCho
  SET TrangThai = N'Đã hủy', GiuDen = NULL
  WHERE MaDatCho = @MaDatCho
    AND TrangThai IN (N'Chờ hàng', N'Đang giữ');
END
GO

-- Chuyển người đầu hàng của 1 cuốn sách sang 'Đang giữ' trong X giờ
-- Trả về MaDatCho được set ready, NULL nếu chưa ai chờ
CREATE OR ALTER PROCEDURE dbo.sp_DatCho_SetReady
  @MaSach      NVARCHAR(20),
  @GiuTrongGio INT = 48
AS
BEGIN
  SET NOCOUNT ON;

  DECLARE @Id NVARCHAR(20);

  SELECT TOP 1 @Id = MaDatCho
  FROM dbo.DatCho WITH (UPDLOCK, ROWLOCK)
  WHERE MaSach = @MaSach AND TrangThai = N'Chờ hàng'
  ORDER BY NgayTao ASC;

  IF @Id IS NOT NULL
  BEGIN
    UPDATE dbo.DatCho
    SET TrangThai = N'Đang giữ',
        GiuDen    = DATEADD(HOUR, @GiuTrongGio, SYSUTCDATETIME())
    WHERE MaDatCho = @Id;

    SELECT @Id AS MaDatChoReady;
  END
  ELSE
    SELECT CAST(NULL AS NVARCHAR(20)) AS MaDatChoReady;
END
GO

-- Chuyển tất cả 'Đang giữ' quá hạn -> 'Hết hạn'
CREATE OR ALTER PROCEDURE dbo.sp_DatCho_ExpireReady
AS
BEGIN
  SET NOCOUNT ON;

  UPDATE dbo.DatCho
  SET TrangThai = N'Hết hạn',
      GiuDen    = NULL
  WHERE TrangThai = N'Đang giữ'
    AND GiuDen IS NOT NULL
    AND GiuDen < SYSUTCDATETIME();

  SELECT @@ROWCOUNT AS SoDongCapNhat;
END
GO


USE QuanLyThuVien;

-- Xem có sách/bạn đọc chưa
SELECT TOP 20 MaSach, TieuDe FROM dbo.Sach ORDER BY MaSach;        -- phải thấy ít nhất 1 mã
SELECT TOP 20 MaBanDoc, HoTen FROM dbo.BanDoc ORDER BY MaBanDoc;    -- phải thấy ít nhất 1 mã

-- Thể loại (Sach.MaTheLoai FK -> TheLoai.MaTheLoai)
IF NOT EXISTS (SELECT 1 FROM TheLoai WHERE MaTheLoai='TL01')
  INSERT INTO TheLoai(MaTheLoai, TenTheLoai) VALUES('TL01', N'Sách tham khảo');

-- Sách
IF NOT EXISTS (SELECT 1 FROM Sach WHERE MaSach='S001')
  INSERT INTO Sach(MaSach, TieuDe, TacGia, MaTheLoai, NamXuatBan, NgonNgu, TomTat)
  VALUES('S001', N'Lập trình C# cơ bản', N'Nguyễn Văn A', 'TL01', 2024, N'vi', N'Sách mẫu');

-- Bạn đọc (chú ý SoThe UNIQUE 10 ký tự, TrangThaiThe theo CHECK)
IF NOT EXISTS (SELECT 1 FROM BanDoc WHERE MaBanDoc='BD05')
  INSERT INTO BanDoc(MaBanDoc, SoThe, HoTen, Email, DienThoai, HanThe, TrangThaiThe, DuNo)
  VALUES('BD05','ST00000005',N'Phạm B','b@example.com','0900000005','2026-12-31',N'Hoạt động',0);

*/
    DECLARE @MaBanDoc NVARCHAR(20),
            @MaSach NVARCHAR(20),
            @HanTra DATETIME,
            @NgayTra DATETIME,
            @DaysLate INT,
            @SoTien DECIMAL(12,2);

    SELECT @MaBanDoc = MaBanDoc,
           @MaSach   = MaSach,
           @HanTra   = HanTra
    FROM PhieuMuon WITH (UPDLOCK, ROWLOCK)
    WHERE MaPhieuMuon = @MaPhieuMuon;


    IF @MaBanDoc IS NULL
      THROW 50001, N'Không tìm thấy phiếu mượn.', 1;

    SET @NgayTra = ISNULL(@NgayTraThucTe, SYSUTCDATETIME());

    UPDATE PhieuMuon
    SET NgayTraThucTe = @NgayTra,
        -- Theo CHECK constraint: chỉ cho phép 'Đang mở' | 'Đã đóng'
        TrangThai     = N'Đã đóng'
    WHERE MaPhieuMuon = @MaPhieuMuon;

    -- Quy tắc đếm ngày trễ: tính theo mốc nửa đêm (floor). Nếu muốn "trễ 1 giờ cũng tính 1 ngày", xem Cách 1B bên dưới.
    SET @DaysLate = DATEDIFF(DAY, @HanTra, @NgayTra);
    IF @DaysLate < 0 SET @DaysLate = 0;

    IF @DaysLate > 0
    BEGIN
      SET @SoTien = @DaysLate * @PhiTreHanMoiNgay;

      INSERT INTO Phat(MaPhat, MaPhieuMuon, SoTien, LyDo, NgayTinh, TrangThai, MaThanhToan)
      VALUES(CONCAT('PP', FORMAT(SYSUTCDATETIME(), 'yyyyMMddHHmmssfff')),
            @MaPhieuMuon, @SoTien, N'Trễ hạn', SYSUTCDATETIME(), N'Chưa trả', NULL);
    END

    COMMIT;
  END TRY
  BEGIN CATCH
    IF XACT_STATE() <> 0 ROLLBACK;
    THROW;
  END CATCH
END
GO




	


	USE QuanLyThuVien;
GO
ALTER TABLE dbo.PhieuMuon
ALTER COLUMN NgayTraThucTe DATE NULL;
GO


USE QuanLyThuVien;
GO

-- 1) Tạo bạn đọc (để tài khoản "Bạn đọc" có MaBanDoc hợp lệ)
IF NOT EXISTS (SELECT 1 FROM dbo.BanDoc WHERE MaBanDoc = 'BD001')
BEGIN
  INSERT INTO dbo.BanDoc (MaBanDoc, SoThe, HoTen, Email, DienThoai, HanThe, TrangThaiThe, DuNo)
  VALUES ('BD001', 'ST00000001', N'Người dùng', 'user@test.local', '0900000001', '2027-12-31', N'Hoạt động', 0);
END
GO

-- 2) Seed TaiKhoan (mật khẩu đã hash BCrypt cost 10)
IF NOT EXISTS (SELECT 1 FROM dbo.TaiKhoan WHERE TenDangNhap = 'admin')
BEGIN
  INSERT INTO dbo.TaiKhoan (MaTaiKhoan, TenDangNhap, MatKhau, VaiTro, MaBanDoc)
  VALUES ('TKADMIN', 'admin', '$2a$10$TX6KW4ucyahldauNIvD3w.SkjIDSSigXnhpoBfNx98izUeMGS4x/m', N'Quản trị', NULL);
END

IF NOT EXISTS (SELECT 1 FROM dbo.TaiKhoan WHERE TenDangNhap = 'thuthu')
BEGIN
  INSERT INTO dbo.TaiKhoan (MaTaiKhoan, TenDangNhap, MatKhau, VaiTro, MaBanDoc)
  VALUES ('TKTHUTHU', 'thuthu', '$2a$10$KmNN1mKjJuAGOgPxJlrEf.J5yZmfqUWwwtdMKzRtASnPOCZxmv7xe', N'Thủ thư', NULL);
END

IF NOT EXISTS (SELECT 1 FROM dbo.TaiKhoan WHERE TenDangNhap = 'user')
BEGIN
  INSERT INTO dbo.TaiKhoan (MaTaiKhoan, TenDangNhap, MatKhau, VaiTro, MaBanDoc)
  VALUES ('TKUSER', 'user', '$2a$10$vlot7SVVOtBZygvsp4mVquZLY5oaGRXoFBPa3tsM0JK1.JDkSHnre', N'Bạn đọc', 'BD001');
END
GO

USE QuanLyThuVien;
GO

-- TheLoai
IF NOT EXISTS (SELECT 1 FROM dbo.TheLoai WHERE MaTheLoai = 'TL001')
BEGIN
    INSERT INTO dbo.TheLoai (MaTheLoai, TenTheLoai, MoTa)
    VALUES ('TL001', N'CNTT', NULL);
END
GO

-- Sach
IF NOT EXISTS (SELECT 1 FROM dbo.Sach WHERE MaSach = 'S001')
BEGIN
    INSERT INTO dbo.Sach (MaSach, TieuDe, TacGia, MaTheLoai, NamXuatBan, NgonNgu, TomTat)
    VALUES ('S001', N'Sach Test', N'Tac Gia', 'TL001', 2024, N'vi', NULL);
END
GO

-- KeSach
IF NOT EXISTS (SELECT 1 FROM dbo.KeSach WHERE MaKe = 'KS001')
BEGIN
    INSERT INTO dbo.KeSach (MaKe, ViTri)
    VALUES ('KS001', N'Tang 1');
END
GO

-- BanSao (để thỏa FK PhieuMuon.MaBanSao)
IF NOT EXISTS (SELECT 1 FROM dbo.BanSao WHERE MaBanSao = 'BS001')
BEGIN
    INSERT INTO dbo.BanSao (MaBanSao, MaVach, MaSach, MaKe, TrangThai)
    VALUES ('BS001', 'VACH001', 'S001', 'KS001', N'Có sẵn');
END
GO