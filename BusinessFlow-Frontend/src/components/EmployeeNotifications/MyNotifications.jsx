import {
  UserRoundPlus,
  Tag,
  CircleCheck,
  CalendarDays,
  Eye,
  CheckCircle2,
  MessageSquare,
} from "lucide-react";

const notifications = [
  {
    title: "New Lead Assigned",
    description: "Sarah Johnson from Acme Corporation",
    time: "10 mins ago",
    icon: UserRoundPlus,
    iconClass: "bg-[#DCEAFF] text-[#3977B5]",
    unread: true,
    action: "View Lead",
  },
  {
    title: "Deal Stage Updated",
    description: "Enterprise CRM Upgrade to Negotiation",
    time: "35 mins ago",
    icon: Tag,
    iconClass: "bg-[#E3F3FF] text-[#168AD0]",
    unread: true,
  },
  {
    title: "Task Due Today",
    description: "Follow up with TechNova at 2:00 PM",
    time: "1 hour ago",
    icon: CircleCheck,
    iconClass: "bg-[#FFF0DA] text-[#F08A00]",
    unread: true,
  },
  {
    title: "Customer Meeting Reminder",
    description: "Meeting with Bright Systems at 3:00 PM",
    time: "2 hours ago",
    icon: CalendarDays,
    iconClass: "bg-[#DCEAFF] text-[#5C7FA0]",
  },
  {
    title: "Proposal Viewed",
    description: "Acme Corporation viewed latest proposal",
    time: "3 hours ago",
    icon: Eye,
    iconClass: "bg-[#DCEAFF] text-[#7890A7]",
  },
  {
    title: "Task Completed",
    description: '"Customer information update" marked completed',
    time: "Yesterday",
    icon: CheckCircle2,
    iconClass: "bg-[#E6F8ED] text-[#24A866]",
  },
  {
    title: "New Customer Activity",
    description: "NovaTech replied to your message",
    time: "Yesterday",
    icon: MessageSquare,
    iconClass: "bg-[#DCEAFF] text-[#67829C]",
  },
];

const MyNotifications = () => {
  return (
    <section
      className="
        overflow-hidden
        rounded-[9px]
        border
        border-[#DCE5ED]
        bg-white
      "
    >
      {/* Header */}
      <div className="px-4 pb-3 pt-4">
        <h2 className="text-[13px] font-bold text-[#17324D]">
          My Notifications
        </h2>

        <p className="mt-1 text-[8px] text-[#7A8B9A]">
          Recent activity and updates related to your work.
        </p>
      </div>

      {/* Notification Rows */}
      <div>
        {notifications.map((notification, index) => {
          const Icon = notification.icon;

          return (
            <div
              key={notification.title}
              className={`
                relative
                flex
                min-h-[55px]
                items-center
                border-t
                border-[#E2EAF0]
                px-3
                py-2.5
                ${notification.unread ? "bg-[#FBFDFF]" : "bg-white"}
              `}
            >
              {notification.unread && (
                <div
                  className="
                    absolute
                    bottom-0
                    left-0
                    top-0
                    w-[2px]
                    bg-[#079BEA]
                  "
                />
              )}

              {/* Icon */}
              <div
                className={`
                  ml-1
                  flex
                  h-[31px]
                  w-[31px]
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  ${notification.iconClass}
                `}
              >
                <Icon size={14} strokeWidth={1.8} />
              </div>

              {/* Content */}
              <div className="ml-3 min-w-0 flex-1">
                <p
                  className={`
                    text-[8px]
                    font-semibold
                    ${
                      notification.unread
                        ? "text-[#17324D]"
                        : "text-[#60758A]"
                    }
                  `}
                >
                  {notification.title}
                </p>

                <p className="mt-[2px] text-[8px] text-[#718599]">
                  {notification.description}
                </p>

                {notification.action && (
                  <button
                    type="button"
                    className="
                      mt-1
                      rounded-[3px]
                      border
                      border-[#C9D8E5]
                      bg-white
                      px-2
                      py-[3px]
                      text-[7px]
                      font-medium
                      text-[#17324D]
                    "
                  >
                    {notification.action}
                  </button>
                )}
              </div>

              {/* Time */}
              <span
                className="
                  self-start
                  pt-[2px]
                  text-[7px]
                  whitespace-nowrap
                  text-[#8A9AA8]
                "
              >
                {notification.time}
              </span>
            </div>
          );
        })}
      </div>

      {/* Bottom */}
      <button
        type="button"
        className="
          flex
          h-[36px]
          w-full
          items-center
          justify-center
          border-t
          border-[#E2EAF0]
          bg-[#FBFCFD]
          text-[8px]
          font-semibold
          text-[#17324D]
          hover:bg-[#F5F8FB]
        "
      >
        Load More Notifications
      </button>
    </section>
  );
};

export default MyNotifications;