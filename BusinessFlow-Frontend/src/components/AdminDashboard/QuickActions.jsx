import {
  Building2,
  UserRoundPlus,
  FilePenLine,
  ListChecks,
  UsersRound,
} from "lucide-react";

import Card from "../common/Card";
import Button from "../common/button";

const actions = [
  {
    label: "Add Customer",
    icon: Building2,
  },
  {
    label: "Add Lead",
    icon: UserRoundPlus,
  },
  {
    label: "Create Deal",
    icon: FilePenLine,
  },
  {
    label: "Add Task",
    icon: ListChecks,
  },
  {
    label: "Add Employee",
    icon: UsersRound,
  },
];

const QuickActions = () => {
  return (
    <Card
      className="
        flex
        min-h-[58px]
        items-center
        justify-between
        px-[14px]
        py-2
      "
    >
      {/* Title */}
      <h2
        className="
          whitespace-nowrap
          text-[13px]
          font-bold
          tracking-[-0.1px]
          text-[#102F4A]
        "
      >
        Quick Actions
      </h2>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <Button
              key={action.label}
              variant="secondary"
              icon={Icon}
              className="
                h-[32px]
                min-w-[105px]
                rounded-[7px]
                border-[#D8E2EA]
                bg-white
                px-2.5
                text-[9px]
                font-semibold
                text-[#29465F]
                shadow-none
                hover:bg-[#F7F9FB]
                hover:border-[#C8D5E0]
              "
            >
              {action.label}
            </Button>
          );
        })}
      </div>
    </Card>
  );
};

export default QuickActions;