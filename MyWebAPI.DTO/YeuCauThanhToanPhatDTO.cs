using System;

namespace MyWebAPI.DTO
{
    public class YeuCauThanhToanPhatDTO
    {
        public string MaYeuCau { get; set; } = default!;
        public string MaPhat { get; set; } = default!;
        public string MaBanDoc { get; set; } = default!;
        public decimal SoTien { get; set; }
        public string HinhThuc { get; set; } = default!;
        public string? GhiChu { get; set; }
        public string TrangThai { get; set; } = default!;
        public DateTime NgayTao { get; set; }
        public string? MaThanhToan { get; set; }
    }

    public class TaoYeuCauThanhToanPhatRequest
    {
        public string MaPhat { get; set; } = default!;
        public string HinhThuc { get; set; } = default!;
        public string? GhiChu { get; set; }
    }

    public class DuyetThanhToanPhatResultDTO
    {
        public string MaThanhToan { get; set; } = default!;
        public string MaYeuCau { get; set; } = default!;
        public string MaPhat { get; set; } = default!;
    }
}
