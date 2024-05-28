"use client";
import Image from 'next/image';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { Avatar, Container, Menu, MenuItem, Select, Stack, Tooltip } from '@mui/material';
import { memberShipSelector, setSelectedOrgIndex } from '@/store/slices/OrgSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useAccount, useLogout, useUser } from '@alchemy/aa-alchemy/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';


export default function Header() {
    const orgs = useSelector(memberShipSelector);
    const dispatch = useDispatch();
    const router = useRouter();
    const { logout } = useLogout({
        onSuccess: () => {
            router.push('');
        },
        onError: (error) => {
            // [optional] Do something with the error
        },
        // [optional] ...additional mutationArgs
    });
    const { account, address, isLoadingAccount } = useAccount({
        type: "MultiOwnerModularAccount",
    });
    const user = useUser();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    useEffect(() => {        
        if (user != null && account != null && address) {
            
        } else {
            router.push('');
        } 
    }, [user, account, address])

    const handleSelectChange = (event : any) => {
        dispatch(setSelectedOrgIndex(event.target.value as number))
        router.push('/dashboard')
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

                        {orgs.length == 0 &&
                            <Typography
                                variant="h6"
                                noWrap
                                component="div"
                                sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}>
                                Pawledger
                            </Typography>
                        }
                        {orgs != undefined && orgs?.length == 1 &&
                            <Typography
                                variant="h6"
                                noWrap
                                component="div"
                                sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}>
                                {orgs[0].name}
                            </Typography>
                        }
                        {orgs != undefined && orgs?.length > 1 &&
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
                            <MenuItem onClick={() => logout}>Logout</MenuItem>
                        </Menu>
                    </Stack>
                </Stack>
            </Toolbar>
        </AppBar>
    );
}