"use client";
import { Button, Grid, Stack, Typography } from "@mui/material";
import { HomeTile } from "./HomeTile";
import IFeature from "@/app/dashboard/IFeature";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";


const features: IFeature[] = [
    {
        displayName: "Register",
        name: "register",
        description: "Register an animal",
        scope: ["Animal.Write"],
        image: "/managerDog.png"
    },
    {
        displayName: "Animal Found",
        name: "foundAnimal",
        description: "You recovered an animal",
        scope: ["Animal.Read"],
        image: "/catSleuth.png"
    },
    {
        displayName: "Adopt Animal",
        name: "adopt",
        description: "Transfer ownership of an animal",
        scope: ["Animal.Read", "Animal.Write", "Chart.Write"],
        image: "/adopt.png"
    },
    {
        displayName: "Charting",
        name: "charting",
        description: "Create a health record for an animal",
        scope: ["Animal.Read", "Animal.Write", "Chart.Write"],
        image: "/drshib.png"
    },
    {
        displayName: "Org Management",
        name: "organization/management",
        description: "Manage registered organizations",
        scope: ["Org.Validity.Write"],
        image: "/drshib.png"
    },
    {
        displayName: "Your Pets Records",
        name: "charting/viewRecord",
        description: "View Your Pets Records",
        scope: ["Animal.0.Read",],
        image: "/drshib.png"
    },
]

export const HomeGrid = ({ scopes }: { scopes: string[] }) => {
    const router = useRouter();

    return (
        <Stack minHeight="100vh" justifyContent="center" alignItems="center" display="flex">
            {scopes.length == 0 &&
                <Stack spacing={3} justifyContent="center" alignItems="center" display="flex">
                    <Image
                        src="/down_dog.png"
                        alt={"oops updog"}
                        style={{ WebkitFilter: "grayscale(100%)" }}
                        width={60}
                        height={60}
                    />
                    <Typography variant="h5" color="gray">Oops it looks like you are not apart of an organization!
                        Either create one or join one.</Typography>
                    <Button variant="contained" onClick={() => router.push("/dashboard/organization/new")}>Create Organization</Button>
                </Stack>}
            <Grid container
                spacing={{ xs: 2, md: 3 }}
                columns={{ xs: 4, sm: 8, md: 12 }}
                padding="5vh">
                {features.map((feature, index) => <React.Fragment key={index}>
                    {feature.scope.every(item => scopes.includes(item)) &&
                        <Grid item sm={4} md={4}>
                            <HomeTile feature={feature} />
                        </Grid>}
                </React.Fragment>
                )}
            </Grid>
        </Stack>
    )
}