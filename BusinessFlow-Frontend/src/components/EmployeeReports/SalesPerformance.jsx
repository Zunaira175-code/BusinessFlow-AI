import { BarChart3 } from "lucide-react";

const SalesPerformance = () => {
  return (
    <section
      className="
        h-[300px]
        rounded-[9px]
        border
        border-[#DCE5ED]
        bg-white
        p-4
      "
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2
          className="
            text-[13px]
            font-bold
            text-[#17324D]
          "
        >
          Sales Performance
        </h2>

        <div
          className="
            flex
            h-[20px]
            overflow-hidden
            rounded-[4px]
            border
            border-[#DCE5ED]
          "
        >
          <button
            type="button"
            className="
              bg-[#F5F8FB]
              px-[9px]
              text-[7px]
              font-medium
              text-[#60758A]
            "
          >
            Monthly
          </button>

          <button
            type="button"
            className="
              px-[9px]
              text-[7px]
              text-[#7A8B9A]
            "
          >
            Quarterly
          </button>
        </div>
      </div>

      {/* Chart Area */}
      <div
        className="
          mt-3
          flex
          h-[228px]
          items-center
          justify-center
          rounded-[5px]
          border
          border-dashed
          border-[#D5E0E8]
          bg-[#FCFDFE]
        "
      >
        <div className="text-center">
          <BarChart3
            size={21}
            strokeWidth={2}
            className="mx-auto text-[#8293A2]"
          />

          <p className="mt-1 text-[8px] text-[#8293A2]">
            Revenue vs Target Data Visualization
          </p>
        </div>
      </div>
    </section>
  );
};

export default SalesPerformance;