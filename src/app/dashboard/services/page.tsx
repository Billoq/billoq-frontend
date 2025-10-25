import { DashboardHeader } from '@/components/Dashboard/dashboard-header'
import DashboardServices from '@/components/Dashboard/Services/DashboardServices'
import React from 'react'

const page = () => {
  return (
    <div  className="flex-1 bg-[#11171F]">
      <DashboardHeader/>
      <DashboardServices/>
    </div>
  )
}

export default page
