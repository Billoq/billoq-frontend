import { DashboardHeader } from '@/components/Dashboard/dashboard-header'
import DashboardTransactions from '@/components/Dashboard/Transactions/DashboardTransactions'
import React from 'react'

const page = () => {
  return (
    <div  className="flex-1 bg-[#0f172a]">
       <DashboardHeader/>
      <DashboardTransactions/>
    </div>
  )
}

export default page
