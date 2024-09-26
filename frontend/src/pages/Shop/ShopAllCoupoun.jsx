import React from 'react'
import AllCoupons from '../../components/Shop/AllCoupons'
import DashboardSidebar from '../../components/Shop/Layout/DashboardSidebar'
import DashboardHeader from '../../components/Shop/Layout/DashboardHeader'

const ShopAllCoupoun = () => {
  return (
    <div>
        <DashboardHeader />
        <div className="flex justify-between w-full">
            <div className="w-[80px] 800px:w-[330px]">
              <DashboardSidebar active={10} />
            </div>
            <div className="w-full justify-center flex">
                <AllCoupons />
            </div>
          </div>
    </div>
  )
}

export default ShopAllCoupoun