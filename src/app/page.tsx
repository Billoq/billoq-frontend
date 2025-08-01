import { AboutSection } from "@/components/about-section"
import { CommunitySection } from "@/components/community-section"
import { FAQSection } from "@/components/faq-section"
import { FeaturesSection } from "@/components/features-section"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/hero-section"
import { ServicesSection } from "@/components/services-section"


export default function Home() {
  return (
    <main className="bg-[#11171F] text-white">
      <HeroSection />
      <FeaturesSection/>
      <ServicesSection/>
      <AboutSection/>
      <FAQSection />
      <CommunitySection/>
      <Footer />
    </main>
  )
}