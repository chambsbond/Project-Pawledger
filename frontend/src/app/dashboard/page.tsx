import { HomeGrid } from "@/components/HomeGrid";

export default function DashboardPage() {
    return (
        <>
            <HomeGrid
                scopes={["Animal.Write", "Animal.Read", "Chart.Write"]}></HomeGrid>
        </>
    )
}