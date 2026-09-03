import {
  CircleCheck,
  Phone,
  UserPlus,
  FileText,
} from "lucide-react";

/* =========================================================
   ACTIVITY DATA
========================================================= */

const activities = [
  {
    id: 1,
    type: "qualified",
    title: "Sarah Johnson moved to Qualified",
    time: "Today, 10:45 AM",
  },
  {
    id: 2,
    type: "followup",
    title: "Follow-up logged for Michael Davis",
    time: "Today, 09:15 AM",
  },
  {
    id: 3,
    type: "assigned",
    title: "New lead Emma Wilson assigned to you",
    time: "Yesterday, 04:30 PM",
  },
  {
    id: 4,
    type: "proposal",
    title: "Proposal sent to Daniel Brown",
    time: "Yesterday, 11:20 AM",
  },
];

/* =========================================================
   ACTIVITY ICON
========================================================= */

const ActivityIcon = ({ type }) => {
  const config = {
    qualified: {
      icon: CircleCheck,
      wrapper: "bg-[#DCEAFF]",
      iconColor: "text-[#4B78B8]",
    },

    followup: {
      icon: Phone,
      wrapper: "bg-[#E4EEFF]",
      iconColor: "text-[#4B78B8]",
    },

    assigned: {
      icon: UserPlus,
      wrapper: "bg-[#DCEAFF]",
      iconColor: "text-[#4B78B8]",
    },

    proposal: {
      icon: FileText,
      wrapper: "bg-[#FFF0C7]",
      iconColor: "text-[#D18A00]",
    },
  };

  const current = config[type] || config.qualified;
  const Icon = current.icon;

  return (
    <div
      className={`
        relative
        z-10
        flex
        h-[22px]
        w-[22px]
        shrink-0
        items-center
        justify-center
        rounded-full
        ${current.wrapper}
      `}
    >
      <Icon
        size={11}
        strokeWidth={1.8}
        className={current.iconColor}
      />
    </div>
  );
};

/* =========================================================
   LEAD ACTIVITY
========================================================= */

const LeadActivity = () => {
  return (
    <div
      className="
        w-full
        rounded-[9px]
        border
        border-[#DCE5ED]
        bg-white
        px-4
        py-4
        shadow-[0_1px_2px_rgba(15,23,42,0.03)]
      "
    >
      {/* =================================================
          HEADER
      ================================================== */}

      <div>
        <h2
          className="
            text-[13px]
            font-bold
            text-[#17324D]
          "
        >
          My Lead Activity
        </h2>

        <div
          className="
            mt-2
            h-px
            w-full
            bg-[#E2E9EF]
          "
        />
      </div>

      {/* =================================================
          TIMELINE
      ================================================== */}

      <div className="relative mt-3">
        {/* Timeline Line */}
        <div
          className="
            absolute
            bottom-[11px]
            left-[10px]
            top-[11px]
            w-px
            bg-[#C9DDF3]
          "
        />

        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="
                relative
                flex
                items-start
                gap-3
              "
            >
              {/* Icon */}
              <ActivityIcon type={activity.type} />

              {/* Content */}
              <div className="min-w-0 flex-1 pt-[1px]">
                <p
                  className="
                    text-[8px]
                    font-semibold
                    leading-[12px]
                    text-[#17324D]
                  "
                >
                  {activity.title}
                </p>

                <p
                  className="
                    mt-[2px]
                    text-[7px]
                    leading-[10px]
                    text-[#718599]
                  "
                >
                  {activity.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LeadActivity;