using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Nethereum.Contracts;
using PawledgerAPI.Services;
using System.Collections.Generic;
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

        [HttpGet("eventLogs")]
        public Task<List<EventLog<MintEvent>>> GetEventLogs()
        {
            return _blockChainService.GetEventLogs();
        }
    }
}
