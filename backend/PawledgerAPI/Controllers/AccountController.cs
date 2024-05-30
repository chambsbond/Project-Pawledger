using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.Extensions.Logging;
using PawledgerAPI.Models;
using PawledgerAPI.Services;

namespace PawledgerAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly ILogger<PetController> _logger;
        private readonly AccountService _accountService;

        public AccountController(ILogger<PetController> logger, AccountService accountService)
        {
            _logger = logger;
            _accountService = accountService;

        }

        [HttpGet("{address}")]
        public async Task<IActionResult> GetAccountByAddress(string address)
        {
            return Ok(await _accountService.GetAccountByAddress(address));
        }

        [HttpPost("")]
        public async Task<IActionResult> AddAccount(AccountModel model)
        {
            await _accountService.AddAccount(model);
            return Ok();
        }
    }
}
