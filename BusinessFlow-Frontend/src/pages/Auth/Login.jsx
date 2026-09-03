import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Zap,
  Eye,
  EyeOff,
  Mail,
  LockKeyhole,
  ArrowRight,
} from "lucide-react";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Login Data:", formData);
  };

  const handleGoogleLogin = () => {
    console.log("Continue with Google");
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
          -left-[100px]
          -top-[100px]
          h-[420px]
          w-[420px]
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
          -bottom-[120px]
          -right-[100px]
          h-[400px]
          w-[400px]
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

            {/* Logo */}
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
              <Zap
                size={18}
                strokeWidth={2.2}
              />
            </div>


            {/* Brand Name */}
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
              LOGIN CARD
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
              py-[22px]
              shadow-[0_10px_25px_rgba(15,45,75,0.11)]
            "
          >

            {/* =================================================
                HEADING
            ================================================= */}

            <div className="text-center">

              <h2
                className="
                  text-[17px]
                  font-semibold
                  tracking-[-0.3px]
                  text-[#092D50]
                "
              >
                Welcome Back
              </h2>

              <p
                className="
                  mt-2
                  text-[8px]
                  leading-4
                  text-[#70859A]
                "
              >
                Sign in to continue to your workspace.
              </p>

            </div>


            {/* =================================================
                FORM
            ================================================= */}

            <form
              onSubmit={handleSubmit}
              className="mt-5"
            >

              {/* =================================================
                  EMAIL
              ================================================= */}

              <div>

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

                <div className="relative">

                  <Mail
                    size={12}
                    strokeWidth={1.7}
                    className="
                      absolute
                      left-2.5
                      top-1/2
                      -translate-y-1/2
                      text-[#7890A5]
                    "
                  />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@company.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="
                      h-[32px]
                      w-full
                      rounded-[4px]
                      border
                      border-[#D8E2EC]
                      bg-white
                      pl-8
                      pr-3
                      text-[9px]
                      text-[#173B5C]
                      outline-none
                      placeholder:text-[#9AAABA]
                      focus:border-[#7AAFE4]
                      focus:ring-1
                      focus:ring-[#D9EAFB]
                    "
                  />

                </div>

              </div>


              {/* =================================================
                  PASSWORD
              ================================================= */}

              <div className="mt-3">

                <label
                  htmlFor="password"
                  className="
                    mb-1.5
                    block
                    text-[8px]
                    font-semibold
                    text-[#173B5C]
                  "
                >
                  Password
                </label>

                <div className="relative">

                  <LockKeyhole
                    size={12}
                    strokeWidth={1.7}
                    className="
                      absolute
                      left-2.5
                      top-1/2
                      -translate-y-1/2
                      text-[#7890A5]
                    "
                  />

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    className="
                      h-[32px]
                      w-full
                      rounded-[4px]
                      border
                      border-[#D8E2EC]
                      bg-white
                      px-8
                      pr-9
                      text-[9px]
                      text-[#173B5C]
                      outline-none
                      placeholder:text-[#9AAABA]
                      focus:border-[#7AAFE4]
                      focus:ring-1
                      focus:ring-[#D9EAFB]
                    "
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((prev) => !prev)
                    }
                    className="
                      absolute
                      right-2
                      top-1/2
                      -translate-y-1/2
                      text-[#7890A5]
                      transition-colors
                      hover:text-[#173B5C]
                    "
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? (
                      <EyeOff size={13} />
                    ) : (
                      <Eye size={13} />
                    )}
                  </button>

                </div>

              </div>


              {/* =================================================
                  REMEMBER + FORGOT PASSWORD
              ================================================= */}

              <div
                className="
                  mt-3
                  flex
                  items-center
                  justify-between
                "
              >

                {/* Remember Me */}
                <label
                  className="
                    flex
                    cursor-pointer
                    items-center
                    gap-1.5
                  "
                >

                  <input
                    type="checkbox"
                    name="remember"
                    checked={formData.remember}
                    onChange={handleChange}
                    className="
                      h-[11px]
                      w-[11px]
                      accent-[#0B3D6B]
                    "
                  />

                  <span
                    className="
                      text-[7px]
                      text-[#61788E]
                    "
                  >
                    Remember me
                  </span>

                </label>


                {/* Forgot Password */}
                <Link
                  to="/forgot-password"
                  className="
                    text-[7px]
                    font-semibold
                    text-[#0B5A96]
                    hover:underline
                  "
                >
                  Forgot Password?
                </Link>

              </div>


              {/* =================================================
                  SIGN IN BUTTON
              ================================================= */}

              <button
                type="submit"
                className="
                  mt-4
                  flex
                  h-[32px]
                  w-full
                  items-center
                  justify-center
                  gap-1.5
                  rounded-[4px]
                  bg-[#0B3D6B]
                  text-[9px]
                  font-semibold
                  text-white
                  transition-all
                  duration-200
                  hover:bg-[#0A3156]
                  active:scale-[0.99]
                "
              >
                Sign In

                <ArrowRight
                  size={11}
                  strokeWidth={2}
                />
              </button>


              {/* =================================================
                  OR DIVIDER
              ================================================= */}

              <div
                className="
                  my-4
                  flex
                  items-center
                  gap-2.5
                "
              >

                <div className="h-px flex-1 bg-[#E3E9EF]" />

                <span
                  className="
                    text-[7px]
                    font-medium
                    text-[#91A2B2]
                  "
                >
                  OR
                </span>

                <div className="h-px flex-1 bg-[#E3E9EF]" />

              </div>


              {/* =================================================
                  GOOGLE LOGIN
              ================================================= */}

              <button
                type="button"
                onClick={handleGoogleLogin}
                className="
                  flex
                  h-[32px]
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-[4px]
                  border
                  border-[#D8E2EC]
                  bg-white
                  text-[9px]
                  font-semibold
                  text-[#173B5C]
                  transition-all
                  duration-200
                  hover:bg-[#F8FAFC]
                "
              >

                {/* Google Colorful Icon */}
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >

                  <path
                    fill="#4285F4"
                    d="M21.35 12.23c0-.79-.07-1.55-.23-2.27H12v4.3h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.91-4.18 2.91-7.42z"
                  />

                  <path
                    fill="#34A853"
                    d="M12 21.5c2.63 0 4.84-.87 6.45-2.35l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.3v2.53A9.75 9.75 0 0 0 12 21.5z"
                  />

                  <path
                    fill="#FBBC05"
                    d="M6.54 13.59A5.86 5.86 0 0 1 6.23 12c0-.55.1-1.08.31-1.59V7.88H3.3A9.75 9.75 0 0 0 2.25 12c0 1.57.38 3.05 1.05 4.12l3.24-2.53z"
                  />

                  <path
                    fill="#EA4335"
                    d="M12 6.38c1.43 0 2.71.49 3.72 1.46l2.79-2.79C16.83 3.49 14.63 2.5 12 2.5a9.75 9.75 0 0 0-8.7 5.38l3.24 2.53C7.31 8.1 9.46 6.38 12 6.38z"
                  />

                </svg>

                Continue with Google

              </button>

            </form>

          </div>


          {/* =================================================
              CREATE ACCOUNT
          ================================================= */}

          <div className="mt-5 text-center">

            <p
              className="
                text-[8px]
                text-[#667D92]
              "
            >
              Don't have an account?{" "}

              <Link
                to="/register"
                className="
                  font-semibold
                  text-[#173B5C]
                  hover:underline
                "
              >
                Create an account
              </Link>
            </p>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Login;