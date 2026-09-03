const BillingPlan = () => {
  return (
    <section className="w-full rounded-[10px] border border-[#DCE5EF] bg-white p-4">
      
      {/* Heading */}
      <h2 className="text-[15px] font-bold text-[#102A43]">
        Billing & Plan
      </h2>

      {/* Plan Card */}
      <div className="mt-4 flex min-h-[70px] items-center justify-between rounded-[7px] border border-[#D7E2EC] bg-[#F5F8FC] px-4">

        {/* Left Side */}
        <div className="flex items-center gap-3">

          {/* Billing Icon */}
          <div className="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-full bg-[#DCEAFF] text-[#102A43]">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
            >
              <rect
                x="3.5"
                y="5"
                width="17"
                height="14"
                rx="2"
                stroke="currentColor"
                strokeWidth="1.8"
              />

              <path
                d="M3.5 9H20.5"
                stroke="currentColor"
                strokeWidth="1.8"
              />

              <path
                d="M7 14H11"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Plan Information */}
          <div>
            <div className="flex items-center gap-2">
              <p className="text-[11px] font-semibold text-[#102A43]">
                Business Plan - $99 / month
              </p>

              <span className="rounded-[3px] bg-[#DDF5E6] px-[7px] py-[3px] text-[8px] font-semibold text-[#16A05D]">
                Active
              </span>
            </div>

            <p className="mt-[3px] text-[9px] text-[#71869A]">
              Next billing date: Oct 15, 2024
            </p>
          </div>
        </div>

        {/* Manage Plan */}
        <button
          type="button"
          className="h-[36px] rounded-[7px] border border-[#B8CDE3] bg-[#D9E9FB] px-4 text-[10px] font-semibold text-[#17324D] transition hover:bg-[#C9E0F8]"
        >
          Manage Plan
        </button>

      </div>
    </section>
  );
};

export default BillingPlan;