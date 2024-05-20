"use client"
import { fetchOrgInfo, isOrgRegistryAdmin, Org, setOrg } from "@/store/slices/OrgSlice";
import { RootState } from "@/store/store";
import { useSendUserOperation, useSmartAccountClient, useUser } from "@alchemy/aa-alchemy/react";
import { Button, CircularProgress, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Address, encodeFunctionData } from "viem";
import OrgRegistryAmoy from "../../../../../../blockchain/packages/hardhat/deployments/polygonAmoy/OrganizationRegistry.json";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

export default function OrgManagementPage() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const orgs = useAppSelector((state: RootState) => state.orgContract.orgs) as Org[];
    const [updatedOrgIndex, setUpdatedOrgIndex] = useState<number | undefined>();

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

    const validateOrg = async (orgIndex: number) => {
        const callData = encodeFunctionData({
            abi: OrgRegistryAmoy.abi,
            functionName: "setOrganizationValidity",
            args: [orgs[orgIndex].address, true]
        });
        setUpdatedOrgIndex(orgIndex);
        await sendUserOperation({
            uo: {
                target: OrgRegistryAmoy.address as Address,
                data: callData
            }
        })
    }

    useEffect(() => {
        const fetchUpdate = async () => {
            if (client?.account.address) {
                await dispatch(fetchOrgInfo(client?.account.address))
            }
        }

        if (sendUserOperationResult)
            fetchUpdate();
    }, [sendUserOperationResult])

    return (
        <Stack direction="column" padding={5} spacing={2}>
            <Button
                variant="contained"
                sx={{ width: "25%" }}
                onClick={() => router.push("/dashboard/organization/new")}>
                Add Organization
            </Button>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Address</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Validated</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orgs.map((org, index) => (
                            <TableRow
                                key={index}>
                                <TableCell>{org?.address}</TableCell>
                                <TableCell>{org.name}</TableCell>
                                <TableCell>{isSendingUserOperation && index == updatedOrgIndex
                                    ? <CircularProgress></CircularProgress> : String(org.validated)}
                                </TableCell>
                                <TableCell>
                                    {!org.validated &&
                                        <Button
                                            variant="contained"
                                            onClick={async () => { await validateOrg(index) }}
                                            disabled={isSendingUserOperation}>
                                            Validate
                                        </Button>
                                    }
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Stack>
    );
}