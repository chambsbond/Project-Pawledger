"use client"
import Header from "@/components/Header";
import { ArrowBack } from "@mui/icons-material";
import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { ethers } from "ethers";
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import OrgFactoryContractAmoy from "../../../../blockchain/packages/hardhat/deployments/polygonAmoy/OrganizationFactory.json";
import OrgContractCompile from "../../../../blockchain/packages/hardhat/artifacts/contracts/organizationImpl/AnimalShelter.sol/AnimalShelter.json";
import { useUser } from "@alchemy/aa-alchemy/react";


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const orgFactoryAddress = OrgFactoryContractAmoy?.address;
    const pathName = usePathname();
    const router = useRouter();
    const user = useUser();
    const [orgName, setOrgName] = useState<string | undefined>();

    useEffect(() => {
        let provider = new ethers.JsonRpcProvider("https://rpc-amoy.polygon.technology/");
        const factoryContract = new ethers.Contract(orgFactoryAddress,
            OrgFactoryContractAmoy.abi, provider)

        const fetchData = async () => {
            const res = await factoryContract.getDeployedOrgs();
            console.log(await res)
            const orgContract = new ethers.Contract(res[0], OrgContractCompile.abi, provider);
            console.log(await orgContract.isOwner(user?.address));
            setOrgName(await orgContract._name());
        };

        fetchData();
    }, [pathName])

    return (
        <Box height="100vh" display="flex" flexDirection="column">
                <Stack direction="column" display="flex">
                    <Header orgName={orgName}></Header>
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