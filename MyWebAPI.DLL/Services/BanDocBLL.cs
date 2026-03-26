using Microsoft.Data.SqlClient;
using MyWebAPI.DAL.Repositories;
using MyWebAPI.DTO;
using System.Text.RegularExpressions;

namespace MyWebAPI.BLL.Services
{
    // Interface - Định nghĩa các methods
    public interface IBanDocService
    {
        Task<ResponseDTO<List<BanDocDTO>>> GetAllAsync();
        Task<ResponseDTO<BanDocDTO>> GetByIdAsync(string maBanDoc);
        Task<ResponseDTO<BanDocDTO>> CreateAsync(CreateBanDocRequest request);
        Task<ResponseDTO<bool>> UpdateAsync(string maBanDoc, UpdateBanDocRequest request);
        Task<ResponseDTO<bool>> DeleteAsync(string maBanDoc);
        Task<ResponseDTO<bool>> UpdateThongTinBanDocAsync(UpdateThongTinBanDocDto req);
    }

    // Implementation - Class thực thi
    public class BanDocService : IBanDocService
    {
        private readonly IBanDocRepository _banDocRepository;

        public BanDocService(IBanDocRepository banDocRepository)
        {
            _banDocRepository = banDocRepository;
        }

        public async Task<ResponseDTO<List<BanDocDTO>>> GetAllAsync()
        {
            try
            {
                var list = await _banDocRepository.GetAllAsync();
                return new ResponseDTO<List<BanDocDTO>>
                {
                    Success = true,
                    Message = "Lấy danh sách thành công",
                    Data = list
                };
            }
            catch (Exception ex)
            {
                return new ResponseDTO<List<BanDocDTO>>
                {
                    Success = false,
                    Message = $"Lỗi: {ex.Message}",
                    Data = null
                };
            }
        }

        public async Task<ResponseDTO<BanDocDTO>> GetByIdAsync(string maBanDoc)
        {
            try
            {
                var banDoc = await _banDocRepository.GetByIdAsync(maBanDoc);
                if (banDoc == null)
                {
                    return new ResponseDTO<BanDocDTO>
                    {
                        Success = false,
                        Message = "Không tìm thấy bạn đọc",
                        Data = null
                    };
                }

                return new ResponseDTO<BanDocDTO>
                {
                    Success = true,
                    Message = "Lấy thông tin thành công",
                    Data = banDoc
                };
            }
            catch (Exception ex)
            {
                return new ResponseDTO<BanDocDTO>
                {
                    Success = false,
                    Message = $"Lỗi: {ex.Message}",
                    Data = null
                };
            }
        }

        public async Task<ResponseDTO<BanDocDTO>> CreateAsync(CreateBanDocRequest request)
        {
            try
            {
                // Validate input
                if (string.IsNullOrWhiteSpace(request.HoTen))
                {
                    return new ResponseDTO<BanDocDTO>
                    {
                        Success = false,
                        Message = "Họ tên không được để trống",
                        Data = null
                    };
                }

                if (string.IsNullOrWhiteSpace(request.SoThe))
                {
                    return new ResponseDTO<BanDocDTO>
                    {
                        Success = false,
                        Message = "Số thẻ không được để trống",
                        Data = null
                    };
                }

                if (string.IsNullOrWhiteSpace(request.Email))
                {
                    return new ResponseDTO<BanDocDTO>
                    {
                        Success = false,
                        Message = "Email không được để trống",
                        Data = null
                    };
                }

                // Validate email format
                if (!IsValidEmail(request.Email))
                {
                    return new ResponseDTO<BanDocDTO>
                    {
                        Success = false,
                        Message = "Email không đúng định dạng",
                        Data = null
                    };
                }

                if (string.IsNullOrWhiteSpace(request.DienThoai))
                {
                    return new ResponseDTO<BanDocDTO>
                    {
                        Success = false,
                        Message = "Điện thoại không được để trống",
                        Data = null
                    };
                }

                // Validate phone number (10-11 digits)
                if (!IsValidPhone(request.DienThoai))
                {
                    return new ResponseDTO<BanDocDTO>
                    {
                        Success = false,
                        Message = "Số điện thoại không hợp lệ (phải có 10-11 chữ số)",
                        Data = null
                    };
                }

                // Validate expiry date
                var today = DateTime.Today;
                if (request.HanThe < today)
                {
                    return new ResponseDTO<BanDocDTO>
                    {
                        Success = false,
                        Message = "Hạn thẻ phải lớn hơn ngày hiện tại",
                        Data = null
                    };
                }

                // Generate new ID if not provided
                var newId = request.MaBanDoc ?? "BD" + Guid.NewGuid().ToString("N")[..7].ToUpper();

                var rows = await _banDocRepository.CreateAsync(request, newId);

                if (rows > 0)
                {
                    var banDocDTO = new BanDocDTO
                    {
                        MaBanDoc = newId,
                        HoTen = request.HoTen,
                        SoThe = request.SoThe,
                        Email = request.Email,
                        DienThoai = request.DienThoai,
                        HanThe = request.HanThe,
                        TrangThaiThe = request.TrangThaiThe,
                        DuNo = request.DuNo
                    };

                    return new ResponseDTO<BanDocDTO>
                    {
                        Success = true,
                        Message = "Thêm bạn đọc thành công",
                        Data = banDocDTO
                    };
                }

                return new ResponseDTO<BanDocDTO>
                {
                    Success = false,
                    Message = "Không thêm được bạn đọc",
                    Data = null
                };
            }
            catch (SqlException ex)
            {
                return new ResponseDTO<BanDocDTO>
                {
                    Success = false,
                    Message = $"Lỗi database: {ex.Message}",
                    Data = null
                };
            }
            catch (Exception ex)
            {
                return new ResponseDTO<BanDocDTO>
                {
                    Success = false,
                    Message = $"Lỗi: {ex.Message}",
                    Data = null
                };
            }
        }

