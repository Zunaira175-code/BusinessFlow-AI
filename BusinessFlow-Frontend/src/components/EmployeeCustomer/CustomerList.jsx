import { useState } from "react";
import {
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const customers = [
  {
    name: "John Carter",
    initials: "JC",
    company: "Acme Corporation",
    status: "Active",
    lastContact: "Today",
    nextFollowUp: "Tomorrow",
    value: "$24,500",
  },
  {
    name: "Emily Stone",
    initials: "ES",
    company: "TechNova",
    status: "Active",
    lastContact: "Yesterday",
    nextFollowUp: "Sep 02, 2026",
    value: "$18,200",
  },
  {
    name: "David Miller",
    initials: "DM",
    company: "Bright Systems",
    status: "At Risk",
    lastContact: "Aug 28, 2026",
    nextFollowUp: "Today ⚠",
    value: "$12,800",
  },
  {
    name: "Sophia Williams",
    initials: "",
    avatar: "https://i.pravatar.cc/100?img=47",
    company: "NovaTech",
    status: "Active",
    lastContact: "Aug 27, 2026",
    nextFollowUp: "Sep 04, 2026",
    value: "$31,400",
  },
  {
    name: "James Anderson",
    initials: "JA",
    company: "Vertex Solutions",
    status: "Inactive",
    lastContact: "Aug 20, 2026",
    nextFollowUp: "—",
    value: "$7,600",
  },
];

const CustomerList = () => {
  const [selectedCustomers, setSelectedCustomers] = useState([]);

  const toggleCustomer = (name) => {
    setSelectedCustomers((prev) =>
      prev.includes(name)
        ? prev.filter((item) => item !== name)
        : [...prev, name]
    );
  };

  const toggleAll = () => {
    if (selectedCustomers.length === customers.length) {
      setSelectedCustomers([]);
    } else {
      setSelectedCustomers(customers.map((customer) => customer.name));
    }
  };

  return (
    <div
      className="
        w-full
        overflow-hidden
        rounded-[9px]
        border
        border-[#DCE5ED]
        bg-white
        shadow-[0_1px_2px_rgba(7,29,53,0.03)]
      "
    >
      {/* =====================================================
          HEADER
      ====================================================== */}

      <div
        className="
          flex
          h-[45px]
          items-center
          justify-between
          border-b
          border-[#DCE5ED]
          px-3
        "
      >
        <h2
          className="
            text-[13px]
            font-bold
            text-[#102F4A]
          "
        >
          Customer List
        </h2>

        <button
          type="button"
          className="
            text-[8px]
            font-semibold
            text-[#315D80]
            transition-colors
            hover:text-[#0B3D6B]
          "
        >
          View All
        </button>
      </div>

      {/* =====================================================
          TABLE
      ====================================================== */}

      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse">
          <thead>
            <tr className="h-[32px] border-b border-[#DCE5ED] bg-[#F8FAFC]">
              {/* Checkbox */}
              <th className="w-[38px] px-3 text-left">
                <input
                  type="checkbox"
                  checked={
                    selectedCustomers.length === customers.length
                  }
                  onChange={toggleAll}
                  className="
                    h-[11px]
                    w-[11px]
                    cursor-pointer
                    rounded-[2px]
                    border-[#D4DEE7]
                    accent-[#0B3D6B]
                  "
                />
              </th>

              <TableHeader>Customer</TableHeader>
              <TableHeader>Company</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader>Last Contact</TableHeader>
              <TableHeader>Next Follow-up</TableHeader>
              <TableHeader>Value</TableHeader>

              <th
                className="
                  px-2
                  text-left
                  text-[8px]
                  font-semibold
                  text-[#60758A]
                "
              >
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {customers.map((customer) => {
              const selected = selectedCustomers.includes(
                customer.name
              );

              return (
                <tr
                  key={customer.name}
                  className={`
                    h-[42px]
                    border-b
                    border-[#E2E9EF]
                    transition-colors
                    ${
                      customer.status === "At Risk"
                        ? "bg-[#FFF8F8]"
                        : "bg-white hover:bg-[#FAFCFE]"
                    }
                  `}
                >
                  {/* Checkbox */}
                  <td className="px-3">
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() =>
                        toggleCustomer(customer.name)
                      }
                      className="
                        h-[11px]
                        w-[11px]
                        cursor-pointer
                        rounded-[2px]
                        border-[#D4DEE7]
                        accent-[#0B3D6B]
                      "
                    />
                  </td>

                  {/* Customer */}
                  <td className="px-2">
                    <div className="flex items-center gap-2">
                      {customer.avatar ? (
                        <div
                          className="
                            h-[24px]
                            w-[24px]
                            shrink-0
                            overflow-hidden
                            rounded-full
                            border
                            border-[#DCE5ED]
                          "
                        >
                          <img
                            src={customer.avatar}
                            alt={customer.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ) : (
                        <div
                          className={`
                            flex
                            h-[24px]
                            w-[24px]
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            text-[7px]
                            font-semibold
                            ${
                              customer.status === "At Risk"
                                ? "bg-[#FFE1C7] text-[#D97706]"
                                : customer.status === "Inactive"
                                  ? "bg-[#E7E9ED] text-[#737B86]"
                                  : "bg-[#BBD6FF] text-[#315D80]"
                            }
                          `}
                        >
                          {customer.initials}
                        </div>
                      )}

                      <span
                        className="
                          whitespace-nowrap
                          text-[9px]
                          font-semibold
                          text-[#17324D]
                        "
                      >
                        {customer.name}
                      </span>
                    </div>
                  </td>

                  {/* Company */}
                  <td
                    className="
                      whitespace-nowrap
                      px-2
                      text-[8px]
                      text-[#60758A]
                    "
                  >
                    {customer.company}
                  </td>

                  {/* Status */}
                  <td className="px-2">
                    <StatusBadge status={customer.status} />
                  </td>

                  {/* Last Contact */}
                  <td
                    className="
                      whitespace-nowrap
                      px-2
                      text-[8px]
                      text-[#60758A]
                    "
                  >
                    {customer.lastContact}
                  </td>

                  {/* Next Follow-up */}
                  <td
                    className={`
                      whitespace-nowrap
                      px-2
                      text-[8px]
                      ${
                        customer.status === "At Risk"
                          ? "font-semibold text-[#EF4444]"
                          : customer.nextFollowUp === "Tomorrow"
                            ? "font-semibold text-[#17324D]"
                            : "text-[#60758A]"
                      }
                    `}
                  >
                    {customer.nextFollowUp}
                  </td>

                  {/* Value */}
                  <td
                    className="
                      whitespace-nowrap
                      px-2
                      text-[9px]
                      font-semibold
                      text-[#17324D]
                    "
                  >
                    {customer.value}
                  </td>

                  {/* Actions */}
                  <td className="px-2">
                    <button
                      type="button"
                      aria-label={`Actions for ${customer.name}`}
                      className="
                        flex
                        h-6
                        w-6
                        items-center
                        justify-center
                        rounded-[4px]
                        text-[#718599]
                        transition-colors
                        hover:bg-[#F1F5F8]
                        hover:text-[#17324D]
                      "
                    >
                      <MoreHorizontal
                        size={13}
                        strokeWidth={1.8}
                      />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* =====================================================
          FOOTER / PAGINATION
      ====================================================== */}

      <div
        className="
          flex
          min-h-[40px]
          items-center
          justify-between
          gap-3
          px-3
          py-2
        "
      >
        <p
          className="
            text-[8px]
            text-[#60758A]
          "
        >
          Showing 1 to 5 of 126 entries
        </p>

        <div className="flex items-center gap-1">
          {/* Previous */}
          <button
            type="button"
            disabled
            className="
              flex
              h-[23px]
              min-w-[30px]
              items-center
              justify-center
              rounded-[4px]
              border
              border-[#E2E9EF]
              bg-white
              px-2
              text-[7px]
              font-medium
              text-[#A7B3BE]
            "
          >
            <ChevronLeft size={10} />
            <span>Prev</span>
          </button>

          {/* Page 1 */}
          <PaginationButton active>
            1
          </PaginationButton>

          {/* Page 2 */}
          <PaginationButton>
            2
          </PaginationButton>

          {/* Page 3 */}
          <PaginationButton>
            3
          </PaginationButton>

          <span
            className="
              px-1
              text-[8px]
              text-[#8495A5]
            "
          >
            ...
          </span>

          {/* Next */}
          <button
            type="button"
            className="
              flex
              h-[23px]
              min-w-[30px]
              items-center
              justify-center
              gap-0.5
              rounded-[4px]
              border
              border-[#DCE5ED]
              bg-white
              px-2
              text-[7px]
              font-medium
              text-[#60758A]
              transition-colors
              hover:bg-[#F3F6F9]
            "
          >
            <span>Next</span>
            <ChevronRight size={10} />
          </button>
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   TABLE HEADER
========================================================= */

const TableHeader = ({ children }) => {
  return (
    <th
      className="
        px-2
        text-left
        text-[8px]
        font-semibold
        text-[#60758A]
      "
    >
      {children}
    </th>
  );
};

/* =========================================================
   STATUS BADGE
========================================================= */

const StatusBadge = ({ status }) => {
  const styles = {
    Active: "bg-[#E8F8EF] text-[#20A65A] border-[#CBEED9]",
    "At Risk": "bg-[#FFE9E9] text-[#EF4444] border-[#FFD0D0]",
    Inactive: "bg-[#F1F3F5] text-[#84909C] border-[#E2E5E8]",
  };

  return (
    <span
      className={`
        inline-flex
        items-center
        rounded-full
        border
        px-2
        py-[2px]
        text-[7px]
        font-semibold
        ${styles[status]}
      `}
    >
      {status}
    </span>
  );
};

/* =========================================================
   PAGINATION BUTTON
========================================================= */

const PaginationButton = ({
  children,
  active = false,
}) => {
  return (
    <button
      type="button"
      className={`
        flex
        h-[23px]
        min-w-[23px]
        items-center
        justify-center
        rounded-[4px]
        border
        px-1.5
        text-[7px]
        font-medium
        transition-colors
        ${
          active
            ? "border-[#A9D1FF] bg-[#A9D1FF] text-[#173B5C]"
            : "border-[#DCE5ED] bg-white text-[#60758A] hover:bg-[#F3F6F9]"
        }
      `}
    >
      {children}
    </button>
  );
};

export default CustomerList;