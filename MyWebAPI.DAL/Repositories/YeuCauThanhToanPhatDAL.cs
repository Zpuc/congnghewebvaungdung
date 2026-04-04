using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;
using MyWebAPI.DTO;

namespace MyWebAPI.DAL.Repositories
{
    public interface IYeuCauThanhToanPhatRepository
    {
        Task<List<YeuCauThanhToanPhatDTO>> ListChoDuyetAsync();
        Task<List<YeuCauThanhToanPhatDTO>> ListByMaBanDocAsync(string maBanDoc);
        Task<YeuCauThanhToanPhatDTO> TaoAsync(string maBanDoc, TaoYeuCauThanhToanPhatRequest request);
        Task<DuyetThanhToanPhatResultDTO?> DuyetAsync(string maYeuCau);
    }

    public class YeuCauThanhToanPhatRepository : IYeuCauThanhToanPhatRepository
    {
        private readonly string _connStr;

        public YeuCauThanhToanPhatRepository(string connectionString) => _connStr = connectionString;

        private static YeuCauThanhToanPhatDTO MapRow(SqlDataReader rd)
        {
            var iGhiChu = rd.GetOrdinal("GhiChu");
            var iMaThanhToan = rd.GetOrdinal("MaThanhToan");
            return new YeuCauThanhToanPhatDTO
            {
                MaYeuCau = rd.GetString(rd.GetOrdinal("MaYeuCau")),
                MaPhat = rd.GetString(rd.GetOrdinal("MaPhat")),
                MaBanDoc = rd.GetString(rd.GetOrdinal("MaBanDoc")),
                SoTien = rd.GetDecimal(rd.GetOrdinal("SoTien")),
                HinhThuc = rd.GetString(rd.GetOrdinal("HinhThuc")),
                GhiChu = rd.IsDBNull(iGhiChu) ? null : rd.GetString(iGhiChu),
                TrangThai = rd.GetString(rd.GetOrdinal("TrangThai")),
                NgayTao = rd.GetDateTime(rd.GetOrdinal("NgayTao")),
                MaThanhToan = rd.IsDBNull(iMaThanhToan) ? null : rd.GetString(iMaThanhToan),
            };
        }

        public async Task<List<YeuCauThanhToanPhatDTO>> ListChoDuyetAsync()
        {
            var list = new List<YeuCauThanhToanPhatDTO>();
            const string sql = @"
SELECT MaYeuCau, MaPhat, MaBanDoc, SoTien, HinhThuc, GhiChu, TrangThai, NgayTao, MaThanhToan
FROM dbo.YeuCauThanhToanPhat
WHERE TrangThai = N'Chờ duyệt'
ORDER BY NgayTao ASC;";
            await using var con = new SqlConnection(_connStr);
            await con.OpenAsync();
            await using var cmd = new SqlCommand(sql, con) { CommandType = CommandType.Text };
            await using var rd = await cmd.ExecuteReaderAsync();
            while (await rd.ReadAsync())
                list.Add(MapRow(rd));
            return list;
        }

        public async Task<List<YeuCauThanhToanPhatDTO>> ListByMaBanDocAsync(string maBanDoc)
        {
            var list = new List<YeuCauThanhToanPhatDTO>();
            const string sql = @"
SELECT MaYeuCau, MaPhat, MaBanDoc, SoTien, HinhThuc, GhiChu, TrangThai, NgayTao, MaThanhToan
FROM dbo.YeuCauThanhToanPhat
WHERE MaBanDoc = @MaBanDoc
ORDER BY NgayTao DESC;";
            await using var con = new SqlConnection(_connStr);
            await con.OpenAsync();
            await using var cmd = new SqlCommand(sql, con) { CommandType = CommandType.Text };
            cmd.Parameters.AddWithValue("@MaBanDoc", maBanDoc);
            await using var rd = await cmd.ExecuteReaderAsync();
            while (await rd.ReadAsync())
                list.Add(MapRow(rd));
            return list;
        }

