"use client";

import { useAccount, useSendUserOperation, useSmartAccountClient, useUser } from "@alchemy/aa-alchemy/react";
import { useEffect, useState } from "react";
import { Button, CircularProgress, Container, FormGroup, NativeSelect, Paper, Select, Stack, TextField, Typography } from "@mui/material";

//look into pet.json for needed contract functions
import PetAmoy from "../../../../../../blockchain/packages/hardhat/deployments/polygonAmoy/Pet.json";
import { ethers, verifyMessage } from "ethers";
import { Input } from '@mui/material';

import EthCrypto from 'eth-crypto';
import { memberShipSelector, orgSelectedIndexSelector } from "@/store/slices/OrgSlice";
import { useSelector } from "react-redux";
import axios from "axios";

export interface Record {
    medicalHistoryId: number;
    tokenId: number;
    encryptedHistory: string;
    addressedTo: BigInt;
    requestId: number;
    createdTimeStamp: string;
    updatedTimeStamp: string;
}

export interface DecryptedRecord {
    medicalHistoryId: number;
    tokenId: number;
    encryptedHistory:
    addressedTo: BigInt;
    requestId: number;
    createdTimeStamp: string;
    updatedTimeStamp: string;
}

export default function ChartingPage() {
    const user = useUser();
    const [userText, setUserText] = useState<string>("");
    const [mnemonic, setMnemonic] = useState<string>("");
    const [medicalRecord, setMedicalRecord] = useState<string>("");
    const [petId, setPetId] = useState<BigInt | undefined>();
    const TurnkeyExportWalletContainerId = "turnkey-export-wallet-container-id";
    const TurnkeyExportWalletElementId = "turnkey-export-wallet-element-id";
    const orgs = useSelector(memberShipSelector);
    const orgIndex = useSelector(orgSelectedIndexSelector);
    
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

    // construct call data and send userOperation for creating a new pet medical record entry
    const viewPetRecord = async () => {        
        //const response = await axios.get(`https://eus-pawledger-backend.azurewebsites.net/api/medicalHistories/token/0/address/${petId}`);
        const response = await axios.get<Record[]>(`https://eus-pawledger-backend.azurewebsites.net/api/medicalHistories/token/0/address/${petId}`);
        
        const temp: Record[] = [];
        response.data.forEach((record) => {
            console.log(record)
            temp.push(record)
        })
        setMedicalRecord(JSON.stringify(temp))

        // console.log("output", await EthCrypto.decryptWithPrivateKey(mnemonic, JSON.stringify(response));

        // await transmitMedicalData(encryptedMedicalData);
    }

    async function encryptMedicalData(plainTextData: any, owner: string) {
        // ethers.

        const encrypt = await EthCrypto.encryptWithPublicKey(
            EthCrypto.publicKey.decompress(owner.substring(2)),
            JSON.stringify(plainTextData)
        );

        console.log('ciphertext', encrypt)
        return encrypt;
    }


    useEffect(() => {
        const method = async () => {
            if (client) {
                client?.account.getSigner().exportWallet({
                    iframeContainerId: TurnkeyExportWalletContainerId,
                    iframeElementId: TurnkeyExportWalletElementId
                }).catch((e) => { });//expected - ignore error

            }
        }

        method();
    }, [client, user]);

    useEffect(() => {
        console.log("error", isSendUserOperationError);
    }, [isSendUserOperationError]);

    return (
        <Container>
            <Paper>
                <Stack padding={10} spacing={4}>
                    <Typography textAlign="center" variant="h3">View Existing Medical Record for Animal</Typography>
                    <Stack spacing={1}>
                        <Typography variant="h5" fontWeight="bold" gutterBottom>Identification</Typography>
                        <Typography variant="h6" color="text.secondary">Copy the pet's TokenID and your private key
                            to get and decrypt the pet medical history</Typography>
                        <div
                            className="w-full"
                            style={{ display: "block" }}
                            id={TurnkeyExportWalletContainerId}
                        >
                            <style>{iframeCss}</style>
                        </div>
                        <TextField
                            required
                            id="animal-id"
                            value={petId}
                            placeholder="PET Id"
                            onChange={(e) => setPetId((e.target.value as unknown) as BigInt)}
                            disabled={isSendingUserOperation}>
                        </TextField>
                        <TextField
                            required
                            id="submitter-key"
                            value={mnemonic}
                            placeholder="Private Key"
                            onChange={(e) => setMnemonic(e.target.value)}
                            disabled={isSendingUserOperation}>
                        </TextField>
                    </Stack>
                    <br></br>
                    <FormGroup>
                        <Stack spacing={2}>
                            <Button
                                variant="contained"
                                onClick={() => { viewPetRecord() }}
                                disabled={isSendingUserOperation}>
                                {isSendingUserOperation ? <CircularProgress /> : <Typography>View</Typography>}
                            </Button>
                        </Stack>
                    </FormGroup>
                    <hr></hr>
                    <TextField
                        id="medical-history"
                        value={medicalRecord}
                        placeholder="medical record"
                        disabled={isSendingUserOperation}>
                    </TextField>
                </Stack>
            </Paper>
        </Container >
    )
}
