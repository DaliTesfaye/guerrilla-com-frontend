import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AboutSection from "@/components/sections/AboutSection";
import ContactSection from "@/components/sections/ContactSection";
import HeroSection from "@/components/sections/HeroSection";
import PartenairesSection from "@/components/sections/PartenairesSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import ProceduresSection from "@/components/sections/ProceduresSection";
import ServicesSection from "@/components/sections/ServicesSection";

export default function Home() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <ProjectsSection />
      <ProceduresSection />
      <PartenairesSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
