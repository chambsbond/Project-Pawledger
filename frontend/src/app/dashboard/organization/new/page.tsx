"use client"
import { useAccount, useSendUserOperation, useSmartAccountClient, useUser } from "@alchemy/aa-alchemy/react";
import { Button, CircularProgress, Container, FormGroup, NativeSelect, Paper, Select, Stack, TextField, Typography } from "@mui/material";

import OrgFactoryContractAmoy from "../../../../../../blockchain/packages/hardhat/deployments/polygonAmoy/OrganizationFactory.json";
//import OrgFactoryContractLocal from "../../../../../../blockchain/packages/hardhat/deployments/localhost/OrganizationFactory.json";
import { Address, encodeFunctionData } from "viem";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { addOrg, fetchOrgInfo } from "@/store/slices/OrgSlice";
import { useAppDispatch } from "@/store/hooks";

export default function CreateOrg() {
    const orgFactoryAddress = OrgFactoryContractAmoy?.address;
    const user = useUser();
    const router = useRouter();
    const [orgType, setOrgType] = useState<number>(0);
    const [orgName, setOrgName] = useState<string | null>(null);
    const dispatch = useAppDispatch();

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

    const createOrg = async () => {
        const callData = encodeFunctionData({
            abi: OrgFactoryContractAmoy.abi,
            functionName: "createOrganization",
            args: [orgType, orgName, client?.account.address]
        });

        await sendUserOperation({
            uo: {
                target: orgFactoryAddress as Address,
                data: callData
            }
        })
    }

    useEffect(() => {
        console.log("success", sendUserOperationResult);
        if (client?.account.address) {
            if (sendUserOperationResult) {
                dispatch(fetchOrgInfo(client?.account.address));
                router.back();
            }
        }
    }, [sendUserOperationResult])

    useEffect(() => {
        console.log("error", isSendUserOperationError);
    }, [isSendUserOperationError]);

    return (
        <Container>
            <Paper>
                <Stack padding={10} spacing={4}>
                    <Typography textAlign="center" variant="h3">New Organization</Typography>
                    <FormGroup>
                        <Stack spacing={2}>
                            <TextField
                                required
                                id="org-name"
                                label="Your Organizations Name"
                                onChange={(e) => setOrgName(e.target.value)}
                                disabled={isSendingUserOperation} />
                            <Select
                                required
                                onChange={(e) => setOrgType(e.target.value as number)}
                                defaultValue={0}
                                id="org-type"
                                disabled={isSendingUserOperation}>
                                <option value={0}>Animal Shelter</option>
                                <option value={1}>Veterinarian</option>
                                <option value={2}>Groomer</option>
                                <option value={3}>Daycare</option>
                            </Select>
                            <Button
                                variant="contained"
                                onClick={async () => { await createOrg() }}
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