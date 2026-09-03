import {
  CircleAlert,
  CircleCheck,
  Info,
} from "lucide-react";

import Card from "../common/Card";

const insights = [
  {
    type: "info",
    title: "Lead Prioritization",
    description:
      "Focus on Global Dynamics and Nexus Industries today. Their engagement scores are in the top 5% across your pipeline.",
    action: "Review top leads",
    icon: Info,
  },
  {
    type: "warning",
    title: "Deal Risk Alert",
    description:
      "The Acme Corp renewal is at risk. 14 days since last contact and usage metrics show a 20% week-over-week decline.",
    action: "View risk details",
    icon: CircleAlert,
  },
  {
    type: "success",
    title: "Optimal Follow-up",
    description:
      "TechFlow decision makers typically open emails between 2 PM and 4 PM on Tuesdays. Draft your proposal now.",
    action: "Schedule email",
    icon: CircleCheck,
  },
];

const styles = {
  info: {
    border: "border-t-[#8BC9F4]",
    iconBg: "bg-[#EAF6FF]",
    iconBorder: "border-[#B9E1FA]",
    iconColor: "text-[#1592D0]",
    actionColor: "text-[#1592D0]",
  },

  warning: {
    border: "border-t-[#E9C17D]",
    iconBg: "bg-[#FFF8EC]",
    iconBorder: "border-[#F2D8AC]",
    iconColor: "text-[#D99022]",
    actionColor: "text-[#D99022]",
  },

  success: {
    border: "border-t-[#81D4AE]",
    iconBg: "bg-[#EFFBF5]",
    iconBorder: "border-[#BCE8D2]",
    iconColor: "text-[#22A866]",
    actionColor: "text-[#22A866]",
  },
};

const InsightCards = () => {
  return (
    <section className="grid grid-cols-3 gap-5">
      {insights.map((item) => {
        const Icon = item.icon;
        const style = styles[item.type];

        return (
          <Card
            key={item.title}
            className={`
              h-[210px]
              overflow-hidden
              rounded-[10px]
              border-t-[3px]
              ${style.border}
              bg-[#FAFCFF]
              px-[22px]
              py-[20px]
            `}
          >
            {/* Header */}
            <div className="flex items-center gap-3">
              <div
                className={`
                  flex
                  h-[36px]
                  w-[36px]
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  border
                  ${style.iconBg}
                  ${style.iconBorder}
                  ${style.iconColor}
                `}
              >
                <Icon
                  size={17}
                  strokeWidth={2}
                />
              </div>

              <h3
                className="
                  text-[15px]
                  font-semibold
                  tracking-[-0.1px]
                  text-[#173750]
                "
              >
                {item.title}
              </h3>
            </div>

            {/* Description */}
            <p
              className="
                mt-[13px]
                max-w-[290px]
                text-[12px]
                font-medium
                leading-[19px]
                text-[#63788B]
              "
            >
              {item.description}
            </p>

            {/* Action */}
            <button
              type="button"
              className={`
                mt-[16px]
                text-[11px]
                font-bold
                transition-opacity
                hover:opacity-70
                ${style.actionColor}
              `}
            >
              {item.action} →
            </button>
          </Card>
        );
      })}
    </section>
  );
};

export default InsightCards;