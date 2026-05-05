using Microsoft.Data.SqlClient;
using System.Data;
using MyWebAPI.DTO;

namespace MyWebAPI.DAL.Repositories
{
    public interface ITaiKhoanRepository
    {
        Task<List<TaiKhoanDTO>> GetAllAsync();
        Task<TaiKhoanDTO?> GetByIdAsync(string maTaiKhoan);
        Task<int> CreateAsync(CreateTaiKhoanRequest taiKhoan, string maTaiKhoan, string hashedPassword);
        Task<int> UpdateAsync(string maTaiKhoan, UpdateTaiKhoanRequest taiKhoan, string hashedPassword);
        Task<int> DeleteAsync(string maTaiKhoan);
        Task<TaiKhoanDTO?> GetByTenDangNhapAsync(string tenDangNhap);

        Task<TaiKhoanDTO?> RegisterReaderAsync(string hoTen, string email, string dienThoai, string matKhauHash);

    }

    public class TaiKhoanRepository : ITaiKhoanRepository
    {
        private readonly string _connStr;

        public TaiKhoanRepository(string connectionString)
        {
            _connStr = connectionString;
        }

        public async Task<List<TaiKhoanDTO>> GetAllAsync()
        {
            var list = new List<TaiKhoanDTO>();
            using var con = new SqlConnection(_connStr);
            await con.OpenAsync();
            using var cmd = new SqlCommand("sp_GetAllTaiKhoan", con);
            cmd.CommandType = CommandType.StoredProcedure;

            using var rd = await cmd.ExecuteReaderAsync();
            while (await rd.ReadAsync())
            {
                var dto = new TaiKhoanDTO
                {
                    MaTaiKhoan = rd.GetString(0),
                    TenDangNhap = rd.GetString(1),
                    MatKhau = rd.GetString(2),
                    VaiTro = rd.GetString(3)
                };

                // Nếu SP có trả thêm cột MaBanDoc thì đọc, còn không thì bỏ qua
                if (rd.FieldCount > 4)
                {
                    if (!rd.IsDBNull(4))
                        dto.MaBanDoc = rd.GetString(4);
                }

                list.Add(dto);
            }

            return list;
        }

