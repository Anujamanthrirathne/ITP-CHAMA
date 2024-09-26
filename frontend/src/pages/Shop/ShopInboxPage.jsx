import React from 'react'
import DashboardHeader from '../../components/Shop/Layout/DashboardHeader'
import DashboardSidebar from '../../components/Shop/Layout/DashboardSidebar'
import DashboardMessages from '../../components/Shop/DashboardMessages.jsx'
const ShopInboxPage = () => {
  return (
    <div>
    <DashboardHeader />
    <div className="flex items-start justify-between w-full">
        <div className="w-[80px] 800px:w-[330px]">
            <DashboardSidebar active={9} />
        </div>
        <DashboardMessages />
    </div>
</div>

  )
}

export default ShopInboxPage