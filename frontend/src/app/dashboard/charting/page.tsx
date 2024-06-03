"use client";

import { useSendUserOperation, useSmartAccountClient, useUser } from "@alchemy/aa-alchemy/react";
import { useEffect } from "react";
import { Button, CircularProgress, Container, FormGroup, MenuItem, Paper, Select, Stack, TextField, Typography } from "@mui/material";
import { useRouter } from 'next/navigation';

export default function ChartingPage() {
    const router = useRouter();
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

    useEffect(() => {
        console.log("error", isSendUserOperationError);
    }, [isSendUserOperationError]);

    return (
        <Container>
            <Paper>
                <Stack padding={10} spacing={4}>
                    <Typography textAlign="center" variant="h3">Animal Medical Records</Typography>
                    <FormGroup>
                        <Stack spacing={2}>
                            <Button
                                variant="contained"
                                onClick={() => { router.push("charting/addRecord") }}
                                disabled={isSendingUserOperation}>
                                {isSendingUserOperation ? <CircularProgress /> : <Typography>Add Record</Typography>}
                            </Button>
                            <Button
                                variant="contained"
                                onClick={() => { router.push("charting/viewRecord") }}
                                disabled={isSendingUserOperation}>
                                {isSendingUserOperation ? <CircularProgress /> : <Typography>View Record</Typography>}
                            </Button>
                        </Stack>
                    </FormGroup>
                </Stack>
            </Paper>
        </Container >
    )
}
