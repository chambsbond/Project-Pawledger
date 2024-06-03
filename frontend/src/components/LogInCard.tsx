"use client";

import { useAccount, useAuthenticate, useSmartAccountClient, useUser } from "@alchemy/aa-alchemy/react";
import { Box, Button, Card, CircularProgress, Paper, Stack, TextField, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import Image from 'next/image';
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { addPublicKey, fetchPublicKey } from "@/store/slices/OrgSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { RootState } from "@/store/store";

export const LogInCard = () => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const publicKey = useAppSelector((state: RootState) => state.orgContract.publicKey);
  const publicKeyIsLoading = useAppSelector((state: RootState) => state.orgContract.publicKeyIsLoading);
  const [email, setEmail] = useState<string>("");
  const { authenticate, isPending: isAuthenticatingUser } = useAuthenticate();
  const { client, isLoadingClient } = useSmartAccountClient({
    type: "MultiOwnerModularAccount",
    gasManagerConfig: {
      policyId: process.env.NEXT_PUBLIC_ALCHEMY_GAS_MANAGER_POLICY_ID!,
    },
    opts: {
      txMaxRetries: 20,
    },
  });

  const { isLoadingAccount, } = useAccount({
    type: "MultiOwnerModularAccount", // alternatively pass in "MultiOwnerModularAccount",
    accountParams: {}, // optional param for overriding any account specific properties
    skipCreate: true, // optional param to skip creating the account
    onSuccess: (account) => {
      // [optional] Do something with the account
    },
    onError: (error) => {
      // [optional] Do something with the error
      console.log(error);
    },
  });

  const user = useUser();
  const router = useRouter();

  useEffect(() => {
    if (client != null && !isLoading) {
      dispatch(fetchPublicKey(client.account.publicKey));
      setIsLoading(true);
    }

    if(user != null && client != null && publicKey && publicKey != "" && !publicKeyIsLoading) {
      router.push('/dashboard');
    }
    else if (user != null && client != null && (publicKey == "" || !publicKey) && !publicKeyIsLoading) {
      router.push('/signup')
    }

  }, [client, publicKey, publicKeyIsLoading])

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
                <Typography fontSize={30} variant="h1" sx={{ fontWeight: "bold" }}>Welcome To Pawledger!</Typography>
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
