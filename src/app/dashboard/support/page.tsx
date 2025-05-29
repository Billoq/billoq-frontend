import { DashboardHeader } from '@/components/Dashboard/dashboard-header'
import DashboardSupport from '@/components/Dashboard/Support/DashboardSupport'
import React from 'react'

function page() {
  return (
    <div  className="flex-1 bg-[#11171F]">
      <DashboardHeader/>
      <DashboardSupport/>

    </div>
  )
}

export default page