import {
  Bot,
  Filter,
  MailCheck,
  Sparkles,
  BrainCircuit,
  RefreshCw,
} from "lucide-react";

import { motion } from "framer-motion";
import FeatureCard from "./FeatureCard";

const AIFeatures = () => {
  const features = [
    {
      icon: Bot,
      title: "AI Sales Assistant",
      description:
        "Helps sales representatives understand customers, deals, and next actions.",
    },
    {
      icon: Filter,
      title: "Smart Lead Qualification",
      description:
        "Automatically analyzes and prioritizes incoming leads.",
    },
    {
      icon: MailCheck,
      title: "Automated Follow-ups",
      description:
        "Suggests and manages timely follow-up actions.",
    },
    {
      icon: Sparkles,
      title: "AI Deal Insights",
      description:
        "Identifies deal risks and recommends next steps.",
    },
    {
      icon: BrainCircuit,
      title: "Customer Intelligence",
      description:
        "Summarizes customer activity and important conversations.",
    },
    {
      icon: RefreshCw,
      title: "Business Automation",
      description:
        "Automates repetitive CRM workflows.",
    },
  ];

  return (
    <section
      id="ai"
      className="
        border-b
        border-[#DCE3EB]
        bg-[#F7F9FD]
        px-5
        py-14
        sm:px-8
        lg:px-10
      "
    >

      <div
        className="
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
            y: 18,
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
            duration: 0.65,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="text-center"
        >

          <h2
            className="
              text-[28px]
              font-semibold
              leading-[1.15]
              tracking-[-0.9px]
              text-[#0A2139]
              sm:text-[32px]
            "
          >
            AI That Works Alongside Your Team
          </h2>

          <p
            className="
              mx-auto
              mt-2
              max-w-[560px]
              text-[11px]
              leading-[17px]
              text-[#60758A]
            "
          >
            Intelligent tools that help your team work
            faster, smarter, and more efficiently.
          </p>

        </motion.div>


        {/* =================================================
            AI CARDS
        ================================================= */}

        <div
          className="
            mt-8
            grid
            grid-cols-1
            justify-items-center
            gap-4
            sm:grid-cols-2
            lg:grid-cols-3
          "
        >

          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
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
                delay: index * 0.08,
                duration: 0.55,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="
                w-full
                max-w-[290px]
              "
            >
              <FeatureCard
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            </motion.div>
          ))}

        </div>

      </div>

    </section>
  );
};

export default AIFeatures;