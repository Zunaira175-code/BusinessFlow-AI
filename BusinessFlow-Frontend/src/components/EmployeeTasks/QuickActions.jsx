import {
  CheckSquare,
  CalendarDays,
} from "lucide-react";

const actions = [
  {
    id: "create-task",
    label: "Create New Task",
    icon: CheckSquare,
    event: "businessflow-open-create-task",
  },
  {
    id: "schedule-follow-up",
    label: "Schedule Follow-up",
    icon: CalendarDays,
    event: "businessflow-open-follow-up",
  },
  {
    id: "view-calendar",
    label: "View My Calendar",
    icon: CalendarDays,
    event: "businessflow-open-calendar",
  },
];

const QuickActions = ({
  onCreateTask,
  onScheduleFollowUp,
  onViewCalendar,
}) => {
  // =====================================================
  // HANDLE ACTION
  // =====================================================

  const handleAction = (action) => {
    // Create New Task
    if (
      action.id === "create-task"
    ) {
      if (onCreateTask) {
        onCreateTask();
        return;
      }

      window.dispatchEvent(
        new Event(
          action.event
        )
      );

      return;
    }

    // Schedule Follow-up
    if (
      action.id ===
      "schedule-follow-up"
    ) {
      if (onScheduleFollowUp) {
        onScheduleFollowUp();
        return;
      }

      window.dispatchEvent(
        new Event(
          action.event
        )
      );

      return;
    }

    // View Calendar
    if (
      action.id ===
      "view-calendar"
    ) {
      if (onViewCalendar) {
        onViewCalendar();
        return;
      }

      window.dispatchEvent(
        new Event(
          action.event
        )
      );
    }
  };

  // =====================================================
  // UI
  // =====================================================

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
      <h2
        className="
          text-[13px]
          font-bold
          text-[#17324D]
        "
      >
        Quick Actions
      </h2>

      <div className="mt-3 space-y-2">
        {actions.map(
          (action) => {
            const Icon =
              action.icon;

            return (
              <button
                key={action.id}
                type="button"
                onClick={() =>
                  handleAction(
                    action
                  )
                }
                className="
                  flex
                  w-full
                  items-center
                  gap-2.5
                  rounded-[6px]
                  px-1.5
                  py-1.5
                  text-left
                  transition-colors
                  hover:bg-[#F5F8FB]
                  active:bg-[#EEF4F9]
                "
              >
                <span
                  className="
                    flex
                    h-6
                    w-6
                    shrink-0
                    items-center
                    justify-center
                    rounded-[4px]
                    bg-[#DCEBFF]
                    text-[#315D80]
                  "
                >
                  <Icon
                    size={12}
                    strokeWidth={1.7}
                  />
                </span>

                <span
                  className="
                    text-[7px]
                    font-semibold
                    text-[#17324D]
                  "
                >
                  {action.label}
                </span>
              </button>
            );
          }
        )}
      </div>
    </div>
  );
};

export default QuickActions;