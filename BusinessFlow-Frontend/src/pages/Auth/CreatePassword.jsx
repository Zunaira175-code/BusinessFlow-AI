import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Zap,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Loader2,
} from "lucide-react";

const API_BASE_URL = "http://localhost:5000";

const CreatePassword = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const [sessionValid, setSessionValid] = useState(false);
  const [error, setError] = useState("");

  // =====================================================
  // CHECK VERIFIED INVITATION SESSION
  // =====================================================

  useEffect(() => {
    const token = sessionStorage.getItem("invitationToken");
    const invitation = sessionStorage.getItem("invitation");

    if (!token || !invitation) {
      setSessionValid(false);
      setError(
        "Your invitation session has expired. Please open the invitation link again."
      );
      setPageLoading(false);
      return;
    }

    try {
      JSON.parse(invitation);

      setSessionValid(true);
      setError("");
    } catch (err) {
      console.error("Invalid invitation session:", err);

      sessionStorage.removeItem("invitation");
      sessionStorage.removeItem("invitationToken");

      setSessionValid(false);
      setError(
        "Your invitation session is invalid. Please open the invitation link again."
      );
    } finally {
      setPageLoading(false);
    }
  }, []);

  // =====================================================
  // PASSWORD REQUIREMENTS
  // =====================================================

  const requirements = [
    {
      label: "At least 8 characters",
      valid: password.length >= 8,
    },
    {
      label: "One uppercase letter",
      valid: /[A-Z]/.test(password),
    },
    {
      label: "One lowercase letter",
      valid: /[a-z]/.test(password),
    },
    {
      label: "One number",
      valid: /[0-9]/.test(password),
    },
  ];

  const passwordValid = requirements.every(
    (requirement) => requirement.valid
  );

  const passwordsMatch =
    password.length > 0 &&
    confirmPassword.length > 0 &&
    password === confirmPassword;

  // =====================================================
  // HANDLE SUBMIT
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) {
      return;
    }

    setError("");

    // =====================================================
    // CHECK SESSION AGAIN
    // =====================================================

    const token = sessionStorage.getItem("invitationToken");
    const invitation = sessionStorage.getItem("invitation");

    if (!token || !invitation) {
      setSessionValid(false);
      setError(
        "Your invitation session has expired. Please open the invitation link again."
      );
      return;
    }

    // =====================================================
    // PASSWORD VALIDATION
    // =====================================================

    if (!passwordValid) {
      setError("Please meet all password requirements.");
      return;
    }

    if (!confirmPassword) {
      setError("Please confirm your password.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // =====================================================
    // ACCEPT INVITATION
    // =====================================================

    try {
      setLoading(true);

      const encodedToken = encodeURIComponent(token);

      const response = await fetch(
        `${API_BASE_URL}/api/employees/invitation/${encodedToken}/accept`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            password,
            confirmPassword,
          }),
        }
      );

      // =====================================================
      // HANDLE RESPONSE
      // =====================================================

      let data = null;

      const contentType = response.headers.get("content-type");

      if (contentType?.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();

        console.error("Unexpected server response:", text);

        throw new Error(
          "The server returned an invalid response. Please try again."
        );
      }

      if (!response.ok) {
        throw new Error(
          data?.message ||
            `Account activation failed. Server returned ${response.status}.`
        );
      }

      if (!data?.success) {
        throw new Error(
          data?.message || "Unable to activate your account."
        );
      }

      // =====================================================
      // SAVE ACTIVATED EMPLOYEE
      // =====================================================

      if (data?.data?.employee) {
        sessionStorage.setItem(
          "activatedEmployee",
          JSON.stringify(data.data.employee)
        );
      }

      // =====================================================
      // SAVE ACTIVATION RESPONSE
      // Optional but useful for next screen
      // =====================================================

      sessionStorage.setItem(
        "activationResult",
        JSON.stringify(data.data || {})
      );

      // =====================================================
      // IMPORTANT
      //
      // DO NOT REMOVE invitationToken BEFORE ACTIVATING SCREEN
      // =====================================================

      navigate("/activating-account", {
        replace: true,
      });
    } catch (err) {
      console.error("Accept Invitation Error:", err);

      setError(
        err?.message ||
          "Something went wrong while activating your account."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // PAGE LOADING
  // =====================================================

  if (pageLoading) {
    return (
      <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#F3F8FE] px-4 py-5">
        {/* Background */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-[180px] -top-[180px] h-[500px] w-[500px] rounded-full bg-[#B9D8FF]/35 blur-[110px]" />

          <div className="absolute -bottom-[220px] -right-[180px] h-[560px] w-[560px] rounded-full bg-[#C9E3FF]/45 blur-[120px]" />

          <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/60 blur-[100px]" />
        </div>

        <div className="relative z-10 flex flex-col items-center">
          <div className="flex h-[48px] w-[48px] items-center justify-center rounded-full bg-[#EAF4FF] text-[#168AF0]">
            <Loader2
              size={24}
              strokeWidth={2}
              className="animate-spin"
            />
          </div>

          <p className="mt-4 text-[11px] font-medium text-[#71869A]">
            Preparing your account...
          </p>
        </div>
      </main>
    );
  }

  // =====================================================
  // SESSION INVALID
  // =====================================================

  if (!sessionValid) {
    return (
      <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#F3F8FE] px-4 py-5">
        {/* Background */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-[180px] -top-[180px] h-[500px] w-[500px] rounded-full bg-[#B9D8FF]/35 blur-[110px]" />

          <div className="absolute -bottom-[220px] -right-[180px] h-[560px] w-[560px] rounded-full bg-[#C9E3FF]/45 blur-[120px]" />

          <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/60 blur-[100px]" />
        </div>

        <div className="relative z-10 w-full max-w-[390px]">
          {/* Brand */}
          <div className="mb-5 flex justify-center">
            <div className="flex items-center gap-2.5">
              <div className="flex h-[38px] w-[38px] items-center justify-center rounded-[7px] bg-[#0B4678] text-white shadow-[0_6px_18px_rgba(11,70,120,0.16)]">
                <Zap size={23} strokeWidth={2.2} />
              </div>

              <div>
                <h1 className="text-[17px] font-semibold tracking-[-0.3px] text-[#092D50]">
                  BusinessFlow AI
                </h1>

                <p className="text-[7px] font-medium tracking-[0.2px] text-[#71869A]">
                  Work Smarter. Grow Faster.
                </p>
              </div>
            </div>
          </div>

          {/* Error Card */}
          <section className="rounded-[11px] border border-[#D9E5F0] bg-white px-5 py-6 shadow-[0_12px_35px_rgba(30,75,115,0.08)]">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-[48px] w-[48px] items-center justify-center rounded-full bg-[#FEF2F2] text-[#DC2626]">
                <AlertCircle size={24} strokeWidth={1.9} />
              </div>

              <h2 className="mt-3.5 text-[19px] font-semibold tracking-[-0.35px] text-[#092D50]">
                Invitation Session Expired
              </h2>

              <p className="mt-2 max-w-[290px] text-[10px] leading-[16px] text-[#71869A]">
                {error}
              </p>

              <button
                type="button"
                onClick={() => navigate("/login", { replace: true })}
                className="mt-5 flex h-[36px] items-center justify-center gap-2 rounded-[7px] bg-[#0B3D6B] px-5 text-[10px] font-semibold text-white transition hover:bg-[#09365F]"
              >
                Go to Login

                <ArrowRight size={13} strokeWidth={2} />
              </button>
            </div>
          </section>

          <div className="mt-6 text-center">
            <p className="text-[9px] font-medium tracking-[0.1px] text-[#71869A]">
              Secure
              <span className="mx-2 text-[#AAB9C8]">•</span>
              Fast
              <span className="mx-2 text-[#AAB9C8]">•</span>
              Reliable
            </p>
          </div>
        </div>
      </main>
    );
  }

  // =====================================================
  // MAIN PAGE
  // =====================================================

  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#F3F8FE] px-4 py-5">
      {/* =================================================
          BACKGROUND
      ================================================= */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-[180px] -top-[180px] h-[500px] w-[500px] rounded-full bg-[#B9D8FF]/35 blur-[110px]" />

        <div className="absolute -bottom-[220px] -right-[180px] h-[560px] w-[560px] rounded-full bg-[#C9E3FF]/45 blur-[120px]" />

        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/60 blur-[100px]" />
      </div>

      {/* =================================================
          CONTENT
      ================================================= */}

      <div className="relative z-10 flex w-full max-w-[390px] flex-col items-center">
        {/* =================================================
            BRAND
        ================================================= */}

        <div className="mb-5 flex flex-col items-center">
          <div className="flex items-center gap-2.5">
            <div className="flex h-[38px] w-[38px] items-center justify-center rounded-[7px] bg-[#0B4678] text-white shadow-[0_6px_18px_rgba(11,70,120,0.16)]">
              <Zap size={23} strokeWidth={2.2} />
            </div>

            <div>
              <h1 className="text-[17px] font-semibold tracking-[-0.3px] text-[#092D50]">
                BusinessFlow AI
              </h1>

              <p className="text-[7px] font-medium tracking-[0.2px] text-[#71869A]">
                Work Smarter. Grow Faster.
              </p>
            </div>
          </div>
        </div>

        {/* =================================================
            PASSWORD CARD
        ================================================= */}

        <section className="w-full rounded-[11px] border border-[#D9E5F0] bg-white px-5 py-5 shadow-[0_12px_35px_rgba(30,75,115,0.08)]">
          {/* Header */}
          <div className="flex flex-col items-center text-center">
            <div className="flex h-[48px] w-[48px] items-center justify-center rounded-full bg-[#EAF4FF] text-[#168AF0]">
              <Lock size={22} strokeWidth={1.9} />
            </div>

            <h2 className="mt-3.5 text-[19px] font-semibold tracking-[-0.35px] text-[#092D50]">
              Create Your Password
            </h2>

            <p className="mt-1.5 max-w-[275px] text-[11px] leading-[17px] text-[#71869A]">
              Set a secure password to activate
              <br />
              your account.
            </p>
          </div>

          {/* =================================================
              FORM
          ================================================= */}

          <form onSubmit={handleSubmit} className="mt-4">
            {/* =================================================
                NEW PASSWORD
            ================================================= */}

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-[10px] font-semibold text-[#193B5B]"
              >
                New Password
              </label>

              <div className="relative">
                <Lock
                  size={14}
                  strokeWidth={1.8}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#71869A]"
                />

                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  placeholder="Enter your password"
                  autoComplete="new-password"
                  disabled={loading}
                  className="h-[36px] w-full rounded-[7px] border border-[#D5E1EB] bg-white pl-9 pr-9 text-[10px] font-medium text-[#193B5B] outline-none placeholder:text-[#91A4B7] transition focus:border-[#7EA9D0] focus:ring-2 focus:ring-[#168AF0]/5 disabled:cursor-not-allowed disabled:bg-[#F5F8FB]"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  disabled={loading}
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#71869A] transition hover:text-[#193B5B] disabled:cursor-not-allowed"
                >
                  {showPassword ? (
                    <EyeOff size={14} strokeWidth={1.8} />
                  ) : (
                    <Eye size={14} strokeWidth={1.8} />
                  )}
                </button>
              </div>

              {/* Password Requirements */}
              <div className="mt-2 space-y-1">
                {requirements.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-1.5"
                  >
                    <CheckCircle2
                      size={13}
                      strokeWidth={2}
                      className={
                        item.valid
                          ? "text-[#16B875]"
                          : "text-[#9AAABA]"
                      }
                    />

                    <span
                      className={`text-[9px] ${
                        item.valid
                          ? "text-[#557086]"
                          : "text-[#71869A]"
                      }`}
                    >
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* =================================================
                CONFIRM PASSWORD
            ================================================= */}

            <div className="mt-4">
              <label
                htmlFor="confirmPassword"
                className="mb-1.5 block text-[10px] font-semibold text-[#193B5B]"
              >
                Confirm Password
              </label>

              <div className="relative">
                <Lock
                  size={14}
                  strokeWidth={1.8}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#71869A]"
                />

                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setError("");
                  }}
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                  disabled={loading}
                  className={`h-[36px] w-full rounded-[7px] border bg-white pl-9 pr-9 text-[10px] font-medium text-[#193B5B] outline-none placeholder:text-[#91A4B7] transition disabled:cursor-not-allowed disabled:bg-[#F5F8FB] ${
                    confirmPassword &&
                    password !== confirmPassword
                      ? "border-[#FCA5A5] focus:border-[#EF4444] focus:ring-2 focus:ring-[#EF4444]/5"
                      : confirmPassword &&
                          password === confirmPassword
                        ? "border-[#86EFAC] focus:border-[#16B875] focus:ring-2 focus:ring-[#16B875]/5"
                        : "border-[#D5E1EB] focus:border-[#7EA9D0] focus:ring-2 focus:ring-[#168AF0]/5"
                  }`}
                />

                <button
                  type="button"
                  onClick={() => setShowConfirm((value) => !value)}
                  disabled={loading}
                  aria-label={
                    showConfirm
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#71869A] transition hover:text-[#193B5B] disabled:cursor-not-allowed"
                >
                  {showConfirm ? (
                    <EyeOff size={14} strokeWidth={1.8} />
                  ) : (
                    <Eye size={14} strokeWidth={1.8} />
                  )}
                </button>
              </div>

              {/* Match Status */}
              {confirmPassword && passwordsMatch && (
                <div className="mt-1 flex items-center gap-1">
                  <CheckCircle2
                    size={11}
                    strokeWidth={2}
                    className="text-[#16B875]"
                  />

                  <p className="text-[8px] text-[#16B875]">
                    Passwords match.
                  </p>
                </div>
              )}

              {confirmPassword && !passwordsMatch && (
                <p className="mt-1 text-[8px] text-[#EF4444]">
                  Passwords do not match.
                </p>
              )}
            </div>

            {/* =================================================
                ERROR
            ================================================= */}

            {error && (
              <div className="mt-3 rounded-[7px] border border-[#FECACA] bg-[#FEF2F2] px-3 py-2">
                <div className="flex items-start gap-2">
                  <AlertCircle
                    size={13}
                    strokeWidth={2}
                    className="mt-[1px] shrink-0 text-[#DC2626]"
                  />

                  <p className="text-[9px] leading-[14px] text-[#DC2626]">
                    {error}
                  </p>
                </div>
              </div>
            )}

            {/* =================================================
                ACTIVATE BUTTON
            ================================================= */}

            <button
              type="submit"
              disabled={loading}
              className="mt-4 flex h-[38px] w-full items-center justify-center gap-2 rounded-[7px] bg-[#0B3D6B] px-4 text-[11px] font-semibold text-white shadow-[0_5px_14px_rgba(22,138,240,0.18)] transition-all duration-200 hover:bg-[#0A3156] hover:shadow-[0_7px_18px_rgba(22,138,240,0.24)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2
                    size={14}
                    strokeWidth={2}
                    className="animate-spin"
                  />
                  Activating...
                </>
              ) : (
                <>
                  Activate Account
                  <ArrowRight size={14} strokeWidth={2} />
                </>
              )}
            </button>
          </form>
        </section>

        {/* =================================================
            FOOTER
        ================================================= */}

        <div className="mt-6 text-center">
          <p className="text-[9px] font-medium tracking-[0.1px] text-[#71869A]">
            Secure
            <span className="mx-2 text-[#AAB9C8]">•</span>
            Fast
            <span className="mx-2 text-[#AAB9C8]">•</span>
            Reliable
          </p>
        </div>
      </div>
    </main>
  );
};

export default CreatePassword;