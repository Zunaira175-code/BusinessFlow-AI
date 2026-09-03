import HeroSection from "../../components/PublicDashboard/HeroSection";
import PlatformFeatures from "../../components/PublicDashboard/PlatformFeatures";
import AIFeatures from "../../components/PublicDashboard/AIFeatures";
import CTASection from "../../components/PublicDashboard/CTASection";
import BillingSection from "../../components/PublicDashboard/BillingSection";
import SolutionsSection from "../../components/PublicDashboard/SolutionsSection";

const PublicHome = () => {
  return (
    <>
      <HeroSection />
      <PlatformFeatures />
      <SolutionsSection />
      <AIFeatures />
      <BillingSection />
      <CTASection />
    </>
  );
};

export default PublicHome;