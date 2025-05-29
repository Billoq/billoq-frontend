import { DashboardHeader } from '@/components/Dashboard/dashboard-header'
import DashboardSettings from '@/components/Dashboard/Settings/DashboardSettings'
import React from 'react'

const page = () => {
  return (
    <div  className=" flex-1  h-screen  overflow-hidden bg-[#11171F] ">
      <DashboardHeader/>
      <DashboardSettings/>
    
    </div>
  )
}

export default page
