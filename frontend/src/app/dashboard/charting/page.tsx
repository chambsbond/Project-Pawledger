"use client";

import { useSendUserOperation, useSmartAccountClient, useUser } from "@alchemy/aa-alchemy/react";
import { useEffect, useState } from "react";
import { Button, CircularProgress, Container, FormGroup, MenuItem, Paper, Select, Stack, TextField, Typography } from "@mui/material";

//look into pet.json for needed contract functions
import PetAmoy from "../../../../../blockchain/packages/hardhat/deployments/polygonAmoy/Pet.json";

import EthCrypto, { publicKey } from 'eth-crypto';
import { useAppSelector } from "@/store/hooks";
import { RootState } from "@/store/store";
import { Address, encodeFunctionData } from "viem";
import { ethers } from "ethers";
import { useSelector } from "react-redux";
import { memberShipSelector, orgSelectedIndexSelector } from "@/store/slices/OrgSlice";
import axios from "axios";

export default function ChartingPage() {

    const pawLedgerPublicKey = "aecf7df15a3a750fb293df93cecb6bc8b5206da52298cf18a9b4be7b7519e97dd99ce7ac05474f68ee44d5bd121f5a375fb71340ca30eb6d546668058025d99e";
    const backendConfig = { headers: { 'Access-Control-Allow-Origin': '*', "Content-Type": "application/json" } };
    
    const loggedInUserPublicKey = useAppSelector((state: RootState) => state.orgContract.publicKey);
    const user = useUser();
    const [recordDetails, setRecordDetails] = useState<string>("");
    const [recordType, setRecordType] = useState<string>("");
    const [petId, setPetId] = useState<BigInt | undefined>();
    const orgs = useSelector(memberShipSelector);
    const orgIndex = useSelector(orgSelectedIndexSelector);
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
        const medicalDataPlainText = {
            by: user?.address,
            type: recordType,
            recordDetails: recordDetails
        };

        const provider = new ethers.JsonRpcProvider("https://rpc-amoy.polygon.technology/");
        const petContract = new ethers.Contract(PetAmoy.address, PetAmoy.abi, provider);
        const petOwnerAddress = await petContract.ownerOf(petId);

        const orgAffilliation = {
            org: orgs[orgIndex].address,
            claimee: petOwnerAddress,
        };

        const petOwnerAccount = await axios.get(`https://eus-pawledger-backend.azurewebsites.net/api/account/${petOwnerAddress}`, backendConfig);

        const encryptedPayloadList = [];
        encryptedPayloadList.push(await encryptMedicalData(medicalDataPlainText, petOwnerAccount?.data?.publicKey));
        encryptedPayloadList.push(await encryptMedicalData(medicalDataPlainText, pawLedgerPublicKey));
        encryptedPayloadList.push(await encryptMedicalData(medicalDataPlainText, loggedInUserPublicKey || "heck"));

        const callData = encodeFunctionData({
            abi: PetAmoy.abi,
            functionName: "receiveMedicalPayload",
            args: [orgAffilliation, petOwnerAddress, JSON.stringify(encryptedPayloadList)]
        });

        await sendUserOperation({
            uo: {
                target: PetAmoy?.address as Address,
                data: callData
            }
        })
    }

    async function encryptMedicalData(plainTextData: any, owner: string) {
        const encrypt = await EthCrypto.encryptWithPublicKey(
            EthCrypto.publicKey.decompress(owner.substring(2)),
            JSON.stringify(plainTextData)
        );

        console.log('ciphertext', encrypt)
        return encrypt;
    }

    useEffect(() => {
        console.log("error", isSendUserOperationError);
    }, [isSendUserOperationError]);

    return (
        <Container>
            <Paper>
                <Stack padding={10} spacing={4}>
                    <Typography textAlign="center" variant="h3">Add New Medical Record for Animal</Typography>
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
                                onChange={(e) => setRecordType(e.target.value as string)}
                                defaultValue={0}
                                id="org-type"
                                disabled={isSendingUserOperation}>
                                <MenuItem value={0}>Vaccine</MenuItem>
                                <MenuItem value={1}>Procedure</MenuItem>
                                <MenuItem value={2}>Checkup</MenuItem>
                                <MenuItem value={3}>Other</MenuItem>
                            </Select>
                            <TextField
                                multiline
                                id="outlined-basic"
                                label="Record Details"
                                variant="outlined"
                                value={recordDetails}
                                onChange={(e) => setRecordDetails(e.target.value)}
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
