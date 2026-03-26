using Microsoft.Data.SqlClient;
using MyWebAPI.DAL.Repositories;
using MyWebAPI.DTO;
using static MyWebAPI.DAL.Repositories.PhieuMuonDAL;


namespace MyWebAPI.BLL.Services
{
    public interface IPhieuMuonService
    {
        Task<ResponseDTO<List<PhieuMuonDTO>>> GetAllAsync();
        Task<ResponseDTO<PhieuMuonDTO>> GetByIdAsync(string maPhieuMuon);
        Task<ResponseDTO<PhieuMuonDTO>> CreateAsync(CreatePhieuMuonRequest request);
        Task<ResponseDTO<bool>> UpdateAsync(string maPhieuMuon, UpdatePhieuMuonRequest request);
        Task<ResponseDTO<bool>> DeleteAsync(string maPhieuMuon);

        Task<ResponseDTO<TraSachVaTinhPhatResultDTO>> TraSachVaTinhPhatAsync(TraSachVaTinhPhatRequest request);

    }

    public class PhieuMuonService : IPhieuMuonService
    {
        private readonly IPhieuMuonRepository _phieuMuonRepository;
        public PhieuMuonService(IPhieuMuonRepository phieuMuonRepository)
        {
            _phieuMuonRepository = phieuMuonRepository;
        }
        public async Task<ResponseDTO<List<PhieuMuonDTO>>> GetAllAsync()
        {
            try
            {
                var list = await _phieuMuonRepository.GetAllAsync();
                return new ResponseDTO<List<PhieuMuonDTO>>
                {
                    Success = true,
                    Message = "Lấy danh sách thành công",
                    Data = list
                };
            }
            catch (Exception ex)
            {
                return new ResponseDTO<List<PhieuMuonDTO>>
                {
                    Success = false,
                    Message = $"Lỗi: {ex.Message}",
                    Data = null
                };
            }
        }
        public async Task<ResponseDTO<PhieuMuonDTO>> GetByIdAsync(string maPhieuMuon)
        {
            try
            {
                var phieuMuon = await _phieuMuonRepository.GetByIdAsync(maPhieuMuon);
                if (phieuMuon == null)
                {
                    return new ResponseDTO<PhieuMuonDTO>
                    {
                        Success = false,
                        Message = "Không tìm thấy phiếu mượn",
                        Data = null
                    };
                }
                return new ResponseDTO<PhieuMuonDTO>
                {
                    Success = true,
                    Message = "Lấy phiếu mượn thành công",
                    Data = phieuMuon
                };
            }
            catch (Exception ex)
            {
                return new ResponseDTO<PhieuMuonDTO>
                {
                    Success = false,
                    Message = $"Lỗi: {ex.Message}",
                    Data = null
                };
            }
        }

        public async Task<ResponseDTO<PhieuMuonDTO>> CreateAsync(CreatePhieuMuonRequest request)
        {
            try
            {
                var newPhieuMuon = new PhieuMuonDTO
                {
                    MaPhieuMuon = "PM" + Guid.NewGuid().ToString("N")[..7].ToUpper(),
                    MaBanSao = request.MaBanSao,
                    MaBanDoc = request.MaBanDoc,
                    NgayMuon = request.NgayMuon,
                    HanTra = request.HanTra,
                    NgayTraThucTe = request.NgayTraThucTe,
                    SoLanGiaHan = 0,
                    // TrangThai của Phiếu Mượn theo CHECK constraint trong DB: 'Đang mở' | 'Đã đóng'
                    TrangThai = "Đang mở"
                };
                var result = await _phieuMuonRepository.CreateAsync(newPhieuMuon);
                if (result)
                {
                    return new ResponseDTO<PhieuMuonDTO>
                    {
                        Success = true,
                        Message = "Tạo phiếu mượn thành công",
                        Data = newPhieuMuon
                    };
                }
                return new ResponseDTO<PhieuMuonDTO>
                {
                    Success = false,
                    Message = "Không tạo được phiếu mượn",
                    Data = null
                };
            }
            catch (SqlException ex) when (ex.Number == 2627)
            {
                return new ResponseDTO<PhieuMuonDTO>
                {
                    Success = false,
                    Message = "Mã phiếu mượn đã tồn tại",
                    Data = null
                };
            }
            catch (Exception ex)
            {
                return new ResponseDTO<PhieuMuonDTO>
                {
                    Success = false,
                    Message = $"Lỗi: {ex.Message}",
                    Data = null
                };
            }
        }

        public async Task<ResponseDTO<bool>> UpdateAsync(string maPhieuMuon, UpdatePhieuMuonRequest request)
        {
            try
            {
                var existing = await _phieuMuonRepository.GetByIdAsync(maPhieuMuon);
                if (existing == null)
                {
                    return new ResponseDTO<bool>
                    {
                        Success = false,
                        Message = "Không tìm thấy phiếu mượn",
                        Data = false
                    };
                }

                var updated = await _phieuMuonRepository.UpdateAsync(maPhieuMuon, existing);
                if (updated)
                {
                    return new ResponseDTO<bool>
                    {
                        Success = true,
                        Message = "Cập nhật phiếu mượn thành công",
                        Data = true
                    };
                }
                return new ResponseDTO<bool>
                {
                    Success = false,
                    Message = "Không thể cập nhật phiếu mượn",
                    Data = false
                };
            }
            catch (Exception ex)
            {
                return new ResponseDTO<bool>
                {
                    Success = false,
                    Message = $"Lỗi: {ex.Message}",
                    Data = false
                };
            }
        }
        public async Task<ResponseDTO<bool>> DeleteAsync(string maPhieuMuon)
        {
            try
            {
                var existing = await _phieuMuonRepository.GetByIdAsync(maPhieuMuon);
                if (existing == null)
                {
                    return new ResponseDTO<bool>
                    {
                        Success = false,
                        Message = "Không tìm thấy phiếu mượn",
                        Data = false
                    };
                }
                var deleted = await _phieuMuonRepository.DeleteAsync(maPhieuMuon);
                if (deleted)
                {
                    return new ResponseDTO<bool>
                    {
                        Success = true,
                        Message = "Xóa phiếu mượn thành công",
                        Data = true
                    };
                }
                return new ResponseDTO<bool>
                {
                    Success = false,
                    Message = "Không thể xóa phiếu mượn",
                    Data = false
                };
            }
            catch (Exception ex)
            {
                return new ResponseDTO<bool>
                {
                    Success = false,
                    Message = $"Lỗi: {ex.Message}",
                    Data = false
                };
            }
        }
        public async Task<ResponseDTO<TraSachVaTinhPhatResultDTO>> TraSachVaTinhPhatAsync(TraSachVaTinhPhatRequest request)
        {
            try
            {
                var result = await _phieuMuonRepository.TraSachVaTinhPhatAsync(request);

                return new ResponseDTO<TraSachVaTinhPhatResultDTO>
                {
                    Success = true,
                    Message = "Trả sách & tính phạt thành công",
                    Data = result
                };
            }
            catch (Exception ex)
            {
                return new ResponseDTO<TraSachVaTinhPhatResultDTO>
                {
                    Success = false,
                    Message = $"Lỗi: {ex.Message}",
                    Data = null
                };
            }
        }
    }
}

