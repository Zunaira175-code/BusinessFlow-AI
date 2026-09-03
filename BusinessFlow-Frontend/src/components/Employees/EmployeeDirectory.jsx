import EmployeeFilters from "./EmployeeFilters";

const EmployeeDirectory = () => {
  const employees = [
    {
      initials: "",
      name: "Sarah Jenkins",
      email: "sarah.j@businessflow.ai",
      role: "VP Sales",
      department: "Enterprise Sales",
      leads: "14",
      deals: "8",
      revenue: "$1.2M",
      status: "Active",
      avatar: "bg-[#EEF2F5]",
      dot: "bg-[#16A05D]",
      statusClass: "bg-[#E5F6EC] text-[#16A05D]",
    },
    {
      initials: "",
      name: "Marcus Chen",
      email: "marcus.c@businessflow.ai",
      role: "Sales Director",
      department: "SMB Sales",
      leads: "42",
      deals: "15",
      revenue: "$850K",
      status: "Active",
      avatar: "bg-[#EEF2F5]",
      dot: "bg-[#16A05D]",
      statusClass: "bg-[#E5F6EC] text-[#16A05D]",
    },
    {
      initials: "",
      name: "Elena Rodriguez",
      email: "elena.r@businessflow.ai",
      role: "Account Executive",
      department: "Enterprise Sales",
      leads: "28",
      deals: "12",
      revenue: "$620K",
      status: "Active",
      avatar: "bg-[#EEF2F5]",
      dot: "bg-[#16A05D]",
      statusClass: "bg-[#E5F6EC] text-[#16A05D]",
    },
    {
      initials: "DJ",
      name: "David Jones",
      email: "david.j@businessflow.ai",
      role: "Senior SDR",
      department: "Inbound",
      leads: "0",
      deals: "0",
      revenue: "$125K",
      status: "On Leave",
      avatar: "bg-[#DCE8F8]",
      dot: "bg-[#F28A00]",
      statusClass: "bg-[#FFF0DF] text-[#F28A00]",
    },
    {
      initials: "",
      name: "Aisha Patel",
      email: "aisha.p@businessflow.ai",
      role: "Account Executive",
      department: "SMB Sales",
      leads: "35",
      deals: "9",
      revenue: "$410K",
      status: "Active",
      avatar: "bg-[#EEF2F5]",
      dot: "bg-[#16A05D]",
      statusClass: "bg-[#E5F6EC] text-[#16A05D]",
    },
  ];

  return (
    <section className="w-full overflow-hidden rounded-[9px] border border-[#DCE5EF] bg-white">

      {/* Filters */}
      <div className="border-b border-[#DCE5EF] bg-[#F9FBFD] p-3">
        <EmployeeFilters />
      </div>

      {/* Table Header */}
      <div className="grid h-[35px] grid-cols-[2.2fr_1.55fr_0.75fr_0.85fr_1fr_0.85fr_0.55fr] items-center border-b border-[#E2E9F0] bg-[#F8FAFC] px-3">

        <span className="text-[8px] font-medium text-[#71869A]">
          Employee
        </span>

        <span className="text-[8px] font-medium text-[#71869A]">
          Role & Dept
        </span>

        <span className="text-center text-[8px] font-medium text-[#71869A]">
          Leads
        </span>

        <span className="text-center text-[8px] font-medium text-[#71869A]">
          Active Deals
        </span>

        <span className="text-center text-[8px] font-medium text-[#71869A]">
          YTD Revenue
        </span>

        <span className="text-center text-[8px] font-medium text-[#71869A]">
          Status
        </span>

        <span className="text-right text-[8px] font-medium text-[#71869A]">
          Actions
        </span>
      </div>

      {/* Employees */}
      {employees.map((employee) => (
        <div
          key={employee.name}
          className="grid min-h-[52px] grid-cols-[2.2fr_1.55fr_0.75fr_0.85fr_1fr_0.85fr_0.55fr] items-center border-b border-[#E2E9F0] px-3"
        >

          {/* Employee */}
          <div className="flex items-center gap-2">
            <div
              className={`relative flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-full text-[9px] font-semibold text-[#31506C] ${employee.avatar}`}
            >
              {employee.initials || (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-[#C5CED6]"
                >
                  <circle
                    cx="12"
                    cy="8"
                    r="3.5"
                    stroke="currentColor"
                    strokeWidth="1.4"
                  />
                  <path
                    d="M5 20C5 16.7 8.1 14 12 14C15.9 14 19 16.7 19 20"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                  />
                </svg>
              )}

              {/* Online / Status Dot */}
              <span
                className={`absolute bottom-0 right-0 h-[7px] w-[7px] rounded-full border border-white ${employee.dot}`}
              />
            </div>

            <div className="min-w-0">
              <p className="truncate text-[9px] font-semibold leading-[12px] text-[#17324D]">
                {employee.name}
              </p>

              <p className="truncate text-[7px] leading-[10px] text-[#8192A2]">
                {employee.email}
              </p>
            </div>
          </div>

          {/* Role */}
          <div>
            <p className="text-[8px] leading-[11px] text-[#17324D]">
              {employee.role}
            </p>

            <p className="text-[7px] leading-[10px] text-[#8192A2]">
              {employee.department}
            </p>
          </div>

          {/* Leads */}
          <span className="text-center text-[8px] text-[#17324D]">
            {employee.leads}
          </span>

          {/* Active Deals */}
          <span className="text-center text-[8px] text-[#17324D]">
            {employee.deals}
          </span>

          {/* Revenue */}
          <span className="text-center text-[8px] font-semibold text-[#17324D]">
            {employee.revenue}
          </span>

          {/* Status */}
          <div className="flex justify-center">
            <span
              className={`rounded-[4px] px-[7px] py-[3px] text-[7px] font-semibold ${employee.statusClass}`}
            >
              {employee.status}
            </span>
          </div>

          {/* Actions */}
          <div className="flex justify-end">
            <button
              type="button"
              className="text-[13px] leading-none text-[#71869A] hover:text-[#17324D]"
              aria-label={`Actions for ${employee.name}`}
            >
              ⋮
            </button>
          </div>
        </div>
      ))}

      {/* Footer / Pagination */}
      <div className="flex h-[44px] items-center justify-between px-3">

        <p className="text-[8px] text-[#71869A]">
          Showing <span className="font-semibold text-[#17324D]">1 to 10</span>{" "}
          of <span className="font-semibold text-[#17324D]">156</span> employees
        </p>

        <div className="flex items-center gap-2">

          {/* Previous */}
          <button
            type="button"
            className="flex h-[22px] w-[22px] items-center justify-center rounded text-[#A0AFBC] hover:bg-[#F3F6F9]"
          >
            ‹
          </button>

          {/* Active */}
          <button
            type="button"
            className="flex h-[23px] w-[23px] items-center justify-center rounded-[4px] bg-[#061C35] text-[8px] font-semibold text-white"
          >
            1
          </button>

          <button
            type="button"
            className="flex h-[23px] w-[23px] items-center justify-center text-[8px] text-[#64798C] hover:bg-[#F3F6F9]"
          >
            2
          </button>

          <button
            type="button"
            className="flex h-[23px] w-[23px] items-center justify-center text-[8px] text-[#64798C] hover:bg-[#F3F6F9]"
          >
            3
          </button>

          <span className="text-[8px] text-[#71869A]">
            ...
          </span>

          <button
            type="button"
            className="flex h-[23px] w-[23px] items-center justify-center text-[8px] text-[#64798C] hover:bg-[#F3F6F9]"
          >
            16
          </button>

          {/* Next */}
          <button
            type="button"
            className="flex h-[22px] w-[22px] items-center justify-center rounded text-[#71869A] hover:bg-[#F3F6F9]"
          >
            ›
          </button>

        </div>
      </div>
    </section>
  );
};

export default EmployeeDirectory;