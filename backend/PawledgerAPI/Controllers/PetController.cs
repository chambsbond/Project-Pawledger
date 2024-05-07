using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using PawledgerAPI.Models;
using PawledgerAPI.Services;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;

namespace PawledgerAPI.Controllers
{
    public class PetController : Controller
    {
        private readonly ILogger<PetController> _logger;
        private readonly BlockChainService _blockChainService;

        public PetController(ILogger<PetController> logger, BlockChainService blockChainService)
        {
            _logger = logger;
            _blockChainService = blockChainService;

        }

        public Task Index()
        {
            return _blockChainService.getEventLogs();
        }
    }
}
