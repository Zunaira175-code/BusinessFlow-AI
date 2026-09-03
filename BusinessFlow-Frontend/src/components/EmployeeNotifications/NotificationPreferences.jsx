import { SlidersHorizontal } from "lucide-react";

const preferences = [
  {
    title: "Leads",
    description: "Assignments & Updates",
  },
  {
    title: "Deals",
    description: "Stage changes & Wins",
  },
  {
    title: "Tasks",
    description: "Due dates & completions",
  },
  {
    title: "Meetings",
    description: "Reminders & changes",
  },
];

const NotificationPreferences = () => {
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
      <div
        className="
          flex
          h-[51px]
          items-center
          gap-2
          border-b
          border-[#DCE5ED]
          px-4
        "
      >
        <SlidersHorizontal
          size={13}
          strokeWidth={1.7}
          className="text-[#60758A]"
        />

        <h2 className="text-[13px] font-bold text-[#17324D]">
          Preferences
        </h2>
      </div>

      {/* Preferences */}
      <div className="px-4 py-2">
        {preferences.map((item) => (
          <div
            key={item.title}
            className="flex items-center justify-between py-[7px]"
          >
            <div>
              <p className="text-[8px] font-semibold text-[#17324D]">
                {item.title}
              </p>

              <p className="mt-[2px] text-[7px] text-[#8A9AA8]">
                {item.description}
              </p>
            </div>

            {/* Toggle */}
            <button
              type="button"
              aria-label={`Toggle ${item.title}`}
              className="
                relative
                h-[16px]
                w-[29px]
                rounded-full
                bg-[#0B3155]
              "
            >
              <span
                className="
                  absolute
                  right-[2px]
                  top-[2px]
                  h-[12px]
                  w-[12px]
                  rounded-full
                  bg-white
                "
              />
            </button>
          </div>
        ))}
      </div>

      {/* Settings */}
      <button
        type="button"
        className="
          flex
          h-[32px]
          w-full
          items-center
          justify-center
          gap-1.5
          border-t
          border-[#DCE5ED]
          bg-[#FBFCFD]
          text-[8px]
          font-semibold
          text-[#17324D]
        "
      >
        ⚙ Manage Notification Settings
      </button>
    </section>
  );
};

export default NotificationPreferences;