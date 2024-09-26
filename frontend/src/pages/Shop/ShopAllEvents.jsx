import React from 'react'
import DashboardHeader from '../../components/Shop/Layout/DashboardHeader'
import DashboardSidebar from '../../components/Shop/Layout/DashboardSidebar'
import AllEvents from '../../components/Shop/AllEvents'

const ShopAllEvents = () => {
  return (
    <div>
    <DashboardHeader />
    <div className="flex  justify-between w-full">
        <div className="w-[80px] 800px:w-[330px]">
            <DashboardSidebar active={6} />
        </div>
        <div className='w-full justify-center flex'>
          <AllEvents />
        </div>
    </div>
</div>
  )
}

export default ShopAllEvents