using Azure.Core;
using Microsoft.Data.SqlClient;
using MyWebAPI.DTO;
using System.Data;

namespace MyWebAPI.DAL.Repositories
{
    public interface IBanSaoRepository
    {
        Task<List<BanSaoDTO>> GetAllAsync();
        Task<BanSaoDTO> GetByIdAsync(string maBanSao);
        Task<int> CreateAsync(CreateBanSaoRequest banSao, string maBanSao);
        Task<int> UpdateAsync(string maBanSao, UpdateBanSaoRequest banSao);
        Task<int> DeleteAsync(string maBanSao);
    }
    public class BanSaoRepository : IBanSaoRepository
    {
        private readonly string _connStr;
        public BanSaoRepository(string connectionString)
        {
            _connStr = connectionString;

        }

        public async Task<List<BanSaoDTO>> GetAllAsync()
        {
            var list = new List<BanSaoDTO>();
            using var con = new SqlConnection(_connStr);
            await con.OpenAsync();
            using var cmd = new SqlCommand("sp_GetAllBanSao", con);
            cmd.CommandType = CommandType.StoredProcedure;
            using var rd = await cmd.ExecuteReaderAsync();
            while (await rd.ReadAsync())
            {
                // Bảng BanSao hiện không lưu SoLuong trong schema của bạn.
                // Tránh mọi ép kiểu phát sinh từ cột SoLuong theo version SP/DB.
                var soLuong = 0;

                list.Add(new BanSaoDTO
                {
                    MaBanSao = rd["MaBanSao"].ToString() ?? "",
                    MaVach = rd["MaVach"].ToString() ?? "",
                    MaSach = rd["MaSach"].ToString() ?? "",
                    MaKe = rd["MaKe"].ToString(),
                    SoLuong = soLuong,
                    TrangThai = rd["TrangThai"].ToString()
                });
            }
            return list;
        }
        public async Task<BanSaoDTO> GetByIdAsync(string maBanSao)
        {
            using var con = new SqlConnection(_connStr);
            await con.OpenAsync();
            using var cmd = new SqlCommand("sp_GetBanSaoById", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@MaBanSao", maBanSao);
            using var rd = await cmd.ExecuteReaderAsync();
            if (await rd.ReadAsync())
            {
                // Tránh lỗi ép kiểu khi SP/DB không nhất quán về cột SoLuong.
                var soLuong = 0;

                return new BanSaoDTO
                {
                    MaBanSao = rd["MaBanSao"].ToString() ?? "",
                    MaVach = rd["MaVach"].ToString() ?? "",
                    MaSach = rd["MaSach"].ToString() ?? "",
                    MaKe = rd["MaKe"].ToString(),
                    SoLuong = soLuong,
                    TrangThai = rd["TrangThai"].ToString()
                };
            }
            return null;
        }
        public async Task<int> CreateAsync(CreateBanSaoRequest banSao, string maBanSao)
        {
            using var con = new SqlConnection(_connStr);
            await con.OpenAsync();
            // Trong sp.sql hiện tại không có sp_CreateBanSao mà có sp_InsertBanSao.
            using var cmd = new SqlCommand("sp_InsertBanSao", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@MaBanSao", maBanSao);
            cmd.Parameters.AddWithValue("@MaVach", banSao.MaVach);
            cmd.Parameters.AddWithValue("@MaSach", banSao.MaSach);
            cmd.Parameters.Add(new SqlParameter("@MaKe", SqlDbType.NVarChar, 20) { Value = (object?)banSao.MaKe ?? DBNull.Value });
            cmd.Parameters.Add(new SqlParameter("@TrangThai", SqlDbType.NVarChar, 20) { Value = (object?)banSao.TrangThai ?? DBNull.Value });
            return await cmd.ExecuteNonQueryAsync();
        }
        public async Task<int> UpdateAsync(string maBanSao, UpdateBanSaoRequest banSao)
        {
            using var con = new SqlConnection(_connStr);
            await con.OpenAsync();
            using var cmd = new SqlCommand("sp_UpdateBanSao", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@MaBanSao", maBanSao);
            cmd.Parameters.AddWithValue("@MaVach", banSao.MaVach);
            cmd.Parameters.AddWithValue("@MaSach", banSao.MaSach);
            cmd.Parameters.Add(new SqlParameter("@MaKe", SqlDbType.NVarChar, 20) { Value = (object?)banSao.MaKe ?? DBNull.Value });
            cmd.Parameters.Add(new SqlParameter("@TrangThai", SqlDbType.NVarChar, 20) { Value = (object?)banSao.TrangThai ?? DBNull.Value });
            return await cmd.ExecuteNonQueryAsync();
        }
        public async Task<int> DeleteAsync(string maBanSao)
        {
            using var con = new SqlConnection(_connStr);
            await con.OpenAsync();
            using var cmd = new SqlCommand("sp_DeleteBanSao", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.Add(new SqlParameter("@MaBanSao", SqlDbType.NVarChar, 20) { Value = maBanSao });
            return await cmd.ExecuteNonQueryAsync();
        }

    }
}
