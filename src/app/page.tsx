import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ClipGenerator from "@/components/ClipGenerator";
import HowItWorks from "@/components/HowItWorks";
import Features from "@/components/Features";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <ClipGenerator />
        <HowItWorks />
        <Features />
      </main>
      <Footer />
    </>
  );
}
