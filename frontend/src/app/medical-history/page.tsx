"use client";

import { useState } from "react";
import styles from "./page.module.css";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
import dayjs from "dayjs";
import EthCrypto, { Encrypted } from "eth-crypto";
import { ethers } from "ethers";
import { useSigner } from "@alchemy/aa-alchemy/react";
import { useMutation } from "@tanstack/react-query";

const TurnkeyExportWalletContainerId = "turnkey-export-wallet-container-id";
const TurnkeyExportWalletElementId = "turnkey-export-wallet-element-id";

// This allows us to style the embedded iframe
const iframeCss = `
iframe {
    box-sizing: border-box;
    width: 100%;
    height: 125px;
    border-radius: 8px;
    border-width: 1px;
    border-style: solid;
    border-color: rgba(216, 219, 227, 1);
    padding: 20px;
}
`;

export default function MedicalHistory() {
  const [isVaccinated, setIsVaccinated] = useState(false);
  const [dateVaccinated, setDateVaccinated] = useState(dayjs());
  const [userText, setUserText] = useState("");
  const [encryptedMedicalData, setEncryptedMedicalData] = useState<Encrypted>();
  const [medicalData, setMedicalData] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [privateKey, setPrivateKey] = useState("");

  async function handleFormSubmitted() {
    const medicalDataPlainText = {
      vaccinatedForRabbies: isVaccinated,
      rabbiesVaccineDate: dateVaccinated,
      userText: userText,
    };
    setEncryptedMedicalData(await encryptMedicalData(medicalDataPlainText));
  }

  async function encryptMedicalData(plainTextData) {
    const encrypt = await EthCrypto.encryptWithPublicKey(
      EthCrypto.publicKey.decompress(publicKey.substring(2)),
      JSON.stringify(plainTextData)
    );
    return encrypt;
  }

  const [mnemonic, setMnemonic] = useState<string>("");
  const signer = useSigner();

  const {
    mutate: exportWallet,
    isLoading,
    data,
  } = useMutation({
    mutationFn: () =>
      signer.exportWallet({
        iframeContainerId: TurnkeyExportWalletContainerId,
        iframeElementId: TurnkeyExportWalletElementId,
      }),
  });

  async function saveKeys() {
    const hdNode = ethers.HDNodeWallet.fromPhrase(mnemonic);

    setPrivateKey(hdNode.privateKey);
    setPublicKey(hdNode.publicKey);
    console.log("PUBLIC = " + publicKey);
    console.log("PRIVATE = " + privateKey);
    console.log("ADDRESS = " + (await hdNode.getAddress()).toString());
  }

  async function handleDecrypt() {
    setMedicalData(
      await EthCrypto.decryptWithPrivateKey(privateKey, encryptedMedicalData)
    );
  }

  return (
    <Box textAlign="center" className={styles.container}>
      <FormControl>
        {!data ? (
          <Button variant="contained" onClick={() => exportWallet()}>
            View Your Seed Phrase
          </Button>
        ) : (
          <strong>Seed Phrase</strong>
        )}
        <div
          className="w-full"
          style={{ display: !data ? "none" : "block" }}
          id={TurnkeyExportWalletContainerId}
        >
          <style>{iframeCss}</style>
        </div>
        <TextField
          id="outlined-basic"
          label="Paste seed phrase here :)"
          variant="outlined"
          value={mnemonic}
          onChange={(e) => setMnemonic(e.target.value)}
        />
        <Button variant="contained" onClick={saveKeys}>
          Submit
        </Button>
      </FormControl>

      <p>{medicalData != "" ? medicalData : encryptedMedicalData?.ciphertext}</p>
      <FormControl>
        <FormControlLabel
          control={<Checkbox defaultChecked />}
          label="Rabbies Vaccine Completed"
          value={isVaccinated}
          onChange={(e) => setIsVaccinated(!isVaccinated)}
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Date Completed"
            value={dateVaccinated}
            onChange={(e) =>
              setDateVaccinated(
                dayjs(new Date(e?.year(), e?.month(), e?.day()))
              )
            }
          />
        </LocalizationProvider>
        <TextField
          id="outlined-basic"
          label="Something else to encrypt"
          variant="outlined"
          value={userText}
          onChange={(e) => setUserText(e.target.value)}
        />
        <Button variant="contained" onClick={handleFormSubmitted}>
          Encrypt Data
        </Button>
        <Button variant="contained" onClick={handleDecrypt}>
          Decrypt Data
        </Button>
      </FormControl>
    </Box>
  );
}

// NOTES
// extract private key: https://accountkit.alchemy.com/signers/alchemy-signer/export-private-key.html
// 1. https://docs.chain.link/chainlink-functions/tutorials/api-post-data
// 2. https://ethereum.stackexchange.com/questions/3092/how-to-encrypt-a-message-with-the-public-key-of-an-ethereum-address
// 3. Base64 encode the message?
// 4. checksum is it needed? Does it make our lives easier

// you encrypt the message with the senders public key and then they decrypt it with their private one!
