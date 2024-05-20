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

namespace PawledgerAPI.Services
{
    //Log Processing https://nethereum.readthedocs.io/en/latest/nethereum-log-processing-detail/
    public class BlockChainService
    {
        private string petContractAddress = "?";
        private BigInteger contractEndBlock = 10;
        private readonly BigInteger contractStartBlock = 0;
        private PetRepository _petRepository;

        public BlockChainService(PetRepository petRepository)
        {
            _petRepository = petRepository;
        }

        [Event("Transfer")]
        public class TransferEvent : IEventDTO
        {
            [Parameter("address", "_from", 1, true)]
            public string From { get; set; }

            [Parameter("address", "_to", 2, true)]
            public string To { get; set; }

            [Parameter("uint256", "_value", 3, false)]
            public BigInteger Value { get; set; }
        }

        public async Task getEventLogs()
        {
            var transferEventLogs = new List<EventLog<TransferEvent>>();

            var web3 = new Web3("https://eth-sepolia.g.alchemy.com/v2/_wCLKJ0Mv3uInMjGnJYz9RWD-6GRqWCH");

            Task StoreLogAsync(EventLog<TransferEvent> eventLog)
            {
                transferEventLogs.Add(eventLog);
                _petRepository.AddPet(eventLog.Log.Data);
                return Task.CompletedTask;
            }

            var processor = web3.Processing.Logs.CreateProcessorForContract<TransferEvent>(petContractAddress, StoreLogAsync);

            var cancellationToken = new CancellationToken();

            await processor.ExecuteAsync(
                toBlockNumber: contractEndBlock,
                cancellationToken: cancellationToken,
                startAtBlockNumberIfNotProcessed: contractStartBlock);

        }
    }
}
