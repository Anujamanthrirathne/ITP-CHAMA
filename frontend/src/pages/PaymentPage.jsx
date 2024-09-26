import React from 'react'
import CheckoutSteps from '../components/Checkout/CheckoutSteps'
import Header from '../components/Layout/Header'
import Payment from "../components/Payment/Payment.jsx";
import Footer from '../components/Route/Footer/Footer.jsx';

const PaymentPage = () => {
  return (
    <div className='w-full min-h-screen bg-[#f6f9fc]'>
       <Header />
       <br />
       <br />
       <CheckoutSteps active={2} />
       <Payment />
       <br />
       <br />
       <Footer />
    </div>
  )
}

export default PaymentPage