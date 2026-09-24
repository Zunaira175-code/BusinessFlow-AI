import {
    ArrowRight,
    CheckCircle2,
    Sparkles,
} from "lucide-react";


import { Link } from "react-router-dom";

import {
    motion,
    useMotionValue,
    useSpring,
    useTransform,
} from "framer-motion";

import { useEffect } from "react";

import HeroDashboard from "./HeroDashboard";

const HeroSection = () => {
    /* =====================================================
       MOUSE PARALLAX
    ====================================================== */

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const smoothX = useSpring(mouseX, {
        stiffness: 35,
        damping: 20,
    });

    const smoothY = useSpring(mouseY, {
        stiffness: 35,
        damping: 20,
    });

    const glowX = useTransform(smoothX, [-1, 1], [15, -15]);
    const glowY = useTransform(smoothY, [-1, 1], [10, -10]);

    useEffect(() => {
        const handleMouseMove = (event) => {
            const x =
                (event.clientX / window.innerWidth) * 2 - 1;

            const y =
                (event.clientY / window.innerHeight) * 2 - 1;

            mouseX.set(x);
            mouseY.set(y);
        };

        window.addEventListener("mousemove", handleMouseMove);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, [mouseX, mouseY]);

    return (
        <section
            className="
        relative
        min-h-[530px]
        overflow-hidden
        bg-[#F7FAFF]
      "
        >

            {/* =====================================================
          MOVING BLUE BACKGROUND ORBS
      ====================================================== */}

            <motion.div
                style={{ x: glowX, y: glowY }}
                className="hero-orb hero-orb-1"
            />

            <motion.div
                style={{ x: glowX, y: glowY }}
                className="hero-orb hero-orb-2"
            />

            <motion.div
                style={{ x: glowX, y: glowY }}
                className="hero-orb hero-orb-3"
            />

            <motion.div
                style={{ x: glowX, y: glowY }}
                className="hero-orb hero-orb-4"
            />

            <motion.div
                style={{ x: glowX, y: glowY }}
                className="hero-orb hero-orb-5"
            />

            <motion.div
                style={{ x: glowX, y: glowY }}
                className="hero-orb hero-orb-6"
            />


            {/* =====================================================
          FLOATING PARTICLES
      ====================================================== */}

            <div className="pointer-events-none absolute inset-0">

                <span className="hero-dot hero-dot-1" />
                <span className="hero-dot hero-dot-2" />
                <span className="hero-dot hero-dot-3" />
                <span className="hero-dot hero-dot-4" />
                <span className="hero-dot hero-dot-5" />
                <span className="hero-dot hero-dot-6" />
                <span className="hero-dot hero-dot-7" />
                <span className="hero-dot hero-dot-8" />

            </div>


            {/* =====================================================
          BOTTOM WAVE LINES
      ====================================================== */}

            <motion.svg
                className="
          hero-wave-lines
          pointer-events-none
          absolute
          bottom-[-35px]
          left-[-5%]
          h-[230px]
          w-[110%]
        "
                viewBox="0 0 1400 260"
                fill="none"
            >

                <path
                    d="
            M-50 215
            C130 105 245 125 395 205
            C545 285 660 280 805 190
            C950 100 1060 100 1190 180
            C1300 245 1380 215 1450 130
          "
                    stroke="#A5CDF3"
                    strokeWidth="1"
                />

                <path
                    d="
            M-50 225
            C130 115 245 135 395 215
            C545 295 660 290 805 200
            C950 110 1060 110 1190 190
            C1300 255 1380 225 1450 140
          "
                    stroke="#B0D5F6"
                    strokeWidth="1"
                />

                <path
                    d="
            M-50 235
            C130 125 245 145 395 225
            C545 305 660 300 805 210
            C950 120 1060 120 1190 200
            C1300 265 1380 235 1450 150
          "
                    stroke="#BCDBF8"
                    strokeWidth="1"
                />

                <path
                    d="
            M-50 245
            C130 135 245 155 395 235
            C545 315 660 310 805 220
            C950 130 1060 130 1190 210
            C1300 275 1380 245 1450 160
          "
                    stroke="#C7E2F9"
                    strokeWidth="1"
                />

                <path
                    d="
            M-50 255
            C130 145 245 165 395 245
            C545 325 660 320 805 230
            C950 140 1060 140 1190 220
            C1300 285 1380 255 1450 170
          "
                    stroke="#D2E8FA"
                    strokeWidth="1"
                />

            </motion.svg>


            {/* =====================================================
          MAIN CONTENT CONTAINER
      ====================================================== */}

            <div
                className="
          relative
          z-10
          mx-auto
          flex
          min-h-[500px]
          w-full
          max-w-[1320px]
          items-center
          px-6
          py-0
          sm:px-8
          md:px-10
          lg:px-12
          xl:px-14
          2xl:px-16
        "
            >

                <div
                    className="
            grid
            w-full
            items-center
            gap-8
            lg:grid-cols-[0.88fr_1.12fr]
            xl:grid-cols-[0.84fr_1.16fr]
            xl:gap-6
          "
                >

                    {/* =================================================
              LEFT CONTENT
          ================================================= */}

                    <div
                        className="
              relative
              z-20
              w-full
              max-w-[560px]
            "
                    >

                        {/* =================================================
                BADGE
            ================================================= */}

                        <motion.div
                            initial={{
                                opacity: 0,
                                y: 15,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                            }}
                            transition={{
                                duration: 0.6,
                                ease: [0.22, 1, 0.36, 1],
                            }}
                            className="
                mb-5
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-[#D6E3F0]
                bg-white/90
                px-3.5
                py-1.5
                shadow-[0_5px_18px_rgba(40,90,140,0.06)]
                backdrop-blur-md
              "
                        >

                            <Sparkles
                                size={13}
                                strokeWidth={2}
                                className="text-[#2879D7]"
                            />

                            <span
                                className="
                  text-[9px]
                  font-semibold
                  tracking-[0.1px]
                  text-[#314C67]
                "
                            >
                                AI-Powered Sales Platform
                            </span>

                        </motion.div>


                        {/* =================================================
                HEADING
            ================================================= */}

                        <motion.h1
                            initial={{
                                opacity: 0,
                                y: 25,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                            }}
                            transition={{
                                delay: 0.12,
                                duration: 0.75,
                                ease: [0.22, 1, 0.36, 1],
                            }}
                            className="
                max-w-[560px]
                text-[42px]
                font-semibold
                leading-[0.98]
                tracking-[-2.2px]
                text-[#0A2139]
                sm:text-[48px]
                lg:text-[54px]
                xl:text-[60px]
              "
                        >

                            <span className="block">
                                Your CRM.
                            </span>

                            <span className="block">

                                <span className="text-[#2879D7]">
                                    Smarter
                                </span>{" "}

                                with AI.

                            </span>

                        </motion.h1>


                        {/* =================================================
                DESCRIPTION
            ================================================= */}

                        <motion.p
                            initial={{
                                opacity: 0,
                                y: 18,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                            }}
                            transition={{
                                delay: 0.3,
                                duration: 0.65,
                                ease: [0.22, 1, 0.36, 1],
                            }}
                            className="
                mt-6
                max-w-[470px]
                text-[13px]
                leading-[21px]
                text-[#536B83]
                sm:text-[14px]
                sm:leading-[23px]
              "
                        >
                            BusinessFlow AI helps teams manage leads,
                            customers, deals, tasks, and analytics — all
                            in one intelligent platform.
                        </motion.p>


                        {/* =================================================
                BUTTONS
            ================================================= */}

                        <motion.div
                            initial={{
                                opacity: 0,
                                y: 18,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                            }}
                            transition={{
                                delay: 0.45,
                                duration: 0.65,
                                ease: [0.22, 1, 0.36, 1],
                            }}
                            className="
                mt-7
                flex
                flex-wrap
                items-center
                gap-3
              "
                        >

                            <Link
                                to="/register"
                                className="
                  group
                  inline-flex
                  h-[44px]
                  items-center
                  gap-2.5
                  rounded-[7px]
                  bg-[#0B3D6B]
                  px-5
                  text-[12px]
                  font-semibold
                  text-white
                  shadow-[0_8px_22px_rgba(11,61,107,0.20)]
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:bg-[#092F54]
                  hover:shadow-[0_12px_28px_rgba(11,61,107,0.28)]
                  active:scale-[0.98]
                "
                            >

                                Get Started

                                <ArrowRight
                                    size={15}
                                    strokeWidth={2}
                                    className="
                    transition-transform
                    duration-300
                    group-hover:translate-x-1
                  "
                                />

                            </Link>


                            <a
                                href="#features"
                                className="
                  inline-flex
                  h-[44px]
                  items-center
                  justify-center
                  rounded-[7px]
                  border
                  border-[#7FA6CC]
                  bg-white/90
                  px-5
                  text-[12px]
                  font-semibold
                  text-[#174878]
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:border-[#2879D7]
                  hover:bg-white
                  hover:shadow-[0_10px_25px_rgba(40,121,215,0.10)]
                "
                            >
                                Explore Features
                            </a>

                        </motion.div>


                        {/* =================================================
               // TRUST POINTS
            ================================================= */}

                        <motion.div
                            initial={{
                                opacity: 0,
                                y: 15,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                            }}
                            transition={{
                                delay: 0.6,
                                duration: 0.65,
                                ease: [0.22, 1, 0.36, 1],
                            }}
                            className="
                mt-7
                flex
                flex-wrap
                items-center
                gap-x-6
                gap-y-3
              "
                        >

                            <TrustPoint text="Easy to use" />

                            <TrustPoint text="AI powered" />

                            <TrustPoint text="Secure CRM" />

                        </motion.div>

                    </div>


                    {/* =================================================
              RIGHT VISUAL
          ================================================= */}

                    <div
                        className="
              relative
              flex
              min-h-[400px]
              w-full
              items-center
              justify-center
              lg:min-h-[450px]
            "
                    >

                        {/* =================================================
                DASHBOARD
            ================================================= */}

                        <motion.div
                            initial={{
                                opacity: 0,
                                x: 45,
                                y: 20,
                                scale: 0.94,
                            }}
                            animate={{
                                opacity: 1,
                                x: 0,
                                y: 0,
                                scale: 1,
                            }}
                            transition={{
                                delay: 0.4,
                                duration: 0.9,
                                ease: [0.22, 1, 0.36, 1],
                            }}
                            className="
                relative
                z-10
                w-full
                max-w-[650px]
              "
                        >

                            <HeroDashboard />

                        </motion.div>


                        {/* =================================================
                ONLY ONE AI BADGE
            ================================================= */}

                        <motion.div
                            animate={{
                                y: [0, -8, 0],
                                rotate: [3, 5, 3],
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                            className="
                absolute
                right-[1%]
                top-[2%]
                z-40
                flex
                h-[72px]
                w-[72px]
                items-center
                justify-center
                rounded-[14px]
                border
                border-[#173F66]
bg-gradient-to-br
from-[#123E63]
via-[#071D35]
to-[#0B3D6B]
shadow-[0_0_30px_rgba(23,63,102,0.35)]
              "
                        >

                            <span
                                className="
                  text-[32px]
                  font-semibold
                  tracking-[-1.5px]
                  text-white
                "
                            >
                                AI
                            </span>


                            <span
                                className="
                  absolute
                  -right-[10px]
                  -top-[10px]
                  text-[18px]
                  text-[#9678FF]
                "
                            >
                                ✦
                            </span>


                            <span
                                className="
                  absolute
                  -left-[9px]
                  bottom-[2px]
                  text-[11px]
                  text-[#A58AFF]
                "
                            >
                                ✦
                            </span>

                        </motion.div>


                        {/* =================================================
                ROBOT
            ================================================= */}

                        <motion.div
                            initial={{
                                opacity: 0,
                                y: 25,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                            }}
                            transition={{
                                delay: 0.9,
                                duration: 0.8,
                                ease: [0.22, 1, 0.36, 1],
                            }}
                            className="
                absolute
                bottom-[-18px]
                left-[9%]
                z-40
                lg:left-[7%]
              "
                        >

                            <RobotAssistant />

                        </motion.div>

                    </div>

                </div>

            </div>

        </section>
    );
};


/* =========================================================
   TRUST POINT
========================================================= */

const TrustPoint = ({ text }) => {
    return (
        <div className="flex items-center gap-2">

            <CheckCircle2
                size={15}
                strokeWidth={2}
                className="text-[#2879D7]"
            />

            <span
                className="
          text-[10px]
          font-medium
          text-[#60758A]
        "
            >
                {text}
            </span>

        </div>
    );
};


/* =========================================================
   ROBOT ASSISTANT
========================================================= */

const RobotAssistant = () => {
    return (
        <div
            className="
        flex
        items-end
        gap-2.5
        scale-[0.88]
        origin-bottom-left
      "
        >

            {/* =================================================
          SPEECH BUBBLE
      ================================================= */}

            <motion.div
                animate={{
                    y: [0, -5, 0],
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="
          relative
          mb-[82px]
          w-[155px]
          rounded-[11px]
          border
          border-[#C7DCEE]
          bg-white
          px-4
          py-3.5
          shadow-[0_12px_30px_rgba(40,90,135,0.11)]
        "
            >

                <div
                    className="
            absolute
            -right-[9px]
            bottom-[18px]
            h-[16px]
            w-[16px]
            rotate-45
            border-r
            border-t
            border-[#C7DCEE]
            bg-white
          "
                />

                <p
                    className="
            text-[13px]
            font-semibold
            text-[#102A42]
          "
                >
                    Hello! 👋
                </p>

                <p
                    className="
            mt-1.5
            text-[10px]
            leading-[16px]
            text-[#536879]
          "
                >
                    How can I help
                    <br />
                    your business today?
                </p>

            </motion.div>


            {/* =================================================
          ROBOT
      ================================================= */}

            <motion.div
                animate={{
                    y: [0, -9, 0],
                }}
                transition={{
                    duration: 3.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="
          relative
          h-[180px]
          w-[145px]
        "
            >

                {/* Shadow */}

                <motion.div
                    animate={{
                        scaleX: [1, 0.82, 1],
                        opacity: [0.30, 0.16, 0.30],
                    }}
                    transition={{
                        duration: 3.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="
            absolute
            bottom-[3px]
            left-[16px]
            h-[18px]
            w-[112px]
            rounded-full
            bg-[#91AAC1]
            blur-[9px]
          "
                />


                {/* Antenna */}

                <div
                    className="
            absolute
            left-1/2
            top-0
            z-20
            -translate-x-1/2
          "
                >

                    <div
                        className="
              mx-auto
              h-[23px]
              w-[3px]
              bg-[#C9D8E5]
            "
                    />

                    <motion.div
                        animate={{
                            scale: [0.8, 1.35, 0.8],
                            opacity: [0.5, 1, 0.5],
                        }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                        className="
              h-[11px]
              w-[11px]
              rounded-full
              bg-[#39B9FF]
              shadow-[0_0_18px_rgba(57,185,255,0.9)]
            "
                    />

                </div>


                {/* Head */}

                <div
                    className="
            absolute
            left-[18px]
            top-[23px]
            z-20
            h-[78px]
            w-[109px]
            rounded-[28px]
            border
            border-[#CBD9E5]
            bg-gradient-to-b
            from-white
            to-[#E5EEF5]
            shadow-[0_11px_22px_rgba(40,70,100,0.15)]
          "
                >

                    {/* Left Ear */}

                    <div
                        className="
              absolute
              -left-[13px]
              top-[25px]
              h-[27px]
              w-[15px]
              rounded-l-full
              border
              border-[#CBD9E5]
              bg-[#EDF3F7]
            "
                    />

                    {/* Right Ear */}

                    <div
                        className="
              absolute
              -right-[13px]
              top-[25px]
              h-[27px]
              w-[15px]
              rounded-r-full
              border
              border-[#CBD9E5]
              bg-[#EDF3F7]
            "
                    />


                    {/* Face */}

                    <div
                        className="
              absolute
              left-[14px]
              top-[15px]
              h-[47px]
              w-[81px]
              overflow-hidden
              rounded-[18px]
              border
              border-[#203A51]
              bg-[#061C2D]
              shadow-[inset_0_0_17px_rgba(0,125,255,0.20)]
            "
                    >

                        {/* Left Eye */}

                        <motion.div
                            animate={{
                                opacity: [0.65, 1, 0.65],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                            }}
                            className="
                absolute
                left-[19px]
                top-[14px]
                h-[10px]
                w-[10px]
                rounded-full
                bg-[#42C9FF]
                shadow-[0_0_11px_#42C9FF]
              "
                        />

                        {/* Right Eye */}

                        <motion.div
                            animate={{
                                opacity: [0.65, 1, 0.65],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                delay: 0.15,
                            }}
                            className="
                absolute
                right-[19px]
                top-[14px]
                h-[10px]
                w-[10px]
                rounded-full
                bg-[#42C9FF]
                shadow-[0_0_11px_#42C9FF]
              "
                        />

                        {/* Smile */}

                        <div
                            className="
                absolute
                bottom-[9px]
                left-1/2
                h-[9px]
                w-[27px]
                -translate-x-1/2
                rounded-b-full
                border-b-[3px]
                border-[#42C9FF]
              "
                        />

                    </div>

                </div>


                {/* Body */}

                <div
                    className="
            absolute
            bottom-[9px]
            left-[40px]
            z-10
            h-[78px]
            w-[74px]
            rounded-[27px]
            border
            border-[#D0DDE8]
            bg-gradient-to-b
            from-white
            to-[#E6EEF4]
            shadow-[0_11px_20px_rgba(40,65,90,0.12)]
          "
                >

                    <div
                        className="
              absolute
              left-1/2
              top-[26px]
              flex
              h-[24px]
              w-[24px]
              -translate-x-1/2
              items-center
              justify-center
              rounded-[7px]
              bg-[#0B5A96]
              shadow-[0_3px_9px_rgba(11,90,150,0.28)]
            "
                    >

                        <Sparkles
                            size={12}
                            strokeWidth={2}
                            className="text-white"
                        />

                    </div>

                </div>


                {/* Left Arm */}

                <motion.div
                    animate={{
                        rotate: [24, 18, 24],
                    }}
                    transition={{
                        duration: 3.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="
            absolute
            bottom-[21px]
            left-[16px]
            h-[52px]
            w-[19px]
            rounded-full
            border
            border-[#C9D8E3]
            bg-[#EDF3F7]
          "
                />


                {/* Right Arm */}

                <motion.div
                    animate={{
                        rotate: [-20, -15, -20],
                    }}
                    transition={{
                        duration: 3.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="
            absolute
            bottom-[19px]
            right-[14px]
            h-[50px]
            w-[19px]
            rounded-full
            border
            border-[#C9D8E3]
            bg-[#EDF3F7]
          "
                />

            </motion.div>

        </div>
    );
};

export default HeroSection;