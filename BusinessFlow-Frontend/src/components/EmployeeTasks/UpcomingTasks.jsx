import { ChevronRight } from "lucide-react";

const upcomingTasks = [
  {
    month: "Sep",
    day: "02",
    title: "Quarterly Review Prep",
    type: "Internal",
  },
  {
    month: "Sep",
    day: "05",
    title: "Client Onboarding Call",
    type: "Omega Corp",
  },
];

const UpcomingTasks = () => {
  return (
    <div
      className="
        rounded-[9px]
        border
        border-[#DCE5ED]
        bg-white
        p-3
      "
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2
          className="
            text-[13px]
            font-bold
            text-[#17324D]
          "
        >
          Upcoming
        </h2>

        <button
          type="button"
          className="
            text-[7px]
            font-medium
            text-[#60758A]
            underline
            underline-offset-2
            hover:text-[#17324D]
          "
        >
          View all
        </button>
      </div>

      {/* Items */}
      <div className="mt-3">
        {upcomingTasks.map((item, index) => (
          <div
            key={item.title}
            className={`
              flex
              items-start
              gap-3
              py-2.5
              ${
                index !== upcomingTasks.length - 1
                  ? "border-b border-[#E3EAF0]"
                  : ""
              }
            `}
          >
            {/* Date */}
            <div className="w-[30px] shrink-0 text-center">
              <p
                className="
                  text-[7px]
                  font-semibold
                  uppercase
                  text-[#17324D]
                "
              >
                {item.month}
              </p>

              <p
                className="
                  mt-0.5
                  text-[13px]
                  font-bold
                  leading-none
                  text-[#17324D]
                "
              >
                {item.day}
              </p>
            </div>

            {/* Vertical line */}
            <div className="h-[32px] w-px bg-[#0784C7]" />

            {/* Content */}
            <div className="min-w-0 flex-1">
              <p
                className="
                  text-[7px]
                  font-bold
                  text-[#17324D]
                "
              >
                {item.title}
              </p>

              <p
                className="
                  mt-1
                  text-[6px]
                  text-[#718599]
                "
              >
                {item.type}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingTasks;