"use client"
import { Org } from "@/store/slices/OrgSlice";
import { RootState } from "@/store/store";
import { useAccount, useSendUserOperation, useSmartAccountClient, useUser } from "@alchemy/aa-alchemy/react";
import { Button, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Address, encodeFunctionData } from "viem";
import OrgRegistryAmoy from "../../../../../../blockchain/packages/hardhat/deployments/polygonAmoy/OrganizationRegistry.json";

export default function OrgManagementPage() {
    const router = useRouter();
    const user = useUser();
    const orgs = useSelector<RootState>(state => state.orgContract.orgs) as Org[];

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
        console.log(orgs[orgIndex].address);
        const callData = encodeFunctionData({
            abi: OrgRegistryAmoy.abi,
            functionName: "setOrganizationValidity",
            args: [orgs[orgIndex].address, true]
        });
    
        await sendUserOperation({
            uo: {
                target: OrgRegistryAmoy.address as Address,
                data: callData
            }
        })
    }


    useEffect(() =>{

    }, [orgs, sendUserOperationResult])

    return (
        <Stack direction="column" padding={5} spacing={2}>
            <Button 
                variant="contained"
                sx={{width: "25%"}}
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
                                <TableCell>{String(org.validated)}</TableCell>
                                <TableCell><Button variant="contained" onClick={(event) => validateOrg(index)}>Validate</Button></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Stack>
    );
}