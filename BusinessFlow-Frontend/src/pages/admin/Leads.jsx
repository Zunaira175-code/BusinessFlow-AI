import LeadsHeader from "../../components/Leads/LeadsHeader";
import LeadsStats from "../../components/Leads/LeadsStats";
import LeadsToolbar from "../../components/Leads/LeadsToolbar";
import LeadsTable from "../../components/Leads/LeadsTable";

const Leads = () => {
  return (
    <div className="w-full">
      <LeadsHeader />

      <LeadsStats />

      <LeadsToolbar />

      <LeadsTable />
    </div>
  );
};

export default Leads;