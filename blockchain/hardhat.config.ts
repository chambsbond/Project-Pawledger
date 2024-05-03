import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
require('dotenv').config();

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  defaultNetwork: "zkEVM",
  networks: {
    zkEVM: {
    url: `https://rpc.cardona.zkevm-rpc.com`,
    accounts: [process.env.ACCOUNT_PRIVATE_KEY as string],
    },
},
};

export default config;
