import {
  CalendarDays,
  Clock3,
} from "lucide-react";

/* =========================================================
   UPCOMING FOLLOW-UPS DATA
========================================================= */

const followUps = [
  {
    id: 1,
    date: "SEP 03",
    customer: "David Miller",
    company: "Bright Systems",
    description:
      "Discuss usage drop-off and retention offer.",
    time: "Today 02:00 PM",
    priority: "Urgent",
  },
  {
    id: 2,
    date: "SEP 04",
    customer: "Sophia Williams",
    company: "NovaTech",
    description:
      "Quarterly business review & upsell pitch.",
    time: "10:00 AM",
    priority: "Normal",
  },
  {
    id: 3,
    date: "SEP 05",
    customer: "John Carter",
    company: "Acme Corporation",
    description:
      "Send finalized Q4 expansion proposal.",
    time: "EOD",
    priority: "Normal",
  },
];

/* =========================================================
   UPCOMING LEAD FOLLOW-UPS
========================================================= */

const UpcomingLeadFollowUps = () => {
  return (
    <div
      className="
        w-full
        rounded-[9px]
        border
        border-[#DCE5ED]
        bg-white
        px-4
        py-4
        shadow-[0_1px_2px_rgba(15,23,42,0.03)]
      "
    >
      {/* =================================================
          HEADER
      ================================================== */}

      <div className="flex items-center justify-between gap-3">
        <h2
          className="
            text-[13px]
            font-bold
            text-[#17324D]
          "
        >
          Upcoming Follow-ups
        </h2>

        <button
          type="button"
          className="
            text-[8px]
            font-semibold
            text-[#079BEA]
            transition-colors
            hover:text-[#0B3D6B]
          "
          onClick={() => {
            console.log("View Calendar clicked");
          }}
        >
          View Calendar
        </button>
      </div>

      {/* Divider */}
      <div className="mt-2 h-px w-full bg-[#E2E9EF]" />

      {/* =================================================
          FOLLOW-UP ITEMS
      ================================================== */}

      <div className="mt-3 space-y-2.5">
        {followUps.map((item) => (
          <div
            key={item.id}
            className="
              flex
              min-h-[60px]
              items-center
              gap-2.5
              rounded-[6px]
              border
              border-[#DCE5ED]
              bg-white
              px-2.5
              py-2
              transition-colors
              hover:bg-[#FAFCFE]
            "
          >
            {/* =================================================
                DATE
            ================================================= */}

            <div
              className="
                flex
                h-[40px]
                w-[40px]
                shrink-0
                flex-col
                items-center
                justify-center
                rounded-[5px]
                bg-[#E8F1FF]
              "
            >
              <span
                className="
                  text-[6px]
                  font-semibold
                  uppercase
                  leading-none
                  text-[#718599]
                "
              >
                {item.date.split(" ")[0]}
              </span>

              <span
                className="
                  mt-[2px]
                  text-[13px]
                  font-bold
                  leading-none
                  text-[#17324D]
                "
              >
                {item.date.split(" ")[1]}
              </span>
            </div>

            {/* =================================================
                DETAILS
            ================================================== */}

            <div className="min-w-0 flex-1">
              <p
                className="
                  truncate
                  text-[8px]
                  font-bold
                  text-[#17324D]
                "
              >
                {item.customer}
              </p>

              <p
                className="
                  truncate
                  text-[7px]
                  text-[#8495A5]
                "
              >
                {item.company}
              </p>

              <p
                className="
                  mt-[2px]
                  line-clamp-1
                  text-[7px]
                  leading-[10px]
                  text-[#718599]
                "
              >
                {item.description}
              </p>
            </div>

            {/* =================================================
                TIME
            ================================================== */}

            <div className="shrink-0 text-right">
              {item.priority === "Urgent" ? (
                <span
                  className="
                    inline-flex
                    items-center
                    gap-1
                    rounded-[4px]
                    bg-[#FFF0E5]
                    px-1.5
                    py-[3px]
                    text-[6px]
                    font-semibold
                    text-[#E87500]
                  "
                >
                  <Clock3
                    size={8}
                    strokeWidth={2}
                  />

                  {item.time}
                </span>
              ) : (
                <span
                  className="
                    inline-flex
                    items-center
                    gap-1
                    text-[7px]
                    font-medium
                    text-[#718599]
                  "
                >
                  <Clock3
                    size={8}
                    strokeWidth={1.8}
                  />

                  {item.time}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* =================================================
          CALENDAR BUTTON
      ================================================== */}

      <button
        type="button"
        className="
          mt-3
          flex
          h-[28px]
          w-full
          items-center
          justify-center
          gap-1.5
          rounded-[5px]
          border
          border-[#DCE5ED]
          bg-[#F8FAFC]
          text-[8px]
          font-semibold
          text-[#315D80]
          transition-colors
          hover:bg-[#EEF4FC]
        "
        onClick={() => {
          console.log("Open Calendar");
        }}
      >
        <CalendarDays
          size={11}
          strokeWidth={1.8}
        />

        View All Follow-ups
      </button>
    </div>
  );
};

export default UpcomingLeadFollowUps;