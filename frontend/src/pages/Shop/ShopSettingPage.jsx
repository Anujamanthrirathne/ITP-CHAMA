import React from 'react'
import ShopSettings from '../../components/Shop/ShopSettings'
import DashboardHeader from '../../components/Shop/Layout/DashboardHeader'
import DashboardSidebar from '../../components/Shop/Layout/DashboardSidebar'

const ShopSettingPage = () => {
    
  return (
    <div>
    <DashboardHeader />
    <div className="flex items-start justify-between w-full">
      <div className="w-[80px] 800px:w-[330px]">
        <DashboardSidebar active={12} />
      </div>
      <ShopSettings />
    </div>
  </div>
  )
}

export default ShopSettingPage