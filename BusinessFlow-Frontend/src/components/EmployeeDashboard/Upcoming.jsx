import { Clock3, MoreHorizontal } from "lucide-react";

const upcomingItems = [
  {
    day: "TODAY",
    date: "15",
    title: "Product Demo - TechNova",
    time: "3:00 PM - 4:00 PM",
  },
  {
    day: "TMRW",
    date: "16",
    title: "Follow-up - Acme Corp",
    time: "10:00 AM",
  },
];

const Upcoming = () => {
  return (
    <div
      className="
        w-full
        overflow-hidden
        rounded-[9px]
        border
        border-[#DCE5ED]
        bg-white
      "
    >
      {/* =====================================================
          HEADER
      ====================================================== */}
      <div
        className="
          flex
          min-h-[48px]
          items-center
          justify-between
          border-b
          border-[#DCE5ED]
          px-3
          py-2.5
        "
      >
        <div>
          <h2
            className="
              text-[13px]
              font-bold
              leading-[16px]
              text-[#17324D]
            "
          >
            Upcoming
          </h2>

          <p
            className="
              mt-0.5
              text-[7px]
              leading-[10px]
              text-[#8495A5]
            "
          >
            Your schedule
          </p>
        </div>

        {/* More */}
        <button
          type="button"
          aria-label="More upcoming options"
          className="
            flex
            h-6
            w-6
            items-center
            justify-center
            rounded-md
            text-[#718599]
            transition-colors
            hover:bg-[#F3F6F9]
            hover:text-[#17324D]
          "
        >
          <MoreHorizontal
            size={13}
            strokeWidth={2}
          />
        </button>
      </div>

      {/* =====================================================
          UPCOMING ITEMS
      ====================================================== */}
      <div>
        {upcomingItems.map((item, index) => (
          <div
            key={`${item.day}-${item.date}`}
            className={`
              flex
              min-h-[52px]
              items-center
              gap-2.5
              px-2.5
              py-2
              ${
                index !== upcomingItems.length - 1
                  ? "border-b border-[#E2E9EF]"
                  : ""
              }
            `}
          >
            {/* Date Box */}
            <div
              className="
                flex
                h-[35px]
                w-[35px]
                shrink-0
                flex-col
                items-center
                justify-center
                rounded-[4px]
                border
                border-[#DCE5ED]
                bg-[#F8FAFC]
              "
            >
              <span
                className="
                  text-[6px]
                  font-semibold
                  leading-[8px]
                  text-[#079BEA]
                "
              >
                {item.day}
              </span>

              <span
                className="
                  mt-0.5
                  text-[11px]
                  font-bold
                  leading-[12px]
                  text-[#17324D]
                "
              >
                {item.date}
              </span>
            </div>

            {/* Event Information */}
            <div className="min-w-0 flex-1">
              <p
                className="
                  truncate
                  text-[10px]
                  font-semibold
                  leading-[13px]
                  text-[#17324D]
                "
              >
                {item.title}
              </p>

              <div
                className="
                  mt-1
                  flex
                  items-center
                  gap-1
                  text-[7px]
                  leading-[10px]
                  text-[#8A9AAA]
                "
              >
                <Clock3
                  size={8}
                  strokeWidth={1.7}
                />

                <span>{item.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Upcoming;