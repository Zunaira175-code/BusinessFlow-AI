const NotificationStats = () => {
  const stats = [
    {
      title: "ALL NOTIFICATIONS",
      value: "24",
      unread: "8 unread",
      icon: (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M18 8A6 6 0 0 0 6 8C6 15 3 15 3 17H21C21 15 18 15 18 8Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M10 21H14"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      ),
      badgeClass: "bg-[#FFD9D9] text-[#E53935]",
    },
    {
      title: "LEADS",
      value: "7",
      unread: "3 unread",
      icon: (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M16 21V19C16 16.8 14.2 15 12 15H6C3.8 15 2 16.8 2 19V21"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <circle
            cx="9"
            cy="7"
            r="4"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <path
            d="M19 8V14M16 11H22"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      ),
      badgeClass: "bg-[#FFE8C7] text-[#D97706]",
    },
    {
      title: "DEALS",
      value: "6",
      unread: "2 unread",
      icon: (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M20.5 13.5L13.5 20.5C12.7 21.3 11.3 21.3 10.5 20.5L3.5 13.5C2.7 12.7 2.7 11.3 3.5 10.5L10.5 3.5C11.3 2.7 12.7 2.7 13.5 3.5L20.5 10.5C21.3 11.3 21.3 12.7 20.5 13.5Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path
            d="M9 9L15 15"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <circle cx="9" cy="9" r="1" fill="currentColor" />
          <circle cx="15" cy="15" r="1" fill="currentColor" />
        </svg>
      ),
      badgeClass: "bg-[#DDF3FF] text-[#1686C4]",
    },
    {
      title: "TASKS & MEETINGS",
      value: "11",
      unread: "3 unread",
      icon: (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="3"
            y="5"
            width="18"
            height="16"
            rx="2"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <path
            d="M8 3V7M16 3V7M3 10H21"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M8 14H10M14 14H16M8 17H10"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      ),
      badgeClass: "bg-[#FFD9D9] text-[#E53935]",
    },
  ];

  return (
    <section className="grid w-full grid-cols-4 gap-3">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className="relative min-h-[100px] rounded-[10px] border border-[#DCE5EF] bg-white px-3.5 py-3 shadow-[0_1px_2px_rgba(15,35,55,0.03)]"
        >
          {/* Icon */}
          <div className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-[6px] bg-[#E4F0FF] text-[#174A78]">
            {stat.icon}
          </div>

          {/* Title */}
          <p className="pr-8 text-[9px] font-semibold uppercase tracking-[0.04em] text-[#5F7488]">
            {stat.title}
          </p>

          {/* Value */}
          <p className="mt-4 text-[21px] font-bold leading-none text-[#0B2239]">
            {stat.value}
          </p>

          {/* Unread */}
          <span
            className={`mt-2 inline-flex items-center rounded-full px-2 py-[2px] text-[8px] font-semibold ${stat.badgeClass}`}
          >
            {stat.unread}
          </span>
        </div>
      ))}
    </section>
  );
};

export default NotificationStats;