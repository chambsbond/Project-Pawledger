"use client";

import { useState, useEffect } from "react";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import TextField from "@mui/material/TextField";
import { Button, Typography } from "@mui/material";
import dayjs from "dayjs";
import EthCrypto, { Encrypted } from "eth-crypto";
import { ethers } from "ethers";
import { useSigner } from "@alchemy/aa-alchemy/react";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import { Address, encodeFunctionData } from "viem";
import {
  useSendUserOperation,
  useSmartAccountClient,
} from "@alchemy/aa-alchemy/react";
import { useSelector } from "react-redux";
import {
  memberShipSelector,
  orgSelectedIndexSelector,
} from "@/store/slices/OrgSlice";
import OrgContractCompile from "../../../../../blockchain/packages/hardhat/artifacts/contracts/organizationImpl/AnimalShelter.sol/AnimalShelter.json";
import PetAmoy from "../../../../../blockchain/packages/hardhat/deployments/polygonAmoy/Pet.json";

const TurnkeyExportWalletContainerId = "turnkey-export-wallet-container-id";
const TurnkeyExportWalletElementId = "turnkey-export-wallet-element-id";
const registreeOptions = ["Your Organization", "A different user", "No one"];

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

export default async function MedicalHistory() {
  const [isVaccinated, setIsVaccinated] = useState(true);
  const [dateVaccinated, setDateVaccinated] = useState(dayjs());
  const [userText, setUserText] = useState("");
  const [encryptedMedicalData, setEncryptedMedicalData] = useState<Encrypted>();
  const [medicalData, setMedicalData] = useState("Nothing here yet");
  const [publicKey, setPublicKey] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [mnemonic, setMnemonic] = useState<string>("");
  const signer = useSigner();
  const orgs = useSelector(memberShipSelector);
  const orgIndex = useSelector(orgSelectedIndexSelector);
  const [registree, setRegistree] = useState<string>(registreeOptions[0]);

  const { client } = useSmartAccountClient({
    type: "MultiOwnerModularAccount",
    gasManagerConfig: {
      policyId: process.env.NEXT_PUBLIC_ALCHEMY_GAS_MANAGER_POLICY_ID!,
    },
    opts: {
      txMaxRetries: 20,
    },
  });

  const {
    sendUserOperation,
    sendUserOperationResult,
    isSendingUserOperation,
    error: isSendUserOperationError,
  } = useSendUserOperation({ client, waitForTxn: true });

  // Fires on page load.
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
    await transmitMedicalData(encryptedMedicalData);
  }

  async function encryptMedicalData(plainTextData: any) {
    const encrypt = await EthCrypto.encryptWithPublicKey(
      EthCrypto.publicKey.decompress(publicKey.substring(2)),
      JSON.stringify(plainTextData)
    );
    return encrypt;
  }

  async function transmitMedicalData(encryptedData: string) {
    let registreeAddress: string;

    // YourOrganization
    if (registree === registreeOptions[0]) {
      registreeAddress = orgs[orgIndex].address;
    }
    // TODO : implement
    else if (registree === registreeOptions[1]) {
      registreeAddress = "0x0";
    }
    // No one
    else {
      registreeAddress = PetAmoy.address;
    }

    const callData = encodeFunctionData({
      abi: OrgContractCompile.abi,
      functionName: "sendMedicalInfo",
      args: [registreeAddress, encryptedData],
    });

    await sendUserOperation({
      uo: {
        target: orgs[orgIndex].address as Address,
        data: callData,
      },
    });
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
              {/* TODO - Pull your data from the db and show it here */}
            </Item>
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
