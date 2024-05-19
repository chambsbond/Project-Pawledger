import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit'


import OrgFactoryContractAmoy from "../../../../blockchain/packages/hardhat/deployments/polygonAmoy/OrganizationFactory.json";
import OrgContractCompile from "../../../../blockchain/packages/hardhat/artifacts/contracts/organizationImpl/AnimalShelter.sol/AnimalShelter.json";
import OrgRegistryAmoy from "../../../../blockchain/packages/hardhat/deployments/polygonAmoy/OrganizationRegistry.json";
import { ethers } from 'ethers';
import { UseUserResult } from '@alchemy/aa-alchemy/react';
import { RootState } from '../store';


export type Roles = "Member" | "Owner" | "Unaffiliated";

export enum OrgType {
    AnimalShelter = 0,
    Registry = 1,
}

export interface Org {
    type: OrgType,
    name: string,
    role: Roles,
    address: string
}


export interface OrgState {
    orgs: Org[],
    selectedOrg: number,
    registryAdmin: boolean
}

const initialState: OrgState = {
    orgs: [],
    selectedOrg: 0,
    registryAdmin: false
}


export const fetchOrgInfo = createAsyncThunk(
    'orgs/membership',
    async (user: UseUserResult) => {
        const orgFactoryAddress = OrgFactoryContractAmoy?.address;
        const provider = new ethers.JsonRpcProvider("https://rpc-amoy.polygon.technology/");
        const factoryContract = new ethers.Contract(orgFactoryAddress,
            OrgFactoryContractAmoy.abi, provider)

        ///res = {
        ///    "0":"0x0",
        ///    "1":"0x0",
        ///    "2":"0x0"
        ///}        
        const res = await factoryContract.getDeployedOrgs();

        const orgContracts = Object.values(res) as string[];
        let orgMembership: Org[] = [];

        for (var org of orgContracts) {
            const orgContract = new ethers.Contract(org, OrgContractCompile.abi, provider);
            let role: Roles = "Unaffiliated";
            const isOwner = await orgContract.isOwner(user?.address);
            const isMember = await orgContract.isEmployee(user?.address);

            if(isOwner)
                role = "Owner"

            if(isMember)
                role = "Member"

            orgMembership.push({
                name: await orgContract._name(),
                role: role,
                type: OrgType.AnimalShelter,
                address: org
            } as Org);
        }
        return orgMembership;
    }
)

export const fetchIsOrgRegistryAdmin = createAsyncThunk(
    'orgs/registry/isAdmin',
    async (user: UseUserResult) => {
        const orgRegistryAddress = OrgRegistryAmoy?.address;
        const provider = new ethers.JsonRpcProvider("https://rpc-amoy.polygon.technology/");
        const registryContract = new ethers.Contract(orgRegistryAddress,
            OrgRegistryAmoy.abi, provider);

        return await registryContract.isAdmin(user?.address);
    }
)

export const orgContractSlice = createSlice({
    name: 'orgContract',
    initialState,
    reducers: {
        setOrg: (state, action) => {
            state.selectedOrg = action.payload
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchOrgInfo.fulfilled, (state, action) => {
            action.payload.forEach(org => {                
                if(!state.orgs.some(orgInc => orgInc.address == org.address))
                    state.orgs.push(org);
            });
        });
        builder.addCase(fetchIsOrgRegistryAdmin.fulfilled, (state, action) => {
            if (action.payload == true && !state.orgs.some(orgInc => orgInc.address == action.payload.org.address)) {
                state.orgs.push({
                    role: "Owner",
                    address: OrgRegistryAmoy?.address ?? '',
                    name: "Pawledger Registry",
                    type: OrgType.Registry
                });
            }
        });
    }
})

export const { setOrg } = orgContractSlice.actions;

export const memberShipSelector = createSelector((state : RootState) => state.orgContract.orgs, (orgs) => orgs.filter(org => org.role == "Member" || org.role == "Owner"));


export default orgContractSlice.reducer;