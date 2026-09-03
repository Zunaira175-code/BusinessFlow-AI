import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const days = [
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
  "Sun",
];

const calendarDays = [
  { day: "31", muted: true },
  { day: "1" },
  { day: "2" },
  { day: "3", event: "2:00 PM Product Demo" },
  { day: "4", event: "10:30 AM Follow-up" },
  { day: "5", muted: true },
  { day: "6", muted: true },

  { day: "7" },
  { day: "8", event: "11:00 AM Proposal" },
  { day: "9" },
  { day: "10", today: true },
  { day: "11", event: "3:00 PM Customer Call" },
  { day: "12", muted: true },
  { day: "13", muted: true },

  { day: "14" },
  { day: "15", event: "1:30 PM Deal Review" },
  { day: "16" },
  { day: "17" },
  { day: "18", event: "10:00 AM Team Meeting" },
  { day: "19", muted: true },
  { day: "20", muted: true },

  { day: "21" },
  { day: "22" },
  { day: "23" },
  { day: "24" },
  { day: "25" },
  { day: "26", muted: true },
  { day: "27", muted: true },
];

const CalendarGrid = () => {
  return (
    <div className="w-full overflow-hidden rounded-[9px] border border-[#DCE5ED] bg-white">
      {/* =====================================================
          CALENDAR TOOLBAR
      ====================================================== */}

      <div
        className="
          flex
          min-h-[44px]
          items-center
          justify-between
          gap-3
          border-b
          border-[#DCE5ED]
          px-2.5
          py-2
        "
      >
        {/* Left Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="
              h-[24px]
              rounded-[4px]
              border
              border-[#DCE5ED]
              bg-white
              px-2
              text-[7px]
              font-semibold
              text-[#17324D]
              hover:bg-[#F5F8FA]
            "
          >
            Today
          </button>

          <button
            type="button"
            className="
              flex
              h-6
              w-5
              items-center
              justify-center
              text-[#60758A]
              hover:text-[#17324D]
            "
          >
            <ChevronLeft size={12} />
          </button>

          <button
            type="button"
            className="
              flex
              h-6
              w-5
              items-center
              justify-center
              text-[#60758A]
              hover:text-[#17324D]
            "
          >
            <ChevronRight size={12} />
          </button>

          <h2
            className="
              ml-1
              whitespace-nowrap
              text-[13px]
              font-bold
              text-[#17324D]
            "
          >
            September 2026
          </h2>
        </div>

        {/* View Switcher */}
        <div
          className="
            flex
            overflow-hidden
            rounded-[4px]
            border
            border-[#DCE5ED]
          "
        >
          <button
            type="button"
            className="
              h-[24px]
              bg-[#F3F7FB]
              px-2.5
              text-[7px]
              font-semibold
              text-[#17324D]
            "
          >
            Month
          </button>

          <button
            type="button"
            className="
              h-[24px]
              px-2.5
              text-[7px]
              font-medium
              text-[#60758A]
              hover:bg-[#F7F9FC]
            "
          >
            Week
          </button>

          <button
            type="button"
            className="
              h-[24px]
              px-2.5
              text-[7px]
              font-medium
              text-[#60758A]
              hover:bg-[#F7F9FC]
            "
          >
            Day
          </button>
        </div>
      </div>

      {/* =====================================================
          DAYS + GRID
      ====================================================== */}

      <div className="overflow-x-auto">
        <div className="min-w-[620px]">
          {/* Weekday Header */}
          <div className="grid grid-cols-7 border-b border-[#DCE5ED] bg-[#FBFCFD]">
            {days.map((day) => (
              <div
                key={day}
                className="
                  flex
                  h-[28px]
                  items-center
                  justify-center
                  border-r
                  border-[#DCE5ED]
                  text-[7px]
                  font-semibold
                  text-[#60758A]
                  last:border-r-0
                "
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Cells */}
          <div className="grid grid-cols-7">
            {calendarDays.map((item, index) => (
              <CalendarCell
                key={`${item.day}-${index}`}
                item={item}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Empty Area */}
      <div className="h-[76px] border-t border-[#DCE5ED] bg-[#DCE6EF]" />
    </div>
  );
};

/* =========================================================
   CALENDAR CELL
========================================================= */

const CalendarCell = ({ item }) => {
  return (
    <div
      className="
        relative
        h-[92px]
        border-b
        border-r
        border-[#DCE5ED]
        bg-white
        p-2
        last:border-r-0
      "
    >
      {/* Date */}
      <div className="flex justify-end">
        <span
          className={`
            flex
            h-[18px]
            min-w-[18px]
            items-center
            justify-center
            rounded-full
            text-[7px]
            font-medium
            ${
              item.today
                ? "bg-[#071D35] text-white"
                : item.muted
                ? "text-[#9AA8B5]"
                : "text-[#60758A]"
            }
          `}
        >
          {item.day}
        </span>
      </div>

      {/* Event */}
      {item.event && (
        <div
          className="
            mt-2
            max-w-full
            overflow-hidden
            rounded-[4px]
            bg-[#D8E8FC]
            px-1.5
            py-1
            text-[6px]
            font-medium
            leading-[9px]
            text-[#173B5C]
          "
        >
          <span className="block truncate">
            {item.event}
          </span>
        </div>
      )}
    </div>
  );
};

export default CalendarGrid;