"use client"

import { useAccount, useSendUserOperation, useSmartAccountClient, useUser } from "@alchemy/aa-alchemy/react";
import { useEffect, useState } from "react";
import { useAppDispatch } from "@/store/hooks";
import { useRouter } from "next/navigation";
import { Button, CircularProgress, Container, FormGroup, NativeSelect, Paper, Select, Stack, TextField, Typography } from "@mui/material";
import { Address, encodeFunctionData } from "viem";

//look into pet.json for needed contract functions
import PetContractAmoy from "../../../../../blockchain/packages/hardhat/deployments/polygonAmoy/Pet.json";



export default function ChartingPage() {
    const petContractAddress = PetContractAmoy?.address;
    const user = useUser();
    const router = useRouter();
    const [recordType, setRecordType] = useState<number>(0);
    const [orgName, setOrgName] = useState<string | null>(null);
    const dispatch = useAppDispatch();
    const [fields, setFields] = useState<any>(null);
    const [userText, setUserText] = useState<string>('');

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
        // //Change callData to use new contract function for adding medical record to pet
        // const callData = encodeFunctionData({
        //     abi: PetContractAmoy.abi,
        //     functionName: "createPetRecord",
        //     args: [pet, recordType, recordInfo, client?.account.address]
        // });
        //
        // await sendUserOperation({
        //     uo: {
        //         target: petContractAddress as Address,
        //         data: callData
        //     }
        // })
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
                                id="submitter-name"
                                label=""
                                disabled={isSendingUserOperation} />
                            <Select
                                required
                                onChange={(e) => setRecordType(e.target.value as number)}
                                defaultValue={0}
                                id="org-type"
                                disabled={isSendingUserOperation}>
                                <option value={0}>Vaccine</option>
                                <option value={1}>Procedure</option>
                                <option value={2}>Checkup</option>
                                <option value={3}>Other</option>
                            </Select>
                            <TextField
                              id="outlined-basic"
                              label="Record Details"
                              variant="outlined"
                              value={userText}
                              onChange={(e) => setUserText(e.target.value)}
                            />
                            <Button
                                variant="contained"
                                onClick={async () => { await createPetRecord() }}
                                disabled={isSendingUserOperation}>
                                {isSendingUserOperation ? <CircularProgress /> : <Typography>Submit</Typography>}
                            </Button>
                        </Stack>
                    </FormGroup>
                </Stack>
            </Paper>
        </Container>
    )
}
