import {
  CalendarDays,
  ChevronRight,
} from "lucide-react";

const events = [
  {
    title: "Product Demo — TechNova",
    date: "Sep 3",
  },
  {
    title: "Follow-up — Acme Corporation",
    date: "Sep 4",
  },
];

const UpcomingEvents = () => {
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
          Upcoming Events
        </h2>
      </div>

      {/* Events */}
      <div className="mt-3 space-y-3">
        {events.map((event) => (
          <div
            key={event.title}
            className="flex items-center justify-between gap-2"
          >
            <div className="min-w-0">
              <p
                className="
                  truncate
                  text-[7px]
                  font-bold
                  text-[#17324D]
                "
              >
                {event.title}
              </p>

              <p
                className="
                  mt-1
                  text-[7px]
                  text-[#718599]
                "
              >
                {event.date}
              </p>
            </div>

            <ChevronRight
              size={11}
              strokeWidth={1.7}
              className="shrink-0 text-[#60758A]"
            />
          </div>
        ))}
      </div>

      {/* View All */}
      <button
        type="button"
        className="
          mt-4
          text-[7px]
          font-semibold
          text-[#0089D6]
          hover:underline
        "
      >
        View All
      </button>
    </div>
  );
};

export default UpcomingEvents;