import React from 'react'
import DashboardHeader from '../../components/Shop/Layout/DashboardHeader'
import DashboardSidebar from '../../components/Shop/Layout/DashboardSidebar'
import CreateEvent from '../../components/Shop/CreateEvent'

const ShopCreateEvents = () => {
  return (
    <div>
        <DashboardHeader />
        <div className="flex items-center justify-between w-full">
            <div className="w-[80px] 800px:w-[330px]">
                <DashboardSidebar active={7} />
            </div>
            <div className='w-full justify-center flex'>
                <CreateEvent />
            </div>
        </div>
    </div>
  )
}

export default ShopCreateEvents