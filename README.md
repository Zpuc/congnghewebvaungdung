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

Mặc định profile **http** thường chỉ mở **`http://localhost:5057`**. Nếu bạn cần HTTPS `https://localhost:7159`, chạy:

```bash
dotnet run --project API/API.csproj --launch-profile https
```

**Frontend** (`frontend/.env.development`) trỏ `VITE_API_BASE_URL` về đúng URL trên (mặc định đã dùng `http://localhost:5057` cho khớp `dotnet run`). Nếu đổi cổng hoặc HTTPS, sửa env và **chạy lại** `npm run dev`.

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

**Bật API trước** (mục 3, `http://localhost:5057`), rồi:

```bash
npm run dev
```

Frontend mặc định dùng **Vite proxy**: trình duyệt gọi `http://localhost:5173/api/...`, Vite chuyển tiếp sang API (giảm lỗi CORS/preflight). Chỉ cần đổi `VITE_API_BASE_URL` trong `frontend/.env.development` nếu bạn **không** muốn dùng proxy.

Nếu thấy **`net::ERR_CONNECTION_REFUSED`**: backend chưa chạy hoặc sai cổng so với `vite.config.ts` → `proxy['/api'].target`.

Mặc định sẽ chạy tại:
- `http://localhost:5173/`

Trang đăng nhập:
- `/login`

---

## 6) Ghi chú nhanh
- **CORS + HTTP:** API **không** bật `UseHttpsRedirection` (redirect HTTP→HTTPS làm hỏng CORS preflight khi gọi `http://localhost:5057` từ Vite). HTTPS nên cấu hình ở proxy/IIS phía trước khi deploy.
- `PhieuMuon.NgayTraThucTe`: theo nghiệp vụ **được phép NULL khi tạo phiếu mượn**, chỉ set khi trả sách.
- `PhieuMuon.TrangThai`: theo hướng đang dùng: **`Đang mở` / `Đã đóng`**
- `BanSao.TrangThai`: **`Có sẵn` / `Đang mượn` / `Hư hỏng`**

