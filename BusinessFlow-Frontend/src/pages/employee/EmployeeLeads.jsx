import EmployeeLeadHeader from "../../components/EmployeeLead/EmployeeLeadHeader";
import LeadStats from "../../components/EmployeeLead/LeadStats";
import LeadPipeline from "../../components/EmployeeLead/LeadPipeline";
import MyLeads from "../../components/EmployeeLead/MyLeads";
import LeadActivity from "../../components/EmployeeLead/LeadActivity";
import UpcomingLeadFollowUps from "../../components/EmployeeLead/UpcomingLeadFollowUps";

const EmployeeLeads = () => {
  return (
    <div className="w-full">

      {/* Header */}
      <EmployeeLeadHeader
        onAddLead={() => {
          console.log("Add Lead clicked");
        }}
      />

      {/* Stats */}
      <div className="mt-4">
        <LeadStats />
      </div>

      {/* Pipeline */}
      <div className="mt-4">
        <LeadPipeline />
      </div>

      {/* Leads */}
      <div className="mt-4">
        <MyLeads />
      </div>

      {/* Activity + Upcoming Follow-ups */}
      <div
        className="
          mt-4
          grid
          w-full
          grid-cols-1
          gap-3
          lg:grid-cols-[1.2fr_1fr]
        "
      >
        <LeadActivity />
        <UpcomingLeadFollowUps />
      </div>

    </div>
  );
};

export default EmployeeLeads;