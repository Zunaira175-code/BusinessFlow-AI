import { AlarmClock } from "lucide-react";

const reminders = [
  {
    title: "Follow-up",
    company: "Acme Corp",
    time: "2:00 PM",
    dot: "bg-[#F08A00]",
  },
  {
    title: "Product Demo",
    company: "TechNova",
    time: "3:00 PM",
    dot: "bg-[#168AD0]",
  },
  {
    title: "Proposal Review",
    company: "Bright Systems",
    time: "Tomorrow",
    dot: "bg-[#16A05D]",
  },
  {
    title: "Deal Negotiation",
    company: "NovaTech",
    time: "Sep 3",
    dot: "bg-[#7B8D9D]",
  },
];

const UpcomingReminders = () => {
  return (
    <section
      className="
        overflow-hidden
        rounded-[9px]
        border
        border-[#DCE5ED]
        bg-white
      "
    >
      {/* Header */}
      <div
        className="
          flex
          h-[52px]
          items-center
          gap-2
          border-b
          border-[#DCE5ED]
          px-4
        "
      >
        <AlarmClock
          size={14}
          strokeWidth={1.8}
          className="text-[#60758A]"
        />

        <h2 className="text-[13px] font-bold text-[#17324D]">
          Upcoming Reminders
        </h2>
      </div>

      {/* Items */}
      <div className="px-4 py-3">
        {reminders.map((item) => (
          <div
            key={item.title}
            className="relative flex items-start gap-2.5 py-1.5"
          >
            <span
              className={`
                mt-[4px]
                h-[5px]
                w-[5px]
                shrink-0
                rounded-full
                ${item.dot}
              `}
            />

            <div className="min-w-0">
              <p className="text-[8px] font-semibold text-[#17324D]">
                {item.title}
              </p>

              <p className="mt-[2px] text-[7px] text-[#718599]">
                {item.company} • {item.time}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <button
        type="button"
        className="
          flex
          h-[32px]
          w-full
          items-center
          justify-center
          border-t
          border-[#DCE5ED]
          bg-[#FBFCFD]
          text-[8px]
          font-semibold
          text-[#17324D]
        "
      >
        View My Calendar →
      </button>
    </section>
  );
};

export default UpcomingReminders;