        public async Task<ResponseDTO<bool>> UpdateAsync(string maBanDoc, UpdateBanDocRequest request)
        {
            try
            {
                // Validate input
                if (string.IsNullOrWhiteSpace(request.HoTen))
                {
                    return new ResponseDTO<bool>
                    {
                        Success = false,
                        Message = "Họ tên không được để trống",
                        Data = false
                    };
                }

                if (string.IsNullOrWhiteSpace(request.Email))
                {
                    return new ResponseDTO<bool>
                    {
                        Success = false,
                        Message = "Email không được để trống",
                        Data = false
                    };
                }

                if (!IsValidEmail(request.Email))
                {
                    return new ResponseDTO<bool>
                    {
                        Success = false,
                        Message = "Email không đúng định dạng",
                        Data = false
                    };
                }

                if (!IsValidPhone(request.DienThoai))
                {
                    return new ResponseDTO<bool>
                    {
                        Success = false,
                        Message = "Số điện thoại không hợp lệ",
                        Data = false
                    };
                }

                var rows = await _banDocRepository.UpdateAsync(maBanDoc, request);

                if (rows > 0)
                {
                    return new ResponseDTO<bool>
                    {
                        Success = true,
                        Message = "Cập nhật thành công",
                        Data = true
                    };
                }

                return new ResponseDTO<bool>
                {
                    Success = false,
                    Message = "Không tìm thấy bạn đọc",
                    Data = false
                };
            }
            catch (SqlException ex)
            {
                return new ResponseDTO<bool>
                {
                    Success = false,
                    Message = $"Lỗi database: {ex.Message}",
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

        public async Task<ResponseDTO<bool>> DeleteAsync(string maBanDoc)
        {
            try
            {
                var rows = await _banDocRepository.DeleteAsync(maBanDoc);

                if (rows > 0)
                {
                    return new ResponseDTO<bool>
                    {
                        Success = true,
                        Message = "Xoá thành công",
                        Data = true
                    };
                }

                return new ResponseDTO<bool>
                {
                    Success = false,
                    Message = "Không tìm thấy bạn đọc",
                    Data = false
                };
            }
            catch (SqlException ex)
            {
                return new ResponseDTO<bool>
                {
                    Success = false,
                    Message = $"Lỗi database: {ex.Message}",
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

        // Helper methods for validation
        private bool IsValidEmail(string email)
        {
            try
            {
                var emailRegex = new Regex(@"^[^@\s]+@[^@\s]+\.[^@\s]+$");
                return emailRegex.IsMatch(email);
            }
            catch
            {
                return false;
            }
        }

        private bool IsValidPhone(string phone)
        {
            // Remove spaces and dashes
            phone = phone.Replace(" ", "").Replace("-", "");

            // Check if it's 10 or 11 digits
            return Regex.IsMatch(phone, @"^\d{10,11}$");
        }
        public async Task<ResponseDTO<bool>> UpdateThongTinBanDocAsync(UpdateThongTinBanDocDto req)
        {
            try
            {
                var rows = await _banDocRepository.UpdateThongTinBanDocAsync(
                    req.MaBanDoc, req.HoTen, req.Email, req.DienThoai);

                // SP có SET NOCOUNT ON nên rows sẽ là -1 khi update OK
                if (rows != 0)   // <<< sửa từ > 0 thành != 0
                {
                    return new ResponseDTO<bool>
                    {
                        Success = true,
                        Message = "Cập nhật thông tin cá nhân thành công",
                        Data = true
                    };
                }

                return new ResponseDTO<bool>
                {
                    Success = false,
                    Message = "Không tìm thấy bạn đọc",
                    Data = false
                };
            }
            catch (Exception ex)
            {
                return new ResponseDTO<bool>
                {
                    Success = false,
                    Message = "Lỗi: " + ex.Message,
                    Data = false
                };
            }
        }
    }
}