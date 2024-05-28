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

        [HttpGet("medicalHistories/{tokenId}")]
        public MedicalHistoryEntity[] GetMedicalHistoryListByTokenId(string tokenId)
        {
            return _service.GetMedicalHistoryListByTokenId(tokenId);
        }

        [HttpPut("medicalHistory")]
        public IActionResult CreateMedicalHistory(MedicalHistory payload)
        {
            _service.CreateMedicalHistory(payload);
            return Ok(new {status = "Success"});
        }
    }
}
