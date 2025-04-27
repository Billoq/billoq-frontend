import { FAQSection } from "@/components/faq-section";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";

function Faq() {
  return (
    <main className="bg-[#161E28] min-h-screen text-white">
      <Navbar />
      <FAQSection />
      <Footer />
    </main>
  );
}

export default Faq
