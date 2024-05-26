[tokenId, decryptorPublicKey, reEncryptPublicKey] = args

const { data } = await Functions.makeHttpRequest({
  url: `http://eus-pawledger-backend.azurewebsites.net/api/medicalHistories/${tokenId}`,
});



return Functions.encodeString(data);