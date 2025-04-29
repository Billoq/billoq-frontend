
import { DashboardContent } from "@/components/Dashboard/dashboard-content";
import { DashboardHeader } from "@/components/Dashboard/dashboard-header";


export default function Dashboard() {
  return (
    <div className="flex-1 bg-[#0f172a]">
      <DashboardHeader />
      <DashboardContent/>
    </div>
  );
}