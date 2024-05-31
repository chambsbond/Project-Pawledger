const EthCrypto = await import('npm:eth-crypto');
const { v4: uuidv4 } = await import('npm:uuid')

const tokenId = args[0];
const transfereePublicKey = args[1];
const addressTo = args[2];
const pawledgerAddress = args[3];

const response = await Functions.makeHttpRequest({
  url: `http://eus-pawledger-backend.azurewebsites.net/api/medicalHistories/token/${tokenId}/address/${pawledgerAddress}`,
  method: "GET",
  timeout: 10000
});

const requestId = uuidv4();
let newEncryptedHistories = [];
for (let i = 0; i < response.data.length; i++) {
  let oldEncryptedHistory = response.data[i].encryptedHistory;

  const plaintextHistory = await EthCrypto.decryptWithPrivateKey(
    secrets.privateKey, 
    JSON.parse(oldEncryptedHistory)
  );

  const newEncryptedHistory = await EthCrypto.encryptWithPublicKey(
    transfereePublicKey, 
    plaintextHistory
  );

  const request = {
    tokenId: tokenId,
    encryptedHistory: newEncryptedHistory,
    addressedTo: addressTo,
    requestId: requestId
  };

  newEncryptedHistories.push(request);
  console.log(i, response.data.length)
}

await Functions.makeHttpRequest({
  url: `https://eus-pawledger-backend.azurewebsites.net/api/medicalHistories`,
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
  },
  data: newEncryptedHistories,
  timeout: 10000
});

const responsePayload = {
  tokenId: tokenId,
  requestId: requestId
}

return Functions.encodeString(true);