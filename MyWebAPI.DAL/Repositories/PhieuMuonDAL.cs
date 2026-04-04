using System;
using System.Data;
using Microsoft.Data.SqlClient;
using MyWebAPI.DTO;

namespace MyWebAPI.DAL.Repositories
{
    public class PhieuMuonDAL
    {
        public interface IPhieuMuonRepository
        {
            Task<List<PhieuMuonDTO>> GetAllAsync();
            Task<PhieuMuonDTO?> GetByIdAsync(string maPhieuMuon);
            Task<bool> CreateAsync(PhieuMuonDTO phieuMuon);
            Task<bool> UpdateAsync(string maPhieuMuon, PhieuMuonDTO phieuMuon);
            Task<bool> DeleteAsync(string maPhieuMuon);
            Task<TraSachVaTinhPhatResultDTO> TraSachVaTinhPhatAsync(TraSachVaTinhPhatRequest request);
        }

        public class PhieuMuonRepository : IPhieuMuonRepository
        {
            private readonly string _connStr;
            public PhieuMuonRepository(string connectionString)
            {
                _connStr = connectionString;
            }

            public async Task<List<PhieuMuonDTO>> GetAllAsync()
            {
                var list = new List<PhieuMuonDTO>();
                using var con = new SqlConnection(_connStr);
                await con.OpenAsync();

                using var cmd = new SqlCommand("sp_GetAllPhieuMuon", con)
                {
                    CommandType = CommandType.StoredProcedure
                };

                using var rd = await cmd.ExecuteReaderAsync();
                while (await rd.ReadAsync())
                {
                    list.Add(new PhieuMuonDTO
                    {
                        MaPhieuMuon = rd.GetString(0),
                        MaBanSao = rd.GetString(1),
                        MaBanDoc = rd.GetString(2),
                        NgayMuon = rd.GetDateTime(3),
                        HanTra = rd.GetDateTime(4),
                        NgayTraThucTe = rd.IsDBNull(5) ? (DateTime?)null : rd.GetDateTime(5),
                        SoLanGiaHan = rd.GetInt32(6),
                        TrangThai = rd.GetString(7)
                    });
                }
                return list;
            }

            public async Task<PhieuMuonDTO?> GetByIdAsync(string maPhieuMuon)
            {
                PhieuMuonDTO? phieuMuon = null;
                using var con = new SqlConnection(_connStr);
                await con.OpenAsync();

                using var cmd = new SqlCommand("sp_GetPhieuMuonById", con)
                {
                    CommandType = CommandType.StoredProcedure
                };
                cmd.Parameters.AddWithValue("@MaPhieuMuon", maPhieuMuon);

                using var rd = await cmd.ExecuteReaderAsync();
                if (await rd.ReadAsync())
                {
                    phieuMuon = new PhieuMuonDTO
                    {
                        MaPhieuMuon = rd.GetString(0),
                        MaBanSao = rd.GetString(1),
                        MaBanDoc = rd.GetString(2),
                        NgayMuon = rd.GetDateTime(3),
                        HanTra = rd.GetDateTime(4),
                        NgayTraThucTe = rd.IsDBNull(5) ? (DateTime?)null : rd.GetDateTime(5),
                        SoLanGiaHan = rd.GetInt32(6),
                        TrangThai = rd.GetString(7)
                    };
                }
                return phieuMuon;
            }

