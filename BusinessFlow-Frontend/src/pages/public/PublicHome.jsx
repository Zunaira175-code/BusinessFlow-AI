import HeroSection from "../../components/PublicDashboard/HeroSection";
import PlatformFeatures from "../../components/PublicDashboard/PlatformFeatures";
import AIFeatures from "../../components/PublicDashboard/AIFeatures";
import CTASection from "../../components/PublicDashboard/CTASection";

import SolutionsSection from "../../components/PublicDashboard/SolutionsSection";

const PublicHome = () => {
  return (
    <>
      <HeroSection />
      <PlatformFeatures />
      <SolutionsSection />
      <AIFeatures />
      <CTASection />
    </>
  );
};

export default PublicHome;