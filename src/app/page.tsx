import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AboutSection from "@/components/sections/AboutSection";
import ContactSection from "@/components/sections/ContactSection";
import EventsSection from "@/components/sections/EventsSection";
import HeroSection from "@/components/sections/HeroSection";
import PartenairesSection from "@/components/sections/PartenairesSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import ProceduresSection from "@/components/sections/ProceduresSection";
import ServicesSection from "@/components/sections/ServicesSection";
import FacebookFeed from "@/components/sections/Facebooksection";
import Chatbot from "@/components/sections/Chatbot";

export default function Home() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <ProjectsSection />
      <EventsSection />
      <FacebookFeed />
      <ProceduresSection />
      <PartenairesSection />
      <ContactSection />
      <Chatbot />
      <Footer />
    </main>
  );
}
