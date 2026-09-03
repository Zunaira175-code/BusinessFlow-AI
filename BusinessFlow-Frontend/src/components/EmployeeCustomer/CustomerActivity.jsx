import {
  CheckCircle2,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

import Card from "../common/Card";

const activities = [
  {
    type: "success",
    time: "2 hours ago",
    title: "John Carter follow-up completed.",
    description: "Notes added regarding Q4 expansion.",
  },
  {
    type: "success",
    time: "Yesterday",
    title: "Contract renewed for Emily Stone (TechNova).",
    description: "Value updated.",
  },
  {
    type: "danger",
    time: "Aug 28",
    title: "David Miller flagged as At Risk",
    description: "due to low engagement score.",
  },
];

const CustomerActivity = () => {
  return (
    <Card className="w-full overflow-hidden">
      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="px-4 pt-4">
        <h2
          className="
            text-[13px]
            font-bold
            text-[#17324D]
          "
        >
          My Customer Activity
        </h2>

        <div className="mt-2 h-px w-full bg-[#DCE5ED]" />
      </div>

      {/* =====================================================
          ACTIVITY LIST
      ====================================================== */}

      <div className="px-4 pb-4 pt-3">
        <div className="relative">

          {/* Vertical Timeline */}
          <div
            className="
              absolute
              left-[4px]
              top-[7px]
              bottom-[7px]
              w-px
              bg-[#D7E4EF]
            "
          />

          <div className="space-y-4">
            {activities.map((activity, index) => {
              const isDanger = activity.type === "danger";

              return (
                <div
                  key={`${activity.time}-${index}`}
                  className="relative flex gap-3"
                >
                  {/* =================================================
                      TIMELINE DOT
                  ================================================= */}

                  <div
                    className={`
                      relative
                      z-10
                      mt-[3px]
                      h-[9px]
                      w-[9px]
                      shrink-0
                      rounded-full
                      border-2
                      border-white
                      ${
                        isDanger
                          ? "bg-[#EF4444]"
                          : "bg-[#20A65A]"
                      }
                    `}
                  />

                  {/* =================================================
                      CONTENT
                  ================================================= */}

                  <div className="min-w-0 flex-1">
                    {/* Time */}
                    <p
                      className="
                        text-[8px]
                        font-medium
                        text-[#718599]
                      "
                    >
                      {activity.time}
                    </p>

                    {/* Main text */}
                    <p
                      className={`
                        mt-[4px]
                        text-[9px]
                        leading-[14px]
                        ${
                          isDanger
                            ? "font-semibold text-[#17324D]"
                            : "font-semibold text-[#17324D]"
                        }
                      `}
                    >
                      {activity.title}

                      {isDanger && (
                        <span className="text-[#EF4444]">
                          {" "}
                          At Risk
                        </span>
                      )}
                    </p>

                    {/* Description */}
                    <p
                      className="
                        text-[9px]
                        leading-[14px]
                        text-[#17324D]
                      "
                    >
                      {activity.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CustomerActivity;