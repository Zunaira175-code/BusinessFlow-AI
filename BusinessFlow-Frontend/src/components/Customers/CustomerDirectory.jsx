import {
  Filter,
  MoreVertical,
} from "lucide-react";

import Card from "../common/Card";
import Badge from "../common/Badge";
import IconButton from "../common/IconButton";

const customers = [
  {
    company: "Acme Corp",
    type: "Retail Enterprise",
    status: "Active",
    manager: "Sarah Jenkins",
    revenue: "$45,000",
    logo: "/images/customers/acme.png",
  },
  {
    company: "Global Dynamics",
    type: "Manufacturing",
    status: "Pending",
    manager: "Marcus Chen",
    revenue: "$12,500",
    logo: "/images/customers/global-dynamics.png",
  },
  {
    company: "TechFlow Inc",
    type: "SaaS Provider",
    status: "Active",
    manager: "Sarah Jenkins",
    revenue: "$89,200",
    logo: "/images/customers/techflow.png",
  },
  {
    company: "Stellar Logistics",
    type: "Transportation",
    status: "Inactive",
    manager: "David Kim",
    revenue: "$3,400",
    logo: "/images/customers/stellar.png",
  },
  {
    company: "BlueSky Partners",
    type: "Consulting",
    status: "Active",
    manager: "Elena Rodriguez",
    revenue: "$124,000",
    logo: "/images/customers/bluesky.png",
  },
  {
    company: "Nexus Industries",
    type: "Industrial",
    status: "Active",
    manager: "Alex Morgan",
    revenue: "$76,500",
    logo: "/images/customers/nexus.png",
  },
];

const statusStyles = {
  Active: "bg-[#EAF8F0] text-[#20A45A] border-[#C9EED8]",
  Pending: "bg-[#FFF4E5] text-[#E58A13] border-[#F6D9AE]",
  Inactive: "bg-[#FFECEE] text-[#E34D59] border-[#F6C9CD]",
};

const CustomerDirectory = () => {
  return (
    <Card
      className="
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
          h-[48px]
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
          Customer Directory
        </h2>

        <div className="flex items-center gap-[7px]">
          <IconButton
            icon={Filter}
            label="Filter customers"
            size={14}
            className="h-6 w-6 rounded-md"
          />

          <IconButton
            icon={MoreVertical}
            label="More options"
            size={14}
            className="h-6 w-6 rounded-md"
          />
        </div>
      </div>

      {/* =====================================================
          TABLE
      ====================================================== */}
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[560px] table-fixed border-collapse">

          {/* TABLE HEAD */}
          <thead>
            <tr className="h-[38px] border-b border-[#DDE5EC]">
              <th
                className="
                  w-[36%]
                  px-[14px]
                  text-left
                  align-middle
                  text-[8px]
                  font-bold
                  uppercase
                  leading-[11px]
                  tracking-[0.4px]
                  text-[#63788B]
                "
              >
                Customer Name & Company
              </th>

              <th
                className="
                  w-[17%]
                  px-[8px]
                  text-left
                  text-[8px]
                  font-bold
                  uppercase
                  tracking-[0.4px]
                  text-[#63788B]
                "
              >
                Status
              </th>

              <th
                className="
                  w-[25%]
                  px-[8px]
                  text-left
                  text-[8px]
                  font-bold
                  uppercase
                  leading-[11px]
                  tracking-[0.4px]
                  text-[#63788B]
                "
              >
                Account
                <br />
                Manager
              </th>

              <th
                className="
                  w-[22%]
                  px-[8px]
                  text-left
                  text-[8px]
                  font-bold
                  uppercase
                  leading-[11px]
                  tracking-[0.4px]
                  text-[#63788B]
                "
              >
                Total
                <br />
                Revenue
              </th>
            </tr>
          </thead>

          {/* TABLE BODY */}
          <tbody>
            {customers.map((customer) => (
              <tr
                key={customer.company}
                className="
                  h-[48px]
                  border-b
                  border-[#E3E9EE]
                  transition-colors
                  duration-150
                  hover:bg-[#FAFCFE]
                "
              >
                {/* CUSTOMER */}
                <td className="px-[14px]">
                  <div className="flex items-center gap-[8px]">

                    {/* Company Logo */}
                    <div
                      className="
                        flex
                        h-[24px]
                        w-[24px]
                        shrink-0
                        items-center
                        justify-center
                        overflow-hidden
                        rounded-[4px]
                        border
                        border-[#E1E8EE]
                        bg-[#F7F9FC]
                      "
                    >
                      <img
                        src={customer.logo}
                        alt=""
                        className="h-full w-full object-contain"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    </div>

                    <div className="min-w-0">
                      <p
                        className="
                          truncate
                          text-[9px]
                          font-semibold
                          leading-[12px]
                          text-[#17324D]
                        "
                      >
                        {customer.company}
                      </p>

                      <p
                        className="
                          mt-[1px]
                          truncate
                          text-[7px]
                          font-medium
                          leading-[10px]
                          text-[#8A9AA8]
                        "
                      >
                        {customer.type}
                      </p>
                    </div>
                  </div>
                </td>

                {/* STATUS */}
                <td className="px-[8px]">
                  <Badge
                    className={`
                      inline-flex
                      rounded-full
                      border
                      px-[7px]
                      py-[2px]
                      text-[7px]
                      font-semibold
                      leading-[10px]
                      ${statusStyles[customer.status]}
                    `}
                  >
                    {customer.status}
                  </Badge>
                </td>

                {/* MANAGER */}
                <td
                  className="
                    px-[8px]
                    text-[8px]
                    font-medium
                    text-[#63788B]
                  "
                >
                  {customer.manager}
                </td>

                {/* REVENUE */}
                <td
                  className="
                    px-[8px]
                    text-[8px]
                    font-semibold
                    text-[#17324D]
                  "
                >
                  {customer.revenue}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* =====================================================
          PAGINATION
      ====================================================== */}
      <div
        className="
          flex
          h-[38px]
          items-center
          justify-between
          border-t
          border-[#DDE5EC]
          px-[10px]
        "
      >
        <span
          className="
            text-[7px]
            font-medium
            text-[#8A9AA8]
          "
        >
          Showing 1-6 of 1,240
        </span>

        <div className="flex items-center gap-[5px]">

          <button
            type="button"
            className="
              px-[5px]
              text-[7px]
              font-medium
              text-[#A2AFBA]
            "
          >
            Prev
          </button>

          <button
            type="button"
            className="
              flex
              h-[19px]
              w-[19px]
              items-center
              justify-center
              rounded-[4px]
              bg-[#0B3D6B]
              text-[7px]
              font-semibold
              text-white
            "
          >
            1
          </button>

          <button
            type="button"
            className="
              flex
              h-[19px]
              w-[19px]
              items-center
              justify-center
              rounded-[4px]
              text-[7px]
              font-medium
              text-[#63788B]
              hover:bg-[#F3F6F9]
            "
          >
            2
          </button>

          <button
            type="button"
            className="
              flex
              h-[19px]
              w-[19px]
              items-center
              justify-center
              rounded-[4px]
              text-[7px]
              font-medium
              text-[#63788B]
              hover:bg-[#F3F6F9]
            "
          >
            3
          </button>

          <button
            type="button"
            className="
              px-[5px]
              text-[7px]
              font-medium
              text-[#63788B]
              hover:text-[#173B5C]
            "
          >
            Next
          </button>

        </div>
      </div>
    </Card>
  );
};

export default CustomerDirectory;