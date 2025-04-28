import React from 'react'
import { HeroSection } from './Hero'
import ServicesGrid from './ServicesGrid'
import { FAQSection } from '../faq-section'
import { CommunitySection } from '../community-section'
import {Footer} from '../footer'


function Services() {
  return (
    //start from here
    <>
    <HeroSection/>
    <ServicesGrid/>
    <FAQSection/>
    <CommunitySection/>
    <Footer/>
    </>
    
  )
}

export default Services