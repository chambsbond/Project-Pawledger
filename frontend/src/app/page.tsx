"use client";

import { LogInCard } from "@/components/LogInCard";
import { ProfileCard } from "@/components/ProfileCard";
import { useAccount, useUser } from "@alchemy/aa-alchemy/react";
import styles from "./page.module.css"
import Stack from '@mui/material/Stack';
import Header from "@/components/Header"
import Head from "next/head";
import { Box, Card, CircularProgress, Container, CssBaseline } from "@mui/material";

export default function Home() {
  const { account, address, isLoadingAccount } = useAccount({
    type: "MultiOwnerModularAccount",
  });
  const user = useUser();

  return (
    <>
      <CssBaseline />
      <Container maxWidth={false} disableGutters>

        <Box height="100vh" display="flex" flexDirection="column">
          {/*the account might be reconnecting, in which case the account is null, but we have the address */}
          {user != null && account != null && address ? (
            <Stack direction="column" display="flex">
              <Header />
            </Stack>
          ) : (
            <LogInCard />
          )}
        </Box>
      </Container>
    </>
  );
}
