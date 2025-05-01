import { DashboardHeader } from '@/components/Dashboard/dashboard-header'
import DashboardSettings from '@/components/Dashboard/Settings/DashboardSettings'
import React from 'react'

const page = () => {
  return (
    <div  className=" flex-1  h-screen  overflow-hidden bg-[#0f172a] ">
      <DashboardHeader/>
      <DashboardSettings/>
    
    </div>
  )
}

export default page
