using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using PawledgerAPI.Services;
using System.Threading.Tasks;

namespace PawledgerAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MedicalRecordController : ControllerBase
    {
        private readonly ILogger<MedicalRecordController> _logger;
        private readonly BlockChainService _blockChainService;

        public MedicalRecordController(ILogger<MedicalRecordController> logger, BlockChainService blockChainService)
        {
            _logger = logger;
            _blockChainService = blockChainService;
        }

        [HttpPost("medicalRecords")]
        public Task CreateMedicalRecord()
        {
            return _blockChainService.getEventLogs();
        }
    }
}
