const MyNotifications = () => {
  const notifications = [
    {
      title: "New Lead Assigned",
      description: "Sarah Johnson from Acme Corporation",
      time: "10 mins ago",
      type: "lead",
      active: true,
      action: "View Lead",
    },
    {
      title: "Deal Stage Updated",
      description: "Enterprise CRM Upgrade to Negotiation",
      time: "35 mins ago",
      type: "deal",
      active: true,
    },
    {
      title: "Task Due Today",
      description: "Follow up with TechNova at 2:00 PM",
      time: "1 hour ago",
      type: "task",
      active: true,
    },
    {
      title: "Customer Meeting Reminder",
      description: "Meeting with Bright Systems at 3:00 PM",
      time: "2 hours ago",
      type: "meeting",
      active: false,
    },
    {
      title: "Proposal Viewed",
      description: "Acme Corporation viewed latest proposal",
      time: "3 hours ago",
      type: "view",
      active: false,
    },
    {
      title: "Task Completed",
      description: '"Customer information update" marked completed',
      time: "Yesterday",
      type: "completed",
      active: false,
    },
    {
      title: "New Customer Activity",
      description: "NovaTech replied to your message",
      time: "Yesterday",
      type: "activity",
      active: false,
    },
  ];

  const getIcon = (type) => {
    switch (type) {
      case "lead":
        return (
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
            <circle
              cx="9"
              cy="8"
              r="4"
              stroke="currentColor"
              strokeWidth="1.7"
            />
            <path
              d="M2.5 20C2.5 16.7 5.4 14.5 9 14.5C11.1 14.5 12.9 15.2 14.2 16.4"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
            />
            <path
              d="M17 12V18M14 15H20"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
            />
          </svg>
        );

      case "deal":
        return (
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
            <path
              d="M20 12.5L12.5 20L4 11.5V5H10.5L20 12.5Z"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinejoin="round"
            />
            <circle
              cx="8"
              cy="8"
              r="1.2"
              fill="currentColor"
            />
            <path
              d="M12 9L15 12"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
            />
          </svg>
        );

      case "task":
        return (
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
            <circle
              cx="12"
              cy="12"
              r="8"
              stroke="currentColor"
              strokeWidth="1.7"
            />
            <path
              d="M8 12L10.5 14.5L16 9"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );

      case "meeting":
        return (
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
            <rect
              x="4"
              y="5"
              width="16"
              height="15"
              rx="2"
              stroke="currentColor"
              strokeWidth="1.7"
            />
            <path
              d="M8 3V7M16 3V7M4 10H20"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
            />
          </svg>
        );

      case "view":
        return (
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
            <path
              d="M3 12C5.5 7.5 8.5 5.5 12 5.5C15.5 5.5 18.5 7.5 21 12C18.5 16.5 15.5 18.5 12 18.5C8.5 18.5 5.5 16.5 3 12Z"
              stroke="currentColor"
              strokeWidth="1.7"
            />
            <circle
              cx="12"
              cy="12"
              r="2.5"
              stroke="currentColor"
              strokeWidth="1.7"
            />
          </svg>
        );

      case "completed":
        return (
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
            <circle
              cx="12"
              cy="12"
              r="8"
              stroke="currentColor"
              strokeWidth="1.7"
            />
            <path
              d="M8 12L10.5 14.5L16 9"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );

      default:
        return (
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
            <rect
              x="4"
              y="5"
              width="16"
              height="14"
              rx="2"
              stroke="currentColor"
              strokeWidth="1.7"
            />
            <path
              d="M7 9H17M7 13H14"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
            />
          </svg>
        );
    }
  };

  const iconStyles = {
    lead: "bg-[#E0ECFF] text-[#3478C8]",
    deal: "bg-[#E2F3FF] text-[#1593D1]",
    task: "bg-[#FFF0D9] text-[#F28A00]",
    meeting: "bg-[#DDEBFF] text-[#7690AE]",
    view: "bg-[#E1EDFF] text-[#718BA8]",
    completed: "bg-[#E6F8ED] text-[#22B573]",
    activity: "bg-[#DDEBFF] text-[#6C87A5]",
  };

  return (
    <section className="w-full overflow-hidden rounded-[10px] border border-[#DCE5EF] bg-white">

      {/* Header */}
      <div className="border-b border-[#E1E8EF] px-4 py-3.5">
        <h2 className="text-[14px] font-bold text-[#102A43]">
          My Notifications
        </h2>

        <p className="mt-1 text-[9px] text-[#71869A]">
          Recent activity and updates related to your work.
        </p>
      </div>

      {/* Notifications */}
      <div>
        {notifications.map((notification, index) => (
          <div
            key={`${notification.title}-${index}`}
            className={`relative flex min-h-[62px] items-center gap-3 border-b border-[#E1E8EF] px-4 py-2.5 ${
              notification.active
                ? "before:absolute before:left-0 before:top-0 before:h-full before:w-[2px] before:bg-[#0794D8]"
                : ""
            }`}
          >
            {/* Icon */}
            <div
              className={`flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full ${
                iconStyles[notification.type]
              }`}
            >
              {getIcon(notification.type)}
            </div>

            {/* Content */}
            <div className="min-w-0 flex-1">
              <p
                className={`text-[10px] font-semibold ${
                  notification.active
                    ? "text-[#172F46]"
                    : "text-[#667C91]"
                }`}
              >
                {notification.title}
              </p>

              <p
                className={`mt-[2px] truncate text-[9px] ${
                  notification.active
                    ? "text-[#61768A]"
                    : "text-[#8293A3]"
                }`}
              >
                {notification.description}
              </p>

              {/* Action */}
              {notification.action && (
                <button
                  type="button"
                  className="mt-1 rounded-[4px] border border-[#D8E2EC] bg-white px-2 py-[2px] text-[8px] font-semibold text-[#173B5C]"
                >
                  {notification.action}
                </button>
              )}
            </div>

            {/* Time */}
            <span className="self-start pt-1 text-[8px] whitespace-nowrap text-[#8495A5]">
              {notification.time}
            </span>
          </div>
        ))}
      </div>

      {/* Load More */}
      <button
        type="button"
        className="flex h-[34px] w-full items-center justify-center bg-[#F8FAFC] text-[9px] font-semibold text-[#173B5C] transition hover:bg-[#F1F5F9]"
      >
        Load More Notifications
      </button>
    </section>
  );
};

export default MyNotifications;