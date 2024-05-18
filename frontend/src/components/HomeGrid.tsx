"use client";

import { Grid, Stack } from "@mui/material";
import { HomeTile } from "./HomeTile";
import IFeature from "@/app/dashboard/IFeature";
import { faker } from "@faker-js/faker"
import React from "react";


const features: IFeature[] = [
    {
        displayName: "Register",
        name: "register",
        description: "Click here to register an animal",
        scope: ["Animal.Write"],
        image: "/up_dog.png"
    },
    {
        displayName: "Lookup",
        name: "lookup",
        description: "Click here to peep at animals details",
        scope: ["Animal.Read"],
        image: "/catSleuth.png"
    },
    {
        displayName: "Charting",
        name: "charting",
        description: "Click here to peep at animals details",
        scope: ["Animal.Read", "Animal.Write", "Chart.Write"],
        image: "/drshib.png"
    },

]

export const HomeGrid = ({ scopes }: { scopes: string[] }) => {


    return (
        <Grid container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
            padding="5vh">
            {features.map((feature, index) => 
                <React.Fragment key={index}>
                {
                    feature.scope.every(item => scopes.includes(item)) &&
                    <Grid item sm={4} md={4}>
                        <HomeTile feature={feature} />
                    </Grid>
                }
                </React.Fragment>
            )
            }
        </Grid>
    );
}