import Card from "../common/Card";
import Button from "../common/button";

const plans = [
  {
    name: "Starter",
    price: "$29",
    period: "/mo",
    features: [
      "5 members",
      "2.5k contacts",
      "Basic AI",
      "Standard integrations",
    ],
    button: "Downgrade",
    current: false,
  },
  {
    name: "Business",
    price: "$99",
    period: "/mo",
    features: [
      "25 members",
      "10k contacts",
      "Advanced AI",
      "Priority support",
    ],
    button: "Current",
    current: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    features: [
      "Unlimited members",
      "Unlimited contacts",
      "Advanced security",
      "Custom integrations",
    ],
    button: "Contact Sales",
    current: false,
  },
];

const AvailablePlans = () => {
  return (
    <section className="mt-[18px]">
      {/* Heading */}
      <h2 className="mb-[10px] text-[14px] font-bold text-[#102F4A]">
        Available Plans
      </h2>

      {/* Plans */}
      <div className="grid grid-cols-3 gap-4">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={`
              relative
              h-[175px]
              overflow-visible
              px-[12px]
              py-[11px]
              ${
                plan.current
                  ? "border-[#0B3D6B] ring-1 ring-[#0B3D6B]"
                  : ""
              }
            `}
          >
            {/* Current Plan Badge */}
            {plan.current && (
              <span
                className="
                  absolute
                  left-1/2
                  top-[-7px]
                  -translate-x-1/2
                  whitespace-nowrap
                  rounded-full
                  bg-[#0B3D6B]
                  px-[8px]
                  py-[3px]
                  text-[7px]
                  font-medium
                  text-white
                "
              >
                Current Plan
              </span>
            )}

            {/* Plan Name */}
            <p className="text-[9px] font-medium text-[#60758A]">
              {plan.name}
            </p>

            {/* Price */}
            <div className="mt-[3px] flex items-end">
              <span className="text-[20px] font-bold leading-none text-[#102F4A]">
                {plan.price}
              </span>

              {plan.period && (
                <span className="mb-[1px] ml-1 text-[8px] text-[#718599]">
                  {plan.period}
                </span>
              )}
            </div>

            {/* Features */}
            <div className="mt-[10px] space-y-[4px]">
              {plan.features.map((feature) => (
                <p
                  key={feature}
                  className="text-[8px] font-medium text-[#718599]"
                >
                  • {feature}
                </p>
              ))}
            </div>

            {/* Button */}
            <Button
              variant={plan.current ? "secondary" : "secondary"}
              className={`
                absolute
                bottom-[10px]
                left-[12px]
                right-[12px]
                h-[25px]
                rounded-[6px]
                text-[8px]
                font-semibold
                ${
                  plan.name === "Enterprise"
                    ? "border-[#0B3D6B] bg-[#0B3D6B] text-white hover:bg-[#092F52]"
                    : plan.current
                      ? "bg-[#F5F7FA] text-[#718599]"
                      : "bg-white text-[#29465F]"
                }
              `}
            >
              {plan.button}
            </Button>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default AvailablePlans;