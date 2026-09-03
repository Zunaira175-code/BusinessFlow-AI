import {
  SlidersHorizontal,
  Mail,
} from "lucide-react";

import Card from "../common/Card";
import Avatar from "../common/Avatar";
import IconButton from "../common/IconButton";

const activities = [
  {
    type: "user",
    name: "Alex M.",
    text: "logged a call with Sarah Jenkins",
    time: "10 mins ago",
    avatar: "/images/leads/alex.jpg",
  },
  {
    type: "system",
    text: "Automated follow-up sent to TechFlow Inc",
    time: "45 mins ago",
  },
  {
    type: "user",
    name: "Jessica T.",
    text: "moved Global Dynamics to Closed Won",
    time: "2 hours ago",
    avatar: "/images/leads/jessica.jpg",
  },
  {
    type: "user",
    name: "You",
    text: "updated pricing for Nexus Industries",
    time: "3 hours ago",
    avatar: "/images/admin-avatar.jpg",
  },
];

const ActivityFeed = () => {
  return (
    <Card className="h-[330px] overflow-hidden">

      {/* Header */}
      <div
        className="
          flex
          h-[55px]
          items-center
          justify-between
          border-b
          border-[#DCE5ED]
          px-[14px]
        "
      >
        <h2
          className="
            text-[13px]
            font-bold
            tracking-[-0.1px]
            text-[#102F4A]
          "
        >
          Activity Feed
        </h2>

        <IconButton
          icon={SlidersHorizontal}
          label="Filter activity"
          size={14}
          className="
            h-6
            w-6
            rounded-[6px]
            text-[#60778B]
            hover:bg-[#F4F7FA]
          "
        />
      </div>

      {/* Activity List */}
      <div className="px-[14px] py-[12px]">

        {activities.map((activity, index) => {
          const isLast = index === activities.length - 1;

          return (
            <div
              key={`${activity.text}-${index}`}
              className="relative flex min-h-[58px]"
            >

              {/* Timeline */}
              {!isLast && (
                <div
                  className="
                    absolute
                    left-[13px]
                    top-[27px]
                    h-[45px]
                    w-px
                    bg-[#DCE5ED]
                  "
                />
              )}

              {/* Avatar / System Icon */}
              <div className="relative z-10 shrink-0">

                {activity.type === "user" ? (
                  <Avatar
                    src={activity.avatar}
                    alt={activity.name}
                    size="sm"
                  />
                ) : (
                  <div
                    className="
                      flex
                      h-[27px]
                      w-[27px]
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-[#D8E4EF]
                      bg-[#EEF4FA]
                      text-[#315D80]
                    "
                  >
                    <Mail
                      size={12}
                      strokeWidth={1.8}
                    />
                  </div>
                )}

              </div>

              {/* Content */}
              <div className="ml-[10px] min-w-0 pt-0">

                <p
                  className="
                    max-w-[200px]
                    text-[9px]
                    font-medium
                    leading-[13px]
                    text-[#28445D]
                  "
                >
                  {activity.type === "user" && (
                    <span className="font-bold">
                      {activity.name}{" "}
                    </span>
                  )}

                  {activity.text}
                </p>

                <p
                  className="
                    mt-[2px]
                    text-[8px]
                    font-medium
                    leading-[11px]
                    text-[#8A99A7]
                  "
                >
                  {activity.time}
                </p>

              </div>

            </div>
          );
        })}

      </div>
    </Card>
  );
};

export default ActivityFeed;