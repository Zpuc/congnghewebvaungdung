using Microsoft.AspNetCore.Http;

namespace MyWebAPI.DTO
{
    public class UploadSachImageRequest
    {
        public IFormFile Image { get; set; } = default!;
        public string MaSach { get; set; } = string.Empty;
    }
}
