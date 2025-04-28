import { FAQSection } from "@/components/faq-section"
import { FeaturesSection } from "@/components/features-section"
import { Footer } from "@/components/footer"
import { FeatureSection } from "@/components/feature-section"
import { HowItWorks } from "@/components/Features/HowItWorks"

function page() {
  return (
    <main className="bg-[#161E28] text-white">
      <FeatureSection/>
      <FeaturesSection/>
      <HowItWorks/>
      <FAQSection />   
      <Footer />
    </main>
  )
}
export default page