import { motion } from "framer-motion";

const FeatureCard = ({
  icon: Icon,
  title,
  description,
}) => {
  return (
    <motion.div
      whileHover={{
        y: -6,
        scale: 1.015,
      }}
      transition={{
        type: "spring",
        stiffness: 280,
        damping: 18,
      }}
      className="
        group
        relative
        min-h-[175px]
        w-full
        overflow-hidden
        rounded-[8px]
        border
        border-[#D2D9E1]
        bg-white
        p-[17px]
        shadow-[0_3px_10px_rgba(20,50,80,0.025)]
        transition-all
        duration-300
        hover:border-[#AFCBE5]
        hover:shadow-[0_12px_28px_rgba(35,100,160,0.10)]
      "
    >

      {/* =================================================
          HOVER BLUE GLOW
      ================================================= */}

      <div
        className="
          pointer-events-none
          absolute
          -right-[35px]
          -top-[35px]
          h-[110px]
          w-[110px]
          rounded-full
          bg-[#D9ECFF]
          opacity-0
          blur-[35px]
          transition-opacity
          duration-500
          group-hover:opacity-80
        "
      />


      {/* =================================================
          ICON
      ================================================= */}

      <motion.div
        whileHover={{
          scale: 1.12,
          rotate: -6,
        }}
        transition={{
          type: "spring",
          stiffness: 350,
          damping: 15,
        }}
        className="
          relative
          flex
          h-[34px]
          w-[34px]
          items-center
          justify-center
          rounded-[7px]
          bg-[#E8F3FF]
          text-[#176FD1]
          transition-colors
          duration-300
          group-hover:bg-[#D7EAFF]
        "
      >
        {Icon && (
          <Icon
            size={17}
            strokeWidth={1.8}
          />
        )}
      </motion.div>


      {/* =================================================
          TITLE
      ================================================= */}

      <h3
        className="
          relative
          mt-[13px]
          text-[13px]
          font-semibold
          leading-[17px]
          tracking-[-0.15px]
          text-[#102A42]
          transition-colors
          duration-300
          group-hover:text-[#176FD1]
        "
      >
        {title}
      </h3>


      {/* =================================================
          DESCRIPTION
      ================================================= */}

      <p
        className="
          relative
          mt-[7px]
          max-w-[320px]
          text-[9px]
          leading-[14px]
          text-[#667687]
        "
      >
        {description}
      </p>


      {/* =================================================
          BOTTOM ANIMATED LINE
      ================================================= */}

      <motion.div
        className="
          absolute
          bottom-0
          left-0
          h-[2px]
          rounded-full
          bg-[#2879D7]
        "
        initial={{
          width: 0,
        }}
        whileHover={{
          width: "42%",
        }}
        transition={{
          duration: 0.35,
          ease: "easeOut",
        }}
      />

    </motion.div>
  );
};

export default FeatureCard;