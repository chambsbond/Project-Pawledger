using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using PawledgerAPI.Services;
using System.Threading.Tasks;

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
        public Task GetEventLogs()
        {
            return _blockChainService.getEventLogs();
        }
    }
}