        public async Task<YeuCauThanhToanPhatDTO> TaoAsync(string maBanDoc, TaoYeuCauThanhToanPhatRequest request)
        {
            await using var con = new SqlConnection(_connStr);
            await con.OpenAsync();

            const string sqlPhat = @"
SELECT p.MaPhat, p.SoTien, p.TrangThai, pm.MaBanDoc
FROM dbo.Phat p
INNER JOIN dbo.PhieuMuon pm ON p.MaPhieuMuon = pm.MaPhieuMuon
WHERE p.MaPhat = @MaPhat;";
            decimal soTien;
            string trangThaiPhat;
            string maBdPhat;
            await using (var cmd = new SqlCommand(sqlPhat, con))
            {
                cmd.Parameters.AddWithValue("@MaPhat", request.MaPhat);
                await using var rd = await cmd.ExecuteReaderAsync();
                if (!await rd.ReadAsync())
                    throw new InvalidOperationException("Không tìm thấy khoản phạt.");
                soTien = rd.GetDecimal(1);
                trangThaiPhat = rd.GetString(2);
                maBdPhat = rd.GetString(3);
            }

            if (!string.Equals(maBdPhat, maBanDoc, StringComparison.Ordinal))
                throw new InvalidOperationException("Bạn không thể thanh toán phạt của người khác.");
            if (trangThaiPhat != "Chưa trả")
                throw new InvalidOperationException("Khoản phạt này không ở trạng thái chờ thanh toán.");

            const string sqlDup = @"
SELECT 1 FROM dbo.YeuCauThanhToanPhat
WHERE MaPhat = @MaPhat AND TrangThai = N'Chờ duyệt';";
            await using (var cmdDup = new SqlCommand(sqlDup, con))
            {
                cmdDup.Parameters.AddWithValue("@MaPhat", request.MaPhat);
                var o = await cmdDup.ExecuteScalarAsync();
                if (o != null && o != DBNull.Value)
                    throw new InvalidOperationException("Đã có yêu cầu thanh toán đang chờ duyệt cho khoản phạt này.");
            }

            var maYeuCau = "YC" + DateTime.UtcNow.ToString("yyyyMMddHHmmssfff");
            if (maYeuCau.Length > 30)
                maYeuCau = maYeuCau[..30];

            const string sqlIns = @"
INSERT INTO dbo.YeuCauThanhToanPhat(MaYeuCau, MaPhat, MaBanDoc, SoTien, HinhThuc, GhiChu, TrangThai)
VALUES(@MaYeuCau, @MaPhat, @MaBanDoc, @SoTien, @HinhThuc, @GhiChu, N'Chờ duyệt');";
            await using (var cmdIns = new SqlCommand(sqlIns, con))
            {
                cmdIns.Parameters.AddWithValue("@MaYeuCau", maYeuCau);
                cmdIns.Parameters.AddWithValue("@MaPhat", request.MaPhat);
                cmdIns.Parameters.AddWithValue("@MaBanDoc", maBanDoc);
                cmdIns.Parameters.AddWithValue("@SoTien", soTien);
                cmdIns.Parameters.AddWithValue("@HinhThuc", request.HinhThuc);
                cmdIns.Parameters.AddWithValue("@GhiChu", (object?)request.GhiChu ?? DBNull.Value);
                await cmdIns.ExecuteNonQueryAsync();
            }

            return new YeuCauThanhToanPhatDTO
            {
                MaYeuCau = maYeuCau,
                MaPhat = request.MaPhat,
                MaBanDoc = maBanDoc,
                SoTien = soTien,
                HinhThuc = request.HinhThuc,
                GhiChu = request.GhiChu,
                TrangThai = "Chờ duyệt",
                NgayTao = DateTime.UtcNow,
                MaThanhToan = null,
            };
        }

