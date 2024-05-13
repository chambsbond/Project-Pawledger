"use client";

import { useAccount, useAuthenticate } from "@alchemy/aa-alchemy/react";
import { Box, Button, Card, CircularProgress, Paper, Stack, TextField, Typography } from "@mui/material";
import { useCallback, useState } from "react";
import Image from 'next/image';

export const LogInCard = () => {
  const [email, setEmail] = useState<string>("");

  const { authenticate, isPending: isAuthenticatingUser } = useAuthenticate();
  const { isLoadingAccount } = useAccount({
    type: "MultiOwnerModularAccount",
    skipCreate: true,
  });

  return (
    <Box display="flex" height="100vh" flexDirection="column" justifyContent="center" alignItems="center" >
      <Box width="25%">
        <Card>
          <Paper>
            <Stack direction="column" padding="10%" spacing={4}>
              <Stack direction="column" alignItems="center" spacing={2}>
                <Image
                  src="/logo-back-invis.png"
                  alt="pawledgerlogo"
                  height={100}
                  width={125}
                />
                <Typography fontSize={30} variant="h1" sx={{fontWeight:"bold"}}>Welcome To Pawledger!</Typography>
              </Stack>
              {isAuthenticatingUser || isLoadingAccount ?
                <Stack direction="column" alignItems="center" spacing={3}>
                  <CircularProgress />
                  <Typography>Check for an email from us to finish logging in</Typography>
                </Stack>
                :
                <>
                  <TextField id="login-field" label="Email" variant="outlined" type="email" onChange={(e) => setEmail(e.target.value)} />
                  <Button variant="contained" onClick={() => authenticate({ type: "email", email })}>Log In</Button>
                </>
              }
            </Stack>
          </Paper>
        </Card>
      </Box>
    </Box>
  );
};
