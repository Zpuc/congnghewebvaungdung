using System;
using Microsoft.Data.SqlClient;
using System.Text;

class Program
{
    static void Main()
    {
        var connectionString = @"Data Source=DESKTOP-NTJKGTE\SQLEXPRESS;Initial Catalog=QuanLyThuVien;Integrated Security=True;TrustServerCertificate=True;Encrypt=False;";

        try
        {
            using var con = new SqlConnection(connectionString);
            con.Open();
            Console.OutputEncoding = Encoding.UTF8;
            Console.InputEncoding = Encoding.UTF8;
            Console.WriteLine("✅ Connected to database!");

            // Update TheLoai
            var theLoai = new[]
            {
                ("TL001", "Công nghệ thông tin", "Sách về lập trình, máy tính"),
                ("TL002", "Văn học", "Tiểu thuyết, truyện ngắn, thơ"),
                ("TL003", "Khoa học", "Sách khoa học tự nhiên, xã hội"),
                ("TL004", "Lịch sử", "Sách lịch sử, biography"),
                ("TL005", "Triết học", "Sách triết học, tư duy"),
                ("TL006", "Kinh tế", "Sách kinh tế, quản trị, marketing"),
                ("TL007", "Y học", "Sách y học, sức khỏe"),
                ("TL008", "Ngoại ngữ", "Sách học ngoại ngữ"),
                ("TL009", "Nghệ thuật", "Sách về hội họa, âm nhạc, nhiếp ảnh"),
                ("TL010", "Thiếu nhi", "Sách cho trẻ em, thiếu niên")
            };

            foreach (var (ma, ten, moTa) in theLoai)
            {
                var cmd = new SqlCommand("UPDATE TheLoai SET TenTheLoai = @ten, MoTa = @moTa WHERE MaTheLoai = @ma", con);
                cmd.Parameters.AddWithValue("@ma", ma);
                cmd.Parameters.AddWithValue("@ten", ten);
                cmd.Parameters.AddWithValue("@moTa", moTa);
                int rows = cmd.ExecuteNonQuery();
                if (rows > 0)
                    Console.WriteLine($"✅ Updated TheLoai {ma}: {ten}");
                else
                {
                    // Insert if not exists
                    cmd = new SqlCommand("INSERT INTO TheLoai (MaTheLoai, TenTheLoai, MoTa) VALUES (@ma, @ten, @moTa)", con);
                    cmd.Parameters.AddWithValue("@ma", ma);
                    cmd.Parameters.AddWithValue("@ten", ten);
                    cmd.Parameters.AddWithValue("@moTa", moTa);
                    cmd.ExecuteNonQuery();
                    Console.WriteLine($"✅ Inserted TheLoai {ma}: {ten}");
                }
            }

            // Update KeSach
            var keSach = new[]
            {
                ("KS001", "Tầng 1 - Khu A"),
                ("KS002", "Tầng 1 - Khu B"),
                ("KS003", "Tầng 2 - Khu A"),
                ("KS004", "Tầng 2 - Khu B"),
                ("KS005", "Tầng 3 - Khu A"),
                ("KS006", "Tầng 3 - Khu B"),
                ("KS007", "Tầng 4 - Khu A"),
                ("KS008", "Tầng 4 - Khu B"),
                ("KS009", "Tầng 5 - Khu A"),
                ("KS010", "Tầng 5 - Khu B")
            };

            foreach (var (ma, viTri) in keSach)
            {
                var cmd = new SqlCommand("UPDATE KeSach SET ViTri = @viTri WHERE MaKe = @ma", con);
                cmd.Parameters.AddWithValue("@ma", ma);
                cmd.Parameters.AddWithValue("@viTri", viTri);
                int rows = cmd.ExecuteNonQuery();
                if (rows > 0)
                    Console.WriteLine($"✅ Updated KeSach {ma}: {viTri}");
                else
                {
                    cmd = new SqlCommand("INSERT INTO KeSach (MaKe, ViTri) VALUES (@ma, @viTri)", con);
                    cmd.Parameters.AddWithValue("@ma", ma);
                    cmd.Parameters.AddWithValue("@viTri", viTri);
                    cmd.ExecuteNonQuery();
                    Console.WriteLine($"✅ Inserted KeSach {ma}: {viTri}");
                }
            }

            // Update Sach
            var sach = new[]
            {
                ("S001", "Lập trình C# cơ bản", "Nguyễn Văn An", 2024, "TL001", "Tiếng Việt", "Sách hướng dẫn lập trình C# từ cơ bản đến nâng cao"),
                ("S002", "Python cho người mới bắt đầu", "Trần Thị Bình", 2023, "TL001", "Tiếng Việt", "Giới thiệu ngôn ngữ Python và ứng dụng"),
                ("S003", "Đắc Nhân Tâm", "Dale Carnegie", 2020, "TL006", "Tiếng Việt", "Sách về kỹ năng giao tiếp và tác động con người"),
                ("S004", "Tuổi Trẻ Đáng Giá Bao Nhiêu", "Rosie Nguyễn", 2022, "TL005", "Tiếng Việt", "Triết lý sống cho giới trẻ"),
                ("S005", "Lão Hạc", "Nam Cao", 2019, "TL002", "Tiếng Việt", "Tác phẩm văn học kinh điển"),
                ("S006", "Sapiens: Lược sử loài người", "Yuval Noah Harari", 2021, "TL003", "Tiếng Việt", "Sách lịch sử về sự phát triển của nhân loại"),
                ("S007", "Người Giàu Có Nhất Thành Babylon", "George S. Clason", 2018, "TL006", "Tiếng Việt", "Nguyên tắc tài chính cá nhân"),
                ("S008", "Đánh Thức Trái Tim", "John Gray", 2020, "TL005", "Tiếng Việt", "Hiểu về giới tính trong tình yêu"),
                ("S009", "Toán Lớp 1", "Nguyễn Văn Minh", 2023, "TL010", "Tiếng Việt", "Sách giáo khoa toán lớp 1"),
                ("S010", "Tiếng Anh Giao Tiếp", "Michael Đỗ", 2024, "TL008", "Tiếng Anh - Việt", "Sách học tiếng Anh cơ bản")
            };

            foreach (var (ma, tieuDe, tacGia, nam, maTheLoai, ngonNgu, tomTat) in sach)
            {
                var cmd = new SqlCommand("UPDATE Sach SET TieuDe = @tieuDe, TacGia = @tacGia, NamXuatBan = @nam, MaTheLoai = @maTheLoai, NgonNgu = @ngonNgu, TomTat = @tomTat WHERE MaSach = @ma", con);
                cmd.Parameters.AddWithValue("@ma", ma);
                cmd.Parameters.AddWithValue("@tieuDe", tieuDe);
                cmd.Parameters.AddWithValue("@tacGia", tacGia);
                cmd.Parameters.AddWithValue("@nam", nam);
                cmd.Parameters.AddWithValue("@maTheLoai", maTheLoai);
                cmd.Parameters.AddWithValue("@ngonNgu", ngonNgu);
                cmd.Parameters.AddWithValue("@tomTat", tomTat);
                int rows = cmd.ExecuteNonQuery();
                if (rows > 0)
                    Console.WriteLine($"✅ Updated Sach {ma}: {tieuDe}");
                else
                {
                    cmd = new SqlCommand("INSERT INTO Sach (MaSach, TieuDe, TacGia, NamXuatBan, MaTheLoai, NgonNgu, TomTat) VALUES (@ma, @tieuDe, @tacGia, @nam, @maTheLoai, @ngonNgu, @tomTat)", con);
                    cmd.Parameters.AddWithValue("@ma", ma);
                    cmd.Parameters.AddWithValue("@tieuDe", tieuDe);
                    cmd.Parameters.AddWithValue("@tacGia", tacGia);
                    cmd.Parameters.AddWithValue("@nam", nam);
                    cmd.Parameters.AddWithValue("@maTheLoai", maTheLoai);
                    cmd.Parameters.AddWithValue("@ngonNgu", ngonNgu);
                    cmd.Parameters.AddWithValue("@tomTat", tomTat);
                    cmd.ExecuteNonQuery();
                    Console.WriteLine($"✅ Inserted Sach {ma}: {tieuDe}");
                }
            }

            // Update BanSao
            var banSao = new[]
            {
                ("BS001", "VACH001", "S001", "KS001", "Có sẵn"),
                ("BS002", "VACH002", "S001", "KS002", "Có sẵn"),
                ("BS003", "VACH003", "S002", "KS001", "Có sẵn"),
                ("BS004", "VACH004", "S002", "KS003", "Có sẵn"),
                ("BS005", "VACH005", "S003", "KS002", "Có sẵn"),
                ("BS006", "VACH006", "S003", "KS004", "Có sẵn"),
                ("BS007", "VACH007", "S004", "KS003", "Có sẵn"),
                ("BS008", "VACH008", "S004", "KS005", "Có sẵn"),
                ("BS009", "VACH009", "S005", "KS004", "Có sẵn"),
                ("BS010", "VACH010", "S005", "KS006", "Có sẵn")
            };

            foreach (var (maBanSao, maVach, maSach, maKe, trangThai) in banSao)
            {
                var cmd = new SqlCommand("UPDATE BanSao SET MaVach = @maVach, MaSach = @maSach, MaKe = @maKe, TrangThai = @trangThai WHERE MaBanSao = @maBanSao", con);
                cmd.Parameters.AddWithValue("@maBanSao", maBanSao);
                cmd.Parameters.AddWithValue("@maVach", maVach);
                cmd.Parameters.AddWithValue("@maSach", maSach);
                cmd.Parameters.AddWithValue("@maKe", maKe);
                cmd.Parameters.AddWithValue("@trangThai", trangThai);
                int rows = cmd.ExecuteNonQuery();
                if (rows > 0)
                    Console.WriteLine($"✅ Updated BanSao {maBanSao}: {trangThai}");
                else
                {
                    cmd = new SqlCommand("INSERT INTO BanSao (MaBanSao, MaVach, MaSach, MaKe, TrangThai) VALUES (@maBanSao, @maVach, @maSach, @maKe, @trangThai)", con);
                    cmd.Parameters.AddWithValue("@maBanSao", maBanSao);
                    cmd.Parameters.AddWithValue("@maVach", maVach);
                    cmd.Parameters.AddWithValue("@maSach", maSach);
                    cmd.Parameters.AddWithValue("@maKe", maKe);
                    cmd.Parameters.AddWithValue("@trangThai", trangThai);
                    cmd.ExecuteNonQuery();
                    Console.WriteLine($"✅ Inserted BanSao {maBanSao}: {trangThai}");
                }
            }

            Console.WriteLine("\n✅ All seed data updated/inserted successfully!");
        }
        catch (Exception ex)
        {
            Console.WriteLine("❌ Error: " + ex.Message);
        }
    }
}
