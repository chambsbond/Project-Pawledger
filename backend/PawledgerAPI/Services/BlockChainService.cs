using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Nethereum.Web3;
using Nethereum.ABI.FunctionEncoding.Attributes;
using Nethereum.Contracts;
using System.Numerics;
using System.Threading;
using PawledgerAPI.Repositories;
using Nethereum.RPC.Eth.DTOs;

namespace PawledgerAPI.Services
{
    //Log Processing https://nethereum.readthedocs.io/en/latest/nethereum-log-processing-detail/
    public class BlockChainService
    {
        private string petContractAddress = "0x24dfD5e00508c58bAE0aD5f50B8d3920892ba7e9";
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

        public async Task getEventLogs()
        {
            var transferEventLogs = new List<EventLog<MintEvent>>();

            var web3 = new Web3("https://polygon-amoy.g.alchemy.com/v2/vUzR4uiV0ccwFLOEliOjn8FtV_Mnzqc1");

            Task StoreLogAsync(EventLog<MintEvent> eventLog)
            {
                transferEventLogs.Add(eventLog);
                //_petRepository.AddPet(eventLog.Event);
                return Task.CompletedTask;
            }

            var processor = web3.Processing.Logs.CreateProcessorForContract<MintEvent>(petContractAddress, StoreLogAsync);

            var cancellationToken = new CancellationToken();

            await processor.ExecuteAsync(
                toBlockNumber: 7298279,
                cancellationToken: cancellationToken,
                startAtBlockNumberIfNotProcessed: 7298269);

        }
    }
}
