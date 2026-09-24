import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Zap,
  Eye,
  EyeOff,
  Mail,
  LockKeyhole,
  ArrowRight,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

const API_URL = "http://localhost:5000/api";

const Login = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =====================================================
  // HANDLE INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (error) {
      setError("");
    }

    if (success) {
      setSuccess("");
    }
  };

  // =====================================================
  // HANDLE LOGIN
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setError("");
    setSuccess("");

    const email = formData.email.trim().toLowerCase();
    const password = formData.password;

    // =====================================================
    // VALIDATION
    // =====================================================

    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);

      // ===================================================
      // LOGIN REQUEST
      // ===================================================

      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      // ===================================================
      // SAFE JSON PARSING
      // ===================================================

      let result;

      try {
        result = await response.json();
      } catch {
        throw new Error(
          "The server returned an invalid response. Please try again."
        );
      }

      // ===================================================
      // BACKEND ERROR
      // ===================================================

      if (!response.ok || !result?.success) {
        throw new Error(
          result?.message || "Invalid email or password."
        );
      }

      // ===================================================
      // GET AUTH DATA
      // ===================================================

      const token = result?.data?.token;
      const user = result?.data?.user;

      if (!token) {
        throw new Error(
          "Login succeeded, but authentication token was not returned."
        );
      }

      if (!user) {
        throw new Error(
          "Login succeeded, but account information was not returned."
        );
      }

      // ===================================================
      // VALIDATE ROLE
      // ===================================================

      const allowedRoles = ["admin", "employee"];

      if (!allowedRoles.includes(user.role)) {
        throw new Error(
          "Your account has an invalid role. Please contact your administrator."
        );
      }

      // ===================================================
      // SAVE AUTHENTICATION DATA
      // =====================================================

      localStorage.setItem("businessflow_token", token);

      localStorage.setItem(
        "businessflow_user",
        JSON.stringify(user)
      );

      // =====================================================
      // OPTIONAL SESSION CLEANUP
      // =====================================================

      sessionStorage.removeItem("invitationToken");
      sessionStorage.removeItem("invitation");
      sessionStorage.removeItem("activatedEmployee");

      // =====================================================
      // SUCCESS
      // =====================================================

      setSuccess("Login successful. Redirecting...");

      // =====================================================
      // ROLE BASED REDIRECT
      // =====================================================

      if (user.role === "admin") {
        navigate("/admin/dashboard", {
          replace: true,
        });
      } else if (user.role === "employee") {
        navigate("/employee/dashboard", {
          replace: true,
        });
      }
    } catch (error) {
      console.error("Login Error:", error);

      setError(
        error?.message ||
          "Unable to connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // GOOGLE LOGIN
  // =====================================================

  const handleGoogleLogin = () => {
    if (loading) return;

    setError("");

    // Google authentication is not connected yet.
    setError("Google sign-in is not configured yet.");
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#EEF5FF]">

      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        <div className="absolute -left-[100px] -top-[100px] h-[420px] w-[420px] rounded-full bg-[#D7E8FF] opacity-80 blur-[50px]" />

        <div className="absolute -bottom-[120px] -right-[100px] h-[400px] w-[400px] rounded-full bg-[#D7E8FF] opacity-80 blur-[50px]" />

        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/40 blur-[100px]" />

      </div>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10">

        <div className="w-full max-w-[800px]">

          {/* =================================================
              BRAND
          ================================================= */}

          <div className="mb-5 flex flex-col items-center">

            <div className="flex items-center gap-2.5">

              <div className="flex h-[38px] w-[38px] items-center justify-center rounded-[7px] bg-[#0B3D6B] text-white shadow-[0_5px_15px_rgba(11,61,107,0.16)]">

                <Zap
                  size={20}
                  strokeWidth={2.2}
                />

              </div>

              <div>

                <h1 className="text-[17px] font-semibold tracking-[-0.3px] text-[#092D50]">
                  BusinessFlow AI
                </h1>

                <p className="mt-[1px] text-[7px] font-medium tracking-[0.2px] text-[#71869A]">
                  Work Smarter. Grow Faster.
                </p>

              </div>

            </div>

          </div>

          {/* =================================================
              LOGIN CARD
          ================================================= */}

          <section
            className="
              mx-auto
              w-full
              max-w-[320px]
              rounded-[9px]
              border
              border-[#DCE5EF]
              bg-white
              px-[23px]
              py-[23px]
              shadow-[0_12px_30px_rgba(15,45,75,0.10)]
            "
          >

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="text-center">

              <h2 className="text-[18px] font-semibold tracking-[-0.3px] text-[#092D50]">
                Welcome Back
              </h2>

              <p className="mt-2 text-[9px] leading-4 text-[#70859A]">
                Sign in to continue to your workspace.
              </p>

            </div>

            {/* =================================================
                FORM
            ================================================= */}

            <form
              onSubmit={handleSubmit}
              className="mt-5"
              noValidate
            >

              {/* =================================================
                  ERROR
              ================================================= */}

              {error && (
                <div className="mb-4 rounded-[6px] border border-[#FECACA] bg-[#FEF2F2] px-3 py-2.5">

                  <div className="flex items-start gap-2">

                    <AlertCircle
                      size={13}
                      strokeWidth={2}
                      className="mt-[1px] shrink-0 text-[#DC2626]"
                    />

                    <p className="text-[8px] leading-[13px] text-[#B42318]">
                      {error}
                    </p>

                  </div>

                </div>
              )}

              {/* =================================================
                  SUCCESS
              ================================================= */}

              {success && (
                <div className="mb-4 rounded-[6px] border border-[#BBE7CF] bg-[#F0FFF6] px-3 py-2.5">

                  <div className="flex items-center gap-2">

                    <CheckCircle2
                      size={13}
                      strokeWidth={2}
                      className="shrink-0 text-[#16A66A]"
                    />

                    <p className="text-[8px] leading-[13px] text-[#16794C]">
                      {success}
                    </p>

                  </div>

                </div>
              )}

              {/* =================================================
                  EMAIL
              ================================================= */}

              <div>

                <label
                  htmlFor="email"
                  className="mb-1.5 block text-[8px] font-semibold text-[#173B5C]"
                >
                  Email Address
                </label>

                <div className="relative">

                  <Mail
                    size={13}
                    strokeWidth={1.7}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#7890A5]"
                  />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@company.com"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={loading}
                    autoComplete="email"
                    spellCheck="false"
                    className="
                      h-[34px]
                      w-full
                      rounded-[5px]
                      border
                      border-[#D8E2EC]
                      bg-white
                      pl-8
                      pr-3
                      text-[9px]
                      font-medium
                      text-[#173B5C]
                      outline-none
                      placeholder:text-[#9AAABA]
                      transition
                      focus:border-[#7AAFE4]
                      focus:ring-2
                      focus:ring-[#D9EAFB]
                      disabled:cursor-not-allowed
                      disabled:bg-[#F5F8FB]
                    "
                  />

                </div>

              </div>

              {/* =================================================
                  PASSWORD
              ================================================= */}

              <div className="mt-3.5">

                <label
                  htmlFor="password"
                  className="mb-1.5 block text-[8px] font-semibold text-[#173B5C]"
                >
                  Password
                </label>

                <div className="relative">

                  <LockKeyhole
                    size={13}
                    strokeWidth={1.7}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#7890A5]"
                  />

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={loading}
                    autoComplete="current-password"
                    className="
                      h-[34px]
                      w-full
                      rounded-[5px]
                      border
                      border-[#D8E2EC]
                      bg-white
                      pl-8
                      pr-9
                      text-[9px]
                      font-medium
                      text-[#173B5C]
                      outline-none
                      placeholder:text-[#9AAABA]
                      focus:border-[#7AAFE4]
                      focus:ring-2
                      focus:ring-[#D9EAFB]
                      disabled:cursor-not-allowed
                      disabled:bg-[#F5F8FB]
                    "
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((previous) => !previous)
                    }
                    disabled={loading}
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
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
                  REMEMBER / FORGOT
              ================================================= */}

              <div className="mt-3.5 flex items-center justify-between">

                <label className="flex cursor-pointer items-center gap-1.5">

                  <input
                    type="checkbox"
                    name="remember"
                    checked={formData.remember}
                    onChange={handleChange}
                    disabled={loading}
                    className="h-[11px] w-[11px] accent-[#0B3D6B]"
                  />

                  <span className="text-[7px] text-[#61788E]">
                    Remember me
                  </span>

                </label>

                <Link
                  to="/forgot-password"
                  className="text-[7px] font-semibold text-[#0B5A96] hover:underline"
                >
                  Forgot Password?
                </Link>

              </div>

              {/* =================================================
                  SIGN IN
              ================================================= */}

              <button
                type="submit"
                disabled={loading}
                className="
                  mt-4
                  flex
                  h-[34px]
                  w-full
                  items-center
                  justify-center
                  gap-1.5
                  rounded-[5px]
                  bg-[#0B3D6B]
                  text-[9px]
                  font-semibold
                  text-white
                  shadow-[0_4px_12px_rgba(11,61,107,0.16)]
                  transition-all
                  duration-200
                  hover:bg-[#0A3156]
                  hover:shadow-[0_5px_15px_rgba(11,61,107,0.20)]
                  active:scale-[0.99]
                  disabled:cursor-not-allowed
                  disabled:opacity-70
                "
              >

                {loading ? (
                  <>
                    <Loader2
                      size={12}
                      strokeWidth={2}
                      className="animate-spin"
                    />

                    Signing In...
                  </>
                ) : (
                  <>
                    Sign In

                    <ArrowRight
                      size={11}
                      strokeWidth={2}
                    />
                  </>
                )}

              </button>

              {/* =================================================
                  DIVIDER
              ================================================= */}

              <div className="my-4 flex items-center gap-2.5">

                <div className="h-px flex-1 bg-[#E3E9EF]" />

                <span className="text-[7px] font-medium text-[#91A2B2]">
                  OR
                </span>

                <div className="h-px flex-1 bg-[#E3E9EF]" />

              </div>

              {/* =================================================
                  GOOGLE
              ================================================= */}

              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="
                  flex
                  h-[34px]
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-[5px]
                  border
                  border-[#D8E2EC]
                  bg-white
                  text-[9px]
                  font-semibold
                  text-[#173B5C]
                  transition-all
                  duration-200
                  hover:bg-[#F8FAFC]
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >

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

          </section>

          {/* =================================================
              REGISTER
          ================================================= */}

          <div className="mt-5 text-center">

            <p className="text-[8px] text-[#667D92]">

              Don't have an account?{" "}

              <Link
                to="/register"
                className="font-semibold text-[#173B5C] hover:underline"
              >
                Create an account
              </Link>

            </p>

          </div>

          {/* =================================================
              FOOTER
          ================================================= */}

          <div className="mt-6 text-center">

            <p className="text-[8px] font-medium tracking-[0.1px] text-[#71869A]">
              Secure
              <span className="mx-2 text-[#AAB9C8]">
                •
              </span>
              Fast
              <span className="mx-2 text-[#AAB9C8]">
                •
              </span>
              Reliable
            </p>

          </div>

        </div>

      </div>

    </main>
  );
};

export default Login;