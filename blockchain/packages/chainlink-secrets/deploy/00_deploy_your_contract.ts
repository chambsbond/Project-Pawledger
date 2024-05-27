import { HardhatRuntimeEnvironment } from "hardhat/types";
import { SubscriptionManager, SecretsManager } from "@chainlink/functions-toolkit";
import  { ethers } from "ethers";

const deployYourContract = async function (hre: HardhatRuntimeEnvironment) {

  const gatewayUrls = [
    "https://01.functions-gateway.testnet.chain.link/",
    "https://02.functions-gateway.testnet.chain.link/",
  ];

  const provider = new ethers.providers.JsonRpcProvider("	https://rpc-amoy.polygon.technology");
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
    minutesUntilExpiration: 2500,
  });
  
  console.log(uploadResult);

  if (!uploadResult.success)
    throw new Error(`Encrypted secrets not uploaded to ${gatewayUrls}`);

  console.log(
    `\n✅ Secrets uploaded properly to gateways ${gatewayUrls}! Gateways response: `,
    uploadResult
  );
};

export default deployYourContract;
