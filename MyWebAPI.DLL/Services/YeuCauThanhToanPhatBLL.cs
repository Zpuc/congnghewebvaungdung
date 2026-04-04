using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using MyWebAPI.DAL.Repositories;
using MyWebAPI.DTO;

namespace MyWebAPI.BLL.Services
{
    public interface IYeuCauThanhToanPhatService
    {
        Task<ResponseDTO<List<YeuCauThanhToanPhatDTO>>> ListChoDuyetAsync();
        Task<ResponseDTO<List<YeuCauThanhToanPhatDTO>>> ListCuaToiAsync(string maBanDoc);
        Task<ResponseDTO<YeuCauThanhToanPhatDTO>> TaoAsync(string maBanDoc, TaoYeuCauThanhToanPhatRequest request);
        Task<ResponseDTO<DuyetThanhToanPhatResultDTO>> DuyetAsync(string maYeuCau);
    }

    public class YeuCauThanhToanPhatService : IYeuCauThanhToanPhatService
    {
        private readonly IYeuCauThanhToanPhatRepository _repo;

        public YeuCauThanhToanPhatService(IYeuCauThanhToanPhatRepository repo) => _repo = repo;

        public async Task<ResponseDTO<List<YeuCauThanhToanPhatDTO>>> ListChoDuyetAsync()
        {
            try
            {
                var list = await _repo.ListChoDuyetAsync();
                return new ResponseDTO<List<YeuCauThanhToanPhatDTO>>
                {
                    Success = true,
                    Message = "OK",
                    Data = list,
                };
            }
            catch (Exception ex)
            {
                return new ResponseDTO<List<YeuCauThanhToanPhatDTO>>
                {
                    Success = false,
                    Message = $"Lỗi: {ex.Message}",
                    Data = null,
                };
            }
        }

        public async Task<ResponseDTO<List<YeuCauThanhToanPhatDTO>>> ListCuaToiAsync(string maBanDoc)
        {
            try
            {
                var list = await _repo.ListByMaBanDocAsync(maBanDoc);
                return new ResponseDTO<List<YeuCauThanhToanPhatDTO>>
                {
                    Success = true,
                    Message = "OK",
                    Data = list,
                };
            }
            catch (Exception ex)
            {
                return new ResponseDTO<List<YeuCauThanhToanPhatDTO>>
                {
                    Success = false,
                    Message = $"Lỗi: {ex.Message}",
                    Data = null,
                };
            }
        }

        public async Task<ResponseDTO<YeuCauThanhToanPhatDTO>> TaoAsync(string maBanDoc, TaoYeuCauThanhToanPhatRequest request)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(request.MaPhat) || string.IsNullOrWhiteSpace(request.HinhThuc))
                    return new ResponseDTO<YeuCauThanhToanPhatDTO>
                    {
                        Success = false,
                        Message = "Thiếu mã phạt hoặc hình thức thanh toán.",
                        Data = null,
                    };

                var data = await _repo.TaoAsync(maBanDoc, request);
                return new ResponseDTO<YeuCauThanhToanPhatDTO>
                {
                    Success = true,
                    Message = "Đã gửi yêu cầu. Vui lòng chờ thủ thư/quản trị duyệt.",
                    Data = data,
                };
            }
            catch (Exception ex)
            {
                return new ResponseDTO<YeuCauThanhToanPhatDTO>
                {
                    Success = false,
                    Message = ex.Message,
                    Data = null,
                };
            }
        }

        public async Task<ResponseDTO<DuyetThanhToanPhatResultDTO>> DuyetAsync(string maYeuCau)
        {
            try
            {
                var result = await _repo.DuyetAsync(maYeuCau);
                if (result == null)
                    return new ResponseDTO<DuyetThanhToanPhatResultDTO>
                    {
                        Success = false,
                        Message = "Không tìm thấy yêu cầu.",
                        Data = null,
                    };

                return new ResponseDTO<DuyetThanhToanPhatResultDTO>
                {
                    Success = true,
                    Message = "Duyệt thanh toán thành công. Đã ghi ThanhToan và xoá khoản phạt.",
                    Data = result,
                };
            }
            catch (Exception ex)
            {
                return new ResponseDTO<DuyetThanhToanPhatResultDTO>
                {
                    Success = false,
                    Message = ex.Message,
                    Data = null,
                };
            }
        }
    }
}
