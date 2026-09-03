import {
  MessageSquare,
  BriefcaseBusiness,
  CalendarDays,
} from "lucide-react";

import Card from "../common/Card";
import Button from "../common/button";

const integrations = [
  {
    name: "Slack",
    description:
      "Receive important BusinessFlow AI notifications and team activity in Slack.",
    icon: MessageSquare,
  },
  {
    name: "Google Workspace",
    description:
      "Sync contacts and workspace information with Google Workspace.",
    icon: BriefcaseBusiness,
  },
  {
    name: "Microsoft Outlook",
    description:
      "Connect Outlook email and calendar services with BusinessFlow AI.",
    icon: CalendarDays,
  },
];

const ConnectedIntegrations = () => {
  return (
    <Card className="w-full overflow-hidden">
      {/* Header */}
      <div className="flex h-[50px] items-center border-b border-[#DCE5ED] px-[18px]">
        <h2 className="text-[14px] font-bold text-[#102F4A]">
          Connected Integrations
        </h2>
      </div>

      {/* Integration Rows */}
      <div>
        {integrations.map((integration, index) => {
          const Icon = integration.icon;

          return (
            <div
              key={integration.name}
              className={`
                flex
                min-h-[78px]
                items-center
                justify-between
                gap-4
                px-[18px]
                py-[12px]
                ${index !== integrations.length - 1
                  ? "border-b border-[#DCE5ED]"
                  : ""
                }
              `}
            >
              {/* Left */}
              <div className="flex min-w-0 items-center gap-3">
                <div
                  className="
                    flex
                    h-[38px]
                    w-[38px]
                    shrink-0
                    items-center
                    justify-center
                    rounded-[7px]
                    border
                    border-[#DCE5ED]
                    bg-[#F8FAFC]
                    text-[#315D80]
                  "
                >
                  <Icon size={17} strokeWidth={1.8} />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-[10px] font-bold text-[#17324D]">
                      {integration.name}
                    </h3>

                    <span
                      className="
                        rounded-[4px]
                        bg-[#E8F8EF]
                        px-[6px]
                        py-[2px]
                        text-[7px]
                        font-semibold
                        text-[#20A65A]
                      "
                    >
                      Connected
                    </span>
                  </div>

                  <p className="mt-1 max-w-[430px] text-[9px] leading-[13px] text-[#718599]">
                    {integration.description}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex shrink-0 items-center gap-1.5">
                <Button
                  variant="secondary"
                  className="
      h-[24px]
      rounded-[5px]
      border-[#D8E2EA]
      bg-[#EEF4FC]
      px-2
      text-[7px]
      font-semibold
      text-[#29465F]
      leading-none
    "
                >
                  Configure
                </Button>

                <Button
                  variant="secondary"
                  className="
      h-[24px]
      rounded-[5px]
      border-[#FFD5D5]
      bg-white
      px-2
      text-[7px]
      font-semibold
      text-[#EF4444]
      leading-none
      hover:bg-[#FFF7F7]
    "
                >
                  Disconnect
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default ConnectedIntegrations;