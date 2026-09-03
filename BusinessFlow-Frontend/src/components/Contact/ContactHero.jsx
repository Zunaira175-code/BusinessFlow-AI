import { motion } from "framer-motion";

const ContactHero = () => {
  return (
    <section
      className="
        relative
        overflow-hidden
        border-t
        border-b
        border-[#DCE5EF]
        bg-[#F7F9FF]
        px-5
        py-10
        sm:px-8
        sm:py-11
        lg:py-12
      "
    >
      {/* Soft Background Glow */}
      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-[-100px]
          h-[260px]
          w-[520px]
          -translate-x-1/2
          rounded-full
          bg-[#DDEBFF]
          opacity-50
          blur-[90px]
        "
      />

      <div className="relative z-10 mx-auto max-w-[900px] text-center">
        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="
            text-[28px]
            font-bold
            leading-[1.15]
            tracking-[-0.8px]
            text-[#12365B]
            sm:text-[32px]
            lg:text-[34px]
          "
        >
          Let's Talk About Your Business
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            delay: 0.1,
            duration: 0.55,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="
            mx-auto
            mt-5
            max-w-[760px]
            text-[11px]
            font-normal
            leading-[18px]
            text-[#587089]
            sm:text-[12px]
            sm:leading-[19px]
          "
        >
          Have questions about BusinessFlow AI or want to see how AI-powered
          CRM can help your team?
          <br className="hidden sm:block" />
          We'd love to hear from you. Our enterprise experts are ready to
          assist.
        </motion.p>
      </div>
    </section>
  );
};

export default ContactHero;