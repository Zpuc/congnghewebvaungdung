using Microsoft.Data.SqlClient;
using System.Data;
using MyWebAPI.DTO;

namespace MyWebAPI.DAL.Repositories
{
    // Interface - Định nghĩa các methods
    public interface IBanDocRepository
    {
        Task<List<BanDocDTO>> GetAllAsync();
        Task<BanDocDTO?> GetByIdAsync(string maBanDoc);
        Task<int> CreateAsync(CreateBanDocRequest banDoc, string maBanDoc);
        Task<int> UpdateAsync(string maBanDoc, UpdateBanDocRequest banDoc);
        Task<int> DeleteAsync(string maBanDoc);

        Task<int> UpdateThongTinBanDocAsync(string maBanDoc, string hoTen, string email, string dienThoai);
    }

    // Implementation - Class thực thi
    public class BanDocRepository : IBanDocRepository
    {
        private readonly string _connStr;

        public BanDocRepository(string connectionString)
        {
            _connStr = connectionString;
        }

        public async Task<List<BanDocDTO>> GetAllAsync()
        {
            var list = new List<BanDocDTO>();
            using var con = new SqlConnection(_connStr);
            await con.OpenAsync();
            using var cmd = new SqlCommand("sp_GetAllBanDoc", con);
            cmd.CommandType = CommandType.StoredProcedure;

            using var rd = await cmd.ExecuteReaderAsync();
            while (await rd.ReadAsync())
            {
                list.Add(new BanDocDTO
                {
                    MaBanDoc = rd.GetString(0),
                    HoTen = rd.GetString(1),
                    SoThe = rd.GetString(2),
                    Email = rd.GetString(3),
                    DienThoai = rd.GetString(4),
                    HanThe = rd.GetDateTime(5),
                    TrangThaiThe = rd.GetString(6),
                    DuNo = rd.GetDecimal(7)
                });
            }
            return list;
        }

        public async Task<BanDocDTO?> GetByIdAsync(string maBanDoc)
        {
            using var con = new SqlConnection(_connStr);
            await con.OpenAsync();
            using var cmd = new SqlCommand("sp_GetBanDocById", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@MaBanDoc", maBanDoc);

            using var rd = await cmd.ExecuteReaderAsync();
            if (await rd.ReadAsync())
            {
                return new BanDocDTO
                {
                    MaBanDoc = rd.GetString(0),
                    HoTen = rd.GetString(1),
                    SoThe = rd.GetString(2),
                    Email = rd.GetString(3),
                    DienThoai = rd.GetString(4),
                    HanThe = rd.GetDateTime(5),
                    TrangThaiThe = rd.GetString(6),
                    DuNo = rd.GetDecimal(7)
                };
            }
            return null;
        }

        public async Task<int> CreateAsync(CreateBanDocRequest banDoc, string maBanDoc)
        {
            using var con = new SqlConnection(_connStr);
            await con.OpenAsync();
            using var cmd = new SqlCommand("sp_CreateBanDoc", con);
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@MaBanDoc", maBanDoc);
            cmd.Parameters.AddWithValue("@HoTen", banDoc.HoTen);
            cmd.Parameters.AddWithValue("@SoThe", banDoc.SoThe);
            cmd.Parameters.AddWithValue("@Email", banDoc.Email);
            cmd.Parameters.AddWithValue("@DienThoai", banDoc.DienThoai);
            cmd.Parameters.AddWithValue("@HanThe", banDoc.HanThe);
            cmd.Parameters.AddWithValue("@TrangThaiThe", banDoc.TrangThaiThe);
            cmd.Parameters.AddWithValue("@DuNo", banDoc.DuNo);

            return await cmd.ExecuteNonQueryAsync();
        }

        public async Task<int> UpdateAsync(string maBanDoc, UpdateBanDocRequest banDoc)
        {
            using var con = new SqlConnection(_connStr);
            await con.OpenAsync();
            using var cmd = new SqlCommand("sp_UpdateBanDoc", con);
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@MaBanDoc", maBanDoc);
            cmd.Parameters.AddWithValue("@HoTen", banDoc.HoTen);
            cmd.Parameters.AddWithValue("@SoThe", banDoc.SoThe);
            cmd.Parameters.AddWithValue("@Email", banDoc.Email);
            cmd.Parameters.AddWithValue("@DienThoai", banDoc.DienThoai);
            cmd.Parameters.AddWithValue("@HanThe", banDoc.HanThe);
            cmd.Parameters.AddWithValue("@TrangThaiThe", banDoc.TrangThaiThe);
            cmd.Parameters.AddWithValue("@DuNo", banDoc.DuNo);

            return await cmd.ExecuteNonQueryAsync();
        }

        public async Task<int> DeleteAsync(string maBanDoc)
        {
            using var con = new SqlConnection(_connStr);
            await con.OpenAsync();
            using var cmd = new SqlCommand("sp_DeleteBanDoc", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@MaBanDoc", maBanDoc);

            return await cmd.ExecuteNonQueryAsync();
        }

        public async Task<int> UpdateThongTinBanDocAsync(string maBanDoc, string hoTen, string email, string dienThoai)
        {
            using var con = new SqlConnection(_connStr);
            await con.OpenAsync();

            using var cmd = new SqlCommand("sp_UpdateTTBanDoc", con);
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@MaBanDoc", maBanDoc);
            cmd.Parameters.AddWithValue("@HoTen", hoTen);
            cmd.Parameters.AddWithValue("@Email", email);
            cmd.Parameters.AddWithValue("@DienThoai", dienThoai);

            return await cmd.ExecuteNonQueryAsync();
        }

    }
}