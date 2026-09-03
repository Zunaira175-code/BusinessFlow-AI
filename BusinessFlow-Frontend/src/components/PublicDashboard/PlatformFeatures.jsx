import {
    UsersRound,
    UserRound,
    Handshake,
    FileCheck2,
    CalendarDays,
    Lightbulb,
} from "lucide-react";

import { motion } from "framer-motion";

const PlatformFeatures = () => {
    const features = [
        {
            icon: UsersRound,
            title: "Leads",
        },
        {
            icon: UserRound,
            title: "Customers",
        },
        {
            icon: Handshake,
            title: "Deals",
        },
        {
            icon: FileCheck2,
            title: "Tasks",
        },
        {
            icon: CalendarDays,
            title: "Meetings",
        },
        {
            icon: Lightbulb,
            title: "AI Insights",
        },
    ];

    return (
        <section
            id="features"
            className="
        relative
        overflow-hidden
        border-b
        border-[#173A5C]
        bg-[#071D35]
        px-5
        py-14
        sm:px-8
        lg:px-10
      "
        >

            {/* =====================================================
          BACKGROUND GLOW
      ====================================================== */}

            <div
                className="
          pointer-events-none
          absolute
          left-[15%]
          top-[-80px]
          h-[220px]
          w-[220px]
          rounded-full
          bg-[#176FD1]
          opacity-[0.09]
          blur-[90px]
        "
            />

            <div
                className="
          pointer-events-none
          absolute
          bottom-[-100px]
          right-[12%]
          h-[240px]
          w-[240px]
          rounded-full
          bg-[#2879D7]
          opacity-[0.08]
          blur-[100px]
        "
            />


            {/* =====================================================
          CONTENT
      ====================================================== */}

            <div
                className="
          relative
          z-10
          mx-auto
          max-w-[1050px]
        "
            >

                {/* =================================================
            HEADING
        ================================================= */}

                <motion.h2
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
                    className="
            mx-auto
            max-w-[760px]
            text-center
            text-[29px]
            font-semibold
            leading-[1.15]
            tracking-[-1px]
            text-white
            sm:text-[33px]
          "
                >
                    Everything Your Sales Team Needs. One Intelligent
                    <br className="hidden sm:block" />
                    Platform.
                </motion.h2>


                {/* =================================================
            FEATURES
        ================================================= */}

                <div
                    className="
            mx-auto
            mt-9
            grid
            max-w-[900px]
            grid-cols-2
            gap-y-7
            sm:grid-cols-3
            lg:grid-cols-6
            lg:gap-y-0
          "
                >

                    {features.map((feature, index) => {
                        const Icon = feature.icon;

                        return (
                            <motion.div
                                key={feature.title}
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
                                    delay: index * 0.08,
                                    duration: 0.5,
                                    ease: [0.22, 1, 0.36, 1],
                                }}
                                whileHover={{
                                    y: -5,
                                }}
                                className="
                  group
                  flex
                  cursor-default
                  flex-col
                  items-center
                "
                            >

                                {/* Icon */}

                                <motion.div
                                    whileHover={{
                                        scale: 1.12,
                                        rotate: -5,
                                    }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 300,
                                        damping: 15,
                                    }}
                                    className="
    flex
    h-[54px]
    w-[54px]
    items-center
    justify-center
    rounded-full
    bg-gray-200
   text-[#071D35]
    shadow-[0_4px_14px_rgba(255,255,255,0.08)]
    transition-all
    duration-300
    group-hover:bg-white
    text-[#071D35]
    group-hover:shadow-[0_0_22px_rgba(255,255,255,0.18)]
  "
                                >
                                    <Icon
                                        size={26}
                                        strokeWidth={1.8}
                                    />
                                </motion.div>

                                {/* Text */}

                                <span
                                    className="
                    mt-3
                    text-[11px]
                    font-medium
                    text-[#E7F1FA]
                    transition-colors
                    duration-300
                    group-hover:text-[#8BC7FF]
                  "
                                >
                                    {feature.title}
                                </span>

                            </motion.div>
                        );
                    })}

                </div>

            </div>

        </section>
    );
};

export default PlatformFeatures;