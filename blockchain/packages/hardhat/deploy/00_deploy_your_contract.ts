import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";
import fs from "fs/promises";
import path from "node:path";
import PetAbi  from "../deployments/polygonAmoy/Pet.json";
import { SubscriptionManager, SecretsManager } from "@chainlink/functions-toolkit";
import  { ethers } from "ethers";

import { config } from "hardhat";
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

  console.log(deployer)

  const admin = "0x2d72722533f7E0e58C4aAC8Ed37992b17DCF44c3"
  const gatewayUrls = [
    "https://01.functions-gateway.testnet.chain.link/",
    "https://02.functions-gateway.testnet.chain.link/",
  ];

  const provider = new ethers.JsonRpcProvider("	https://rpc-amoy.polygon.technology");
  const wallet = new ethers.Wallet(process.env.DEPLOYER_PRIVATE_KEY as string);
  const signer = wallet.connect(provider);
  const routerAddress = "0xC22a79eBA640940ABB6dF0f7982cc119578E11De";
  const donId = "fun-polygon-amoy-1";
  
  // First encrypt secrets and upload the encrypted secrets to the DON
  const secretsManager = new SecretsManager({
    signer: signer,
    functionsRouterAddress: routerAddress,
    donId: donId,
  });

  await secretsManager.initialize();

  const secrets = { privateKey : process.env.DECRYPT_PRIVATE_KEY }
  // Encrypt secrets and upload to DON
  await secretsManager.initialize();
  const encryptedSecretsObj = await secretsManager.encryptSecrets(secrets as Record<string,string>);
  
  const uploadResult = await secretsManager.uploadEncryptedSecretsToDON({
    encryptedSecretsHexstring: encryptedSecretsObj.encryptedSecrets,
    gatewayUrls: gatewayUrls,
    slotId: 0,
    minutesUntilExpiration: 15,
  });

  
  if (!uploadResult.success)
    throw new Error(`Encrypted secrets not uploaded to ${gatewayUrls}`);

  console.log(
    `\n✅ Secrets uploaded properly to gateways ${gatewayUrls}! Gateways response: `,
    uploadResult
  );

  console.log(uploadResult.version);

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

  const source = await fs.readFile(
    path.join(__dirname, '../functions/test.js'),
    { encoding: 'utf8' }
  );


  console.log(source);
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

  const getFunction = pet.getFunction("getDecryptContract");

  const contract = pet.attach(PetAbi.address); 

  console.log(await contract.getDecryptContract());

  await execute("OrganizationFactory", { from: deployer }, "setPet", pet.target);
};


export default deployYourContract;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags YourContract
deployYourContract.tags = ["OrgRegistry", "PET"];