using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Nethereum.Contracts;
using PawledgerAPI.Services;
using System.Collections.Generic;
using System.IO;
using System.Reflection.PortableExecutable;
using System.Text;
using System.Threading.Tasks;
using static PawledgerAPI.Services.BlockChainService;

namespace PawledgerAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PetController : ControllerBase
    {
        private readonly ILogger<PetController> _logger;
        private readonly BlockChainService _blockChainService;

        public PetController(ILogger<PetController> logger, BlockChainService blockChainService)
        {
            _logger = logger;
            _blockChainService = blockChainService;

        }

        // [HttpGet("eventLogs")]
        // public Task<List<EventLog<MintEvent>>> GetEventLogs()
        // {
        //     return _blockChainService.GetEventLogs();
        // }

        // [HttpPost("storeMedicalEvent")]
        // [Consumes("text/plain")]
        // public bool storeMedicalEvent()
        // {
        //     var pureString = "";
        //     using (StreamReader reader = new StreamReader(Request.Body, Encoding.UTF8))
        //     {
        //         pureString = reader.ReadToEndAsync().Result;
        //     }
        //     var list = new List<EventLog<MedicalPayloadEvent>>();
        //     var medicalPayloadEvent = new MedicalPayloadEvent();
        //     medicalPayloadEvent.MedicalPayload = pureString;
        //     var medicalPayloadEventLog = new EventLog<MedicalPayloadEvent>(medicalPayloadEvent, null);
        //     _blockChainService.StoreMedicalEventAsync( medicalPayloadEventLog);
        //     return true;
        // }
    }
}
