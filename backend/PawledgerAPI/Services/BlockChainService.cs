﻿using System.Collections.Generic;
using System.Threading.Tasks;
using Nethereum.Web3;
using Nethereum.ABI.FunctionEncoding.Attributes;
using Nethereum.Contracts;
using PawledgerAPI.Repositories;
using Nethereum.BlockchainProcessing.ProgressRepositories;
using System.Threading;
using System;
using PawledgerAPI.Models;

namespace PawledgerAPI.Services
{
    //Log Processing https://nethereum.readthedocs.io/en/latest/nethereum-log-processing-detail/
    public class BlockChainService
    {
        private readonly string petContractAddress = "0x24dfD5e00508c58bAE0aD5f50B8d3920892ba7e9";
        private readonly Web3 web3 = new("https://polygon-amoy.g.alchemy.com/v2/vUzR4uiV0ccwFLOEliOjn8FtV_Mnzqc1");
        private PetRepository _petRepository;
        private MedicalHistoryRepository _medicalHistoryRepository;

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

        [Event("MedicalPayload")]
        public class MedicalPayloadEvent : IEventDTO
        {
            [Parameter("address", "orgAffiliation", 1)]
            public string OrgAffiliation { get; set; }
            [Parameter("address", "Claimee", 2)]
            public string Claimee { get; set; }
            [Parameter("address", "prtOwner", 3)]
            public string PrtOwner { get; set; }
            [Parameter("string", "medPayload", 4)]
            public string MedicalPayload { get; set; }
            [Parameter("uint256", "tokenId", 5)]
            public int tokenId { get; set; }
            [Parameter("bytes32", "requestId", 6)]
            public int requestId { get; set; }
        }

        public async Task<List<EventLog<MintEvent>>> GetEventLogs()
        {
            var transferEventLogs = new List<EventLog<MintEvent>>();
            var blockProgressRepository = new InMemoryBlockchainProgressRepository();
            var processor = web3.Processing.Logs.CreateProcessorForContract<MintEvent>(
              contractAddress: petContractAddress,
              action: log => StoreLogAsync(transferEventLogs, log),
              blockProgressRepository: blockProgressRepository);

            var cancellationToken = new CancellationToken();

            // FIXME Consider storing that start block in db on cancelation to start back up in case app is restarted.
            await processor.ExecuteAsync(
                cancellationToken: cancellationToken,
                startAtBlockNumberIfNotProcessed: 7298259);

            return await Task.FromResult(transferEventLogs);
        }

        public async Task<List<EventLog<MedicalPayloadEvent>>> GetMedicalEventLogs()
        {
            var medicalEventLogs = new List<EventLog<MedicalPayloadEvent>>();
            var blockProgressRepository = new InMemoryBlockchainProgressRepository();
            var processor = web3.Processing.Logs.CreateProcessorForContract<MedicalPayloadEvent>(
                contractAddress: petContractAddress,
                action: log => StoreMedicalEventAsync(medicalEventLogs, log),
                blockProgressRepository: blockProgressRepository);

            var cancellationToken = new CancellationToken();
            await processor.ExecuteAsync(
                cancellationToken: cancellationToken,
                startAtBlockNumberIfNotProcessed: 7298259);
            return await Task.FromResult(medicalEventLogs);
        }
    private Task StoreLogAsync(List<EventLog<MintEvent>> list, EventLog<MintEvent> eventLog)
    {

      list.Add(eventLog);
      // FIXME the claimee is not the token id but need to check why its not in the mint event.
      _petRepository.AddPet(eventLog.Event.Claimee + Guid.NewGuid().ToString());
      return Task.CompletedTask;
    }

    private Task StoreMedicalEventAsync(List<EventLog<MedicalPayloadEvent>> list, EventLog<MedicalPayloadEvent> eventLog)
        {
            list.Add(eventLog);
            MedicalHistory medicalHistory = new MedicalHistory();
            //Don't we need tokenID?
            medicalHistory.AddressedTo = eventLog.Event.PrtOwner;
            EncryptedHistory encryptedHistory = new EncryptedHistory();
            var histories = eventLog.Event.MedicalPayload.Split(",");
            encryptedHistory.Iv = histories[0];
            encryptedHistory.EphemPublicKey = histories[1];
            encryptedHistory.Ciphertext = histories[2];
            medicalHistory.EncryptedHistory = encryptedHistory;
            medicalHistory.TokenId = eventLog.Event.tokenId.ToString();
            medicalHistory.RequestId = eventLog.Event.requestId.ToString();

            _medicalHistoryRepository.AddMedicalHistory(medicalHistory);
            return Task.CompletedTask;

        }
  }
}
