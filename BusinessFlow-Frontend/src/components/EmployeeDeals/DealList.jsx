import {
  MoreHorizontal,
} from "lucide-react";

const deals = [
  {
    id: 1,
    deal: "Enterprise CRM Upgrade",
    company: "Acme Corporation",
    stage: "Negotiation",
    stageClass: "bg-[#FFF0DE] text-[#E87500]",
    value: "$24,000",
    probability: 75,
    probabilityClass: "bg-[#E87500]",
    expectedClose: "Sep 24, 2026",
    lastActivity: "Today",
  },
  {
    id: 2,
    deal: "Website Automation Package",
    company: "TechNova",
    stage: "Proposal",
    stageClass: "bg-[#DDF2FF] text-[#0784C7]",
    value: "$18,500",
    probability: 60,
    probabilityClass: "bg-[#0784C7]",
    expectedClose: "Sep 28, 2026",
    lastActivity: "Yesterday",
  },
  {
    id: 3,
    deal: "CRM Integration",
    company: "Bright Systems",
    stage: "Qualified",
    stageClass: "bg-[#E7EEF7] text-[#47709A]",
    value: "$12,800",
    probability: 40,
    probabilityClass: "bg-[#47709A]",
    expectedClose: "Oct 03, 2026",
    lastActivity: "Aug 29, 2026",
  },
  {
    id: 4,
    deal: "Business Intelligence Suite",
    company: "NovaTech",
    stage: "Negotiation",
    stageClass: "bg-[#FFF0DE] text-[#E87500]",
    value: "$21,600",
    probability: 70,
    probabilityClass: "bg-[#E87500]",
    expectedClose: "Sep 30, 2026",
    lastActivity: "Today",
  },
  {
    id: 5,
    deal: "Customer Support Platform",
    company: "Vertex Solutions",
    stage: "New",
    stageClass: "bg-[#EEF2F5] text-[#60758A]",
    value: "$7,900",
    probability: 20,
    probabilityClass: "bg-[#60758A]",
    expectedClose: "Oct 12, 2026",
    lastActivity: "Aug 28, 2026",
  },
];

const DealList = () => {
  return (
    <div
      className="
        mt-4
        w-full
        overflow-hidden
        rounded-[9px]
        border
        border-[#DCE5ED]
        bg-white
        shadow-[0_1px_2px_rgba(15,23,42,0.03)]
      "
    >
      {/* =================================================
          HEADER
      ================================================== */}

      <div className="border-b border-[#DCE5ED] px-4 py-4">
        <h2
          className="
            text-[13px]
            font-bold
            text-[#17324D]
          "
        >
          My Deals
        </h2>

        <p
          className="
            mt-1
            text-[7px]
            text-[#718599]
          "
        >
          Deals currently assigned to you
        </p>
      </div>

      {/* =================================================
          TABLE
      ================================================== */}

      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[800px] border-collapse">
          {/* Table Head */}
          <thead>
            <tr className="border-b border-[#DCE5ED] bg-[#FBFCFD]">
              <th className={headerClass}>
                Deal
              </th>

              <th className={headerClass}>
                Company
              </th>

              <th className={headerClass}>
                Stage
              </th>

              <th className={`${headerClass} text-right`}>
                Value
              </th>

              <th className={`${headerClass} text-center`}>
                Probability
              </th>

              <th className={headerClass}>
                Expected Close
              </th>

              <th className={headerClass}>
                Last Activity
              </th>

              <th className={`${headerClass} text-center`}>
                Actions
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {deals.map((deal) => (
              <DealRow
                key={deal.id}
                deal={deal}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* =========================================================
   DEAL ROW
========================================================= */

const DealRow = ({ deal }) => {
  return (
    <tr
      className="
        border-b
        border-[#E2E9EF]
        last:border-b-0
        hover:bg-[#FAFCFE]
      "
    >
      {/* Deal */}
      <td className={cellClass}>
        <span
          className="
            text-[8px]
            font-semibold
            text-[#17324D]
          "
        >
          {deal.deal}
        </span>
      </td>

      {/* Company */}
      <td className={cellClass}>
        <span
          className="
            text-[7px]
            text-[#60758A]
          "
        >
          {deal.company}
        </span>
      </td>

      {/* Stage */}
      <td className={cellClass}>
        <span
          className={`
            inline-flex
            rounded-[5px]
            px-2
            py-1
            text-[6px]
            font-semibold
            ${deal.stageClass}
          `}
        >
          {deal.stage}
        </span>
      </td>

      {/* Value */}
      <td
        className={`
          ${cellClass}
          text-right
        `}
      >
        <span
          className="
            text-[8px]
            font-bold
            text-[#17324D]
          "
        >
          {deal.value}
        </span>
      </td>

      {/* Probability */}
      <td className={cellClass}>
        <div className="flex flex-col items-center">
          <div
            className="
              h-[4px]
              w-[45px]
              overflow-hidden
              rounded-full
              bg-[#DDE9F5]
            "
          >
            <div
              className={`
                h-full
                rounded-full
                ${deal.probabilityClass}
              `}
              style={{
                width: `${deal.probability}%`,
              }}
            />
          </div>

          <span
            className="
              mt-1
              text-[6px]
              text-[#718599]
            "
          >
            {deal.probability}%
          </span>
        </div>
      </td>

      {/* Expected Close */}
      <td className={cellClass}>
        <span className="text-[7px] text-[#60758A]">
          {deal.expectedClose}
        </span>
      </td>

      {/* Last Activity */}
      <td className={cellClass}>
        <span className="text-[7px] text-[#60758A]">
          {deal.lastActivity}
        </span>
      </td>

      {/* Actions */}
      <td className={`${cellClass} text-center`}>
        <button
          type="button"
          aria-label={`Actions for ${deal.deal}`}
          className="
            inline-flex
            h-6
            w-6
            items-center
            justify-center
            rounded-md
            text-[#718599]
            hover:bg-[#F1F5F9]
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
};

/* =========================================================
   TABLE STYLES
========================================================= */

const headerClass = `
  px-3
  py-2.5
  text-left
  text-[7px]
  font-semibold
  capitalize
  text-[#60758A]
`;

const cellClass = `
  px-3
  py-2.5
  align-middle
`;

export default DealList;