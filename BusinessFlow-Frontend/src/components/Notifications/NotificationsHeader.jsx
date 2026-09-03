const NotificationsHeader = () => {
  return (
    <section className="w-full flex items-start justify-between gap-6">
      {/* Left Side */}
      <div>
        <h1 className="text-[24px] font-bold leading-[30px] text-[#0B2239]">
          Notifications
        </h1>

        <p className="mt-1 text-[12px] leading-[18px] text-[#5F7488]">
          Stay up to date with your leads, customers, deals, tasks, and meetings.
        </p>
      </div>

      {/* Right Side */}
      <button
        type="button"
        className="flex h-[36px] items-center gap-2 rounded-[7px] border border-[#D9E3ED] bg-white px-4 text-[11px] font-semibold text-[#17324D] shadow-sm transition hover:bg-[#F7F9FC]"
      >
        {/* Check icon */}
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="shrink-0"
        >
          <path
            d="M5 12.5L9.5 17L19 7.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M3 12.5L7.5 17"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        Mark All as Read
      </button>
    </section>
  );
};

export default NotificationsHeader;