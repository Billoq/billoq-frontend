import React from 'react'
import { FeatureSection } from './feature-section'
import { HowItWorks } from './HowItWorks'
import { FAQSection } from '../faq-section'
import { Footer } from '../footer'
function FeaturesSection() {
  return (
    //start from here
    <>
    <FeatureSection/>
      <HowItWorks/>
      <FAQSection />   
      <Footer />
    </>
  )
}

export default FeaturesSection