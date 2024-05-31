import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit'


import OrgFactoryContractAmoy from "../../../../blockchain/packages/hardhat/deployments/polygonAmoy/OrganizationFactory.json";
import OrgContractCompile from "../../../../blockchain/packages/hardhat/artifacts/contracts/organizationImpl/AnimalShelter.sol/AnimalShelter.json";
import OrgRegistryAmoy from "../../../../blockchain/packages/hardhat/deployments/polygonAmoy/OrganizationRegistry.json";
import { ethers } from 'ethers';
import { RootState } from '../store';
import { Address } from 'viem';
import axios from 'axios';
import { headers } from 'next/headers';

export type Roles = "Member" | "Owner" | "Unaffiliated";

const backendConfig = { headers: { 'Access-Control-Allow-Origin': '*', "Content-Type": "application/json" } };

export enum OrgType {
    AnimalShelter = 0,
    Registry = 1,
}

export interface Org {
    type: OrgType,
    name: string,
    role: Roles,
    address: string,
    validated: boolean
}


export interface OrgState {
    orgs: Org[],
    selectedOrg: number,
    registryAdmin: boolean,
    publicKey: string | undefined,
    publicKeyIsLoading: boolean
}

const initialState: OrgState = {
    orgs: [],
    selectedOrg: 0,
    registryAdmin: false,
    publicKey: undefined,
    publicKeyIsLoading: false
}


export const fetchOrgInfo = createAsyncThunk(
    'orgs/membership',
    async (client: Address) => {
        const orgFactoryAddress = OrgFactoryContractAmoy?.address;
        const orgRegistryAddress = OrgRegistryAmoy?.address;
        const provider = new ethers.JsonRpcProvider("https://rpc-amoy.polygon.technology/");
        const factoryContract = new ethers.Contract(orgFactoryAddress,
            OrgFactoryContractAmoy.abi, provider);
        const registryContract = new ethers.Contract(orgRegistryAddress,
            OrgRegistryAmoy.abi, provider);

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
            const isValidOrgPromise = registryContract.isValidated(org);
            const isOwnerPromise = orgContract.isOwner(client);
            const isMemberPromise = orgContract.isEmployee(client);
            const namePromise = orgContract._name();

            await Promise.all([isValidOrgPromise, isOwnerPromise, isMemberPromise, namePromise]);

            if (await isOwnerPromise)
                role = "Owner"
            else if (await isMemberPromise)
                role = "Member"

            orgMembership.push({
                name: await namePromise,
                role: role,
                type: OrgType.AnimalShelter,
                address: org,
                validated: await isValidOrgPromise
            });
        }
        return orgMembership;
    }
)

export const isOrgRegistryAdmin = createAsyncThunk(
    'orgs/registry/isAdmin',
    async (client: Address) => {
        const orgRegistryAddress = OrgRegistryAmoy?.address;
        const provider = new ethers.JsonRpcProvider("https://rpc-amoy.polygon.technology/");
        const registryContract = new ethers.Contract(orgRegistryAddress,
            OrgRegistryAmoy.abi, provider);

        return await registryContract.isAdmin(client);
    }
);


export const fetchPublicKey = createAsyncThunk(
    'orgs/publicKey/fetch',
    async (address: Address) => {
        const response = await axios.get(`https://eus-pawledger-backend.azurewebsites.net/api/account/${address}`, backendConfig);
        return response.data.publicKey;
    }
);

export const addPublicKey = createAsyncThunk(
    'orgs/publicKey/add',
    async (model: { address: string, publicKey: string }) => {
        const response = await axios.put(`https://eus-pawledger-backend.azurewebsites.net/api/account`, model, backendConfig);
        return model.publicKey;
    }
);

export const orgContractSlice = createSlice({
    name: 'orgContract',
    initialState,
    reducers: {
        setSelectedOrgIndex: (state, action) => {
            state.selectedOrg = action.payload;
        },
        setOrg: (state, action) => {
            state.orgs[action.payload.index] = action.payload.org;
        },
        addOrg: (state, action) => {
            state.orgs.push(action.payload);
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchOrgInfo.fulfilled, (state, action) => {
            action.payload.forEach(org => {
                if (!state.orgs.some(orgInc => orgInc.address == org.address))
                    state.orgs.push(org);
            });
        });
        builder.addCase(isOrgRegistryAdmin.fulfilled, (state, action) => {
            if (action.payload == true && !state.orgs.some(orgInc => orgInc.address == OrgRegistryAmoy?.address)) {
                state.orgs.push({
                    role: "Owner",
                    address: OrgRegistryAmoy?.address ?? '',
                    name: "Pawledger Registry",
                    type: OrgType.Registry,
                    validated: true
                });
            }
        });
        builder.addCase(fetchPublicKey.pending, (state, action) => {
            state.publicKeyIsLoading = true;
        })
        builder.addCase(fetchPublicKey.fulfilled, (state, action) => {
            state.publicKey = action.payload as unknown as string;
            state.publicKeyIsLoading = false;
        })
        builder.addCase(fetchPublicKey.rejected, (state, action) => {
            if (action.error.code == "ERR_BAD_REQUEST") {
                state.publicKey = "";
            }
            state.publicKeyIsLoading = false;
        })
        builder.addCase(addPublicKey.fulfilled, (state, action) => {
            console.log(action.payload)
            state.publicKey = action.payload as unknown as string;
            state.publicKeyIsLoading = false;
        })
        builder.addCase(addPublicKey.pending, (state, action) => {
            state.publicKeyIsLoading = true;
        })
        builder.addCase(addPublicKey.rejected, (state, action) => {
            state.publicKeyIsLoading = false;
        })
    }
})

export const { setOrg, addOrg, setSelectedOrgIndex } = orgContractSlice.actions;

const selectedOrgIndex = (state: RootState) => (state.orgContract.selectedOrg)
const selectedOrg = (state: RootState) => (state.orgContract.orgs[state.orgContract.selectedOrg]);

export const memberShipSelector = createSelector((state: RootState) => state.orgContract.orgs, (orgs) => orgs.filter(org => org.role == "Member" || org.role == "Owner"));
export const orgSelectedIndexSelector = createSelector(selectedOrgIndex, (org: number) => { return org });
export const orgSelectedSelector = createSelector(selectedOrg, (org: Org) => { return org });

export default orgContractSlice.reducer;