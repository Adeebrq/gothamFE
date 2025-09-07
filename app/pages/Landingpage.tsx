"use client"
import React from 'react'
import Header from '../components/header'
import HeroSection from '../components/heroSection'
import NewsBoard from '../components/newsBoard'

const Landingpage = () => {
  return (
    <div className='w-full h-full'>
      <Header/>
      <HeroSection />
      <NewsBoard />
    </div>
  )
}

export default Landingpage
