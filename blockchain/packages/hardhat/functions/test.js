//TODO SEE BELOW TODOs
//Figure out dynamic DON hosted secret
//UI: Figure out how to to get transfereePublicKey
//UI: Add/View charts from portal


//UI: User side portal
  // Onramp/Dashboard
    // Transfer
    // View Charts
//BE: Found Animal Flow
    //UI/Chainlink/BE: Timer for abandoned strays (chainlink points)

//General Bug Fixes (state change in verified)



const EthCrypto = await import('npm:eth-crypto');
const { Buffer } = await import('node:buffer')


const tokenId = args[0];
const transfereePublicKey = args[1];
const addressTo = args[2];
const requestId = args[3];

const data  = await Functions.makeHttpRequest({
  url: `http://eus-pawledger-backend.azurewebsites.net/api/medicalHistories/${tokenId}`,
  method: "GET",
  timeout: 10000
});

//TODO: Make this a loop
const encryptedMessage = data.data[0].encryptedHistory;

//Decrypting with DON's private key
const result = await EthCrypto.decryptWithPrivateKey(secrets.privateKey, JSON.parse(encryptedMessage));

//ReEncrypt with New Owners public key
const reEncryptedMessage = await EthCrypto.encryptWithPublicKey(
  transfereePublicKey, // publicKey
  result // message
);

// console.log(historyString)
const test = {
  tokenId: tokenId,
  encryptedHistory: reEncryptedMessage,
  addressedTo: addressTo,
  requestId: requestId
}


//TODO: Make endpoint that posts all history at once
await Functions.makeHttpRequest({
  url: `https://eus-pawledger-backend.azurewebsites.net/api/medicalHistory`,
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
  },
  data: test,
  timeout: 10000
});

const responsePayload = {
  tokenId: tokenId,
  requestId: requestId
}

return Functions.encodeString(true);