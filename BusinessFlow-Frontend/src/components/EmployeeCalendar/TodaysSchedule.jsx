import { CalendarDays } from "lucide-react";

const schedule = [
  {
    time: "10:30 AM",
    title: "Follow-up Call",
    company: "Acme Corporation",
  },
  {
    time: "1:00 PM",
    title: "Deal Review",
    company: "NovaTech",
  },
  {
    time: "3:00 PM",
    title: "Product Demo",
    company: "TechNova",
  },
  {
    time: "5:00 PM",
    title: "Task Review",
    company: "Bright Systems",
  },
];

const TodaysSchedule = () => {
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
      <div className="flex items-center gap-2">
        <CalendarDays
          size={15}
          strokeWidth={1.8}
          className="text-[#0089D6]"
        />

        <h2 className="text-[13px] font-bold text-[#17324D]">
          Today's Schedule
        </h2>
      </div>

      {/* Schedule */}
      <div className="mt-3 space-y-2.5">
        {schedule.map((item) => (
          <div
            key={`${item.time}-${item.title}`}
            className="
              border-l-2
              border-[#C7DFF8]
              pl-2.5
            "
          >
            <p
              className="
                text-[7px]
                font-bold
                text-[#17324D]
              "
            >
              {item.time}
            </p>

            <p
              className="
                mt-0.5
                text-[7px]
                leading-[10px]
                text-[#60758A]
              "
            >
              {item.title} — {item.company}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodaysSchedule;