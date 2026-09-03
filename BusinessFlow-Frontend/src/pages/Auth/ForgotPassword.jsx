import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    navigate("/check-email", {
      state: {
        email,
      },
    });
  };

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
          MAIN CONTAINER
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
                h-[36px]
                w-[36px]
                items-center
                justify-center
                rounded-[6px]
                bg-[#0B3D6B]
                text-white
                shadow-sm
              "
            >
              <span className="text-[14px] font-bold">
                ◆
              </span>
            </div>

            <h1
              className="
                mt-2
                text-[12px]
                font-semibold
                tracking-[-0.2px]
                text-[#092D50]
              "
            >
              BusinessFlow AI
            </h1>

          </div>


          {/* =================================================
              FORGOT PASSWORD CARD
          ================================================= */}

          <div
            className="
              mx-auto
              w-full
              max-w-[300px]
              rounded-[8px]
              border
              border-[#DCE5EF]
              bg-white
              px-[22px]
              py-[24px]
              shadow-[0_10px_25px_rgba(15,45,75,0.11)]
            "
          >

            {/* Heading */}
            <div className="text-center">

              <h2
                className="
                  text-[16px]
                  font-semibold
                  tracking-[-0.3px]
                  text-[#092D50]
                "
              >
                Forgot Your Password?
              </h2>

              <p
                className="
                  mx-auto
                  mt-2
                  max-w-[225px]
                  text-[7px]
                  leading-[11px]
                  text-[#70859A]
                "
              >
                Enter your email address and we'll send you a link
                to reset your password.
              </p>

            </div>


            {/* =================================================
                FORM
            ================================================= */}

            <form
              onSubmit={handleSubmit}
              className="mt-5"
            >

              {/* Email Label */}
              <label
                htmlFor="email"
                className="
                  mb-1.5
                  block
                  text-[8px]
                  font-semibold
                  text-[#173B5C]
                "
              >
                Email Address
              </label>


              {/* Email Input */}
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="
                  h-[32px]
                  w-full
                  rounded-[4px]
                  border
                  border-[#D8E2EC]
                  bg-white
                  px-3
                  text-[9px]
                  text-[#173B5C]
                  outline-none
                  placeholder:text-[#9AAABA]
                  focus:border-[#7AAFE4]
                  focus:ring-1
                  focus:ring-[#D9EAFB]
                "
              />


              {/* =================================================
                  SEND RESET BUTTON
              ================================================= */}

              <button
                type="submit"
                className="
                  mt-3.5
                  flex
                  h-[32px]
                  w-full
                  items-center
                  justify-center
                  gap-1.5
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
                Send Reset Link

                <ArrowRight
                  size={11}
                  strokeWidth={2}
                />
              </button>

            </form>


            {/* =================================================
                BACK TO LOGIN
            ================================================= */}

            <div className="mt-4 text-center">

              <Link
                to="/login"
                className="
                  inline-flex
                  items-center
                  gap-1
                  text-[7px]
                  font-medium
                  text-[#0B5A96]
                  transition-colors
                  hover:text-[#092D50]
                  hover:underline
                "
              >
                <ArrowLeft
                  size={9}
                  strokeWidth={1.8}
                />

                Back to Login
              </Link>

            </div>

          </div>


          {/* =================================================
              SIGN IN
          ================================================= */}

          <div className="mt-5 text-center">

            <p
              className="
                text-[8px]
                text-[#667D92]
              "
            >
              Remember your password?{" "}

              <Link
                to="/login"
                className="
                  font-semibold
                  text-[#173B5C]
                  hover:underline
                "
              >
                Sign in
              </Link>
            </p>

          </div>

        </div>

      </div>

    </div>
  );
};

export default ForgotPassword;