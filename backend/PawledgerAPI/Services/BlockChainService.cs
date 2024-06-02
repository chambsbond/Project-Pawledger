using System.Collections.Generic;
using System.Threading.Tasks;
using Nethereum.Web3;
using Nethereum.ABI.FunctionEncoding.Attributes;
using Nethereum.Contracts;
using PawledgerAPI.Repositories;
using Nethereum.BlockchainProcessing.ProgressRepositories;
using System.Threading;
using System;
using PawledgerAPI.Models;
using Newtonsoft.Json;
using System.Numerics;

namespace PawledgerAPI.Services
{
  //Log Processing https://nethereum.readthedocs.io/en/latest/nethereum-log-processing-detail/
  public class BlockChainService
  {
    private readonly string petContractAddress = "0x3b2a767c3f8fC0a51C32AEF5cCbd33db9929bBa7";
    private readonly Web3 web3 = new("https://polygon-amoy.g.alchemy.com/v2/vUzR4uiV0ccwFLOEliOjn8FtV_Mnzqc1");
    private PetRepository _petRepository;
    private MedicalHistoryRepository _medicalHistoryRepository;

    public BlockChainService(PetRepository petRepository, MedicalHistoryRepository medicalHistoryRepository)
    {
      _petRepository = petRepository;
      _medicalHistoryRepository = medicalHistoryRepository;
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

    [Event("MedicalPayload")]
    public class MedicalPayloadEvent : IEventDTO
    {
      [Parameter("address", "orgAffiliation", 1)]
      public string OrgAffiliation { get; set; }
      [Parameter("address", "claimee", 2)]
      public string Claimee { get; set; }
      [Parameter("address", "prtOwner", 3)]
      public string PrtOwner { get; set; }
      [Parameter("string", "medPayload", 4)]
      public string MedicalPayload { get; set; }
      [Parameter("uint256", "tokenId", 5)]
      public BigInteger tokenId { get; set; }
      [Parameter("bytes32", "requestId", 6)]
      public BigInteger requestId { get; set; }
    }

    public Task GetEventLogs()
    {
      var blockProgressRepository = new InMemoryBlockchainProgressRepository();
      var processor = web3.Processing.Logs.CreateProcessorForContract<MintEvent>(
        contractAddress: petContractAddress,
        action: async log => await StoreLogAsync(log),
        blockProgressRepository: blockProgressRepository);

      var cancellationToken = new CancellationToken();

      return processor.ExecuteAsync(
          cancellationToken: cancellationToken,
          startAtBlockNumberIfNotProcessed: 7298259);
    }

    public Task GetMedicalEventLogs(CancellationToken cancellationToken)
    {
      var blockProgressRepository = new InMemoryBlockchainProgressRepository();
      var processor = web3.Processing.Logs.CreateProcessorForContract<MedicalPayloadEvent>(
          contractAddress: petContractAddress,
          action: async log => await StoreMedicalEventAsync(log),
          blockProgressRepository: blockProgressRepository);

      return processor.ExecuteAsync(
          cancellationToken: cancellationToken,
          startAtBlockNumberIfNotProcessed: 7767295);
    }

    private Task StoreLogAsync(EventLog<MintEvent> eventLog)
    {
      // FIXME the claimee is not the token id but need to check why its not in the mint event.
      _petRepository.AddPet(eventLog.Event.Claimee + Guid.NewGuid().ToString());
      return Task.CompletedTask;
    }

    public Task StoreMedicalEventAsync(EventLog<MedicalPayloadEvent> eventLog)
    {
      var histories = mapMedicalHistories(eventLog);

      foreach (var history in histories)
      {
        _medicalHistoryRepository.AddMedicalHistory(history);
      }

      return Task.CompletedTask;
    }

    private List<MedicalHistory> mapMedicalHistories(EventLog<MedicalPayloadEvent> eventLog)
    {
      var medicalHistoryList = new List<MedicalHistory>();
      List<EncryptedHistory> encryptedHistories = JsonConvert.DeserializeObject<List<EncryptedHistory>>(eventLog.Event.MedicalPayload);
      foreach (var encryptedHistory in encryptedHistories)
      {
        var medicalHistory = new MedicalHistory
        {
          TokenId = eventLog.Event.tokenId.ToString(),
          RequestId = eventLog.Event.requestId.ToString(),
          EncryptedHistory = encryptedHistory,
          AddressedTo = eventLog.Event.PrtOwner
        };
        medicalHistoryList.Add(medicalHistory);
      }
      return medicalHistoryList;
    }
  }
}
