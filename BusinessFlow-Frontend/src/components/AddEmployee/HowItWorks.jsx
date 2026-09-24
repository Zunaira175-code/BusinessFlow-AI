import {
  Info,
  UserPlus,
  Send,
  UserRoundCheck,
  ShieldCheck,
} from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      number: "1",
      title: "Add Employee Details",
      description: "Enter the employee's basic information.",
      icon: UserPlus,
    },
    {
      number: "2",
      title: "Send Invitation",
      description: "We'll send an invitation link to their email.",
      icon: Send,
    },
    {
      number: "3",
      title: "Employee Joins",
      description:
        "They can set their password and start using the platform.",
      icon: UserRoundCheck,
    },
    {
      number: "4",
      title: "Manage Access",
      description:
        "You can update their role and permissions anytime.",
      icon: ShieldCheck,
    },
  ];

  return (
    <section className="w-full overflow-hidden rounded-lg border border-[#DCE7F1] bg-white">
      {/* Header */}
      <div className="flex items-center gap-2.5 border-b border-[#E7EEF4] px-4 py-3">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#EEF5FF] text-[#1677E8]">
          <Info size={16} strokeWidth={2} />
        </div>

        <h2 className="text-[15px] font-semibold text-[#102F4B]">
          How It Works
        </h2>
      </div>

      {/* Steps */}
      <div className="px-4 py-3.5">
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-[14px] top-[28px] bottom-[28px] w-px bg-[#D7E5F4]" />

          <div className="relative space-y-4">
            {steps.map((step) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.number}
                  className="relative flex items-start gap-3"
                >
                  {/* Number */}
                  <div className="relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#E8F1FF] text-[11px] font-semibold text-[#1677E8]">
                    {step.number}
                  </div>

                  {/* Content */}
                  <div className="min-w-0 pt-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-[12px] font-semibold leading-[17px] text-[#193B5B]">
                        {step.title}
                      </h3>
                    </div>

                    <p className="mt-0.5 text-[10px] leading-[15px] text-[#71869A]">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;