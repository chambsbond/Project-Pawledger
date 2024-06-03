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
    private readonly BlockChainService _blockChainService;

    public BlockChainWorker(ILogger<BlockChainWorker> logger, IServiceProvider provider)
    {
      var scope = provider.CreateScope();
      _logger = logger;
      _blockChainService = scope.ServiceProvider.GetRequiredService<BlockChainService>();
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
      await _blockChainService.GetMedicalEventLogs(stoppingToken);

      // Ensure the thread does not stop lisening.
      while (true)
      {
        // 16.67 minute delay, not scientific just a long wait.
        await Task.Delay(1000000);
      }
    }
  }
}
