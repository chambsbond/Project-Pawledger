"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Button, Typography } from "@mui/material";
import dayjs from "dayjs";
import EthCrypto, { Encrypted } from "eth-crypto";
import { ethers } from "ethers";
import { useSigner } from "@alchemy/aa-alchemy/react";
import { useMutation } from "@tanstack/react-query";
import { TroubleshootOutlined } from "@mui/icons-material";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";

const TurnkeyExportWalletContainerId = "turnkey-export-wallet-container-id";
const TurnkeyExportWalletElementId = "turnkey-export-wallet-element-id";

// This allows us to style the embedded iframe
const iframeCss = `
iframe {
    box-sizing: border-box;
    width: 100%;
    height: 50px;
    border-radius: 8px;
    border-width: 1px;
    border-style: solid;
    border-color: rgba(216, 219, 227, 1);
    padding: 0px;
}
`;

export default function MedicalHistory() {
  const [isVaccinated, setIsVaccinated] = useState(true);
  const [dateVaccinated, setDateVaccinated] = useState(dayjs());
  const [userText, setUserText] = useState("");
  const [encryptedMedicalData, setEncryptedMedicalData] = useState<Encrypted>();
  const [medicalData, setMedicalData] = useState("Nothing here yet");
  const [publicKey, setPublicKey] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [mnemonic, setMnemonic] = useState<string>("");
  const signer = useSigner();

  // Fires on page load and gets
  useEffect(() => {
    signer.exportWallet({
      iframeContainerId: TurnkeyExportWalletContainerId,
      iframeElementId: TurnkeyExportWalletElementId,
    });
  }, []);

  async function handleFormSubmitted() {
    const medicalDataPlainText = {
      vaccinatedForRabbies: isVaccinated,
      rabbiesVaccineDate: dateVaccinated,
      userText: userText,
    };
    setEncryptedMedicalData(await encryptMedicalData(medicalDataPlainText));
    setMedicalData((await encryptMedicalData(medicalDataPlainText)).ciphertext);
  }

  async function encryptMedicalData(plainTextData) {
    const encrypt = await EthCrypto.encryptWithPublicKey(
      EthCrypto.publicKey.decompress(publicKey.substring(2)),
      JSON.stringify(plainTextData)
    );
    return encrypt;
  }

  async function saveKeys() {
    const hdNode = ethers.HDNodeWallet.fromPhrase(mnemonic);

    setPrivateKey(hdNode.privateKey);
    setPublicKey(hdNode.publicKey);
  }

  async function handleDecrypt() {
    setMedicalData(
      await EthCrypto.decryptWithPrivateKey(privateKey, encryptedMedicalData)
    );
  }

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  }));

  return (
    <>
      {publicKey == "" && privateKey == "" ? (
        <Stack spacing={2} padding={4}>
          <Item>
            <strong>Seed Phrase</strong>
            <div
              className="w-full"
              style={{ display: "block" }}
              id={TurnkeyExportWalletContainerId}
            >
              <style>{iframeCss}</style>
            </div>
          </Item>
          <Item>
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
          </Item>
        </Stack>
      ) : (
        <div>
          <Stack spacing={1} padding={4}>
            <Item>
              VIEW YOUR DATA HERE:
              <p>{medicalData}</p>
            </Item>
            <Item>SEND YOUR DATA TO ANYONE HERE:</Item>
            {/* TODO: connect to abi of animal hospital. */}
          </Stack>
          <Grid container bgcolor="white" padding={4}>
            <Grid item>
              <FormControlLabel
                control={<Checkbox defaultChecked />}
                label={
                  <Typography color="black">
                    Rabbies Vaccine Completed
                  </Typography>
                }
                value={isVaccinated}
                onChange={(e) => setIsVaccinated(!isVaccinated)}
              />
            </Grid>
            <Grid item>
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
            </Grid>
            <Grid item>
              <TextField
                id="outlined-basic"
                label="Something else to encrypt"
                variant="outlined"
                value={userText}
                onChange={(e) => setUserText(e.target.value)}
              />
            </Grid>
            <Grid item>
              <Button variant="contained" onClick={handleFormSubmitted}>
                Encrypt Data
              </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" onClick={handleDecrypt}>
                Decrypt Data
              </Button>
            </Grid>
          </Grid>
        </div>
      )}
    </>
  );
}

// NOTES
// extract private key: https://accountkit.alchemy.com/signers/alchemy-signer/export-private-key.html
// 1. https://docs.chain.link/chainlink-functions/tutorials/api-post-data
// 2. https://ethereum.stackexchange.com/questions/3092/how-to-encrypt-a-message-with-the-public-key-of-an-ethereum-address
// 3. Base64 encode the message?
// 4. checksum is it needed? Does it make our lives easier

// you encrypt the message with the senders public key and then they decrypt it with their private one!
