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

    protected override Task ExecuteAsync(CancellationToken stoppingToken)
    {
      using var scope = _serviceProvider.CreateScope();
      var blockChainService = scope.ServiceProvider.GetRequiredService<BlockChainService>();
      blockChainService.GetEventLogs();

      // Ensure the thread does not stop lisening.
      while (true) { }
    }
  }
}
