using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyWebAPI.BLL.Services;
using MyWebAPI.DTO;
using static MyWebAPI.BLL.Services.PhatBLL;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PhatController : ControllerBase
    {
        private readonly IPhatService _service;
        public PhatController(IPhatService service) => _service = service;

        [HttpGet]
        public async Task<IActionResult> GetAll() => Ok(await _service.GetAllAsync());

        [Authorize(Roles = "Quản trị, Thủ thư")]
        [HttpGet("{maPhat}")]
        public async Task<IActionResult> GetById(string maPhat)
        {
            var data = await _service.GetByIdAsync(maPhat);
            return data is null ? NotFound() : Ok(data);
        }

        [Authorize(Roles = "Quản trị, Thủ thư")]
        [HttpPost("TraSachVaTinhPhat")]
        public async Task<IActionResult> TraSachVaTinhPhat([FromBody] TraSachDTO dto)
        {
            try
            {
                var result = await _service.TraSachVaTinhPhatAsync(dto);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
