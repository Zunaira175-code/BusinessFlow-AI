import { Plus } from "lucide-react";

import Card from "../common/Card";
import Button from "../common/button";
import Badge from "../common/Badge";

const overdueTasks = [
  {
    title: "Send revised proposal",
    company: "Nexus Industries",
    due: "Yesterday",
  },
];

const todayTasks = [
  {
    title: "Follow up call",
    company: "Sarah Jenkins",
    due: "2:00 PM",
    priority: "HIGH",
  },
  {
    title: "Prepare Q2 Review",
    company: "Global Dynamics",
    due: "4:30 PM",
  },
];

const TaskItem = ({ task, overdue = false }) => {
  return (
    <div
      className={`
        flex
        min-h-[58px]
        items-center
        gap-2
        rounded-[7px]
        border
        bg-white
        px-2.5
        py-2
        ${
          overdue
            ? "border-[#F3CACA]"
            : "border-[#DCE5ED]"
        }
      `}
    >
      {/* Checkbox */}
      <button
        type="button"
        aria-label={`Complete ${task.title}`}
        className="
          flex
          h-[15px]
          w-[15px]
          shrink-0
          items-center
          justify-center
          rounded-[3px]
          border
          border-[#C9D6E1]
          bg-white
          transition-colors
          hover:border-[#0B3D6B]
          hover:bg-[#F5F9FC]
        "
      />

      {/* Content */}
      <div className="min-w-0 flex-1">
        <p
          className="
            truncate
            text-[9px]
            font-semibold
            leading-[12px]
            text-[#29445C]
          "
        >
          {task.title}
        </p>

        <p
          className="
            mt-[2px]
            truncate
            text-[8px]
            font-medium
            leading-[11px]
            text-[#8393A2]
          "
        >
          {task.company}

          <span className="mx-1">•</span>

          <span
            className={
              overdue
                ? "text-[#EF4444]"
                : "text-[#8292A0]"
            }
          >
            {task.due}
          </span>
        </p>
      </div>

      {/* Priority */}
      {task.priority && (
        <Badge
          variant="warning"
          className="text-[7px]"
        >
          {task.priority}
        </Badge>
      )}
    </div>
  );
};

const TaskUpcoming = () => {
  return (
    <Card className="h-[330px] overflow-hidden">

      {/* Header */}
      <div
        className="
          flex
          h-[55px]
          items-center
          justify-between
          px-[14px]
        "
      >
        <h2
          className="
            text-[13px]
            font-bold
            tracking-[-0.1px]
            text-[#102F4A]
          "
        >
          Tasks &amp; Upcoming
        </h2>

        <Button
          variant="secondary"
          icon={Plus}
          className="
            h-[27px]
            rounded-[6px]
            border-[#D8E2EA]
            px-2.5
            text-[9px]
            font-semibold
            text-[#24435D]
          "
        >
          Task
        </Button>
      </div>

      {/* Tabs */}
      <div
        className="
          border-b
          border-[#DCE5ED]
          px-[14px]
          pb-[10px]
        "
      >
        <div className="flex h-[27px] rounded-[6px] bg-[#F8FAFC] p-[3px]">

          <button
            type="button"
            className="
              flex-1
              rounded-[5px]
              bg-white
              text-[9px]
              font-semibold
              text-[#29445C]
              shadow-[0_1px_3px_rgba(16,47,74,0.08)]
            "
          >
            Today
          </button>

          <button
            type="button"
            className="
              flex-1
              text-[9px]
              font-medium
              text-[#718395]
            "
          >
            Upcoming
          </button>

          <button
            type="button"
            className="
              flex-1
              text-[9px]
              font-medium
              text-[#EF4444]
            "
          >
            Overdue
          </button>

        </div>
      </div>

      {/* Tasks */}
      <div className="space-y-3 overflow-hidden px-[14px] py-[12px]">

        {/* Overdue */}
        <div>
          <div className="mb-2 flex items-center gap-1.5">

            <span className="h-[6px] w-[6px] rounded-full bg-[#EF4444]" />

            <span
              className="
                text-[8px]
                font-bold
                uppercase
                tracking-[0.4px]
                text-[#EF4444]
              "
            >
              Overdue
            </span>

          </div>

          <div className="space-y-1.5">
            {overdueTasks.map((task) => (
              <TaskItem
                key={task.title}
                task={task}
                overdue
              />
            ))}
          </div>
        </div>

        {/* Today */}
        <div>
          <div className="mb-2 flex items-center gap-1.5">

            <span className="h-[6px] w-[6px] rounded-full bg-[#1592D0]" />

            <span
              className="
                text-[8px]
                font-bold
                uppercase
                tracking-[0.4px]
                text-[#587086]
              "
            >
              Today
            </span>

          </div>

          <div className="space-y-1.5">
            {todayTasks.map((task) => (
              <TaskItem
                key={task.title}
                task={task}
              />
            ))}
          </div>
        </div>

      </div>
    </Card>
  );
};

export default TaskUpcoming;