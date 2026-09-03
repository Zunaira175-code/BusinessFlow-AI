import {
  Bell,
  UserRoundPlus,
  Tag,
  CalendarDays,
} from "lucide-react";

const stats = [
  {
    title: "ALL NOTIFICATIONS",
    value: "24",
    unread: "8 unread",
    icon: Bell,
    iconClass: "bg-[#DCEAFF] text-[#2F6FAE]",
    unreadClass: "bg-[#FFD9D9] text-[#E53935]",
  },
  {
    title: "LEADS",
    value: "7",
    unread: "3 unread",
    icon: UserRoundPlus,
    iconClass: "bg-[#E0EDFF] text-[#3779B8]",
    unreadClass: "bg-[#FFF0D8] text-[#E58A00]",
  },
  {
    title: "DEALS",
    value: "6",
    unread: "2 unread",
    icon: Tag,
    iconClass: "bg-white text-[#168AD0] border border-[#A9D7F5]",
    unreadClass: "bg-[#DFF3FF] text-[#168AD0]",
  },
  {
    title: "TASKS & MEETINGS",
    value: "11",
    unread: "3 unread",
    icon: CalendarDays,
    iconClass: "bg-[#DCEAFF] text-[#2F6FAE]",
    unreadClass: "bg-[#FFD9D9] text-[#E53935]",
  },
];

const NotificationStats = () => {
  return (
    <div className="grid w-full grid-cols-4 gap-3">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.title}
            className="
              relative
              h-[99px]
              rounded-[9px]
              border
              border-[#DCE5ED]
              bg-white
              px-4
              py-3
            "
          >
            <p className="text-[8px] font-semibold text-[#60758A]">
              {stat.title}
            </p>

            <p
              className="
                mt-[11px]
                text-[22px]
                font-bold
                leading-none
                tracking-[-0.5px]
                text-[#071D35]
              "
            >
              {stat.value}
            </p>

            <span
              className={`
                mt-[7px]
                inline-flex
                rounded-full
                px-2
                py-[3px]
                text-[7px]
                font-semibold
                ${stat.unreadClass}
              `}
            >
              {stat.unread}
            </span>

            <div
              className={`
                absolute
                right-3
                top-3
                flex
                h-[25px]
                w-[25px]
                items-center
                justify-center
                rounded-[6px]
                ${stat.iconClass}
              `}
            >
              <Icon size={13} strokeWidth={1.8} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default NotificationStats;