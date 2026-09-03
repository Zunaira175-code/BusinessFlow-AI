import {
  ArrowRight,
} from "lucide-react";

/* =========================================================
   PIPELINE DATA
========================================================= */

const pipelineStages = [
  {
    name: "New",
    count: 8,
    className: "bg-[#DCEAFF] text-[#17324D]",
    countClassName: "bg-white text-[#17324D]",
  },
  {
    name: "Contacted",
    count: 6,
    className: "bg-[#BFD6FA] text-[#17324D]",
    countClassName: "bg-white text-[#17324D]",
  },
  {
    name: "Qualified",
    count: 14,
    className: "bg-[#A9CFFF] text-[#17324D]",
    countClassName: "bg-white text-[#17324D]",
  },
  {
    name: "Proposal",
    count: 10,
    className: "bg-[#FFE18A] text-[#8A5600]",
    countClassName: "bg-white text-[#8A5600]",
  },
  {
    name: "Converted",
    count: 4,
    className: "bg-[#B8F0D0] text-[#187A43]",
    countClassName: "bg-white text-[#187A43]",
  },
];

/* =========================================================
   LEAD PIPELINE
========================================================= */

const LeadPipeline = () => {
  return (
    <div
      className="
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

      <div
        className="
          px-4
          pb-3
          pt-3
        "
      >
        <h2
          className="
            text-[13px]
            font-bold
            text-[#17324D]
          "
        >
          My Lead Pipeline
        </h2>
      </div>

      {/* =================================================
          PIPELINE
      ================================================== */}

      <div
        className="
          flex
          items-center
          gap-1
          overflow-x-auto
          px-4
          pb-4
        "
      >
        {pipelineStages.map((stage, index) => (
          <div
            key={stage.name}
            className="
              flex
              min-w-0
              flex-1
              items-center
            "
          >
            {/* Stage */}
            <div
              className={`
                flex
                h-[36px]
                min-w-0
                flex-1
                items-center
                justify-between
                gap-2
                rounded-[6px]
                px-3
                ${stage.className}
              `}
            >
              <span
                className="
                  truncate
                  text-[8px]
                  font-semibold
                "
              >
                {stage.name}
              </span>

              <span
                className={`
                  flex
                  h-[19px]
                  min-w-[19px]
                  shrink-0
                  items-center
                  justify-center
                  rounded-[5px]
                  px-1
                  text-[7px]
                  font-bold
                  ${stage.countClassName}
                `}
              >
                {stage.count}
              </span>
            </div>

            {/* Arrow */}
            {index < pipelineStages.length - 1 && (
              <ArrowRight
                size={18}
                strokeWidth={1.5}
                className="
                  mx-1
                  shrink-0
                  text-[#AFC7DE]
                "
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeadPipeline;