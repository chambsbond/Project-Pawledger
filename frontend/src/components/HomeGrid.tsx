"use client";

import { Grid, Stack } from "@mui/material";
import { HomeTile } from "./HomeTile";
import IFeature from "@/pages/Features/IFeature";
import { faker } from "@faker-js/faker"


const testFeature: IFeature = {
    displayName: "Register an Animal",
    name: "registerAnimal",
    description: "Click here to register an animal",
    scope: "Register.Write",
    image: "/up_dog.png"
}

export const HomeGrid = ({ scopes }: { scopes: string[] }) => {

    return (
        <Grid container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
            padding="5vh">
            {scopes.map((scope, index) =>
                <Grid item sm={4} md={4} key={index}>
                    <HomeTile feature={testFeature} />
                </Grid>
            )
            }
        </Grid>
    );
}