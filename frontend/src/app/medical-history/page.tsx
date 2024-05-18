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
import dayjs from 'dayjs';
import EthCrypto from 'eth-crypto';
import { ethers } from "ethers";

const { ethereum } = window as any;

export default function MedicalHistory() {
  const [isVaccinated, setIsVaccinated] = useState(false);
  const [dateVaccinated, setDateVaccinated] = useState(dayjs());
  const [userText, setUserText] = useState("");
  
  async function requestAccount() {
    await ethereum.request({ method: "eth_requestAccounts" });
  }

  function handleFormSubmitted() {
    const medicalDataPlainText = {
      vaccinatedForRabbies: isVaccinated,
      rabbiesVaccineDate: dateVaccinated,
      userText: userText
    }
    const crypherText = encryptMedicalData(medicalDataPlainText);
  }

  async function getUsersPublicKey() {
    if (typeof ethereum !== "undefined") {
      await requestAccount();
      const provider = new ethers.BrowserProvider(ethereum);
      const signer = await provider.getSigner();
    }
  }

  async function encryptMedicalData(plainTextData) {
    const alice = EthCrypto.createIdentity();
    console.log("PUBLIC KEY :: " + alice.publicKey)
    console.log("PRIVATE KEY :: " + alice.privateKey)
    const encrypt = await EthCrypto.encryptWithPublicKey(alice.publicKey, JSON.stringify(plainTextData));
    console.log("ENCRYPTED :: " + encrypt.ciphertext);
    console.log("DECRYPTED :: " + await EthCrypto.decryptWithPrivateKey(alice.privateKey, encrypt))
    return encrypt;
  }

  return (
    <Box textAlign="center" className={styles.container}>
      <FormControl>
        <FormControlLabel
          control={<Checkbox defaultChecked />}
          label="Rabbies Vaccine Completed"
          value={isVaccinated}
          onChange={e => setIsVaccinated(!isVaccinated)}
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker label="Date Completed" 
          value={dateVaccinated}
          onChange={e => setDateVaccinated(dayjs(new Date(e?.year(), e?.month(), e?.day())))}/>
        </LocalizationProvider>
        <TextField
          id="outlined-basic"
          label="Something else to encrypt"
          variant="outlined"
          value={userText}
          onChange={e => setUserText(e.target.value)}
        />
        <Button variant="contained" onClick={handleFormSubmitted}>
          Submit
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