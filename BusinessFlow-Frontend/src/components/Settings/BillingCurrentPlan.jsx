import {
  CheckCircle2,
  Sparkles,
} from "lucide-react";

import Card from "../common/Card";
import Button from "../common/button";

const features = [
  {
    text: "Up to 25 team members",
    icon: "check",
  },
  {
    text: "Unlimited contacts",
    icon: "check",
  },
  {
    text: "Advanced CRM automation",
    icon: "check",
  },
  {
    text: "AI-powered insights",
    icon: "sparkle",
  },
  {
    text: "Advanced integrations",
    icon: "check",
  },
  {
    text: "Priority support",
    icon: "check",
  },
];

const BillingCurrentPlan = () => {
  return (
    <Card className="h-[250px] overflow-hidden px-[16px] py-[14px]">
      {/* Header */}
      <div>
        <h2 className="text-[14px] font-bold text-[#102F4A]">
          Business Plan
        </h2>

        <div className="mt-[3px] flex items-end">
          <span className="text-[23px] font-bold leading-none tracking-[-0.6px] text-[#102F4A]">
            $99
          </span>

          <span className="mb-[1px] ml-1 text-[9px] text-[#718599]">
            /month
          </span>
        </div>
      </div>

      {/* Features */}
      <div className="mt-[12px] space-y-[5px]">
        {features.map((feature) => (
          <div
            key={feature.text}
            className="flex items-center gap-[6px]"
          >
            {feature.icon === "sparkle" ? (
              <Sparkles
                size={11}
                strokeWidth={2}
                className="text-[#1592D0]"
              />
            ) : (
              <CheckCircle2
                size={11}
                strokeWidth={2}
                className="text-[#315D80]"
              />
            )}

            <span className="text-[9px] font-medium text-[#62788C]">
              {feature.text}
            </span>
          </div>
        ))}
      </div>

      {/* Manage Plan */}
      <Button
        variant="secondary"
        className="
          mt-[12px]
          h-[29px]
          w-full
          rounded-[7px]
          border-[#D8E2EA]
          bg-[#EEF4FC]
          text-[9px]
          font-semibold
          text-[#29465F]
          hover:bg-[#E5EEF8]
        "
      >
        Manage Plan
      </Button>
    </Card>
  );
};

export default BillingCurrentPlan;