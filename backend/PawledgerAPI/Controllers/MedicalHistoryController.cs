using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using PawledgerAPI.Entities;
using PawledgerAPI.Models;
using PawledgerAPI.Services;

namespace PawledgerAPI.Controllers
{
    [ApiController]
    [Route("api/")]
    public class MedicalRecordController : ControllerBase
    {
        private readonly MedicalHistoryService _service;

        public MedicalRecordController(MedicalHistoryService service)
        {
            _service = service;
        }

        [HttpGet("medicalHistories/token/{tokenId}/address/{addressTo}")]
        public MedicalHistoryEntity[] GetMedicalHistoryListByTokenId(string tokenId, string addressTo)
        {
            return _service.GetMedicalHistoryListByTokenId(tokenId, addressTo);
        }

        [HttpPut("medicalHistories")]
        public Task<IActionResult> CreateMedicalHistories(MedicalHistory[] payloads)
        {
            _service.CreateMedicalHistories(payloads);
            return Task.FromResult<IActionResult>(Ok(new { status = "Success" }));
        }
    }
}