            public async Task<bool> CreateAsync(PhieuMuonDTO phieuMuon)
            {
                using var con = new SqlConnection(_connStr);
                await con.OpenAsync();

                using var cmd = new SqlCommand("sp_TaoPhieuMuon", con)
                {
                    CommandType = CommandType.StoredProcedure
                };
                cmd.Parameters.AddWithValue("@MaPhieuMuon", phieuMuon.MaPhieuMuon);
                cmd.Parameters.AddWithValue("@MaBanSao", phieuMuon.MaBanSao);
                cmd.Parameters.AddWithValue("@MaBanDoc", phieuMuon.MaBanDoc);
                cmd.Parameters.AddWithValue("@NgayMuon", phieuMuon.NgayMuon);
                cmd.Parameters.AddWithValue("@HanTra", phieuMuon.HanTra);
                cmd.Parameters.AddWithValue("@NgayTraThucTe", (object?)phieuMuon.NgayTraThucTe ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@SoLanGiaHan", phieuMuon.SoLanGiaHan);
                cmd.Parameters.AddWithValue("@TrangThai", phieuMuon.TrangThai);

                var rowsAffected = await cmd.ExecuteNonQueryAsync();
                return rowsAffected > 0 || rowsAffected == -1;
            }

            public async Task<bool> UpdateAsync(string maPhieuMuon, PhieuMuonDTO phieuMuon)
            {
                using var con = new SqlConnection(_connStr);
                await con.OpenAsync();

                using var cmd = new SqlCommand("sp_UpdatePhieuMuon", con)
                {
                    CommandType = CommandType.StoredProcedure
                };
                cmd.Parameters.AddWithValue("@MaPhieuMuon", maPhieuMuon);
                cmd.Parameters.AddWithValue("@MaBanSao", phieuMuon.MaBanSao);
                cmd.Parameters.AddWithValue("@MaBanDoc", phieuMuon.MaBanDoc);
                cmd.Parameters.AddWithValue("@NgayMuon", phieuMuon.NgayMuon);
                cmd.Parameters.AddWithValue("@HanTra", phieuMuon.HanTra);
                cmd.Parameters.AddWithValue("@NgayTraThucTe", (object?)phieuMuon.NgayTraThucTe ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@SoLanGiaHan", phieuMuon.SoLanGiaHan);
                cmd.Parameters.AddWithValue("@TrangThai", (object?)phieuMuon.TrangThai ?? DBNull.Value);

                var rows = await cmd.ExecuteNonQueryAsync();
                return rows > 0 || rows == -1;
            }

            public async Task<bool> DeleteAsync(string maPhieuMuon)
            {
                using var con = new SqlConnection(_connStr);
                await con.OpenAsync();

                using var cmd = new SqlCommand("sp_DeletePhieuMuon", con)
                {
                    CommandType = CommandType.StoredProcedure
                };
                cmd.Parameters.AddWithValue("@MaPhieuMuon", maPhieuMuon);

                var rows = await cmd.ExecuteNonQueryAsync();
                return rows > 0 || rows == -1;
            }
            public async Task<TraSachVaTinhPhatResultDTO> TraSachVaTinhPhatAsync(TraSachVaTinhPhatRequest request)
            {
                // Không phụ thuộc sp_TraSachVaTinhPhat trên DB (nhiều môi trường chưa tạo procedure).
                const decimal phiTreHanMoiNgay = 5000m;

                await using var con = new SqlConnection(_connStr);
                await con.OpenAsync();
                await using var tx = await con.BeginTransactionAsync();

                DateTime hanTra;
                string maBanSao;
                string trangThai;

                const string sqlSelect = @"
SELECT HanTra, MaBanSao, TrangThai
FROM dbo.PhieuMuon WITH (UPDLOCK, ROWLOCK)
WHERE MaPhieuMuon = @MaPhieuMuon;";
                await using (var cmd = new SqlCommand(sqlSelect, con, (SqlTransaction)tx))
                {
                    cmd.Parameters.AddWithValue("@MaPhieuMuon", request.MaPhieuMuon);
                    await using var rd = await cmd.ExecuteReaderAsync();
                    if (!await rd.ReadAsync())
                        throw new InvalidOperationException("Không tìm thấy phiếu mượn.");
                    hanTra = rd.GetDateTime(0);
                    maBanSao = rd.GetString(1);
                    trangThai = rd.GetString(2);
                }

                if (trangThai != "Đang mở")
                    throw new InvalidOperationException("Phiếu không ở trạng thái Đang mở.");

                var ngayTra = request.NgayTraThucTe.Date;

                const string sqlUpdPm = @"
UPDATE dbo.PhieuMuon
SET NgayTraThucTe = @NgayTra, TrangThai = N'Đã đóng'
WHERE MaPhieuMuon = @MaPhieuMuon;";
                await using (var cmd = new SqlCommand(sqlUpdPm, con, (SqlTransaction)tx))
                {
                    cmd.Parameters.AddWithValue("@MaPhieuMuon", request.MaPhieuMuon);
                    cmd.Parameters.AddWithValue("@NgayTra", ngayTra);
                    await cmd.ExecuteNonQueryAsync();
                }

                const string sqlUpdBs = @"
UPDATE dbo.BanSao SET TrangThai = N'Có sẵn' WHERE MaBanSao = @MaBanSao;";
                await using (var cmd = new SqlCommand(sqlUpdBs, con, (SqlTransaction)tx))
                {
                    cmd.Parameters.AddWithValue("@MaBanSao", maBanSao);
                    await cmd.ExecuteNonQueryAsync();
                }

                var han = hanTra.Date;
                var tra = ngayTra.Date;
                var soNgayTre = Math.Max(0, (tra - han).Days);

                decimal tienPhat = 0m;
                string? maPhat = null;

                if (soNgayTre > 0)
                {
                    tienPhat = soNgayTre * phiTreHanMoiNgay;
                    maPhat = "PP" + DateTime.UtcNow.ToString("yyyyMMddHHmmssfff");
                    if (maPhat.Length > 20)
                        maPhat = maPhat[..20];

                    const string sqlInsPhat = @"
INSERT INTO dbo.Phat(MaPhat, MaPhieuMuon, SoTien, LyDo, NgayTinh, TrangThai, MaThanhToan)
VALUES(@MaPhat, @MaPhieuMuon, @SoTien, N'Trễ hạn', SYSUTCDATETIME(), N'Chưa trả', NULL);";
                    await using (var cmdIns = new SqlCommand(sqlInsPhat, con, (SqlTransaction)tx))
                    {
                        cmdIns.Parameters.AddWithValue("@MaPhat", maPhat);
                        cmdIns.Parameters.AddWithValue("@MaPhieuMuon", request.MaPhieuMuon);
                        cmdIns.Parameters.AddWithValue("@SoTien", tienPhat);
                        await cmdIns.ExecuteNonQueryAsync();
                    }
                }

                await tx.CommitAsync();

                var phieuMuon = await GetByIdAsync(request.MaPhieuMuon);
                return new TraSachVaTinhPhatResultDTO
                {
                    PhieuMuon = phieuMuon,
                    SoNgayTre = soNgayTre,
                    TienPhat = tienPhat,
                    MaPhat = maPhat
                };
            }
        }
    }
}
