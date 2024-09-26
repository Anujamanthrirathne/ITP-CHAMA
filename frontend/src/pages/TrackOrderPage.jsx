import React from 'react'
import Header from '../components/Layout/Header'
import Footer from '../components/Route/Footer/Footer'
import TrackOrder from '../components/profile/TrackOrder.jsx'

const TrackOrderPage = () => {
  return (
    <div>
        <Header />
        <TrackOrder/>
        <Footer/>
    </div>
  )
}

export default TrackOrderPage