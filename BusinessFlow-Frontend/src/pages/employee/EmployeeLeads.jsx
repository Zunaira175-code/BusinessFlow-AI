import EmployeeLeadHeader from "../../components/EmployeeLead/EmployeeLeadHeader";
import LeadStats from "../../components/EmployeeLead/LeadStats";
import LeadPipeline from "../../components/EmployeeLead/LeadPipeline";
import MyLeads from "../../components/EmployeeLead/MyLeads";
import LeadActivity from "../../components/EmployeeLead/LeadActivity";
import UpcomingLeadFollowUps from "../../components/EmployeeLead/UpcomingLeadFollowUps";

const EmployeeLeads = () => {
  const handleAddLead = () => {
    console.log("Add Lead clicked");
  };

  return (
    <div className="w-full min-w-0">
      {/* =====================================================
          PAGE HEADER
      ====================================================== */}

      <EmployeeLeadHeader
        onAddLead={handleAddLead}
      />

      {/* =====================================================
          LEAD STATS
      ====================================================== */}

      <div className="mt-4 w-full">
        <LeadStats />
      </div>

      {/* =====================================================
          LEAD PIPELINE
      ====================================================== */}

      <div className="mt-4 w-full">
        <LeadPipeline />
      </div>

      {/* =====================================================
          MY LEADS
      ====================================================== */}

      <div className="mt-4 w-full">
        <MyLeads />
      </div>

      {/* =====================================================
          ACTIVITY + FOLLOW UPS
      ====================================================== */}

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
        {/* Lead Activity */}

        <div className="min-w-0">
          <LeadActivity />
        </div>

        {/* Upcoming Follow Ups */}

        <div className="min-w-0">
          <UpcomingLeadFollowUps />
        </div>
      </div>
    </div>
  );
};

export default EmployeeLeads;