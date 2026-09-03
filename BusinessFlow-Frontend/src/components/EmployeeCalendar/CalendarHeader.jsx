import {
  ChevronLeft,
  ChevronRight,
  Plus,
} from "lucide-react";

const CalendarHeader = ({ onAddEvent }) => {
  return (
    <div className="flex w-full items-start justify-between">
      {/* Left */}
      <div>
        <h1
          className="
            text-[24px]
            font-bold
            leading-tight
            tracking-[-0.5px]
            text-[#071D35]
          "
        >
          Calendar
        </h1>

        <p
          className="
            mt-1
            text-[10px]
            leading-[14px]
            text-[#60758A]
          "
        >
          Manage your meetings, follow-ups, tasks, and upcoming activities.
        </p>
      </div>

      {/* New Event */}
      <button
        type="button"
        onClick={onAddEvent}
        className="
          flex
          h-[30px]
          shrink-0
          items-center
          gap-1.5
          rounded-[6px]
          bg-[#0B3D6B]
          px-3
          text-[9px]
          font-semibold
          text-white
          transition-colors
          duration-200
          hover:bg-[#082F54]
        "
      >
        <Plus size={11} strokeWidth={2} />
        <span>New Event</span>
      </button>
    </div>
  );
};

export default CalendarHeader;