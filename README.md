# Hướng dẫn chạy dự án (Backend + Frontend)

## Yêu cầu môi trường
- **.NET SDK**: dùng để chạy các project trong solution `MyWebAPI.sln`
- **SQL Server / SQL Server Express**
- **Node.js + npm**

---

## 1) Setup Database (SQL Server)

### 1.1 Tạo database + tables
Chạy file:
- `QuanLyThuVien.sql`

Lưu ý: file này có đoạn **DROP DATABASE** + **CREATE DATABASE** nên nếu chạy lại sẽ **mất dữ liệu hiện có**.

### 1.2 Tạo stored procedures
Chạy file:
- `sp.sql`

---

## 2) Seed nhanh tài khoản đăng nhập

Chạy script seed (để có 3 tài khoản: admin / thủ thư / bạn đọc).  
Tài khoản mặc định:
- **admin** / `admin123` / vai trò **Quản trị**
- **thuthu** / `thuthu123` / vai trò **Thủ thư**
- **user** / `user123` / vai trò **Bạn đọc**

Script seed đã được gửi trong chat (dùng BCrypt hash). Nếu bạn cần mình gom lại thành file `.sql` seed riêng thì nói mình.

---

## 3) Chạy Backend (API)

### 3.1 Kiểm tra connection string
Xem trong:
- `API/appsettings.json`
- `MyWebAPI/appsettings.Development.json`

Ví dụ đang dùng:
- `Initial Catalog=QuanLyThuVien`

### 3.2 Chạy project API
Tại thư mục gốc repo:

```bash
dotnet run --project API/API.csproj
```

Hoặc mở `MyWebAPI.sln` bằng Visual Studio và Run.

### 3.3 Nếu build bị “file is locked”
Nếu bạn gặp lỗi kiểu file `.exe/.dll` bị lock khi `dotnet build`, hãy **tắt process đang chạy** (API/Visual Studio đang chạy app), rồi build/run lại.

---

## 4) Test API bằng Postman

Import file:
- `API/MyWebAPI.postman_collection.json`

Gợi ý chạy đúng thứ tự (để không lỗi FK):
1. `DangNhap/Login` (lấy token)
2. `TheLoai/Create` → lưu `maTheLoai`
3. `Sach/Create` → lưu `maSach`
4. `KeSach/Create` → lưu `maKe`
5. `BanSao/Create` → lưu `maBanSao`
6. `BanDoc/Create` → lưu `maBanDoc`
7. `PhieuMuon/Create` → lưu `maPhieuMuon`

Collection đã được chỉnh để **không hardcode ID** và tự set biến.

---

## 5) Chạy Frontend (React + TypeScript + Ant Design)

### 5.1 Cài dependencies

```bash
cd frontend
npm install
```

### 5.2 Chạy dev server

```bash
npm run dev
```

Mặc định sẽ chạy tại:
- `http://localhost:5173/`

Trang đăng nhập:
- `/login`

---

## 6) Ghi chú nhanh
- `PhieuMuon.NgayTraThucTe`: theo nghiệp vụ **được phép NULL khi tạo phiếu mượn**, chỉ set khi trả sách.
- `PhieuMuon.TrangThai`: theo hướng đang dùng: **`Đang mở` / `Đã đóng`**
- `BanSao.TrangThai`: **`Có sẵn` / `Đang mượn` / `Hư hỏng`**

