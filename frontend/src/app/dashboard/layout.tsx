"use client"
import Header from "@/components/Header";
import { ArrowBack } from "@mui/icons-material";
import { Box, Button, Stack, Typography } from "@mui/material";
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from "react";
import { useUser } from "@alchemy/aa-alchemy/react";
import { fetchOrgInfo, fetchIsOrgRegistryAdmin } from "@/store/slices/OrgSlice";
import { useAppDispatch } from "@/store/hooks";


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathName = usePathname();
    const router = useRouter();
    const user = useUser();
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(fetchOrgInfo(user));
        dispatch(fetchIsOrgRegistryAdmin(user));
    }, [dispatch])
    
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