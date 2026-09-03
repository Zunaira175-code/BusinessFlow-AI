import { Link, useLocation } from "react-router-dom";
import { MailCheck } from "lucide-react";

const CheckEmail = () => {
  const location = useLocation();

  // Email can be passed from Forgot Password page
  const email = location.state?.email || "";

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#EEF5FF]">

      {/* =====================================================
          BACKGROUND DECORATION
      ====================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          -left-[105px]
          -top-[100px]
          h-[390px]
          w-[390px]
          rounded-full
          bg-[#D7E8FF]
          opacity-80
          blur-[50px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -bottom-[110px]
          -right-[90px]
          h-[380px]
          w-[380px]
          rounded-full
          bg-[#D7E8FF]
          opacity-80
          blur-[50px]
        "
      />

      {/* =====================================================
          MAIN
      ====================================================== */}

      <div
        className="
          relative
          z-10
          flex
          min-h-screen
          items-center
          justify-center
          px-4
          py-10
        "
      >

        <div className="w-full max-w-[800px]">

          {/* =================================================
              BRAND
          ================================================= */}

          <div className="mb-5 flex flex-col items-center">

            <div
              className="
                flex
                items-center
                justify-center
                text-[#092D50]
              "
            >
              {/* Brand mark */}
              <span className="mr-1.5 text-[14px] font-bold">
                ••
              </span>

              <span className="text-[15px] font-semibold tracking-[-0.4px]">
                BusinessFlow AI
              </span>
            </div>

          </div>


          {/* =================================================
              CHECK EMAIL CARD
          ================================================= */}

          <div
            className="
              mx-auto
              w-full
              max-w-[335px]
              overflow-hidden
              rounded-[8px]
              border
              border-[#DCE5EF]
              border-t-[3px]
              border-t-[#0B3D6B]
              bg-white
              px-[25px]
              py-[23px]
              shadow-[0_10px_25px_rgba(15,45,75,0.10)]
            "
          >

            {/* =================================================
                SUCCESS ICON
            ================================================= */}

            <div className="flex justify-center">

              <div
                className="
                  flex
                  h-[49px]
                  w-[49px]
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-[#DCE8F0]
                  bg-[#F7FAFC]
                  text-[#16A34A]
                "
              >
                <MailCheck
                  size={25}
                  strokeWidth={2}
                />
              </div>

            </div>


            {/* =================================================
                CONTENT
            ================================================= */}

            <div className="mt-5 text-center">

              <h1
                className="
                  text-[17px]
                  font-semibold
                  tracking-[-0.35px]
                  text-[#092D50]
                "
              >
                Check Your Email
              </h1>

              <p
                className="
                  mx-auto
                  mt-2
                  max-w-[270px]
                  text-[9px]
                  leading-[15px]
                  text-[#61788E]
                "
              >
                We've sent password reset instructions to your email
                address. Please check your inbox and follow the link to
                reset your password.
              </p>

              {email && (
                <p
                  className="
                    mt-2
                    truncate
                    text-[8px]
                    font-medium
                    text-[#173B5C]
                  "
                >
                  {email}
                </p>
              )}

            </div>


            {/* =================================================
                BACK TO LOGIN
            ================================================= */}

            <Link
              to="/login"
              className="
                mt-6
                flex
                h-[32px]
                w-full
                items-center
                justify-center
                rounded-[4px]
                bg-[#0B3D6B]
                text-[8px]
                font-semibold
                text-white
                transition-all
                duration-200
                hover:bg-[#0A3156]
                active:scale-[0.99]
              "
            >
              Back to Login
            </Link>


            {/* =================================================
                DIVIDER
            ================================================= */}

            <div className="my-4 h-px w-full bg-[#E3E9EF]" />


            {/* =================================================
                RESEND
            ================================================= */}

            <p
              className="
                text-center
                text-[8px]
                text-[#71869A]
              "
            >
              Didn't receive the email?{" "}

              <button
                type="button"
                onClick={() => {
                  console.log("Resend email");
                }}
                className="
                  font-semibold
                  text-[#173B5C]
                  hover:underline
                "
              >
                Resend email
              </button>
            </p>

          </div>

        </div>

      </div>

    </div>
  );
};

export default CheckEmail;