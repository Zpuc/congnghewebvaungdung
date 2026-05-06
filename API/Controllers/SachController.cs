using Microsoft.AspNetCore.Mvc;
using MyWebAPI.BLL.Services;
using MyWebAPI.DTO;
using Microsoft.AspNetCore.Http;

namespace MyWebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SachController : ControllerBase
    {
        private readonly ISachService _sachService;
        private readonly IWebHostEnvironment _env;

        public SachController(ISachService sachService, IWebHostEnvironment env)
        {
            _sachService = sachService;
            _env = env;
        }

        // GET api/sach
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var response = await _sachService.GetAllAsync();

            if (response.Success)
                return Ok(response);

            return StatusCode(500, response);
        }

        // GET api/sach/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            var response = await _sachService.GetByIdAsync(id);

            if (response.Success)
                return Ok(response);

            return NotFound(response);
        }

        // POST api/sach
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateSachRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var response = await _sachService.CreateAsync(request);

            if (response.Success)
                return Ok(response);

            return BadRequest(response);
        }

        // PUT api/sach/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(string id, [FromBody] UpdateSachRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var response = await _sachService.UpdateAsync(id, request);

            if (response.Success)
                return Ok(response);

            return NotFound(response);
        }

        // DELETE api/sach/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var response = await _sachService.DeleteAsync(id);

            if (response.Success)
                return Ok(response);

            return NotFound(response);
        }

        // POST api/sach/upload
        [HttpPost("upload")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> UploadImage([FromForm] UploadSachImageRequest request)
        {
            if (request.Image == null || request.Image.Length == 0)
                return BadRequest(new { message = "Không có file ảnh" });

            var sach = await _sachService.GetByIdAsync(request.MaSach);
            if (sach == null)
                return NotFound(new { message = "Không tìm thấy sách" });

            var fileName = $"{Guid.NewGuid():N}{Path.GetExtension(request.Image.FileName)}";
            var relativePath = Path.Combine("images", "sach", fileName).Replace('\\', '/');
            var fullPath = Path.Combine(_env.WebRootPath, relativePath);

            Directory.CreateDirectory(Path.GetDirectoryName(fullPath)!);
            using var stream = new FileStream(fullPath, FileMode.Create);
            await request.Image.CopyToAsync(stream);

            var imageUrl = $"/{relativePath.Replace('\\', '/')}";
            await _sachService.UpdateLienKetAnhAsync(request.MaSach, imageUrl);

            return Ok(new { imageUrl });
        }

        [HttpPost("create-with-image")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> CreateWithImage([FromForm] CreateSachWithImageRequest request)
        {
            if (request.Image == null || request.Image.Length == 0)
                return BadRequest(new { message = "Vui lòng chọn ảnh bìa" });

            var dto = new CreateSachRequest
            {
                TieuDe = request.TieuDe,
                TacGia = request.TacGia,
                NamXuatBan = request.NamXuatBan,
                MaTheLoai = request.TheLoai,  // CreateSachWithImageRequest dùng TheLoai (string) thay vì MaTheLoai
                NgonNgu = request.NgonNgu,
                TomTat = request.TomTat
            };

            var result = await _sachService.CreateAsync(dto);
            if (!result.Success || result.Data == null)
                return BadRequest(new { message = result.Message ?? "Tạo sách thất bại" });

            var maSach = result.Data.MaSach;
            if (string.IsNullOrEmpty(maSach))
                return BadRequest(new { message = "Không lấy được mã sách" });

            var fileName = $"{Guid.NewGuid():N}{Path.GetExtension(request.Image.FileName)}";
            var relativePath = Path.Combine("images", "sach", fileName).Replace('\\', '/');
            var fullPath = Path.Combine(_env.WebRootPath, relativePath);

            Directory.CreateDirectory(Path.GetDirectoryName(fullPath)!);
            using var stream = new FileStream(fullPath, FileMode.Create);
            await request.Image.CopyToAsync(stream);

            var imageUrl = $"/{relativePath.Replace('\\', '/')}";
            await _sachService.UpdateLienKetAnhAsync(maSach, imageUrl);

            return Ok(new { maSach, imageUrl });
        }

        [HttpPut("{maSach}/anhbia")]
        public async Task<IActionResult> UpdateAnhBia(string maSach, [FromBody] UpdateAnhBiaDto dto)
        {
            var result = await _sachService.UpdateLienKetAnhAsync(maSach, dto.AnhBiaUrl);
            return result.Success ? Ok() : NotFound();
        }
    }
}
