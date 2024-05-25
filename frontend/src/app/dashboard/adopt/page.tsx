"use client"

import { useSendUserOperation, useSmartAccountClient } from "@alchemy/aa-alchemy/react";
import { Container, Paper, Stack, Typography, Checkbox, FormGroup, FormControlLabel, TextField, Button } from "@mui/material";
import { useState } from "react";
import { Address, encodeFunctionData } from "viem";

import OrgContractCompile from "../../../../../blockchain/packages/hardhat/artifacts/contracts/organizationImpl/AnimalShelter.sol/AnimalShelter.json";
import { useSelector } from "react-redux";
import { memberShipSelector, Org, orgSelectedIndexSelector } from "@/store/slices/OrgSlice";
import { useAppSelector } from "@/store/hooks";
import { RootState } from "@/store/store";

export default function adoptAnimal() {    
    const orgs = useAppSelector((state: RootState) => state.orgContract.orgs) as Org[];
    const orgIndex = useAppSelector((state: RootState) => state.orgContract.selectedOrg) as number;
    const [tokenId, setTokenId] = useState<BigInt | undefined>();
    const [adopteeAddress, setAdopteeAddress] = useState<string>();
    
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


    
    const onSubmitClick = async () => {
        console.log(orgs[orgIndex]);
        const callData = encodeFunctionData({
            abi: OrgContractCompile.abi,
            functionName: "adoptAnimal",
            args: [tokenId, adopteeAddress, 10000]
        });

        sendUserOperation({
            uo: {
                target: orgs[orgIndex].address as Address,
                data: callData
            }
        })
    }

    return (
        <Container>
            <Paper>
                <Stack padding={10} spacing={4}>
                    <Typography textAlign="center" variant="h3">Adopt Animal</Typography>
                    <FormGroup>
                        <Stack padding={5} spacing={3}>
                            <TextField required label="PET Id" onChange={(e) => setTokenId((e.target.value as unknown) as BigInt)}></TextField>
                            <TextField required label="Adoptee's Address" onChange={(e) => setAdopteeAddress(e.target.value)}></TextField>
                            <Button variant="contained" onClick={onSubmitClick}>Submit</Button>
                        </Stack>
                    </FormGroup>
                </Stack>
            </Paper>
        </Container>);
}