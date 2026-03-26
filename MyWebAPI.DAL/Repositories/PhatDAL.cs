using Microsoft.Data.SqlClient;
using MyWebAPI.DTO;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyWebAPI.DAL.Repositories
{
    public class PhatDAL
    {
        public interface IPhatRepository
        {
            Task<List<PhatDTO>> GetAllAsync();
            Task<PhatDTO?> GetByIdAsync(string maPhat);
            Task<(int soNgayTre, decimal tienPhat, string? maPhat)> TraSachVaTinhPhatAsync(TraSachDTO dto);
        }

        public class PhatRepository : IPhatRepository
        {
            private readonly string _connStr;
            public PhatRepository(string connectionString) => _connStr = connectionString;


            public async Task<List<PhatDTO>> GetAllAsync()
            {
                var list = new List<PhatDTO>();

                using var con = new SqlConnection(_connStr);
                await con.OpenAsync();
                using var cmd = new SqlCommand("sp_GetAllPhat", con)
                {
                    CommandType = CommandType.StoredProcedure
                };

                using var rd = await cmd.ExecuteReaderAsync();
                while (await rd.ReadAsync())
                {
                    list.Add(new PhatDTO
                    {
                        MaPhat = rd.GetString(0),
                        MaPhieuMuon = rd.GetString(1),
                        SoTien = rd.GetDecimal(2),
                        LyDo = rd.GetString(3),
                        NgayTinh = rd.GetDateTime(4),
                        TrangThai = rd.GetString(5),
                        MaThanhToan = rd.IsDBNull(6) ? null : rd.GetString(6)
                    });
                }
                return list;
            }
            public async Task<PhatDTO?> GetByIdAsync(string maPhat)
            {
                PhatDTO? phat = null;
                using var con = new SqlConnection(_connStr);
                await con.OpenAsync();

                using var cmd = new SqlCommand("sp_GetPhatById", con)
                {
                    CommandType = CommandType.StoredProcedure
                };

                cmd.Parameters.AddWithValue("@MaPhat", maPhat);

                using var rd = await cmd.ExecuteReaderAsync();
                if (await rd.ReadAsync())
                {
                    phat = new PhatDTO
                    {
                        MaPhat = rd.GetString(0),
                        MaPhieuMuon = rd.GetString(1),
                        SoTien = rd.GetDecimal(2),
                        LyDo = rd.GetString(3),
                        NgayTinh = rd.GetDateTime(4),
                        TrangThai = rd.GetString(5),
                        MaThanhToan = rd.IsDBNull(6) ? null : rd.GetString(6)
                    };
                }
                return phat;
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
