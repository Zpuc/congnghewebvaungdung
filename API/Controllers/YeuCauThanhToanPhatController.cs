using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyWebAPI.BLL.Services;
using MyWebAPI.DTO;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class YeuCauThanhToanPhatController : ControllerBase
    {
        private readonly IYeuCauThanhToanPhatService _svc;

        public YeuCauThanhToanPhatController(IYeuCauThanhToanPhatService svc) => _svc = svc;

        private static string? MaBanDocClaim(ClaimsPrincipal user) =>
            user.FindFirst("maBanDoc")?.Value ?? user.FindFirst("MaBanDoc")?.Value;

        [Authorize(Roles = "Bạn đọc")]
        [HttpGet("cua-toi")]
        public async Task<IActionResult> YeuCauCuaToi()
        {
            var ma = MaBanDocClaim(User);
            if (string.IsNullOrWhiteSpace(ma))
                return Unauthorized(new { success = false, message = "Tài khoản chưa gắn mã bạn đọc." });

            var res = await _svc.ListCuaToiAsync(ma);
            return res.Success ? Ok(res) : StatusCode(500, res);
        }

        [Authorize(Roles = "Bạn đọc")]
        [HttpPost]
        public async Task<IActionResult> Tao([FromBody] TaoYeuCauThanhToanPhatRequest body)
        {
            var ma = MaBanDocClaim(User);
            if (string.IsNullOrWhiteSpace(ma))
                return Unauthorized(new { success = false, message = "Tài khoản chưa gắn mã bạn đọc." });

            if (body == null)
                return BadRequest(new { success = false, message = "Thiếu dữ liệu." });

            var res = await _svc.TaoAsync(ma, body);
            return res.Success ? Ok(res) : BadRequest(res);
        }

        [Authorize(Roles = "Quản trị, Thủ thư")]
        [HttpGet("cho-duyet")]
        public async Task<IActionResult> ChoDuyet()
        {
            var res = await _svc.ListChoDuyetAsync();
            return res.Success ? Ok(res) : StatusCode(500, res);
        }

        [Authorize(Roles = "Quản trị, Thủ thư")]
        [HttpPost("{maYeuCau}/duyet")]
        public async Task<IActionResult> Duyet(string maYeuCau)
        {
            var res = await _svc.DuyetAsync(maYeuCau);
            return res.Success ? Ok(res) : BadRequest(res);
        }
    }
}
