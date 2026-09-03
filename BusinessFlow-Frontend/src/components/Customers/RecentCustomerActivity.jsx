import {
  Filter,
  Headphones,
  CalendarDays,
} from "lucide-react";

import Card from "../common/Card";
import Avatar from "../common/Avatar";

const activities = [
  {
    name: "Sarah Jenkins",
    action: "logged a quarterly review with Acme Corp",
    time: "10 mins ago",
    type: "avatar",
    image: "/images/team/sarah-jenkins.jpg",
  },
  {
    name: "",
    action: "New support ticket opened by TechFlow Inc",
    time: "45 mins ago",
    type: "icon",
  },
  {
    name: "Marcus Chen",
    action: "updated contact details for Global Dynamics",
    time: "2 hours ago",
    type: "avatar",
    image: "/images/team/marcus-chen.jpg",
  },
  {
    name: "",
    action: "You added a note to Stellar Logistics",
    time: "4 hours ago",
    type: "avatar",
    image: "/images/admin-avatar.jpg",
  },
  {
    name: "",
    action: "Onboarding meeting scheduled with BlueSky Partners",
    time: "",
    type: "icon",
  },
];

const RecentCustomerActivity = () => {
  return (
    <Card
      className="
        mt-5
        w-full
        overflow-hidden
        rounded-[9px]
        border-[#DCE5ED]
        bg-white
      "
    >
      {/* =====================================================
          HEADER
      ====================================================== */}
      <div
        className="
          flex
          h-[47px]
          items-center
          justify-between
          border-b
          border-[#DDE5EC]
          px-[14px]
        "
      >
        <h2
          className="
            text-[12px]
            font-bold
            text-[#102F4A]
          "
        >
          Recent Customer Activity
        </h2>

        <button
          type="button"
          aria-label="Filter activity"
          className="
            flex
            h-6
            w-6
            items-center
            justify-center
            rounded-md
            text-[#718599]
            transition-colors
            hover:bg-[#F3F6F9]
            hover:text-[#173B5C]
          "
        >
          <Filter
            size={13}
            strokeWidth={1.8}
          />
        </button>
      </div>

      {/* =====================================================
          ACTIVITY LIST
      ====================================================== */}
      <div className="px-[14px] py-[9px]">

        {activities.map((activity, index) => {
          const isLast = index === activities.length - 1;

          return (
            <div
              key={`${activity.action}-${index}`}
              className="relative flex min-h-[47px]"
            >
              {/* =================================================
                  TIMELINE LINE
              ================================================== */}
              {!isLast && (
                <span
                  className="
                    absolute
                    left-[10px]
                    top-[28px]
                    h-[31px]
                    w-px
                    bg-[#DDE5EC]
                  "
                />
              )}

              {/* =================================================
                  AVATAR / ICON
              ================================================== */}
              <div className="relative z-10 mr-[10px] shrink-0">

                {activity.type === "avatar" ? (
                  <Avatar
                    src={activity.image}
                    alt={activity.name || "Activity"}
                    className="
                      h-[21px]
                      w-[21px]
                      border
                      border-white
                    "
                  />
                ) : (
                  <div
                    className="
                      flex
                      h-[21px]
                      w-[21px]
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-[#DCE6F0]
                      bg-[#EEF4FC]
                      text-[#496A87]
                    "
                  >
                    {index === 1 ? (
                      <Headphones
                        size={10}
                        strokeWidth={1.8}
                      />
                    ) : (
                      <CalendarDays
                        size={10}
                        strokeWidth={1.8}
                      />
                    )}
                  </div>
                )}

              </div>

              {/* =================================================
                  ACTIVITY CONTENT
              ================================================== */}
              <div className="min-w-0 pt-[1px]">

                <p
                  className="
                    text-[8px]
                    font-semibold
                    leading-[12px]
                    text-[#17324D]
                  "
                >
                  {activity.name && (
                    <span>{activity.name} </span>
                  )}

                  <span className="font-semibold">
                    {activity.action}
                  </span>
                </p>

                {activity.time && (
                  <p
                    className="
                      mt-[2px]
                      text-[7px]
                      font-medium
                      leading-[10px]
                      text-[#91A0AE]
                    "
                  >
                    {activity.time}
                  </p>
                )}

              </div>
            </div>
          );
        })}

      </div>
    </Card>
  );
};

export default RecentCustomerActivity;