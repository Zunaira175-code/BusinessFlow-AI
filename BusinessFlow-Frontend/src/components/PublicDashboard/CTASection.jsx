import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section className="bg-[#F4F8FD]">
      <div
        className="
          mx-auto
          flex
          min-h-[265px]
          max-w-[900px]
          flex-col
          items-center
          justify-center
          px-5
          py-[55px]
          text-center
        "
      >
        {/* Heading */}
        <h2
          className="
            max-w-[480px]
            text-[24px]
            font-semibold
            leading-[1.15]
            tracking-[-0.7px]
            text-[#0A2139]
          "
        >
          Ready to Make Your CRM Smarter?
        </h2>

        {/* Description */}
        <p
          className="
            mt-[16px]
            max-w-[390px]
            text-[12px]
            leading-[14px]
            text-[#667687]
          "
        >
          Bring your sales, customers, and AI-powered automation together with
          BusinessFlow AI.
        </p>

        {/* Buttons */}
        <div className="mt-[19px] flex items-center gap-[8px]">
          {/* Get Started */}
          <Link
            to="/register"
            className="
              flex
              h-[29px]
              items-center
              justify-center
              rounded-[4px]
              bg-[#0B3D6B]
              px-[17px]
              text-[7px]
              font-semibold
              text-white
              transition
              hover:bg-[#092F54]
            "
          >
            Get Started
          </Link>

          {/* Contact Us */}
          <Link
            to="/contact"
            className="
              flex
              h-[29px]
              items-center
              justify-center
              rounded-[4px]
              border
              border-[#9DAFBE]
              bg-white
              px-[17px]
              text-[7px]
              font-semibold
              text-[#173B5C]
              transition
              hover:bg-[#F8FAFC]
            "
          >
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTASection;