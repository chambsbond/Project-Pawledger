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
      using var scope = _serviceProvider.CreateScope();
      var blockChainService = scope.ServiceProvider.GetRequiredService<BlockChainService>();
      await blockChainService.GetEventLogs();

      // Ensure the thread does not stop lisening.
      // FIXME change this to true to run. We did not want the app service busy waiting so we stopped in like this.
      while (false)
      {
        // 16.67 minute delay, not scientific just a long wait.
        await Task.Delay(1000000);
      }
    }
  }
}
