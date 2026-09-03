import {
  BriefcaseBusiness,
  CircleDollarSign,
  Globe,
  Search,
  Clock3,
  UsersRound,
} from "lucide-react";

import Card from "../common/Card";
import IntegrationCard from "../common/IntegrationCard";

const integrations = [
  {
    name: "LinkedIn",
    description:
      "Import leads and client opportunities from LinkedIn and manage them directly in BusinessFlow AI.",
    icon: UsersRound,
    action: "Connect",
  },
  {
    name: "Upwork",
    description:
      "Import project opportunities and client information from Upwork.",
    icon: BriefcaseBusiness,
    action: "Connect",
  },
  {
    name: "Fiverr",
    description:
      "Manage Fiverr client opportunities and lead information.",
    icon: CircleDollarSign,
    action: "Connect",
    iconClassName: "text-[#20A65A]",
  },
  {
    name: "Website (Lead Capture)",
    description:
      "Capture leads from your website forms directly into BusinessFlow AI.",
    icon: Globe,
    action: "Configure",
  },
  {
    name: "Guru.com",
    description:
      "Import project opportunities and client information from Guru.com.",
    icon: BriefcaseBusiness,
    action: "Connect",
  },
  {
    name: "PeoplePerHour",
    description:
      "Track client opportunities from PeoplePerHour.",
    icon: Clock3,
    action: "Connect",
    iconClassName: "text-[#E88918]",
  },
];

const AvailableIntegrations = () => {
  return (
    <Card className="w-full overflow-hidden">

      {/* Header */}
      <div
        className="
          flex
          h-[50px]
          items-center
          justify-between
          border-b
          border-[#DCE5ED]
          px-[18px]
        "
      >
        <h2 className="text-[14px] font-bold text-[#102F4A]">
          Available Integrations
        </h2>

        <div
          className="
            flex
            h-[28px]
            w-[145px]
            items-center
            gap-2
            rounded-[6px]
            border
            border-[#D8E2EA]
            bg-white
            px-2
          "
        >
          <Search
            size={12}
            strokeWidth={1.8}
            className="text-[#718599]"
          />

          <input
            type="text"
            placeholder="Search apps..."
            className="
              w-full
              bg-transparent
              text-[8px]
              text-[#29465C]
              outline-none
              placeholder:text-[#9AA8B5]
            "
          />
        </div>
      </div>

      {/* Available Integration Cards */}
      <div className="grid grid-cols-2 gap-3 p-[14px]">
        {integrations.map((integration) => (
          <IntegrationCard
            key={integration.name}
            icon={integration.icon}
            name={integration.name}
            description={integration.description}
            action={integration.action}
            iconClassName={integration.iconClassName}
          />
        ))}
      </div>

    </Card>
  );
};

export default AvailableIntegrations;