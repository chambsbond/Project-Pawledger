import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";
import fs from "fs/promises";
import path from "node:path";
import  { ethers } from "ethers";
import { simulateScript } from "@chainlink/functions-toolkit";
/**
 * Deploys a contract named "YourContract" using the deployer account and
 * constructor arguments set to the deployer address
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployYourContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  /*
    On localhost, the deployer account is the one that comes with Hardhat, which is already funded.

    When deploying to live networks (e.g `yarn deploy --network sepolia`), the deployer account
    should have sufficient balance to pay for the gas fees for contract creation.

    You can generate a random account with `yarn generate` which will fill DEPLOYER_PRIVATE_KEY
    with a random private key in the .env file (then used on hardhat.config.ts)
    You can run the `yarn account` command to check your balance in every network.
  */
  const { deployer } = await hre.getNamedAccounts();
  const { deploy, execute } = hre.deployments;

  const admin = "0x2d72722533f7E0e58C4aAC8Ed37992b17DCF44c3";
  const routerAddress = "0xC22a79eBA640940ABB6dF0f7982cc119578E11De";

  const privateKey =  { privateKey: process.env.DECRYPT_PRIVATE_KEY ?? "1234" }
  const tempPublicKey = "95ac1fbdf77cbe075bc34368543a2bd0c5cf92f7832eedfb0e40f03ff4e279e2d3cbdd05b633251a10df3229ba095b551f4b1b725c75c2c2e5231bc8f0c00828";

  const source = await fs.readFile(
    path.join(__dirname, '../functions/test.js'),
    { encoding: 'utf8' }
  );


  const response = await simulateScript({
    source: source,
    args: ["0", tempPublicKey, admin, "515315"],
    bytesArgs: [], // bytesArgs - arguments can be encoded off-chain to bytes.
    secrets: privateKey,
  });

  console.log(response);

  if(response.errorString) {
    console.error("decrypt function failed! Exiting! Error:", response.errorString);
    return;
  }
    

  await deploy("OrganizationFactory", {
    from: deployer,
    args: [],
    log: true,
    autoMine: true
  });

  const orgFactory = await hre.ethers.getContract<Contract>("OrganizationFactory", deployer);

  await deploy("OrganizationRegistry", {
    from: deployer,
    args: [admin, orgFactory.target],
    log: true,
    autoMine: true
  })

  const orgRegistry = await hre.ethers.getContract<Contract>("OrganizationRegistry", deployer);

  await execute("OrganizationFactory", { from: deployer }, "setRegistry", orgRegistry.target);

  await deploy("Pet", {
    from: deployer,
    // Contract constructor arguments
    args: [orgRegistry.target, routerAddress, source],
    log: true,
    // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
    // automatically mining the contract deployment transaction. There is no effect on live networks.
    autoMine: true,
  });

  const pet = await hre.ethers.getContract<Contract>("Pet", deployer);


  const contract = pet.attach(pet.target); 

  console.log(await contract.getDecryptContract());

  await execute("OrganizationFactory", { from: deployer }, "setPet", pet.target);
};


export default deployYourContract;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags YourContract
deployYourContract.tags = ["OrgRegistry", "PET"];