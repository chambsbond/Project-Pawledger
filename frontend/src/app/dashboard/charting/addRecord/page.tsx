"use client";

import { useAccount, useSendUserOperation, useSmartAccountClient, useUser } from "@alchemy/aa-alchemy/react";
import { useEffect, useState } from "react";
import { Button, CircularProgress, Container, FormGroup, NativeSelect, Paper, Select, Stack, TextField, Typography } from "@mui/material";

//look into pet.json for needed contract functions
import PetAmoy from "../../../../../blockchain/packages/hardhat/deployments/polygonAmoy/Pet.json";
import { ethers, verifyMessage } from "ethers";
import { Input } from '@mui/material';

import EthCrypto from 'eth-crypto';

export default function ChartingPage() {
    const user = useUser();
    const [userText, setUserText] = useState<string>("");
    const [mnemonic, setMnemonic] = useState<string>("");
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
    const createPetRecord = async () => {
        // const petAddress = PetAmoy?.address;
        // const provider = new ethers.JsonRpcProvider("https://rpc-amoy.polygon.technology/");
        // const petContract = new ethers.Contract(petAddress,
        //     PetAmoy.abi, provider);


        // const owner = await petContract.ownerOf(petId);
        // const medicalDataPlainText = {
        //     by: user?.address,
        //     type: recordType,
        //     userText: userText
        // };
        // const test2 = await client?.account.getSigner().getAuthDetails();
        // console.log(test2, await client?.account.getSigner().getAddress());
        // // console.log('keyTest', publicKeyTest, client?.account.publicKey);

        const hdNode = ethers.HDNodeWallet.fromPhrase(mnemonic);
        const test = await encryptMedicalData(userText, hdNode.publicKey);
        console.log(await client?.account.address, await client?.account.publicKey, hdNode.address);
        

        console.log("output", await EthCrypto.decryptWithPrivateKey(hdNode.privateKey, test));

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
                    <Typography textAlign="center" variant="h3">Add New Medical Record for Animal</Typography>
                    <Stack spacing={1}>
                        <Typography variant="h5" fontWeight="bold" gutterBottom>Seed Phrase</Typography>
                        <Typography variant="h6" color="text.secondary">Copy your seed phrase into the seed phrase text field in
                            order to encrypt the medical history</Typography>
                        <div
                            className="w-full"
                            style={{ display: "block" }}
                            id={TurnkeyExportWalletContainerId}
                        >
                            <style>{iframeCss}</style>
                        </div>
                        <TextField
                            required
                            id="submitter-name"
                            label="Paste Seed Phrase"
                            value={mnemonic}
                            onChange={(e) => setMnemonic(e.target.value)}
                            disabled={isSendingUserOperation}>
                        </TextField>
                    </Stack>
                    <br></br>
                    <Typography variant="h5" fontWeight="bold" gutterBottom>Medical Form</Typography>
                    <FormGroup>
                        <Stack spacing={2}>
                            <TextField
                                required
                                id="animal-id"
                                value={petId}
                                type="number"
                                placeholder="PET Id"
                                onChange={(e) => setPetId((e.target.value as unknown) as BigInt)}
                                disabled={isSendingUserOperation}>
                            </TextField>
                            <Select
                                required
                                // onChange={(e) => setRecordType(e.target.value as number)}
                                defaultValue={0}
                                id="org-type"
                                disabled={isSendingUserOperation}>
                                <option value={0}>Vaccine</option>
                                <option value={1}>Procedure</option>
                                <option value={2}>Checkup</option>
                                <option value={3}>Other</option>
                            </Select>
                            <TextField
                                multiline
                                id="outlined-basic"
                                label="Record Details"
                                variant="outlined"
                                value={userText}
                                onChange={(e) => setUserText(e.target.value)}
                            />
                            <Button
                                variant="contained"
                                onClick={() => { createPetRecord() }}
                                disabled={isSendingUserOperation}>
                                {isSendingUserOperation ? <CircularProgress /> : <Typography>Submit</Typography>}
                            </Button>
                        </Stack>
                    </FormGroup>
                </Stack>
            </Paper>
        </Container >
    )
}
