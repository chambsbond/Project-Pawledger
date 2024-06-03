"use client";
import Image from 'next/image';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { Avatar, Container, FormControlLabel, Menu, MenuItem, Select, Stack, Switch, Tooltip } from '@mui/material';
import { memberShipSelector, setPersonalAccount, setSelectedOrgIndex } from '@/store/slices/OrgSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useAccount, useLogout, useSmartAccountClient, useUser } from '@alchemy/aa-alchemy/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import { RootState } from '@/store/store';

export default function Header() {
    const orgs = useSelector(memberShipSelector);
    const isPersonalAccount = useSelector((state: RootState) => state.orgContract.isPersonalAccount);
    const dispatch = useDispatch();
    const router = useRouter();
    const user = useUser();
    const { isLoadingAccount, account } = useAccount({
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
    const { logout, isLoggingOut } = useLogout({
        onSuccess: () => {
            console.log('succesfully logged out')
            router.push('/');
        },
        onError: (error: any) => {
            // [optional] Do something with the error
            console.log("error logging out", error)
        },
        // [optional] ...additional mutationArgs
    });
    const { client, isLoadingClient } = useSmartAccountClient({
        type: "MultiOwnerModularAccount",
        gasManagerConfig: {
            policyId: process.env.NEXT_PUBLIC_ALCHEMY_GAS_MANAGER_POLICY_ID!,
        },
        opts: {
            txMaxRetries: 20,
        },
    });
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    useEffect(() => {
        if (!user || account == null && !isLoadingClient && !isLoadingAccount) {
            router.push('/');
        }
    }, [isLoadingAccount, isLoadingClient, client, user])

    const handleSelectChange = (event: any) => {
        dispatch(setSelectedOrgIndex(event.target.value as number))
        router.push('/dashboard')
    }

    const handleAccountSwitch = (event: any) => {
        dispatch(setPersonalAccount(event.target.checked as boolean));
        router.push('/dashboard');
    }

    return (
        <AppBar position="static">
            <Toolbar>
                <Stack direction="row" alignItems="center" justifyContent="space-between" minWidth="100%">
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Image
                            src="/logo-back-invis.png"
                            height={40}
                            width={55}
                            alt="pawledger logo"
                        />
                        {isPersonalAccount &&
                            <Typography
                                variant="h6"
                                noWrap
                                component="div"
                                sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}>
                                Welcome {user?.email}
                            </Typography>
                        }
                        {orgs.length == 0 && !isPersonalAccount &&
                            <Typography
                                variant="h6"
                                noWrap
                                component="div"
                                sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}>
                                Pawledger
                            </Typography>
                        }
                        {orgs != undefined && orgs?.length == 1 && !isPersonalAccount &&
                            <Typography
                                variant="h6"
                                noWrap
                                component="div"
                                sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}>
                                {orgs[0].name}
                            </Typography>
                        }
                        {orgs != undefined && orgs?.length > 1 && !isPersonalAccount &&
                            <Select
                                defaultValue={0}
                                onChange={(event) => handleSelectChange(event)}
                                sx={{ color: "white", borderColor: "white" }}
                            >
                                {orgs.map((org, index) =>
                                    <MenuItem value={index} key={index}>{org.name}</MenuItem>
                                )}
                            </Select>
                        }
                    </Stack>
                    <Stack>
                        <IconButton sx={{ p: 0 }} onClick={handleClick}>
                            <Avatar />
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                        >
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={isPersonalAccount}
                                        sx={{ m: 1 }}
                                        onClick={(e) => handleAccountSwitch(e)}
                                    />}

                                label="Personal Account">
                            </FormControlLabel>
                            <MenuItem onClick={() => logout()}>Logout</MenuItem>
                        </Menu>
                    </Stack>
                </Stack>
            </Toolbar>
        </AppBar>
    );
}