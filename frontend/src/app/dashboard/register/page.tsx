"use client"

import { memberShipSelector, orgSelectedIndexSelector, orgSelectedSelector } from "@/store/slices/OrgSlice"
import { useSendUserOperation, useSmartAccountClient } from "@alchemy/aa-alchemy/react"
import { Button, CircularProgress, Container, Grid, InputLabel, MenuItem, Paper, Select, Snackbar, Stack, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Address, encodeFunctionData } from "viem"
import OrgContractCompile from "../../../../../blockchain/packages/hardhat/artifacts/contracts/organizationImpl/AnimalShelter.sol/AnimalShelter.json";
import PetAmoy from "../../../../../blockchain/packages/hardhat/deployments/polygonAmoy/Pet.json";
import { ethers } from "ethers"
import Image from "next/image"
import { grey } from "@mui/material/colors"
const registreeOptions = ["Your Organization", "A different user", "No one"]

export default function RegisterPage() {
    const [registree, setRegistree] = useState<string>(registreeOptions[0]);
    const [open, setOpen] = useState(false);
    const [nftIndex, setNftIndex] = useState<BigInt>();
    const orgs = useSelector(memberShipSelector);
    const orgIndex = useSelector(orgSelectedIndexSelector);

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

    const onSubmitClick = async () => {
        let registreeAddress: string;

        //YourOrganization
        if (registree === registreeOptions[0]) {
            registreeAddress = orgs[orgIndex].address
        }
        //TODO : implement
        else if (registree === registreeOptions[1]) {
            registreeAddress = "0x0"
        }
        //No one
        else {
            registreeAddress = PetAmoy.address
        }


        const callData = encodeFunctionData({
            abi: OrgContractCompile.abi,
            functionName: "registerAnimal",
            args: [registreeAddress]
        });

        await sendUserOperation({
            uo: {
                target: orgs[orgIndex].address as Address,
                data: callData
            }
        })
    }

    const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    useEffect(() => {
        const displayIndex = async () => {
            const petAddress = PetAmoy?.address;
            const provider = new ethers.JsonRpcProvider("https://rpc-amoy.polygon.technology/");
            const registryContract = new ethers.Contract(petAddress,
                PetAmoy.abi, provider);

            setNftIndex((await registryContract.getNextId()) - BigInt(1));
            setOpen(true);
        }

        if(sendUserOperationResult)
            displayIndex();
    }, [sendUserOperationResult])

    useEffect(() => {

    }, [client])

    return (
        <Container>
            <Paper>
                <Stack padding={10} spacing={4}>
                    <Typography textAlign="center" variant="h3">Register Animal</Typography>
                    <Stack spacing={3}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <InputLabel>To whom should the animal be registered?</InputLabel>
                            <Select
                                sx={{ width: "45%" }}
                                defaultValue={"Your Organization"}
                                value={registree}
                                onChange={(e) => setRegistree(e.target.value)}
                            >
                                {registreeOptions.map((option, index) =>
                                    <MenuItem key={index} value={option}>{option}</MenuItem>
                                )}
                            </Select>
                        </Stack>
                        <Button
                            fullWidth
                            variant="contained"
                            onClick={() => onSubmitClick()}
                            disabled={isSendingUserOperation}>
                            {isSendingUserOperation ? <CircularProgress></CircularProgress>
                                : <Typography>Submit</Typography>}
                        </Button>
                        <Snackbar
                            open={open}
                            autoHideDuration={6000}
                            onClose={handleClose}
                            color={grey[400]}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Typography>{`Animal was minted at index: ${nftIndex}`}</Typography>
                                <Image src="/up_dog.png" alt="up_dog.png" width={46} height={46} />
                            </Stack>
                        </Snackbar>
                    </Stack>
                </Stack>
            </Paper>
        </Container>
    )
}
