const NotificationsPageHeader = ({ onMarkAllRead }) => {
  return (
    <div className="flex w-full items-start justify-between">
      <div>
        <h1
          className="
            text-[24px]
            font-bold
            leading-[30px]
            tracking-[-0.6px]
            text-[#071D35]
          "
        >
          Notifications
        </h1>

        <p className="mt-[3px] text-[10px] text-[#60758A]">
          Stay up to date with your leads, customers, deals, tasks, and meetings.
        </p>
      </div>

      <button
        type="button"
        onClick={onMarkAllRead}
        className="
          mt-1
          flex
          h-[30px]
          items-center
          gap-1.5
          rounded-[6px]
          border
          border-[#DCE5ED]
          bg-white
          px-3
          text-[8px]
          font-semibold
          text-[#17324D]
          transition
          hover:bg-[#F5F8FB]
        "
      >
        <span className="text-[10px]">✓</span>
        Mark All as Read
      </button>
    </div>
  );
};

export default NotificationsPageHeader;