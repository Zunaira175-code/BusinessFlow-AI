import {
  Mail,
  Headphones,
  MapPin,
  Send,
  ChevronDown,
} from "lucide-react";
import { motion } from "framer-motion";

const ContactMain = () => {
  return (
    <section
      className="
        relative
        overflow-hidden
        bg-[#F7F9FF]
        px-5
        py-10
        sm:px-8
        lg:px-5
        lg:py-12
      "
    >
      <div className="relative z-10 mx-auto grid w-full max-w-[1160px] gap-7 lg:grid-cols-[1.15fr_0.85fr]">
        
        {/* =====================================================
            CONTACT FORM
        ====================================================== */}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.6 }}
          className="
            relative
            overflow-hidden
            rounded-[10px]
            border
            border-[#D8E3EE]
            bg-white
            px-8
            py-9
            shadow-[0_3px_12px_rgba(20,50,80,0.035)]
            sm:px-9
            lg:px-10
          "
        >
          {/* Soft glow */}
          <div
            className="
              pointer-events-none
              absolute
              right-[-70px]
              top-[-70px]
              h-[180px]
              w-[180px]
              rounded-full
              bg-[#E5F0FF]
              opacity-70
              blur-[55px]
            "
          />

          <div className="relative z-10">
            <h2
              className="
                text-[23px]
                font-bold
                tracking-[-0.5px]
                text-[#071D35]
                sm:text-[24px]
              "
            >
              Send us a message
            </h2>

            <form className="mt-7">
              {/* First / Last Name */}
              <div className="grid gap-5 sm:grid-cols-2">
                <FormField
                  label="First Name"
                  placeholder="Jane"
                />

                <FormField
                  label="Last Name"
                  placeholder="Doe"
                />
              </div>

              {/* Email / Company */}
              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <FormField
                  label="Work Email"
                  type="email"
                  placeholder="jane@company.com"
                />

                <FormField
                  label="Company"
                  placeholder="Acme Corp"
                />
              </div>

              {/* Subject */}
              <div className="mt-5">
                <label
                  className="
                    mb-2
                    block
                    text-[10px]
                    font-semibold
                    text-[#071D35]
                  "
                >
                  Subject
                </label>

                <div className="relative">
                  <select
                    defaultValue="General Inquiry"
                    className="
                      h-[38px]
                      w-full
                      appearance-none
                      rounded-[6px]
                      border
                      border-[#D8E3EE]
                      bg-white
                      px-3
                      text-[11px]
                      text-[#19334D]
                      outline-none
                      transition
                      focus:border-[#0B3D6B]
                      focus:ring-2
                      focus:ring-[#0B3D6B]/10
                    "
                  >
                    <option>General Inquiry</option>
                    <option>Sales</option>
                    <option>Support</option>
                    <option>Partnership</option>
                  </select>

                  <ChevronDown
                    size={15}
                    className="
                      pointer-events-none
                      absolute
                      right-3
                      top-1/2
                      -translate-y-1/2
                      text-[#687B8E]
                    "
                  />
                </div>
              </div>

              {/* Message */}
              <div className="mt-5">
                <label
                  className="
                    mb-2
                    block
                    text-[10px]
                    font-semibold
                    text-[#071D35]
                  "
                >
                  Message
                </label>

                <textarea
                  rows={5}
                  placeholder="How can we help your team scale?"
                  className="
                    min-h-[108px]
                    w-full
                    resize-none
                    rounded-[6px]
                    border
                    border-[#D8E3EE]
                    bg-white
                    px-3
                    py-2.5
                    text-[11px]
                    text-[#19334D]
                    outline-none
                    placeholder:text-[#8491A0]
                    transition
                    focus:border-[#0B3D6B]
                    focus:ring-2
                    focus:ring-[#0B3D6B]/10
                  "
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="
                  mt-5
                  flex
                  h-[37px]
                  min-w-[122px]
                  items-center
                  justify-center
                  gap-2
                  rounded-[6px]
                  bg-[#0B3D6B]
                  px-5
                  text-[10px]
                  font-semibold
                  text-white
                  shadow-[0_4px_10px_rgba(11,61,107,0.16)]
                  transition-all
                  duration-300
                  hover:bg-[#092F54]
                  hover:shadow-[0_6px_15px_rgba(11,61,107,0.22)]
                  active:scale-[0.98]
                "
              >
                Send Message
                <Send size={12} strokeWidth={1.8} />
              </button>
            </form>
          </div>
        </motion.div>


        {/* =====================================================
            RIGHT COLUMN
        ====================================================== */}

        <div className="flex flex-col gap-6">

          {/* =================================================
              DIRECT CONTACT
          ================================================= */}

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="
              rounded-[10px]
              border
              border-[#D8E3EE]
              bg-white
              px-5
              py-5
              shadow-[0_3px_12px_rgba(20,50,80,0.035)]
            "
          >
            <h2
              className="
                text-[16px]
                font-bold
                tracking-[-0.2px]
                text-[#071D35]
              "
            >
              Direct Contact
            </h2>

            <div className="mt-5 space-y-5">

              {/* Email */}
              <ContactItem
                icon={Mail}
                title="Email Us"
              >
                <a
                  href="mailto:hello@businessflow.ai"
                  className="text-[10px] font-medium text-[#1687E8] hover:underline"
                >
                  hello@businessflow.ai
                </a>
              </ContactItem>

              {/* Support */}
              <ContactItem
                icon={Headphones}
                title="Sales & Support"
              >
                <p className="text-[10px] text-[#667C91]">
                  +1 (800) 555-0199
                </p>

                <p className="mt-1 text-[9px] text-[#8A9AAA]">
                  Mon-Fri, 9am - 6pm EST
                </p>
              </ContactItem>

            </div>
          </motion.div>


          {/* =================================================
              GLOBAL PRESENCE
          ================================================= */}

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="
              overflow-hidden
              rounded-[10px]
              border
              border-[#D8E3EE]
              bg-white
              shadow-[0_3px_12px_rgba(20,50,80,0.035)]
            "
          >
            {/* Map */}
            <div
              className="
                relative
                h-[180px]
                overflow-hidden
                bg-[#DCE9FA]
              "
            >
              {/* Map-style background */}
              <div
                className="
                  absolute
                  inset-0
                  opacity-70
                  bg-[radial-gradient(circle_at_25%_35%,#ffffff_0,transparent_28%),radial-gradient(circle_at_70%_55%,#ffffff_0,transparent_30%),linear-gradient(135deg,#D8E7FA,#C5D9F1)]
                "
              />

              {/* Decorative map lines */}
              <div className="absolute left-[8%] top-[25%] h-[1px] w-[84%] rotate-[8deg] bg-white/70" />
              <div className="absolute left-[10%] top-[48%] h-[1px] w-[75%] -rotate-[10deg] bg-white/70" />
              <div className="absolute left-[20%] top-[68%] h-[1px] w-[68%] rotate-[5deg] bg-white/60" />

              {/* Location badge */}
              <div
                className="
                  absolute
                  left-1/2
                  top-1/2
                  flex
                  -translate-x-1/2
                  -translate-y-1/2
                  items-center
                  gap-1.5
                  whitespace-nowrap
                  rounded-[6px]
                  bg-white
                  px-4
                  py-2
                  shadow-[0_4px_12px_rgba(20,50,80,0.10)]
                "
              >
                <MapPin
                  size={14}
                  fill="#071D35"
                  className="text-[#071D35]"
                />

                <span
                  className="
                    text-[10px]
                    font-semibold
                    text-[#071D35]
                  "
                >
                  Headquarters: San Francisco, CA
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="px-5 py-5">
              <h2
                className="
                  text-[16px]
                  font-bold
                  tracking-[-0.2px]
                  text-[#071D35]
                "
              >
                Global Presence
              </h2>

              <p
                className="
                  mt-2
                  max-w-[450px]
                  text-[9px]
                  leading-[15px]
                  text-[#667C91]
                "
              >
                With offices in SF, London, and Singapore, our team is
                equipped to support enterprise clients worldwide.
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};


/* =========================================================
   FORM FIELD
========================================================= */

const FormField = ({
  label,
  placeholder,
  type = "text",
}) => {
  return (
    <div>
      <label
        className="
          mb-2
          block
          text-[10px]
          font-semibold
          text-[#071D35]
        "
      >
        {label}
      </label>

      <input
        type={type}
        placeholder={placeholder}
        className="
          h-[38px]
          w-full
          rounded-[6px]
          border
          border-[#D8E3EE]
          bg-white
          px-3
          text-[11px]
          text-[#19334D]
          outline-none
          placeholder:text-[#8491A0]
          transition
          focus:border-[#0B3D6B]
          focus:ring-2
          focus:ring-[#0B3D6B]/10
        "
      />
    </div>
  );
};


/* =========================================================
   CONTACT ITEM
========================================================= */

const ContactItem = ({
  icon: Icon,
  title,
  children,
}) => {
  return (
    <div className="flex items-start gap-3">
      <div
        className="
          flex
          h-[38px]
          w-[38px]
          shrink-0
          items-center
          justify-center
          rounded-full
          bg-[#EEF5FF]
          text-[#2D6095]
        "
      >
        <Icon size={18} strokeWidth={1.7} />
      </div>

      <div className="pt-0.5">
        <p
          className="
            text-[10px]
            font-semibold
            text-[#071D35]
          "
        >
          {title}
        </p>

        <div className="mt-1">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ContactMain;