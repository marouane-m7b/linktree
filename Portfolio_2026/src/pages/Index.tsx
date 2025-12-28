import CyberBackground from "@/components/portfolio/CyberBackground";
import Navbar from "@/components/portfolio/Navbar";
import HeroSection from "@/components/portfolio/HeroSection";
import AboutSection from "@/components/portfolio/AboutSection";
import SkillsSection from "@/components/portfolio/SkillsSection";
import WorkSection from "@/components/portfolio/WorkSection";
import ExperienceSection from "@/components/portfolio/ExperienceSection";
import AwardsSection from "@/components/portfolio/AwardsSection";
import CertificationsSection from "./CertificationsSection";
import ContactSection from "@/components/portfolio/ContactSection";
import Footer from "@/components/portfolio/Footer";

const Index = () => {
  return (
    <CyberBackground>
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <WorkSection />
        <ExperienceSection />
        <AwardsSection />
        <CertificationsSection />
        <ContactSection />
      </main>
      <Footer />
    </CyberBackground>
  );
};

export default Index;
