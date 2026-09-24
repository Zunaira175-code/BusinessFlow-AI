import { useState } from "react";
import {
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import {
  Zap,
  Eye,
  EyeOff,
  LockKeyhole,
  ArrowRight,
} from "lucide-react";

const API_URL = "http://localhost:5000/api";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // =====================================================
  // RESET TOKEN FROM URL
  // =====================================================

  const token = searchParams.get("token");

  // =====================================================
  // STATES
  // =====================================================

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =====================================================
  // HANDLE INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error while typing
    if (error) {
      setError("");
    }
  };

  // =====================================================
  // HANDLE SUBMIT
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // =====================================================
    // TOKEN VALIDATION
    // =====================================================

    if (!token) {
      setError(
        "This password reset link is invalid or missing."
      );
      return;
    }

    // =====================================================
    // PASSWORD VALIDATION
    // =====================================================

    if (!formData.password || !formData.confirmPassword) {
      setError(
        "Password and confirm password are required."
      );
      return;
    }

    if (formData.password.length < 6) {
      setError(
        "Password must be at least 6 characters."
      );
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // =====================================================
    // API REQUEST
    // =====================================================

    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/auth/reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token,
            password: formData.password,
            confirmPassword: formData.confirmPassword,
          }),
        }
      );

      const result = await response.json();

      // =====================================================
      // BACKEND ERROR
      // =====================================================

      if (!response.ok || !result.success) {
        setError(
          result.message ||
            "Unable to reset your password."
        );

        setLoading(false);
        return;
      }

      // =====================================================
      // SUCCESS
      // =====================================================

      setSuccess(
        "Password changed successfully. Redirecting to login..."
      );

      // =====================================================
      // REDIRECT TO LOGIN
      // =====================================================

      setTimeout(() => {
        navigate("/login", {
          replace: true,
        });
      }, 1200);
    } catch (error) {
      console.error("Reset Password Error:", error);

      setError(
        "Unable to connect to the server. Please make sure the backend is running."
      );

      setLoading(false);
    }
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
                rounded-[7px]
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
              RESET PASSWORD CARD
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
                Reset Your Password
              </h2>

              <p
                className="
                  mx-auto
                  mt-2
                  max-w-[230px]
                  text-[8px]
                  leading-4
                  text-[#70859A]
                "
              >
                Enter your new password below and confirm it
                to update your account.
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
                  ERROR MESSAGE
              ================================================= */}

              {error && (
                <div
                  className="
                    mb-4
                    rounded-[4px]
                    border
                    border-[#F5C2C7]
                    bg-[#FFF1F2]
                    px-3
                    py-2
                    text-[7px]
                    leading-[11px]
                    text-[#B42318]
                  "
                >
                  {error}
                </div>
              )}

              {/* =================================================
                  SUCCESS MESSAGE
              ================================================= */}

              {success && (
                <div
                  className="
                    mb-4
                    rounded-[4px]
                    border
                    border-[#B7E4C7]
                    bg-[#F0FFF4]
                    px-3
                    py-2
                    text-[7px]
                    leading-[11px]
                    text-[#16794C]
                  "
                >
                  {success}
                </div>
              )}

              {/* =================================================
                  PASSWORD
              ================================================= */}

              <div>

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
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Enter new password"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={loading}
                    autoComplete="new-password"
                    className="
                      h-[32px]
                      w-full
                      rounded-[4px]
                      border
                      border-[#D8E2EC]
                      bg-white
                      pl-8
                      pr-9
                      text-[9px]
                      text-[#173B5C]
                      outline-none
                      placeholder:text-[#9AAABA]
                      focus:border-[#7AAFE4]
                      focus:ring-1
                      focus:ring-[#D9EAFB]
                      disabled:cursor-not-allowed
                      disabled:bg-[#F5F8FB]
                    "
                  />

                  {/* Password Visibility */}
                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (prev) => !prev
                      )
                    }
                    disabled={loading}
                    className="
                      absolute
                      right-2
                      top-1/2
                      -translate-y-1/2
                      text-[#7890A5]
                      transition-colors
                      hover:text-[#173B5C]
                      disabled:cursor-not-allowed
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
                  CONFIRM PASSWORD
              ================================================= */}

              <div className="mt-3">

                <label
                  htmlFor="confirmPassword"
                  className="
                    mb-1.5
                    block
                    text-[8px]
                    font-semibold
                    text-[#173B5C]
                  "
                >
                  Confirm Password
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
                    id="confirmPassword"
                    name="confirmPassword"
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Confirm new password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    disabled={loading}
                    autoComplete="new-password"
                    className="
                      h-[32px]
                      w-full
                      rounded-[4px]
                      border
                      border-[#D8E2EC]
                      bg-white
                      pl-8
                      pr-9
                      text-[9px]
                      text-[#173B5C]
                      outline-none
                      placeholder:text-[#9AAABA]
                      focus:border-[#7AAFE4]
                      focus:ring-1
                      focus:ring-[#D9EAFB]
                      disabled:cursor-not-allowed
                      disabled:bg-[#F5F8FB]
                    "
                  />

                  {/* Confirm Password Visibility */}
                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        (prev) => !prev
                      )
                    }
                    disabled={loading}
                    className="
                      absolute
                      right-2
                      top-1/2
                      -translate-y-1/2
                      text-[#7890A5]
                      transition-colors
                      hover:text-[#173B5C]
                      disabled:cursor-not-allowed
                    "
                    aria-label="Toggle confirm password visibility"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={13} />
                    ) : (
                      <Eye size={13} />
                    )}
                  </button>

                </div>

              </div>

              {/* =================================================
                  CHANGE PASSWORD BUTTON
              ================================================= */}

              <button
                type="submit"
                disabled={loading}
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
                  disabled:cursor-not-allowed
                  disabled:opacity-70
                "
              >

                {loading ? (
                  <>
                    <span
                      className="
                        h-[11px]
                        w-[11px]
                        animate-spin
                        rounded-full
                        border-2
                        border-white
                        border-t-transparent
                      "
                    />

                    Changing...
                  </>
                ) : (
                  <>
                    Change Password

                    <ArrowRight
                      size={11}
                      strokeWidth={2}
                    />
                  </>
                )}

              </button>

            </form>

          </div>

          {/* =================================================
              BOTTOM TEXT
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

export default ResetPassword;