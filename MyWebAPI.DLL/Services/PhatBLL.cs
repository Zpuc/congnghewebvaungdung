
﻿using Microsoft.Data.SqlClient;
using MyWebAPI.DAL.Repositories;
using MyWebAPI.DTO;
using static MyWebAPI.DAL.Repositories.PhatDAL;
﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace MyWebAPI.BLL.Services
{
    public class PhatBLL
    {
        public interface IPhatService
        {
            Task<List<PhatDTO>> GetAllAsync();
            Task<PhatDTO?> GetByIdAsync(string maPhat);
            Task<List<PhatDTO>> GetByMaBanDocAsync(string maBanDoc);
            Task<TraSachResultDTO> TraSachVaTinhPhatAsync(TraSachDTO dto);
        }

        public class PhatService : IPhatService
        {
            private readonly IPhatRepository _repo;
            public PhatService(IPhatRepository repo) => _repo = repo;

            public Task<List<PhatDTO>> GetAllAsync() => _repo.GetAllAsync();

            public Task<PhatDTO?> GetByIdAsync(string maPhat) => _repo.GetByIdAsync(maPhat);

            public Task<List<PhatDTO>> GetByMaBanDocAsync(string maBanDoc) => _repo.GetByMaBanDocAsync(maBanDoc);

            public async Task<TraSachResultDTO> TraSachVaTinhPhatAsync(TraSachDTO dto)
            {
                var (soNgayTre, tienPhat, maPhat) = await _repo.TraSachVaTinhPhatAsync(dto);
                return new TraSachResultDTO
                {
                    MaPhieuMuon = dto.MaPhieuMuon,
                    SoNgayTre = soNgayTre,
                    TienPhat = tienPhat,
                    MaPhat = maPhat
                };
            }
        }
    }
}
