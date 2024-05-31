"use client";
import { useSmartAccountClient, useUser } from "@alchemy/aa-alchemy/react";
import { Button, CircularProgress, Container, Paper, Stack, TextField, Typography } from "@mui/material"
import { useEffect, useState } from "react";

export default function WalletFetcher() {
    const user = useUser();
    const [mnemonic, setMnemonic] = useState<string>("");
    const TurnkeyExportWalletContainerId = "turnkey-export-wallet-container-id";
    const TurnkeyExportWalletElementId = "turnkey-export-wallet-element-id";
    const iframeCss = `
        iframe {
            box-sizing: border-box;
            width: 100%;
            height: 50px;
            border-radius: 8px;
            border-width: 1px;
            border-style: solid;
            border-color: rgba(216, 219, 227, 1);
            padding: 0px;
        }
        `;

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
        const method = async () => {
            if (client) {
                client?.account.getSigner().exportWallet({
                    iframeContainerId: TurnkeyExportWalletContainerId,
                    iframeElementId: TurnkeyExportWalletElementId
                }).catch((e) => { });//expected - ignore error

            }
        }

        method();
    }, [client, user]);
    return (
        <Container>
            <Paper>
                <Stack padding={10} spacing={4}>
                    <Typography textAlign="center" variant="h3">First Time Registration</Typography>
                    <Stack spacing={1}>
                        <Typography variant="h5" fontWeight="bold" gutterBottom>Seed Phrase</Typography>
                        <Typography variant="h6" color="text.secondary">Copy your seed phrase into the seed phrase text field in
                            order to encrypt the medical history</Typography>
                        <div
                            className="w-full"
                            style={{ display: "block" }}
                            id={TurnkeyExportWalletContainerId}
                        >
                            <style>{iframeCss}</style>
                        </div>
                        <TextField
                            required
                            id="submitter-name"
                            label="Paste Seed Phrase"
                            value={mnemonic}
                            onChange={(e) => setMnemonic(e.target.value)}>
                        </TextField>
                    </Stack>
                    <br></br>
                    <Button
                        variant="contained">
                        Submit
                    </Button>

                </Stack>
            </Paper>
        </Container >
    )
}