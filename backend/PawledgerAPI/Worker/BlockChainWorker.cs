using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using PawledgerAPI.Services;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace PawledgerAPI.Worker
{
    public class BlockChainWorker : BackgroundService
    {
        private readonly ILogger<BlockChainWorker> _logger;
        private readonly IServiceProvider _serviceProvider;

        public BlockChainWorker(ILogger<BlockChainWorker> logger, IServiceProvider serviceProvider)
        {
            _logger = logger;
            _serviceProvider = serviceProvider;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                _logger.LogInformation("Blockchain Service reading contract at: {time}", DateTimeOffset.Now);
                using var scope = _serviceProvider.CreateScope();
                var blockChainService = scope.ServiceProvider.GetRequiredService<BlockChainService>();
                await blockChainService.getEventLogs();
                await Task.Delay(120000);
            }
        }
    }
}
