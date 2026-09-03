import { useState } from "react";
import { CalendarDays } from "lucide-react";

const tasks = [
  {
    id: 1,
    title: "Finalize TechNova Proposal",
    date: "Today, 5:00 PM",
    priority: "High",
    priorityClass:
      "bg-[#FFF0F0] text-[#EF4444]",
  },
  {
    id: 2,
    title: "Follow up with Acme Corp",
    date: "Tomorrow",
    priority: "Medium",
    priorityClass:
      "bg-[#FFF6E8] text-[#F59E0B]",
  },
  {
    id: 3,
    title: "Review Bright Systems requirements",
    date: "Sep 03",
    priority: "Low",
    priorityClass:
      "bg-[#EAF7FC] text-[#079BEA]",
  },
];

const MyTasks = () => {
  const [completedTasks, setCompletedTasks] = useState([]);

  const toggleTask = (id) => {
    setCompletedTasks((prev) =>
      prev.includes(id)
        ? prev.filter((taskId) => taskId !== id)
        : [...prev, id]
    );
  };

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
          min-h-[64px]
          items-center
          justify-between
          border-b
          border-[#DCE5ED]
          px-4
          py-3
        "
      >
        {/* Left */}
        <div>
          <h2
            className="
              text-[13px]
              font-bold
              leading-[16px]
              text-[#17324D]
            "
          >
            My Tasks
          </h2>

          <p
            className="
              mt-1
              text-[8px]
              leading-[11px]
              text-[#8495A5]
            "
          >
            Tasks assigned to you
          </p>
        </div>

        {/* View All */}
        <button
          type="button"
          className="
            text-[8px]
            font-semibold
            text-[#079BEA]
            transition-colors
            hover:text-[#0B3D6B]
          "
        >
          View All Tasks
        </button>
      </div>

      {/* =====================================================
          TASK LIST
      ====================================================== */}
      <div>
        {tasks.map((task, index) => {
          const completed = completedTasks.includes(task.id);

          return (
            <div
              key={task.id}
              className={`
                flex
                min-h-[57px]
                items-center
                gap-2.5
                px-3
                py-2.5
                ${
                  index !== tasks.length - 1
                    ? "border-b border-[#E2E9EF]"
                    : ""
                }
              `}
            >
              {/* Checkbox */}
              <button
                type="button"
                onClick={() => toggleTask(task.id)}
                aria-label={`Mark ${task.title} as ${
                  completed ? "incomplete" : "complete"
                }`}
                className="
                  flex
                  h-[13px]
                  w-[13px]
                  shrink-0
                  items-center
                  justify-center
                  rounded-[3px]
                  border
                  border-[#9AAAB8]
                  bg-white
                  transition-colors
                  hover:border-[#315D80]
                "
              >
                {completed && (
                  <span
                    className="
                      text-[9px]
                      font-bold
                      leading-none
                      text-[#0B3D6B]
                    "
                  >
                    ✓
                  </span>
                )}
              </button>

              {/* Task Information */}
              <div className="min-w-0 flex-1">
                <p
                  className={`
                    truncate
                    text-[10px]
                    font-semibold
                    leading-[13px]
                    ${
                      completed
                        ? "text-[#8A9AAA] line-through"
                        : "text-[#17324D]"
                    }
                  `}
                >
                  {task.title}
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
                  <CalendarDays
                    size={8}
                    strokeWidth={1.7}
                  />

                  <span>{task.date}</span>
                </div>
              </div>

              {/* Priority */}
              <span
                className={`
                  shrink-0
                  rounded-[4px]
                  px-[6px]
                  py-[3px]
                  text-[7px]
                  font-semibold
                  leading-[9px]
                  ${task.priorityClass}
                `}
              >
                {task.priority}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyTasks;