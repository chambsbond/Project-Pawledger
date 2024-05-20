"use client"

import { HomeGrid } from "@/components/HomeGrid";
import { memberShipSelector, Org, OrgState, OrgType } from "@/store/slices/OrgSlice";
import { RootState } from "@/store/store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function DashboardPage() {    
    const orgs = useSelector(memberShipSelector);
    const orgSelected = useSelector((state :RootState) => state.orgContract.selectedOrg) as number; 
    
    const [scopes, setScopes] = useState<string[]>([]);

    useEffect(() => {
        console.log(orgSelected);
        // debugger;
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
    }, [orgSelected, orgs])


    return (
        <>
            <HomeGrid
                scopes={scopes}></HomeGrid>
        </>
    )
}