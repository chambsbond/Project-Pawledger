"use client"

import IFeature from "@/app/dashboard/IFeature"
import { Card, CardActionArea, Stack, Typography } from "@mui/material"
import Image from "next/image"
import { useRouter } from "next/navigation"

export const HomeTile = ({ feature }: { feature: IFeature | undefined }) => {
    const router = useRouter();

    return (
        <Card>
            <CardActionArea onClick={() => router.push(`/dashboard/${feature?.name}`)}>
                <Stack
                    minHeight="40vh"
                    direction="column"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    spacing={1}>
                    <Typography gutterBottom variant="h3" component="div">
                        {feature?.displayName}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                        {feature?.description}
                    </Typography>
                    {feature?.image &&
                        <Image
                            src={feature.image}
                            alt="tile alt"
                            width={150}
                            height={150} />}
                </Stack>
            </CardActionArea>
        </Card>
    )
}