"use client"
import Header from "@/components/Header";
import { ArrowBack } from "@mui/icons-material";
import { Box, Button, Stack, Typography } from "@mui/material";
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from "react";
import { useSmartAccountClient } from "@alchemy/aa-alchemy/react";
import { fetchOrgInfo, isOrgRegistryAdmin } from "@/store/slices/OrgSlice";
import { useAppDispatch } from "@/store/hooks";


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathName = usePathname();
    const router = useRouter();
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

    useEffect(() => {
        if (client?.account?.address) {
            dispatch(fetchOrgInfo(client?.account?.address));
            dispatch(isOrgRegistryAdmin(client?.account?.address));
        }
    }, [client, dispatch])

    return (
        <Box height="100vh" display="flex" flexDirection="column">
            <Stack direction="column" display="flex">
                <Header></Header>
                {pathName !== "/dashboard" &&
                    <Box padding={3} style={{ fontSize: '2rem' }} >
                        <Button
                            style={{ fontSize: 'inherit' }}
                            onClick={() => router.back()}>
                            <ArrowBack fontSize="inherit" />
                            <Typography
                                padding={1}
                                variant="button"
                                display="block"
                                fontSize="inherit">
                                Back
                            </Typography>
                        </Button>
                    </Box>}
                {children}
            </Stack>
        </Box>
    );
}