        public async Task<TaiKhoanDTO?> GetByIdAsync(string maTaiKhoan)
        {
            using var con = new SqlConnection(_connStr);
            await con.OpenAsync();
            using var cmd = new SqlCommand("sp_GetTaiKhoanById", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@MaTaiKhoan", maTaiKhoan);

            using var rd = await cmd.ExecuteReaderAsync();
            if (await rd.ReadAsync())
            {
                var dto = new TaiKhoanDTO
                {
                    MaTaiKhoan = rd.GetString(0),
                    TenDangNhap = rd.GetString(1),
                    MatKhau = rd.GetString(2),
                    VaiTro = rd.GetString(3),
                    MaBanDoc = rd.GetString(4)
                };

                if (rd.FieldCount > 4 && !rd.IsDBNull(4))
                {
                    dto.MaBanDoc = rd.GetString(4);
                }

                return dto;
            }
            return null;

        }

        public async Task<int> CreateAsync(CreateTaiKhoanRequest taiKhoan, string maTaiKhoan, string hashedPassword)
        {
            using var con = new SqlConnection(_connStr);
            await con.OpenAsync();
            using var cmd = new SqlCommand("sp_Register", con);
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@MaTaiKhoan", maTaiKhoan);
            cmd.Parameters.AddWithValue("@TenDangNhap", taiKhoan.TenDangNhap);
            cmd.Parameters.AddWithValue("@MatKhau", hashedPassword);
            cmd.Parameters.AddWithValue("@VaiTro", taiKhoan.VaiTro);
            cmd.Parameters.AddWithValue("@MaBanDoc", (object?)taiKhoan.MaBanDoc ?? DBNull.Value);

            return await cmd.ExecuteNonQueryAsync();
        }

        public async Task<int> UpdateAsync(string maTaiKhoan, UpdateTaiKhoanRequest taiKhoan, string hashedPassword)
        {
            using var con = new SqlConnection(_connStr);
            await con.OpenAsync();
            using var cmd = new SqlCommand("sp_UpdateTaiKhoan", con);
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@MaTaiKhoan", maTaiKhoan);
            cmd.Parameters.AddWithValue("@TenDangNhap", taiKhoan.TenDangNhap);
            cmd.Parameters.AddWithValue("@MatKhau", hashedPassword);
            cmd.Parameters.AddWithValue("@VaiTro", taiKhoan.VaiTro);
            cmd.Parameters.AddWithValue("@MaBanDoc", (object?)taiKhoan.MaBanDoc ?? DBNull.Value);

            return await cmd.ExecuteNonQueryAsync();
        }

        public async Task<int> DeleteAsync(string maTaiKhoan)
        {
            using var con = new SqlConnection(_connStr);
            await con.OpenAsync();
            using var cmd = new SqlCommand("sp_DeleteTaiKhoan", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@MaTaiKhoan", maTaiKhoan);

            return await cmd.ExecuteNonQueryAsync();
        }

        public async Task<TaiKhoanDTO?> GetByTenDangNhapAsync(string tenDangNhap)
        {
            using var conn = new SqlConnection(_connStr);
            using var cmd = new SqlCommand("sp_Login", conn);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@TenDangNhap", tenDangNhap);

            await conn.OpenAsync();
            using var rd = await cmd.ExecuteReaderAsync();
            if (await rd.ReadAsync())
            {
                // Một số version của sp_Login có thể chưa trả về cột MaBanDoc.
                // Tránh crash bằng cách chỉ đọc khi cột tồn tại.
                int? maBanDocOrdinal = null;
                for (int i = 0; i < rd.FieldCount; i++)
                {
                    if (string.Equals(rd.GetName(i), "MaBanDoc", StringComparison.OrdinalIgnoreCase))
                    {
                        maBanDocOrdinal = i;
                        break;
                    }
                }

                return new TaiKhoanDTO
                {
                    MaTaiKhoan = rd["MaTaiKhoan"].ToString() ?? "",
                    TenDangNhap = rd["TenDangNhap"].ToString() ?? "",
                    VaiTro = rd["VaiTro"].ToString() ?? "",
                    MatKhau = rd["MatKhau"].ToString() ?? "",
                    MaBanDoc = maBanDocOrdinal.HasValue && !rd.IsDBNull(maBanDocOrdinal.Value)
                        ? rd.GetString(maBanDocOrdinal.Value)
                        : null
                };
            }
            return null;
        }
        public async Task<TaiKhoanDTO?> RegisterReaderAsync(string hoTen, string email, string dienThoai, string matKhauHash)
        {
            // Một số DB chưa có stored procedure sp_RegisterReader.
            // Fallback: tự tạo BanDoc + TaiKhoan bằng các SP sẵn có (sp_CreateBanDoc + sp_Register).
            using var con = new SqlConnection(_connStr);
            await con.OpenAsync();
            using var tx = (SqlTransaction)await con.BeginTransactionAsync();

            try
            {
                var maBanDoc = "BD" + Guid.NewGuid().ToString("N")[..8].ToUpperInvariant();
                var soThe = Random.Shared.NextInt64(0, 9_999_999_999L).ToString("D10");
                var hanThe = DateTime.UtcNow.Date.AddYears(1);

                using (var createBanDoc = new SqlCommand("sp_CreateBanDoc", con, tx))
                {
                    createBanDoc.CommandType = CommandType.StoredProcedure;
                    createBanDoc.Parameters.AddWithValue("@MaBanDoc", maBanDoc);
                    createBanDoc.Parameters.AddWithValue("@SoThe", soThe);
                    createBanDoc.Parameters.AddWithValue("@HoTen", hoTen);
                    createBanDoc.Parameters.AddWithValue("@Email", email);
                    createBanDoc.Parameters.AddWithValue("@DienThoai", dienThoai);
                    createBanDoc.Parameters.AddWithValue("@HanThe", hanThe);
                    createBanDoc.Parameters.AddWithValue("@TrangThaiThe", "Hoạt động");
                    createBanDoc.Parameters.AddWithValue("@DuNo", 0m);

                    await createBanDoc.ExecuteNonQueryAsync();
                }

                var maTaiKhoan = "TK" + Guid.NewGuid().ToString("N")[..8].ToUpperInvariant();
                var tenDangNhap = string.IsNullOrWhiteSpace(email) ? ("user" + soThe) : email.Trim();

                using (var createTaiKhoan = new SqlCommand("sp_Register", con, tx))
                {
                    createTaiKhoan.CommandType = CommandType.StoredProcedure;
                    createTaiKhoan.Parameters.AddWithValue("@MaTaiKhoan", maTaiKhoan);
                    createTaiKhoan.Parameters.AddWithValue("@TenDangNhap", tenDangNhap);
                    createTaiKhoan.Parameters.AddWithValue("@MatKhau", matKhauHash);
                    createTaiKhoan.Parameters.AddWithValue("@VaiTro", "Bạn đọc");
                    createTaiKhoan.Parameters.AddWithValue("@MaBanDoc", maBanDoc);

                    await createTaiKhoan.ExecuteNonQueryAsync();
                }

                await tx.CommitAsync();

                return new TaiKhoanDTO
                {
                    MaTaiKhoan = maTaiKhoan,
                    TenDangNhap = tenDangNhap,
                    VaiTro = "Bạn đọc",
                    MaBanDoc = maBanDoc
                };
            }
            catch
            {
                await tx.RollbackAsync();
                throw;
            }
        }

    }
}