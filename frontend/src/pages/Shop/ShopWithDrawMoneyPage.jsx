import React from 'react'
import DashboardHeader from '../../components/Shop/Layout/DashboardHeader'
import DashboardSidebar from '../../components/Shop/Layout/DashboardSidebar';
import WithdrawMoney from "../../components/Shop/WithdrawMoney.jsx";

const ShopWithDrawMoneyPage = () => {
  return (
    <div>
    <DashboardHeader />
    <div className="flex items-start justify-between w-full">
      <div className="w-[80px] 800px:w-[330px]">
        <DashboardSidebar active={8} />
      </div>
      <WithdrawMoney />
    </div>
  </div>
  )
}

export default ShopWithDrawMoneyPage