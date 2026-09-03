import DealsHeader from "../../components/Deals/DealsHeader";
import DealsStats from "../../components/Deals/DealsStats";
import DealsToolbar from "../../components/Deals/DealsToolbar";
import DealsPipeline from "../../components/Deals/DealsPipeline";
import AIPipelineAnalytics from "../../components/Deals/AIPipelineAnalytics";

const Deals = () => {
  return (
    <div className="w-full">
      <DealsHeader />

      <DealsStats />

      <DealsToolbar />

      <DealsPipeline />

      <AIPipelineAnalytics />
    </div>
  );
};

export default Deals;