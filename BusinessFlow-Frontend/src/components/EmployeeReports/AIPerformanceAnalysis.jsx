import {
  Sparkles,
  Lightbulb,
  ArrowRight,
} from "lucide-react";

const AIPerformanceAnalysis = () => {
  return (
    <section
      className="
        relative
        h-[300px]
        overflow-hidden
        rounded-[9px]
        border
        border-[#DCE5ED]
        bg-[#F5F9FD]
        p-4
      "
    >
      {/* Decorative Sparkles */}
      <Sparkles
        size={46}
        strokeWidth={1}
        className="
          pointer-events-none
          absolute
          right-[-5px]
          top-[5px]
          text-[#DDE9F2]
        "
      />

      {/* Header */}
      <div className="relative flex items-center gap-2">
        <Sparkles
          size={16}
          strokeWidth={1.8}
          className="text-[#0089D6]"
        />

        <h2 className="text-[13px] font-bold text-[#17324D]">
          AI Performance Analysis
        </h2>
      </div>

      {/* First Insight */}
      <div
        className="
          relative
          mt-3
          rounded-[6px]
          border
          border-[#DCE5ED]
          bg-white
          px-3
          py-3
        "
      >
        <p className="text-[8px] leading-[13px] text-[#60758A]">
          You have a{" "}
          <span className="font-semibold text-[#17324D]">
            15% higher win rate
          </span>{" "}
          on leads from LinkedIn compared to other sources.
        </p>
      </div>

      {/* Recommendation */}
      <div
        className="
          mt-3
          rounded-[6px]
          border
          border-[#DCE5ED]
          bg-white
          px-3
          py-3
        "
      >
        <div className="flex items-center gap-1.5">
          <Lightbulb
            size={12}
            strokeWidth={1.8}
            className="text-[#0089D6]"
          />

          <span className="text-[8px] font-semibold text-[#17324D]">
            Recommendation
          </span>
        </div>

        <p className="mt-2 text-[8px] leading-[13px] text-[#60758A]">
          Focus on the 'Proposal' stage for{" "}
          <span className="font-medium text-[#17324D]">
            Acme Corp
          </span>{" "}
          and{" "}
          <span className="font-medium text-[#17324D]">
            NovaTech
          </span>
          ; they show high engagement patterns.
        </p>
      </div>

      {/* Bottom Button */}
      <button
        type="button"
        className="
          absolute
          bottom-4
          left-4
          right-4
          flex
          h-[27px]
          items-center
          justify-center
          gap-1.5
          rounded-[5px]
          border
          border-[#9ED3F4]
          bg-white
          text-[8px]
          font-semibold
          text-[#17324D]
          transition
          hover:bg-[#F7FBFE]
        "
      >
        View Detailed AI Report
        <ArrowRight size={11} />
      </button>
    </section>
  );
};

export default AIPerformanceAnalysis;