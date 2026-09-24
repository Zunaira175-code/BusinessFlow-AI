import { useState } from "react";

const NotificationPreferences = () => {
  const [preferences, setPreferences] =
    useState({
      leads: true,
      deals: true,
      tasks: true,
      meetings: true,
    });

  const togglePreference = (key) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const items = [
    {
      key: "leads",
      title: "Leads",
      description: "Assignments & Updates",
    },
    {
      key: "deals",
      title: "Deals",
      description: "Stage changes & Wins",
    },
    {
      key: "tasks",
      title: "Tasks",
      description: "Due dates & completions",
    },
    {
      key: "meetings",
      title: "Meetings",
      description: "Reminders & changes",
    },
  ];

  return (
    <section className="w-full overflow-hidden rounded-[10px] border border-[#DCE5EF] bg-white">
      <div className="flex h-[48px] items-center gap-2 border-b border-[#E1E8EF] px-4">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          className="text-[#5B7187]"
        >
          <path
            d="M4 7H20"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />

          <path
            d="M4 17H20"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />

          <path
            d="M8 4V10"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />

          <path
            d="M16 14V20"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
        </svg>

        <h2 className="text-[14px] font-bold text-[#102A43]">
          Preferences
        </h2>
      </div>

      <div className="px-4 py-2.5">
        {items.map((item) => (
          <div
            key={item.key}
            className="flex items-center justify-between py-[5px]"
          >
            <div>
              <p className="text-[9px] font-bold leading-[12px] text-[#172F46]">
                {item.title}
              </p>

              <p className="text-[8px] leading-[11px] text-[#8192A2]">
                {item.description}
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                togglePreference(item.key)
              }
              aria-label={`Toggle ${item.title} notifications`}
              className={`relative h-[15px] w-[29px] shrink-0 rounded-full transition ${
                preferences[item.key]
                  ? "bg-[#0B3558]"
                  : "bg-[#C9D4DF]"
              }`}
            >
              <span
                className={`absolute top-[2px] h-[11px] w-[11px] rounded-full bg-white shadow-sm transition-all ${
                  preferences[item.key]
                    ? "right-[2px]"
                    : "left-[2px]"
                }`}
              />
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        className="flex h-[31px] w-full items-center justify-center gap-1.5 border-t border-[#E1E8EF] bg-[#F8FAFC] text-[9px] font-semibold text-[#173B5C] transition hover:bg-[#F1F5F9]"
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            cx="12"
            cy="12"
            r="3"
            stroke="currentColor"
            strokeWidth="1.7"
          />

          <path
            d="M19.4 15A1.7 1.7 0 0 0 19.7 17.1L19.8 17.2L17.2 19.8L17.1 19.7A1.7 1.7 0 0 0 15 19.4A1.7 1.7 0 0 0 13.8 21V21.1H10.2V21A1.7 1.7 0 0 0 9 19.4A1.7 1.7 0 0 0 6.9 19.7L6.8 19.8L4.2 17.2L4.3 17.1A1.7 1.7 0 0 0 4.6 15A1.7 1.7 0 0 0 3 13.8H2.9V10.2H3A1.7 1.7 0 0 0 4.6 9A1.7 1.7 0 0 0 4.3 6.9L4.2 6.8L6.8 4.2L6.9 4.3A1.7 1.7 0 0 0 9 4.6A1.7 1.7 0 0 0 10.2 3V2.9H13.8V3A1.7 1.7 0 0 0 15 4.6A1.7 1.7 0 0 0 17.1 4.3L17.2 4.2L19.8 6.8L19.7 6.9A1.7 1.7 0 0 0 19.4 9A1.7 1.7 0 0 0 21 10.2H21.1V13.8H21A1.7 1.7 0 0 0 19.4 15Z"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinejoin="round"
          />
        </svg>

        Manage Notification Settings
      </button>
    </section>
  );
};

export default NotificationPreferences;