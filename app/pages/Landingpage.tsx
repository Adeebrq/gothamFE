"use client"
import React from 'react'
import Header from '../components/header'
import HeroSection from '../components/heroSection'
import BentoGrid from '../components/BentoGrid'
import NewsBoard from '../components/newsBoard'
import ScrollVideo from '../components/ScrollVideo'

const Landingpage = () => {
  return (
    <div className='w-full h-full'>
      <Header/>
      <HeroSection />
      <BentoGrid />
      <ScrollVideo />
    </div>
  )
}

export default Landingpage
