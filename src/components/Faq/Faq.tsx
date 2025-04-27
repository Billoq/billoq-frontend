import { FAQSection } from "@/components/faq-section";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";

function Faq() {
  return (
    <main className="  bg-[#0F172A] min-h-screen text-white">
      <>
      <div className="max-w-7xl mx-auto">
      <Navbar />
      </div>
    
      <FAQSection />
      <Footer />
      
      </>
      
    </main>
  );
}

export default Faq
