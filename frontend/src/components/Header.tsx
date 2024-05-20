"use client";
import Image from 'next/image';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { Avatar, MenuItem, Select, Stack, Tooltip } from '@mui/material';
import { memberShipSelector, setOrg } from '@/store/slices/OrgSlice';
import { useDispatch, useSelector } from 'react-redux';


export default function Header() {
    const orgs = useSelector(memberShipSelector);
    const dispatch = useDispatch();

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
                                onChange={(event) => dispatch(setOrg(event.target.value as number))}
                                sx={{ color: "white", borderColor: "white" }}
                            >
                                {orgs.map((org, index) =>
                                    <MenuItem value={index} key={index}>{org.name}</MenuItem>
                                )}
                            </Select>
                        }
                    </Stack>
                    <Tooltip title="Open settings">
                        <IconButton sx={{ p: 0 }}>
                            <Avatar  />
                        </IconButton>
                    </Tooltip>
                </Stack>
            </Toolbar>
        </AppBar>
    );
}