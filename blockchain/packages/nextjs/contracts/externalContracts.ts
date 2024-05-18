import { GenericContractsDeclaration } from "~~/utils/scaffold-eth/contract";

/**
 * @example
 * const externalContracts = {
 *   1: {
 *     DAI: {
 *       address: "0x...",
 *       abi: [...],
 *     },
 *   },
 * } as const;
 */
const externalContracts = {
    1: {
        Organization: {
            address: "0xa16E02E87b7454126E5E10d957A927A7F5B5d2be",
            abi: [
                {
                  "inputs": [
                    {
                      "internalType": "string",
                      "name": "name",
                      "type": "string"
                    },
                    {
                      "internalType": "address",
                      "name": "owner",
                      "type": "address"
                    }
                  ],
                  "stateMutability": "nonpayable",
                  "type": "constructor"
                },
                {
                  "inputs": [],
                  "name": "_name",
                  "outputs": [
                    {
                      "internalType": "string",
                      "name": "",
                      "type": "string"
                    }
                  ],
                  "stateMutability": "view",
                  "type": "function"
                },
                {
                  "inputs": [
                    {
                      "components": [
                        {
                          "internalType": "address",
                          "name": "walletAddress",
                          "type": "address"
                        }
                      ],
                      "internalType": "struct Employee",
                      "name": "employee",
                      "type": "tuple"
                    }
                  ],
                  "name": "addEmployee",
                  "outputs": [],
                  "stateMutability": "nonpayable",
                  "type": "function"
                },
                {
                  "inputs": [
                    {
                      "internalType": "address",
                      "name": "employeeAddress",
                      "type": "address"
                    }
                  ],
                  "name": "isEmployee",
                  "outputs": [
                    {
                      "internalType": "bool",
                      "name": "",
                      "type": "bool"
                    }
                  ],
                  "stateMutability": "view",
                  "type": "function"
                },
                {
                  "inputs": [
                    {
                      "internalType": "address",
                      "name": "operator",
                      "type": "address"
                    },
                    {
                      "internalType": "address",
                      "name": "from",
                      "type": "address"
                    },
                    {
                      "internalType": "uint256",
                      "name": "tokenId",
                      "type": "uint256"
                    },
                    {
                      "internalType": "bytes",
                      "name": "data",
                      "type": "bytes"
                    }
                  ],
                  "name": "onERC721Received",
                  "outputs": [
                    {
                      "internalType": "bytes4",
                      "name": "",
                      "type": "bytes4"
                    }
                  ],
                  "stateMutability": "nonpayable",
                  "type": "function"
                },
                {
                  "inputs": [
                    {
                      "internalType": "address",
                      "name": "employeeAddress",
                      "type": "address"
                    }
                  ],
                  "name": "removeEmployee",
                  "outputs": [],
                  "stateMutability": "nonpayable",
                  "type": "function"
                }
            ],
        }
    }
} as const;

export default externalContracts satisfies GenericContractsDeclaration;
