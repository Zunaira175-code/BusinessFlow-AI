import {
  TrendingUp,
  Megaphone,
  Headphones,
  CheckCircle2,
} from "lucide-react";

import { motion } from "framer-motion";

const SolutionsSection = () => {
  const solutions = [
    {
      icon: TrendingUp,
      title: "Sales Teams",
      description:
        "Accelerate pipeline velocity with predictive lead scoring and automated follow-ups. Let AI handle data entry while reps focus on closing deals.",
      features: [
        "Predictive Forecasting",
        "Automated Activity Tracking",
        "Deal Risk Insights",
      ],
    },

    {
      icon: Megaphone,
      title: "Marketing Teams",
      description:
        "Generate high-quality leads and measure campaign ROI accurately. AI segments your audience for hyper-personalized outreach.",
      features: [
        "Smart Audience Segmentation",
        "Campaign ROI Attribution",
        "Automated Lead Nurturing",
      ],
    },

    {
      icon: Headphones,
      title: "Customer Success",
      description:
        "Identify churn risks before they happen. Proactively manage accounts with health scores powered by behavioral analysis.",
      features: [
        "Predictive Churn Alerts",
        "Account Health Scoring",
        "Automated Renewals",
      ],
    },
  ];

  return (
    <section
      id="solutions"
      className="
        relative
        overflow-hidden
        border-t
        border-[#DCE3EA]
        bg-[#F8F8FB]
        px-4
        py-10
        sm:px-6
        sm:py-12
        lg:px-8
      "
    >

      {/* Background */}

      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-0
          h-[180px]
          w-[500px]
          -translate-x-1/2
          rounded-full
          bg-[#EAF3FF]
          opacity-50
          blur-[80px]
        "
      />

      <div
        className="
          relative
          z-10
          mx-auto
          w-full
          max-w-[1000px]
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
              leading-[1.15]
              tracking-[-0.8px]
              text-[#071D35]
              sm:text-[30px]
              lg:text-[32px]
            "
          >
            Built for How You Work
          </h2>

          <p
            className="
              mx-auto
              mt-2
              max-w-[600px]
              text-[11px]
              leading-[17px]
              text-[#59616B]
              sm:text-[12px]
              sm:leading-[18px]
            "
          >
            Discover how our intelligent platform streamlines
            workflows and drives growth across specialized
            departments.
          </p>

        </motion.div>


        {/* =================================================
            SOLUTION CARDS
        ================================================= */}

        <div
          className="
            mt-7
            grid
            gap-3
            md:grid-cols-3
          "
        >

          {solutions.map((solution, index) => (
            <SolutionCard
              key={solution.title}
              solution={solution}
              index={index}
            />
          ))}

        </div>

      </div>

    </section>
  );
};


/* =========================================================
   SOLUTION CARD
========================================================= */

const SolutionCard = ({
  solution,
  index,
}) => {
  const Icon = solution.icon;

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.2,
      }}
      transition={{
        delay: index * 0.1,
        duration: 0.55,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{
        y: -5,
        scale: 1.01,
      }}
      className="
        group
        relative
        overflow-hidden
        rounded-[8px]
        border
        border-[#D5DCE4]
        bg-white/90
        p-4
        shadow-[0_3px_10px_rgba(20,50,80,0.025)]
        transition-all
        duration-300
        hover:border-[#AFCBE5]
        hover:shadow-[0_12px_26px_rgba(35,90,140,0.10)]
      "
    >

      {/* Hover glow */}

      <div
        className="
          pointer-events-none
          absolute
          -right-8
          -top-8
          h-[100px]
          w-[100px]
          rounded-full
          bg-[#DCEEFF]
          opacity-0
          blur-[35px]
          transition-opacity
          duration-500
          group-hover:opacity-70
        "
      />


      {/* =================================================
          ICON
      ================================================= */}

      <motion.div
        whileHover={{
          scale: 1.1,
          rotate: -5,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 15,
        }}
        className="
          relative
          flex
          h-[32px]
          w-[32px]
          items-center
          justify-center
          rounded-[6px]
          bg-[#DDEEFF]
          text-[#176FD1]
        "
      >
        <Icon
          size={16}
          strokeWidth={1.8}
        />
      </motion.div>


      {/* =================================================
          TITLE
      ================================================= */}

      <h3
        className="
          relative
          mt-3
          text-[14px]
          font-bold
          leading-[18px]
          tracking-[-0.15px]
          text-[#071D35]
          transition-colors
          duration-300
          group-hover:text-[#176FD1]
        "
      >
        {solution.title}
      </h3>


      {/* =================================================
          DESCRIPTION
      ================================================= */}

      <p
        className="
          relative
          mt-1.5
          min-h-[58px]
          text-[9px]
          leading-[14px]
          text-[#59616B]
        "
      >
        {solution.description}
      </p>


      {/* =================================================
          FEATURES
      ================================================= */}

      <div className="relative mt-3 space-y-2">

        {solution.features.map((feature) => (
          <div
            key={feature}
            className="
              flex
              items-center
              gap-1.5
            "
          >

            <CheckCircle2
              size={10}
              strokeWidth={2}
              className="
                shrink-0
                text-[#176FD1]
              "
            />

            <span
              className="
                text-[9px]
                font-medium
                leading-[13px]
                text-[#303940]
              "
            >
              {feature}
            </span>

          </div>
        ))}

      </div>


      {/* Bottom animation */}

      <motion.div
        initial={{
          width: 0,
        }}
        whileHover={{
          width: "40%",
        }}
        transition={{
          duration: 0.35,
        }}
        className="
          absolute
          bottom-0
          left-0
          h-[2px]
          rounded-full
          bg-[#2879D7]
        "
      />

    </motion.div>
  );
};

export default SolutionsSection;