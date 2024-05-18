import { HomeGrid } from "@/components/HomeGrid";

export default function DashboardPage() {
    return (
        <>
            <HomeGrid
                scopes={["test", "test2", "test", "", ""]}></HomeGrid>
        </>
    )
}