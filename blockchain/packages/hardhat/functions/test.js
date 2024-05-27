const openpgp = await require('npm:openpgp');

[tokenId, reEncryptPublicKey] = args

if (!secrets.privateKey) {
  throw Error(
    "Did not work! LOL"
  );
}

const { data } = await Functions.makeHttpRequest({
  url: `http://eus-pawledger-backend.azurewebsites.net/api/medicalHistories/${tokenId}`,
});

const encryptedMessage = data.data.EncryptedHistory;

const { data: decrypted, signatures } = await openpgp.decrypt({
  encryptedMessage,
  decryptionKeys: privateKey
});

const result = await openpgp.encrypt({
  message: await openpgp.createMessage(decrypted),
  encryptionKeys: reEncryptPublicKey,
});

return Functions.encodeString(result);