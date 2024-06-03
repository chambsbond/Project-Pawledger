"use client";

import { useSendUserOperation, useSmartAccountClient, useUser } from "@alchemy/aa-alchemy/react";
import { useEffect, useState } from "react";
import { Button, CircularProgress, Container, FormGroup, Paper, Stack, TextField, Typography } from "@mui/material";

import EthCrypto, { Encrypted } from 'eth-crypto';
import { memberShipSelector, orgSelectedIndexSelector } from "@/store/slices/OrgSlice";
import { useSelector } from "react-redux";
import axios from "axios";
import { ethers, verifyMessage } from "ethers";

export interface EncryptedRecord {
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
    medicalHistory: string;
    addressedTo: BigInt;
    requestId: number;
}

export interface MedicalDataPlainText {
    by: any,
    type: string,
    recordDetails: string
}

export default function ChartingPage() {
    const user = useUser();
    const [mnemonic, setMnemonic] = useState<string>("");
    const [medicalRecord, setMedicalRecord] = useState<string>("");
    const [petId, setPetId] = useState<BigInt | undefined>();
    const TurnkeyExportWalletContainerId = "turnkey-export-wallet-container-id";
    const TurnkeyExportWalletElementId = "turnkey-export-wallet-element-id";
    
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
        let response = await axios.get<EncryptedRecord[]>(`https://eus-pawledger-backend.azurewebsites.net/api/medicalHistories/token/${petId}/address/${user?.address}`);  
        let decryptedResponse: DecryptedRecord[] = [];
        
        for ( const record of response.data) {
            var encryptedMeds = JSON.parse(record.encryptedHistory.replace('\\', '')) as Encrypted;
            const hdNode = ethers.HDNodeWallet.fromPhrase(mnemonic);
            var decryptedMeds = await EthCrypto.decryptWithPrivateKey(hdNode.privateKey, encryptedMeds);
            var decryptedRecord: DecryptedRecord = {
                medicalHistoryId: record.medicalHistoryId,
                tokenId: record.tokenId,
                medicalHistory: decryptedMeds,
                addressedTo: record.addressedTo,
                requestId: record.requestId,
            };

            decryptedResponse.push(decryptedRecord);
        }

        setMedicalRecord(JSON.stringify(decryptedResponse))
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
                        <Typography variant="h6" color="text.secondary">Copy the pet&apos;s TokenID and your private key
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
                    <textarea
                        id="medical-history"
                        value={medicalRecord}
                        placeholder="medical record"
                        rows={20}
                        disabled={isSendingUserOperation}>
                    </textarea>
                </Stack>
            </Paper>
        </Container >
    )
}
