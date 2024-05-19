"use client"

import { HomeGrid } from "@/components/HomeGrid";
import { Org, OrgState, OrgType } from "@/store/slices/OrgSlice";
import { RootState } from "@/store/store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function DashboardPage() {    
    const orgs = useSelector<RootState>(state => state.orgContract.orgs) as Org[];
    const orgSelected = useSelector<RootState>(state => state.orgContract.selectedOrg) as number; 
    
    const [scopes, setScopes] = useState<string[]>([]);

    useEffect(() => {
        console.log(orgSelected);
        if (orgs.length > 0) {
            if (orgs[orgSelected].type === OrgType.Registry) {
                setScopes(["Org.Validity.Write"]);
            }
            else if (orgs[orgSelected].role === "Owner") {
                setScopes(["Animal.Read", "Animal.Write", "Chart.Write"]);
            }
            else if (orgs[orgSelected].role === "Member") {
                setScopes(["Animal.Read", "Chart.Write"]);
            }
        }
    }, [orgs, orgSelected])


    return (
        <>
            <HomeGrid
                scopes={scopes}></HomeGrid>
        </>
    )
}