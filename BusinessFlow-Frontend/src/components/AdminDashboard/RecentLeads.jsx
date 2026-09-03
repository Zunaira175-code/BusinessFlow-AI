import { SlidersHorizontal } from "lucide-react";

import Card from "../common/Card";
import Avatar from "../common/Avatar";
import Badge from "../common/Badge";
import IconButton from "../common/IconButton";
import SearchInput from "../common/SearchInput";

const leads = [
  {
    name: "Sarah Jenkins",
    company: "Acme Corp",
    value: "$45,000",
    status: "New",
    assignedTo: "Alex M.",
    activity: "2 hours ago",
    avatar: "/images/leads/sarah.jpg",
  },
  {
    name: "Michael Chen",
    company: "TechFlow Inc",
    value: "$12,500",
    status: "Contacted",
    assignedTo: "Jessica T.",
    activity: "Yesterday",
    avatar: "/images/leads/michael.jpg",
  },
  {
    name: "Elena Rodriguez",
    company: "Global Dynamics",
    value: "$85,000",
    status: "Qualified",
    assignedTo: "Alex M.",
    activity: "Today, 9:30 AM",
    avatar: "/images/leads/elena.jpg",
  },
  {
    name: "David Wilson",
    company: "Nexus Industries",
    value: "$120,000",
    status: "Proposal Sent",
    assignedTo: "Admin User",
    activity: "3 days ago",
    avatar: "/images/leads/david.jpg",
  },
  {
    name: "Jessica Moore",
    company: "Stellar Logistics",
    value: "$34,500",
    status: "New",
    assignedTo: "Unassigned",
    activity: "4 hours ago",
    avatar: "/images/leads/jessica.jpg",
  },
  {
    name: "Daniel Smith",
    company: "BlueSky Partners",
    value: "$8,000",
    status: "Lost",
    assignedTo: "Jessica T.",
    activity: "Last week",
    avatar: "/images/leads/daniel.jpg",
  },
];

const getBadgeVariant = (status) => {
  switch (status) {
    case "New":
      return "info";
    case "Contacted":
      return "warning";
    case "Qualified":
      return "success";
    case "Proposal Sent":
      return "primary";
    case "Lost":
      return "danger";
    default:
      return "default";
  }
};

const RecentLeads = () => {
  return (
    <Card className="w-full overflow-hidden">

      {/* =====================================================
          HEADER
      ====================================================== */}
      <div
        className="
          flex
          h-[60px]
          items-center
          justify-between
          border-b
          border-[#DCE5ED]
          px-[14px]
        "
      >
        {/* Title */}
        <h2
          className="
            text-[13px]
            font-bold
            tracking-[-0.1px]
            text-[#102F4A]
          "
        >
          Recent Leads
        </h2>

        {/* Actions */}
        <div className="flex items-center gap-2">

          <SearchInput
            placeholder="Search leads..."
            className="w-[200px]"
          />

          <IconButton
            icon={SlidersHorizontal}
            label="Filter leads"
            size={14}
            className="
              h-[30px]
              w-[30px]
              rounded-[6px]
              border
              border-[#D8E2EA]
              bg-white
              text-[#526B80]
              hover:bg-[#F5F8FB]
            "
          />

          <button
            type="button"
            className="
              ml-0.5
              whitespace-nowrap
              text-[9px]
              font-semibold
              text-[#193B5B]
              transition-colors
              hover:text-[#0B3D6B]
            "
          >
            View All
          </button>

        </div>
      </div>

      {/* =====================================================
          TABLE
      ====================================================== */}
      <div className="w-full overflow-x-auto">

        <table className="w-full min-w-[760px] border-collapse">

          {/* Table Header */}
          <thead>
            <tr
              className="
                h-[36px]
                border-b
                border-[#DCE5ED]
                bg-[#FCFDFE]
              "
            >

              <th className="w-[27%] px-[14px] text-left">
                <span className="text-[8px] font-semibold tracking-[0.5px] text-[#657A8D]">
                  NAME &amp; COMPANY
                </span>
              </th>

              <th className="w-[16%] px-2 text-left">
                <span className="text-[8px] font-semibold tracking-[0.5px] text-[#657A8D]">
                  VALUE
                </span>
              </th>

              <th className="w-[16%] px-2 text-left">
                <span className="text-[8px] font-semibold tracking-[0.5px] text-[#657A8D]">
                  STATUS
                </span>
              </th>

              <th className="w-[17%] px-2 text-left">
                <span className="text-[8px] font-semibold tracking-[0.5px] text-[#657A8D]">
                  ASSIGNED TO
                </span>
              </th>

              <th className="w-[17%] px-2 text-left">
                <span className="text-[8px] font-semibold tracking-[0.5px] text-[#657A8D]">
                  LAST ACTIVITY
                </span>
              </th>

              <th className="w-[7%] px-2 text-left">
                <span className="text-[8px] font-semibold tracking-[0.5px] text-[#657A8D]">
                  ACTION
                </span>
              </th>

            </tr>
          </thead>

          {/* Table Body */}
          <tbody>

            {leads.map((lead) => (
              <tr
                key={lead.name}
                className="
                  h-[52px]
                  border-b
                  border-[#E2E9EF]
                  transition-colors
                  duration-150
                  last:border-b-0
                  hover:bg-[#FAFCFE]
                "
              >

                {/* Name & Company */}
                <td className="px-[14px]">

                  <div className="flex items-center gap-2">

                    <Avatar
                      src={lead.avatar}
                      alt={lead.name}
                      size="sm"
                    />

                    <div className="min-w-0">

                      <p
                        className="
                          truncate
                          text-[9px]
                          font-semibold
                          leading-[12px]
                          text-[#173750]
                        "
                      >
                        {lead.name}
                      </p>

                      <p
                        className="
                          mt-[2px]
                          truncate
                          text-[8px]
                          font-medium
                          leading-[10px]
                          text-[#8292A1]
                        "
                      >
                        {lead.company}
                      </p>

                    </div>

                  </div>

                </td>

                {/* Value */}
                <td className="px-2">
                  <span
                    className="
                      text-[9px]
                      font-semibold
                      text-[#173750]
                    "
                  >
                    {lead.value}
                  </span>
                </td>

                {/* Status */}
                <td className="px-2">
                  <Badge
                    variant={getBadgeVariant(lead.status)}
                    className="text-[7px]"
                  >
                    {lead.status}
                  </Badge>
                </td>

                {/* Assigned To */}
                <td className="px-2">
                  <span
                    className="
                      text-[8px]
                      font-medium
                      text-[#6F8294]
                    "
                  >
                    {lead.assignedTo}
                  </span>
                </td>

                {/* Last Activity */}
                <td className="px-2">
                  <span
                    className="
                      whitespace-nowrap
                      text-[8px]
                      font-medium
                      text-[#6F8294]
                    "
                  >
                    {lead.activity}
                  </span>
                </td>

                {/* Action */}
                <td className="px-2">

                  <button
                    type="button"
                    aria-label={`Open ${lead.name}`}
                    className="
                      text-[10px]
                      font-medium
                      text-[#6F8294]
                      transition-colors
                      hover:text-[#0B3D6B]
                    "
                  >
                    •••
                  </button>

                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </Card>
  );
};

export default RecentLeads;