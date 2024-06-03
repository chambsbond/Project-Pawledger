"use client";

import { useSendUserOperation, useSmartAccountClient, useUser } from "@alchemy/aa-alchemy/react";
import { useEffect, useState } from "react";
import { Button, CircularProgress, Container, FormGroup, MenuItem, Paper, Select, Stack, TextField, Typography } from "@mui/material";

import OrgContractCompile from "../../../../../generated/contracts/organizationImpl/AnimalShelter.sol/AnimalShelter.json";

//look into pet.json for needed contract functions
import PetAmoy from "../../../../../generated/deployments/polygonAmoy/Pet.json";

import EthCrypto, { publicKey } from 'eth-crypto';
import { useAppSelector } from "@/store/hooks";
import { RootState } from "@/store/store";
import { Address, encodeFunctionData } from "viem";
import { ethers } from "ethers";
import { useSelector } from "react-redux";
import { memberShipSelector, orgSelectedIndexSelector } from "@/store/slices/OrgSlice";
import axios from "axios";

export default function ChartingPage() {

    const pawLedgerPublicKey = "0xaecf7df15a3a750fb293df93cecb6bc8b5206da52298cf18a9b4be7b7519e97dd99ce7ac05474f68ee44d5bd121f5a375fb71340ca30eb6d546668058025d99e";
    const backendConfig = { headers: { 'Access-Control-Allow-Origin': '*', "Content-Type": "application/json" } };
    
    const loggedInUserPublicKey = useAppSelector((state: RootState) => state.orgContract.publicKey);
    const orgIndex = useAppSelector((state: RootState) => state.orgContract.selectedOrg);
    const orgs = useAppSelector((state: RootState) => state.orgContract.orgs);
    const user = useUser();
    const [recordDetails, setRecordDetails] = useState<string>("");
    const [recordType, setRecordType] = useState<string>("");
    const [petId, setPetId] = useState<BigInt | undefined>();
    
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
        const orgContract = new ethers.Contract(orgs[orgIndex].address, OrgContractCompile.abi, provider);
        const petOwnerAddress = await petContract.ownerOf(petId);

        const petOwnerAccount = await axios.get(`https://eus-pawledger-backend.azurewebsites.net/api/account/${petOwnerAddress}`, backendConfig);
        const encryptedPayloadList = [];
        encryptedPayloadList.push(await encryptMedicalData(medicalDataPlainText, petOwnerAccount?.data?.publicKey));
        encryptedPayloadList.push(await encryptMedicalData(medicalDataPlainText, pawLedgerPublicKey));
        encryptedPayloadList.push(await encryptMedicalData(medicalDataPlainText, loggedInUserPublicKey!));
        console.log([petOwnerAddress, JSON.stringify(encryptedPayloadList), petId, ethers.toUtf8Bytes("1")]);
        const requestId = Math.round((Math.random() * 100));

        const callData = encodeFunctionData({
            abi: OrgContractCompile.abi,
            functionName: "sendMedicalInfo",
            args: [petOwnerAddress, JSON.stringify(encryptedPayloadList), petId, ethers.encodeBytes32String(requestId.toString())]
        });

        await sendUserOperation({
            uo: {
                target: orgs[orgIndex].address as Address,
                data: callData
            }
        })
    }

    async function encryptMedicalData(plainTextData: any, owner: string) {
        const encrypt = await EthCrypto.encryptWithPublicKey(
            EthCrypto.publicKey.decompress(owner.substring(2)),
            JSON.stringify(plainTextData)
        );

        return encrypt;
    }

    useEffect(() => {
        if(isSendUserOperationError)
         console.log("error", isSendUserOperationError);

    }, [isSendUserOperationError, sendUserOperationResult]);

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
