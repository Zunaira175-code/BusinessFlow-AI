import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

const BillingSection = () => {
  const [billingCycle, setBillingCycle] = useState("monthly");

  const isAnnual = billingCycle === "annual";

  const plans = [
    {
      name: "Starter",
      description: "For small teams getting started with CRM.",
      monthlyPrice: "29",
      annualPrice: "23",
      suffix: "/user/mo",
      button: "Start Free Trial",
      featured: false,
      features: [
        "Up to 1,000 Contacts",
        "Basic Deal Management",
        "Email Integration",
        "Standard Reporting",
      ],
    },
    {
      name: "Professional",
      description:
        "Advanced features and AI insights for growing teams.",
      monthlyPrice: "79",
      annualPrice: "63",
      suffix: "/user/mo",
      button: "Get Started",
      featured: true,
      features: [
        "Everything in Starter",
        "Unlimited Contacts",
        "AI Lead Qualification",
        "Automated Workflows",
        "Advanced Analytics Dashboard",
      ],
    },
    {
      name: "Enterprise",
      description:
        "Custom solutions for large-scale operations.",
      monthlyPrice: null,
      annualPrice: null,
      suffix: "",
      button: "Contact Sales",
      featured: false,
      custom: true,
      features: [
        "Everything in Professional",
        "Dedicated Account Manager",
        "Custom AI Model Training",
        "SSO & Advanced Security",
        "API Access",
      ],
    },
  ];

  return (
    <section
      id="pricing"
      className="
        relative
        overflow-hidden
        bg-white
        px-5
        py-14
        sm:px-8
        lg:px-12
      "
    >

      {/* Background Glow */}

      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-10
          h-[240px]
          w-[500px]
          -translate-x-1/2
          rounded-full
          bg-[#EEF5FF]
          opacity-40
          blur-[90px]
        "
      />

      {/* Content */}

      <div
        className="
          relative
          z-10
          mx-auto
          w-full
          max-w-[1050px]
        "
      >

        {/* =================================================
            HEADING
        ================================================= */}

        <motion.div
          initial={{
            opacity: 0,
            y: 15,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.25,
          }}
          transition={{
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="text-center"
        >

          <h2
            className="
              text-[28px]
              font-bold
              leading-[1.1]
              tracking-[-1px]
              text-[#071D35]
              sm:text-[32px]
              lg:text-[36px]
            "
          >
            Simple, transparent pricing
          </h2>

          <p
            className="
              mx-auto
              mt-2
              max-w-[570px]
              text-[11px]
              leading-[18px]
              text-[#59616B]
              sm:text-[12px]
            "
          >
            Choose the plan that fits your team's needs.
            Upgrade, downgrade, or cancel at any time.
          </p>

        </motion.div>


        {/* =================================================
            BILLING TOGGLE
        ================================================= */}

        <motion.div
          initial={{
            opacity: 0,
            y: 10,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            delay: 0.1,
            duration: 0.5,
          }}
          className="
            mx-auto
            mt-4
            flex
            h-[30px]
            w-fit
            items-center
            rounded-full
            bg-[#E9E9ED]
            p-[3px]
          "
        >

          <button
            type="button"
            onClick={() =>
              setBillingCycle("monthly")
            }
            className={`
              relative
              h-[24px]
              min-w-[70px]
              rounded-full
              px-3
              text-[9px]
              font-semibold
              transition-all
              duration-300
              ${
                !isAnnual
                  ? `
                    bg-white
                    text-[#1C2A3A]
                    shadow-[0_2px_5px_rgba(0,0,0,0.08)]
                  `
                  : `
                    text-[#59616B]
                  `
              }
            `}
          >
            Monthly
          </button>


          <button
            type="button"
            onClick={() =>
              setBillingCycle("annual")
            }
            className={`
              flex
              h-[24px]
              items-center
              gap-1.5
              rounded-full
              px-2.5
              text-[9px]
              font-semibold
              transition-all
              duration-300
              ${
                isAnnual
                  ? `
                    bg-white
                    text-[#1C2A3A]
                    shadow-[0_2px_5px_rgba(0,0,0,0.08)]
                  `
                  : `
                    text-[#59616B]
                  `
              }
            `}
          >
            Annually

            <span
              className="
                rounded-[3px]
                bg-[#D8E9FA]
                px-1
                py-[1px]
                text-[7px]
                font-bold
                text-[#234A70]
              "
            >
              Save 20%
            </span>

          </button>

        </motion.div>


        {/* =================================================
            PRICING CARDS
        ================================================= */}

        <div
          className="
            mt-9
            grid
            gap-4
            md:grid-cols-3
            md:items-start
          "
        >

          {plans.map((plan, index) => (
            <PricingCard
              key={plan.name}
              plan={plan}
              index={index}
              isAnnual={isAnnual}
            />
          ))}

        </div>

      </div>

    </section>
  );
};


/* =========================================================
   PRICING CARD
========================================================= */

const PricingCard = ({
  plan,
  index,
  isAnnual,
}) => {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 25,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.15,
      }}
      transition={{
        delay: index * 0.1,
        duration: 0.55,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{
        y: plan.featured ? -4 : -3,
      }}
      className={`
        relative
        rounded-[8px]
        ${
          plan.featured
            ? `
              bg-[#0B3155]
              px-4
              pb-5
              pt-5
              text-white
              shadow-[0_10px_24px_rgba(7,45,80,0.15)]
            `
            : `
              border
              border-[#CBD2D9]
              bg-white
              px-4
              pb-5
              pt-4
              text-[#071D35]
            `
        }
      `}
    >

      {/* =================================================
          MOST POPULAR
      ================================================= */}

      {plan.featured && (
        <div
          className="
            absolute
            left-1/2
            top-[-9px]
            -translate-x-1/2
            whitespace-nowrap
            rounded-full
            bg-[#CDE3FF]
            px-2.5
            py-[3px]
            text-[7px]
            font-bold
            tracking-[0.35px]
            text-[#173B5C]
          "
        >
          MOST POPULAR
        </div>
      )}


      {/* =================================================
          PLAN NAME
      ================================================= */}

      <h3
        className={`
          text-[15px]
          font-semibold
          ${
            plan.featured
              ? "text-white"
              : "text-[#071D35]"
          }
        `}
      >
        {plan.name}
      </h3>


      {/* =================================================
          DESCRIPTION
      ================================================= */}

      <p
        className={`
          mt-1.5
          min-h-[32px]
          max-w-[270px]
          text-[9px]
          leading-[14px]
          ${
            plan.featured
              ? "text-[#8BA9C4]"
              : "text-[#59616B]"
          }
        `}
      >
        {plan.description}
      </p>


      {/* =================================================
          PRICE
      ================================================= */}

      <div className="mt-3 flex items-end">

        {plan.custom ? (
          <span
            className="
              text-[26px]
              font-bold
              leading-none
              tracking-[-0.8px]
              text-[#071D35]
            "
          >
            Custom
          </span>
        ) : (
          <>
            <span
              className={`
                text-[28px]
                font-bold
                leading-none
                tracking-[-1px]
                ${
                  plan.featured
                    ? "text-white"
                    : "text-[#071D35]"
                }
              `}
            >
              $
              {isAnnual
                ? plan.annualPrice
                : plan.monthlyPrice}
            </span>

            <span
              className={`
                mb-[1px]
                ml-1
                text-[8px]
                ${
                  plan.featured
                    ? "text-[#7897B3]"
                    : "text-[#59616B]"
                }
              `}
            >
              {plan.suffix}
            </span>
          </>
        )}

      </div>


      {/* =================================================
          BUTTON
      ================================================= */}

      <button
        type="button"
        className={`
          mt-4
          flex
          h-[32px]
          w-full
          items-center
          justify-center
          rounded-[5px]
          text-[9px]
          font-semibold
          transition-all
          duration-300
          ${
            plan.featured
              ? `
                bg-white
                text-[#173B5C]
                hover:bg-[#EEF5FF]
                hover:shadow-[0_4px_12px_rgba(255,255,255,0.12)]
              `
              : `
                border
                border-[#8E969E]
                bg-white
                text-[#1F3348]
                hover:border-[#2879D7]
                hover:bg-[#F7FAFF]
              `
          }
        `}
      >
        {plan.button}
      </button>


      {/* =================================================
          FEATURES
      ================================================= */}

      <div
        className={`
          mt-4
          space-y-2.5
          ${
            plan.featured
              ? "border-t border-[#244B6D] pt-4"
              : "pt-1"
          }
        `}
      >

        {plan.features.map((feature) => (
          <div
            key={feature}
            className="flex items-start gap-1.5"
          >

            <CheckCircle2
              size={10}
              strokeWidth={1.8}
              className={`
                mt-[1px]
                shrink-0
                ${
                  plan.featured
                    ? "text-[#A9D1FF]"
                    : "text-[#173B5C]"
                }
              `}
            />

            <span
              className={`
                text-[9px]
                leading-[13px]
                ${
                  plan.featured
                    ? "text-[#E5EFF8]"
                    : "text-[#303940]"
                }
                ${
                  feature.includes("AI") ||
                  feature.includes("Automated")
                    ? "font-semibold"
                    : ""
                }
              `}
            >
              {feature}
            </span>

          </div>
        ))}

      </div>

    </motion.div>
  );
};

export default BillingSection;