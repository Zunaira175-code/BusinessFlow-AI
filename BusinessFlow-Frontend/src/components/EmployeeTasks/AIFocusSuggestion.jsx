import { Sparkles } from "lucide-react";

const AIFocusSuggestion = () => {
  return (
    <div
      className="
        rounded-[9px]
        border
        border-[#C9DFF7]
        bg-[#E8F3FF]
        p-3
      "
    >
      {/* Heading */}
      <div className="flex items-center gap-2">
        <Sparkles
          size={15}
          strokeWidth={1.8}
          className="text-[#0089D6]"
        />

        <h3
          className="
            text-[9px]
            font-bold
            uppercase
            tracking-[0.3px]
            text-[#0784C7]
          "
        >
          AI Focus Suggestion
        </h3>
      </div>

      {/* Content */}
      <p
        className="
          mt-3
          text-[8px]
          leading-[13px]
          text-[#315D80]
        "
      >
        You have 3 high priority tasks stuck in "To Do" for more than 48
        hours. Consider delegating or rescheduling the Nexa task.
      </p>
    </div>
  );
};

export default AIFocusSuggestion;