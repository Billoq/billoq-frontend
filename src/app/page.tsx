import { AboutSection } from "@/components/about-section"
import { FeaturesSection } from "@/components/features-section"
import { HeroSection } from "@/components/hero-section"
import { ServicesSection } from "@/components/services-section"

export default function Home() {
  return (
    <main className="bg-[#161E28] text-white">
      <HeroSection />
      <FeaturesSection/>
      <ServicesSection/>
      <AboutSection/>
    </main>
  )
}