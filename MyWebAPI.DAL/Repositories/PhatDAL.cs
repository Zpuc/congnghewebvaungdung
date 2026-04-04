using Microsoft.Data.SqlClient;
using MyWebAPI.DTO;
using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

namespace MyWebAPI.DAL.Repositories
{
    public class PhatDAL
    {
        public interface IPhatRepository
        {
            Task<List<PhatDTO>> GetAllAsync();
            Task<PhatDTO?> GetByIdAsync(string maPhat);
            Task<List<PhatDTO>> GetByMaBanDocAsync(string maBanDoc);
            Task<(int soNgayTre, decimal tienPhat, string? maPhat)> TraSachVaTinhPhatAsync(TraSachDTO dto);
        }

        public class PhatRepository : IPhatRepository
        {
            private readonly string _connStr;
            public PhatRepository(string connectionString) => _connStr = connectionString;

            private static PhatDTO MapRow(SqlDataReader rd)
            {
                var iMaThanhToan = rd.GetOrdinal("MaThanhToan");
                return new PhatDTO
                {
                    MaPhat = rd.GetString(rd.GetOrdinal("MaPhat")),
                    MaPhieuMuon = rd.GetString(rd.GetOrdinal("MaPhieuMuon")),
                    SoTien = rd.GetDecimal(rd.GetOrdinal("SoTien")),
                    LyDo = rd.GetString(rd.GetOrdinal("LyDo")),
                    NgayTinh = rd.GetDateTime(rd.GetOrdinal("NgayTinh")),
                    TrangThai = rd.GetString(rd.GetOrdinal("TrangThai")),
                    MaThanhToan = rd.IsDBNull(iMaThanhToan) ? null : rd.GetString(iMaThanhToan)
                };
            }

            public async Task<List<PhatDTO>> GetAllAsync()
            {
                var list = new List<PhatDTO>();
                const string sql = @"
SELECT MaPhat, MaPhieuMuon, SoTien, LyDo, NgayTinh, TrangThai, MaThanhToan
FROM Phat
ORDER BY NgayTinh DESC;";

                using var con = new SqlConnection(_connStr);
                await con.OpenAsync();
                using var cmd = new SqlCommand(sql, con) { CommandType = CommandType.Text };
                using var rd = await cmd.ExecuteReaderAsync();
                while (await rd.ReadAsync())
                    list.Add(MapRow(rd));
                return list;
            }

            public async Task<PhatDTO?> GetByIdAsync(string maPhat)
            {
                const string sql = @"
SELECT MaPhat, MaPhieuMuon, SoTien, LyDo, NgayTinh, TrangThai, MaThanhToan
FROM Phat
WHERE MaPhat = @MaPhat;";

                using var con = new SqlConnection(_connStr);
                await con.OpenAsync();
                using var cmd = new SqlCommand(sql, con) { CommandType = CommandType.Text };
                cmd.Parameters.AddWithValue("@MaPhat", maPhat);
                using var rd = await cmd.ExecuteReaderAsync();
                if (await rd.ReadAsync())
                    return MapRow(rd);
                return null;
            }

            public async Task<List<PhatDTO>> GetByMaBanDocAsync(string maBanDoc)
            {
                var list = new List<PhatDTO>();
                const string sql = @"
SELECT p.MaPhat, p.MaPhieuMuon, p.SoTien, p.LyDo, p.NgayTinh, p.TrangThai, p.MaThanhToan
FROM dbo.Phat p
INNER JOIN dbo.PhieuMuon pm ON p.MaPhieuMuon = pm.MaPhieuMuon
WHERE pm.MaBanDoc = @MaBanDoc
ORDER BY p.NgayTinh DESC;";

                using var con = new SqlConnection(_connStr);
                await con.OpenAsync();
                using var cmd = new SqlCommand(sql, con) { CommandType = CommandType.Text };
                cmd.Parameters.AddWithValue("@MaBanDoc", maBanDoc);
                using var rd = await cmd.ExecuteReaderAsync();
                while (await rd.ReadAsync())
                    list.Add(MapRow(rd));
                return list;
            }

            public async Task<(int soNgayTre, decimal tienPhat, string? maPhat)> TraSachVaTinhPhatAsync(TraSachDTO dto)
            {
                using var con = new SqlConnection(_connStr);
                using var cmd = new SqlCommand("sp_TraSachVaTinhPhat", con) { CommandType = CommandType.StoredProcedure };

                cmd.Parameters.AddWithValue("@MaPhieuMuon", dto.MaPhieuMuon);
                cmd.Parameters.AddWithValue("@NgayTraThucTe", dto.NgayTraThucTe);

                var pSoNgayTre = new SqlParameter("@SoNgayTre", SqlDbType.Int) { Direction = ParameterDirection.Output };
                var pTienPhat = new SqlParameter("@TienPhat", SqlDbType.Decimal) { Precision = 12, Scale = 2, Direction = ParameterDirection.Output };
                var pMaPhat = new SqlParameter("@MaPhat", SqlDbType.NVarChar, 20) { Direction = ParameterDirection.Output };
                cmd.Parameters.AddRange(new[] { pSoNgayTre, pTienPhat, pMaPhat });

                await con.OpenAsync();
                await cmd.ExecuteNonQueryAsync();

                int soNgayTre = pSoNgayTre.Value is DBNull ? 0 : (int)pSoNgayTre.Value;
                decimal tienPhat = pTienPhat.Value is DBNull ? 0m : (decimal)pTienPhat.Value;
                string? maPhat = pMaPhat.Value is DBNull ? null : (string)pMaPhat.Value;

                return (soNgayTre, tienPhat, maPhat);
            }
        }
    }
}