        public async Task<DuyetThanhToanPhatResultDTO?> DuyetAsync(string maYeuCau)
        {
            await using var con = new SqlConnection(_connStr);
            await con.OpenAsync();
            await using var tx = await con.BeginTransactionAsync();

            string maPhat;
            decimal soTien;
            string maBanDoc;
            string hinhThuc;
            string? ghiChu;

            const string sqlY = @"
SELECT MaPhat, SoTien, MaBanDoc, HinhThuc, GhiChu, TrangThai
FROM dbo.YeuCauThanhToanPhat WITH (UPDLOCK, ROWLOCK)
WHERE MaYeuCau = @MaYeuCau;";
            await using (var cmdY = new SqlCommand(sqlY, con, (SqlTransaction)tx))
            {
                cmdY.Parameters.AddWithValue("@MaYeuCau", maYeuCau);
                await using var rd = await cmdY.ExecuteReaderAsync();
                if (!await rd.ReadAsync())
                    return null;
                if (rd.GetString(5) != "Chờ duyệt")
                    throw new InvalidOperationException("Yêu cầu không còn ở trạng thái chờ duyệt.");
                maPhat = rd.GetString(0);
                soTien = rd.GetDecimal(1);
                maBanDoc = rd.GetString(2);
                hinhThuc = rd.GetString(3);
                ghiChu = rd.IsDBNull(4) ? null : rd.GetString(4);
            }

            const string sqlPhatExists = @"SELECT 1 FROM dbo.Phat WHERE MaPhat = @MaPhat AND TrangThai = N'Chưa trả';";
            await using (var cmdP = new SqlCommand(sqlPhatExists, con, (SqlTransaction)tx))
            {
                cmdP.Parameters.AddWithValue("@MaPhat", maPhat);
                var ok = await cmdP.ExecuteScalarAsync();
                if (ok == null || ok == DBNull.Value)
                    throw new InvalidOperationException("Khoản phạt không còn tồn tại hoặc đã được xử lý.");
            }

            var maThanhToan = "TT" + DateTime.UtcNow.ToString("yyyyMMddHHmmssfff");
            if (maThanhToan.Length > 20)
                maThanhToan = maThanhToan[..20];

            const string sqlInsTt = @"
INSERT INTO dbo.ThanhToan(MaThanhToan, MaBanDoc, NgayThanhToan, SoTien, HinhThuc, GhiChu)
VALUES(@MaThanhToan, @MaBanDoc, SYSUTCDATETIME(), @SoTien, @HinhThuc, @GhiChu);";
            await using (var cmdTt = new SqlCommand(sqlInsTt, con, (SqlTransaction)tx))
            {
                cmdTt.Parameters.AddWithValue("@MaThanhToan", maThanhToan);
                cmdTt.Parameters.AddWithValue("@MaBanDoc", maBanDoc);
                cmdTt.Parameters.AddWithValue("@SoTien", soTien);
                cmdTt.Parameters.AddWithValue("@HinhThuc", hinhThuc);
                cmdTt.Parameters.AddWithValue("@GhiChu", (object?)ghiChu ?? DBNull.Value);
                await cmdTt.ExecuteNonQueryAsync();
            }

            const string sqlDelPhat = @"DELETE FROM dbo.Phat WHERE MaPhat = @MaPhat;";
            await using (var cmdDel = new SqlCommand(sqlDelPhat, con, (SqlTransaction)tx))
            {
                cmdDel.Parameters.AddWithValue("@MaPhat", maPhat);
                await cmdDel.ExecuteNonQueryAsync();
            }

            const string sqlUpdY = @"
UPDATE dbo.YeuCauThanhToanPhat
SET TrangThai = N'Đã duyệt', MaThanhToan = @MaThanhToan
WHERE MaYeuCau = @MaYeuCau;";
            await using (var cmdUpd = new SqlCommand(sqlUpdY, con, (SqlTransaction)tx))
            {
                cmdUpd.Parameters.AddWithValue("@MaThanhToan", maThanhToan);
                cmdUpd.Parameters.AddWithValue("@MaYeuCau", maYeuCau);
                await cmdUpd.ExecuteNonQueryAsync();
            }

            await tx.CommitAsync();
            return new DuyetThanhToanPhatResultDTO
            {
                MaThanhToan = maThanhToan,
                MaYeuCau = maYeuCau,
                MaPhat = maPhat,
            };
        }
    }
}
