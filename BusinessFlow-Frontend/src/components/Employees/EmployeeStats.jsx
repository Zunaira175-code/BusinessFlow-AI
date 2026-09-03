const EmployeeStats = () => {
  const stats = [
    {
      title: "TOTAL EMPLOYEES",
      value: "156",
      bottom: (
        <span className="inline-flex items-center rounded-[4px] bg-[#E7F7EE] px-[6px] py-[3px] text-[8px] font-semibold text-[#16A05D]">
          ↗ +2% vs last month
        </span>
      ),
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            cx="9"
            cy="8"
            r="3"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <circle
            cx="17"
            cy="9"
            r="2.5"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <path
            d="M3.5 19C3.5 15.96 5.96 13.5 9 13.5C12.04 13.5 14.5 15.96 14.5 19"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M15 14.5C17.76 14.5 20 16.74 20 19"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      ),
      iconClass: "text-[#E1E5E9]",
    },

    {
      title: "ACTIVE EMPLOYEES",
      value: "142",
      bottom: (
        <span className="text-[8px] text-[#6F8294]">
          91% of total workforce
        </span>
      ),
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M12 3L19 6V11C19 15.6 16.05 19.9 12 21C7.95 19.9 5 15.6 5 11V6L12 3Z"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
          <path
            d="M8.5 12L10.8 14.3L15.5 9.6"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      iconClass: "text-[#DDF2E7]",
    },

    {
      title: "ON LEAVE",
      value: "8",
      bottom: (
        <span className="text-[8px] text-[#6F8294]">
          3 returning this week
        </span>
      ),
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <rect
            x="5"
            y="5"
            width="14"
            height="15"
            rx="2"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <path
            d="M8 3V7"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M16 3V7"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M8 11L16 17"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M16 11L8 17"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
      ),
      iconClass: "text-[#F7E6D2]",
    },

    {
      title: "NEW THIS MONTH",
      value: "6",
      bottom: (
        <span className="inline-flex items-center rounded-[4px] bg-[#E6F3FA] px-[6px] py-[3px] text-[8px] font-medium text-[#1989C5]">
          In onboarding phase
        </span>
      ),
      icon: (
        <svg
          width="25"
          height="24"
          viewBox="0 0 25 24"
          fill="none"
        >
          <rect
            x="4"
            y="5"
            width="17"
            height="14"
            rx="2"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M7 9H18"
            stroke="currentColor"
            strokeWidth="1.4"
          />
          <text
            x="7"
            y="16"
            fill="currentColor"
            fontSize="5"
            fontWeight="700"
          >
            NEW
          </text>
        </svg>
      ),
      iconClass: "text-[#DDEEF5]",
    },
  ];

  return (
    <section className="grid w-full grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className="relative h-[103px] overflow-hidden rounded-[9px] border border-[#DCE5EF] bg-white px-4 py-3"
        >
          {/* Card Content */}
          <div className="relative z-10">
            <p className="text-[8px] font-semibold uppercase tracking-[0.05em] text-[#71869A]">
              {stat.title}
            </p>

            <p className="mt-[5px] text-[23px] font-bold leading-[27px] text-[#071D35]">
              {stat.value}
            </p>

            <div className="mt-[4px]">
              {stat.bottom}
            </div>
          </div>

          {/* Background Icon */}
          <div
            className={`absolute right-3 top-3 ${stat.iconClass}`}
          >
            {stat.icon}
          </div>
        </div>
      ))}
    </section>
  );
};

export default EmployeeStats;