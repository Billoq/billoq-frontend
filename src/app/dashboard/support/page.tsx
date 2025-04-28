import { DashboardHeader } from '@/components/Dashboard/dashboard-header'
import DashboardSupport from '@/components/Dashboard/Support/DashboardSupport'
import React from 'react'

function page() {
  return (
    <div  className="flex-1 bg-[#0f172a]">
      <DashboardHeader/>
      <DashboardSupport/>

    </div>
  )
}

export default page