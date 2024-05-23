using System.Collections.Generic;
using System.Threading.Tasks;
using Nethereum.Web3;
using Nethereum.ABI.FunctionEncoding.Attributes;
using Nethereum.Contracts;
using PawledgerAPI.Repositories;
using Nethereum.BlockchainProcessing.ProgressRepositories;
using System.Threading;

namespace PawledgerAPI.Services
{
  //Log Processing https://nethereum.readthedocs.io/en/latest/nethereum-log-processing-detail/
  public class BlockChainService
  {
    private readonly string petContractAddress = "0x24dfD5e00508c58bAE0aD5f50B8d3920892ba7e9";
    private readonly Web3 web3 = new("https://polygon-amoy.g.alchemy.com/v2/vUzR4uiV0ccwFLOEliOjn8FtV_Mnzqc1");
    private PetRepository _petRepository;

    public BlockChainService(PetRepository petRepository)
    {
      _petRepository = petRepository;
    }

    [Event("MintClaimMade")]
    public class MintEvent : IEventDTO
    {
      [Parameter("address", "orgAffiliation", 1)]
      public string OrgAffiliation { get; set; }

      [Parameter("address", "claimee", 2)]
      public string Claimee { get; set; }

      [Parameter("address", "prospectOwner", 3)]
      public string ProspectOwner { get; set; }
    }

    public async Task<List<EventLog<MintEvent>>> GetEventLogs()
    {
      var transferEventLogs = new List<EventLog<MintEvent>>();
      var blockProgressRepository = new InMemoryBlockchainProgressRepository();
      var processor = web3.Processing.Logs.CreateProcessorForContract<MintEvent>(
        contractAddress: petContractAddress,
        action: log => StoreLogAsync(transferEventLogs, log),
        blockProgressRepository: blockProgressRepository);

      // OLD CODE THAT JUST PARSED ONE BLOCK
      var cancellationToken = new CancellationToken();

      await processor.ExecuteAsync(
          cancellationToken: cancellationToken);

      return await Task.FromResult(transferEventLogs);
    }

    private static Task StoreLogAsync(List<EventLog<MintEvent>> list, EventLog<MintEvent> eventLog)
    {

      list.Add(eventLog);
      //FIXME add this back after testing
      //_petRepository.AddPet(eventLog.Event);
      return Task.CompletedTask;
    }
  }
}
