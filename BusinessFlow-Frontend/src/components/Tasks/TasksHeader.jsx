import {
  CalendarDays,
  ChevronDown,
  Plus,
} from "lucide-react";

const TasksHeader = ({
  dateLabel = "Mar 15, 2025",
  onDateClick,
  onCreateTask,
}) => {
  return (
    <section className="w-full">
      <div className="flex items-start justify-between gap-6">

        {/* ================================
            LEFT
        ================================= */}

        <div>
          <h1
            className="
              text-[22px]
              font-bold
              leading-[28px]
              text-[#071D35]
            "
          >
            Tasks
          </h1>

          <p
            className="
              mt-[3px]
              text-[10px]
              leading-[15px]
              text-[#64798C]
            "
          >
            Create, assign, and track tasks across your team.
          </p>
        </div>

        {/* ================================
            RIGHT ACTIONS
        ================================= */}

        <div className="flex shrink-0 items-center gap-2 pt-[2px]">

          {/* Date */}

          <button
            type="button"
            onClick={onDateClick}
            className="
              flex
              h-[27px]
              min-w-[135px]
              items-center
              justify-between
              gap-2
              rounded-[6px]
              border
              border-[#CFE0F1]
              bg-white
              px-3
              text-left
              transition
              hover:bg-[#F5F8FC]
            "
          >
            <span className="flex items-center gap-2">

              <CalendarDays
                size={11}
                strokeWidth={1.8}
                className="text-[#526E83]"
              />

              <span
                className="
                  whitespace-nowrap
                  text-[9px]
                  font-semibold
                  text-[#17324D]
                "
              >
                {dateLabel}
              </span>

            </span>

            <ChevronDown
              size={11}
              strokeWidth={1.8}
              className="text-[#71869A]"
            />
          </button>

          {/* Create Task */}

          <button
            type="button"
            onClick={onCreateTask}
            className="
              flex
              h-[27px]
              items-center
              gap-2
              rounded-[6px]
              bg-[#061C35]
              px-3
              text-[9px]
              font-semibold
              text-white
              transition
              hover:bg-[#0B3155]
              active:scale-[0.98]
            "
          >
            <Plus
              size={11}
              strokeWidth={2.2}
            />

            <span className="whitespace-nowrap">
              Create Task
            </span>
          </button>

        </div>
      </div>
    </section>
  );
};

export default TasksHeader;