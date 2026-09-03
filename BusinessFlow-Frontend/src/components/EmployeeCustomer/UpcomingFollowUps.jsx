import { Clock3 } from "lucide-react";

import Card from "../common/Card";

const followUps = [
  {
    month: "SEP",
    day: "03",
    name: "David Miller (Bright Systems)",
    description:
      "Urgent: Discuss usage drop-off and retention offer.",
    time: "Today 14:00",
    urgent: true,
  },
  {
    month: "SEP",
    day: "04",
    name: "Sophia Williams (NovaTech)",
    description:
      "Quarterly business review & upsell pitch.",
    time: "10:00 AM",
    urgent: false,
  },
  {
    month: "SEP",
    day: "05",
    name: "John Carter (Acme Corp)",
    description:
      "Send finalized Q4 expansion proposal.",
    time: "EOD",
    urgent: false,
  },
];

const UpcomingFollowUps = () => {
  return (
    <Card className="w-full overflow-hidden">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="px-4 pt-4">
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
              shrink-0
              text-[8px]
              font-semibold
              text-[#315D80]
              transition-colors
              hover:text-[#0B3D6B]
            "
          >
            View Calendar
          </button>
        </div>

        <div className="mt-2 h-px w-full bg-[#DCE5ED]" />
      </div>

      {/* =====================================================
          FOLLOW-UP LIST
      ====================================================== */}

      <div className="space-y-2.5 px-4 pb-4 pt-3">
        {followUps.map((item) => (
          <div
            key={`${item.day}-${item.name}`}
            className="
              flex
              min-h-[62px]
              items-center
              gap-3
              rounded-[6px]
              border
              border-[#DCE5ED]
              bg-white
              px-2.5
              py-2
            "
          >
            {/* =================================================
                DATE BOX
            ================================================= */}

            <div
              className="
                flex
                h-[42px]
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
                  text-[7px]
                  font-semibold
                  uppercase
                  leading-none
                  text-[#718599]
                "
              >
                {item.month}
              </span>

              <span
                className="
                  mt-[2px]
                  text-[14px]
                  font-bold
                  leading-none
                  text-[#17324D]
                "
              >
                {item.day}
              </span>
            </div>

            {/* =================================================
                CONTENT
            ================================================= */}

            <div className="min-w-0 flex-1">
              <p
                className="
                  truncate
                  text-[8px]
                  font-bold
                  text-[#17324D]
                "
              >
                {item.name}
              </p>

              <p
                className="
                  mt-[3px]
                  line-clamp-2
                  text-[8px]
                  leading-[12px]
                  text-[#718599]
                "
              >
                {item.description}
              </p>
            </div>

            {/* =================================================
                TIME
            ================================================= */}

            <div className="shrink-0">
              {item.urgent ? (
                <span
                  className="
                    rounded-[4px]
                    bg-[#FFF3E6]
                    px-[6px]
                    py-[3px]
                    text-[7px]
                    font-semibold
                    text-[#F59E0B]
                  "
                >
                  {item.time}
                </span>
              ) : (
                <span
                  className="
                    text-[7px]
                    font-medium
                    text-[#718599]
                  "
                >
                  {item.time}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default UpcomingFollowUps;