import React from 'react'
import DashboardSidebar from '../../components/Shop/Layout/DashboardSidebar'
import DashboardHeader from '../../components/Shop/Layout/DashboardHeader'
import EditProduct from '../../components/Shop/EditProduct.jsx'

const ShopEditProducts = () => {
  return (
    <div>
    <DashboardHeader />
    <div className="flex items-center justify-between w-full">
        <div className="w-[80px] 800px:w-[330px]">
            <DashboardSidebar active={5} />
        </div>
        <div className='w-full justify-center flex'>
           <EditProduct />
        </div>
    </div>
</div>
  )
}

export default ShopEditProducts