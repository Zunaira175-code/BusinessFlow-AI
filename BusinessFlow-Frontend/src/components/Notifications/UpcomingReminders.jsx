const UpcomingReminders = () => {
  const reminders = [
    {
      title: "Follow-up",
      company: "Acme Corp",
      time: "2:00 PM",
      dot: "bg-[#F59E0B]",
    },
    {
      title: "Product Demo",
      company: "TechNova",
      time: "3:00 PM",
      dot: "bg-[#168BE0]",
    },
    {
      title: "Proposal Review",
      company: "Bright Systems",
      time: "Tomorrow",
      dot: "bg-[#16A34A]",
    },
    {
      title: "Deal Negotiation",
      company: "NovaTech",
      time: "Sep 3",
      dot: "bg-[#8493A3]",
    },
  ];

  return (
    <section className="w-full overflow-hidden rounded-[10px] border border-[#DCE5EF] bg-white">
      {/* Header */}
      <div className="flex h-[48px] items-center border-b border-[#E3EAF1] px-4">
        <div className="flex items-center gap-2">
          {/* Clock Icon */}
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            className="text-[#516B82]"
          >
            <circle
              cx="12"
              cy="12"
              r="8"
              stroke="currentColor"
              strokeWidth="1.8"
            />
            <path
              d="M12 8V12L15 14"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M5 4L3.5 5.5M19 4L20.5 5.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>

          <h2 className="text-[14px] font-bold text-[#102A43]">
            Upcoming Reminders
          </h2>
        </div>
      </div>

      {/* Reminder List */}
      <div className="px-4 py-2.5">
        {reminders.map((reminder) => (
          <div
            key={reminder.title}
            className="flex items-start gap-2.5 py-2"
          >
            {/* Dot */}
            <span
              className={`mt-[5px] h-[5px] w-[5px] shrink-0 rounded-full ${reminder.dot}`}
            />

            {/* Content */}
            <div className="min-w-0">
              <p className="text-[10px] font-bold leading-[13px] text-[#172F46]">
                {reminder.title}
              </p>

              <p className="mt-[1px] text-[9px] leading-[13px] text-[#71869A]">
                {reminder.company} • {reminder.time}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Calendar Button */}
      <button
        type="button"
        className="flex h-[31px] w-full items-center justify-center border-t border-[#E3EAF1] bg-[#F8FAFC] text-[9px] font-semibold text-[#173B5C] transition hover:bg-[#F1F5F9]"
      >
        View My Calendar
        <span className="ml-1 text-[12px]">→</span>
      </button>
    </section>
  );
};

export default UpcomingReminders;