"use client"

import { useSendUserOperation, useSmartAccountClient } from "@alchemy/aa-alchemy/react";
import { Container, Paper, Stack, Typography, Checkbox, FormGroup, FormControlLabel, TextField, Button } from "@mui/material";
import { useState } from "react";
import { Address, encodeFunctionData } from "viem";

import OrgContractCompile from "../../../../generated/contracts/organizationImpl/AnimalShelter.sol/AnimalShelter.json";

import { useSelector } from "react-redux";
import { memberShipSelector, Org, orgSelectedIndexSelector } from "@/store/slices/OrgSlice";
import { useAppSelector } from "@/store/hooks";
import { RootState } from "@/store/store";

export default function AdoptAnimal() {    
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
            args: [tokenId, adopteeAddress, "95ac1fbdf77cbe075bc34368543a2bd0c5cf92f7832eedfb0e40f03ff4e279e2d3cbdd05b633251a10df3229ba095b551f4b1b725c75c2c2e5231bc8f0c00828", 10000]
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