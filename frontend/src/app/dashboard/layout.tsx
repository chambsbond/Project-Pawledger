"use client"
import Header from "@/components/Header";
import { ArrowBack } from "@mui/icons-material";
import { Box, Button, Stack } from "@mui/material";
import { usePathname, useRouter } from 'next/navigation';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathName = usePathname();
    const router = useRouter();
    console.log(pathName);
    return (
        <Box height="100vh" display="flex" flexDirection="column">
            <Stack direction="column" display="flex">
                <Header></Header>
                {pathName !== "/dashboard" &&
                    <Button
                        startIcon={<ArrowBack />}
                        onClick={() => router.back()}>
                        Back
                    </Button>}
                {children}
            </Stack>
        </Box>
    );
}