import { ClipboardCheck } from "lucide-react";

const tasks = [
  {
    title: "Prepare TechNova proposal",
    date: "Tomorrow",
  },
  {
    title: "Follow up with Acme",
    date: "Sep 4",
  },
];

const TasksDue = () => {
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
        <ClipboardCheck
          size={15}
          strokeWidth={1.8}
          className="text-[#E87500]"
        />

        <h2 className="text-[13px] font-bold text-[#17324D]">
          My Tasks Due
        </h2>
      </div>

      {/* Tasks */}
      <div className="mt-3 space-y-3">
        {tasks.map((task) => (
          <label
            key={task.title}
            className="
              flex
              cursor-pointer
              items-start
              gap-2
            "
          >
            <input
              type="checkbox"
              className="
                mt-[1px]
                h-[12px]
                w-[12px]
                rounded-[3px]
                border-[#C9D4DE]
                accent-[#0B3D6B]
              "
            />

            <div>
              <p
                className="
                  text-[7px]
                  font-semibold
                  leading-[10px]
                  text-[#17324D]
                "
              >
                {task.title}
              </p>

              <p
                className="
                  mt-0.5
                  text-[6px]
                  text-[#718599]
                "
              >
                {task.date}
              </p>
            </div>
          </label>
        ))}
      </div>

      {/* Link */}
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
        View My Tasks
      </button>
    </div>
  );
};

export default TasksDue;