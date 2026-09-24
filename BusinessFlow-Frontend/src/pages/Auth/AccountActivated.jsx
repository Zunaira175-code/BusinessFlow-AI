import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Check,
  ArrowRight,
  Zap,
} from "lucide-react";

const AccountActivated = () => {
  const navigate = useNavigate();

  // =====================================================
  // CHECK ACTIVATED ACCOUNT SESSION
  // =====================================================

  useEffect(() => {
    const storedEmployee =
      sessionStorage.getItem("activatedEmployee");

    if (!storedEmployee) {
      navigate("/login", { replace: true });
      return;
    }

    try {
      const parsedEmployee = JSON.parse(storedEmployee);

      if (
        !parsedEmployee ||
        typeof parsedEmployee !== "object"
      ) {
        throw new Error("Invalid activated employee.");
      }
    } catch (error) {
      console.error(
        "Account Activated Session Error:",
        error
      );

      sessionStorage.removeItem("activatedEmployee");

      navigate("/login", { replace: true });
    }
  }, [navigate]);

  // =====================================================
  // GET EMPLOYEE NAME
  // =====================================================

  const employeeName = useMemo(() => {
    const storedEmployee =
      sessionStorage.getItem("activatedEmployee");

    if (!storedEmployee) {
      return "";
    }

    try {
      const employee = JSON.parse(storedEmployee);

      const firstName = employee?.firstName || "";
      const lastName = employee?.lastName || "";

      const fullName =
        `${firstName} ${lastName}`.trim();

      return (
        fullName ||
        employee?.name ||
        ""
      );
    } catch {
      return "";
    }
  }, []);

  // =====================================================
  // GO TO LOGIN
  // =====================================================

  const handleLogin = () => {
    /*
     * Keep activatedEmployee until login.
     * Do NOT remove invitationToken here because
     * CreatePassword already removes invitation data
     * after successful activation.
     */

    navigate("/login", {
      replace: true,
    });
  };

  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#F4F8FD] px-4 py-6 sm:px-6">

      {/* =================================================
          BACKGROUND
      ================================================= */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        {/* Top-left glow */}
        <div className="absolute -left-[180px] -top-[180px] h-[520px] w-[520px] rounded-full bg-[#1677E8]/10 blur-[120px]" />

        {/* Bottom-right glow */}
        <div className="absolute -bottom-[220px] -right-[150px] h-[550px] w-[550px] rounded-full bg-[#1677E8]/10 blur-[130px]" />

        {/* Left light */}
        <div className="absolute left-[-140px] top-[18%] h-[650px] w-[250px] rotate-[24deg] bg-gradient-to-r from-[#1677E8]/10 to-transparent" />

        {/* Right light */}
        <div className="absolute bottom-[-280px] right-[-100px] h-[600px] w-[280px] rotate-[-25deg] bg-gradient-to-l from-[#1677E8]/10 to-transparent" />

        {/* Bottom shape */}
        <div className="absolute bottom-[-150px] left-[-10%] h-[260px] w-[120%] rounded-[50%] border-t border-[#1677E8]/10 bg-[#EAF3FD]/60" />

        {/* Center glow */}
        <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/50 blur-[100px]" />

      </div>

      {/* =================================================
          CONTENT
      ================================================= */}

      <div className="relative z-10 flex w-full max-w-[390px] flex-col items-center">

        {/* =================================================
            BRAND
        ================================================= */}

        <div className="mb-7 flex flex-col items-center">

          <div className="flex items-center gap-3">

            {/* Logo */}

            <div className="flex h-[40px] w-[40px] items-center justify-center rounded-[8px] bg-[#0B3D6B] text-white shadow-[0_5px_16px_rgba(11,61,107,0.15)]">

              <Zap
                size={22}
                strokeWidth={2.2}
              />

            </div>

            {/* Brand */}

            <div>

              <h1 className="text-[18px] font-semibold tracking-[-0.3px] text-[#092D50]">
                BusinessFlow AI
              </h1>

              <p className="mt-[1px] text-[8px] font-medium tracking-[0.3px] text-[#71869A]">
                Work Smarter. Grow Faster.
              </p>

            </div>

          </div>

        </div>

        {/* =================================================
            SUCCESS CARD
        ================================================= */}

        <section className="w-full rounded-[12px] border border-[#D5E3F0] bg-white px-6 py-7 shadow-[0_15px_45px_rgba(28,67,105,0.10)]">

          <div className="flex flex-col items-center text-center">

            {/* =================================================
                SUCCESS ICON
            ================================================= */}

            <div className="relative mb-4 flex h-[58px] w-[58px] items-center justify-center">

              {/* Soft glow */}

              <div className="absolute inset-0 rounded-full bg-[#DDF7EC] opacity-70 blur-[4px]" />

              {/* Circle */}

              <div className="relative flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[#E6F8EF] text-[#16A66A]">

                <Check
                  size={27}
                  strokeWidth={2.7}
                />

              </div>

            </div>

            {/* =================================================
                HEADING
            ================================================= */}

            <h2 className="text-[21px] font-semibold tracking-[-0.35px] text-[#092D50]">
              Account Activated!
            </h2>

            {/* =================================================
                DESCRIPTION
            ================================================= */}

            <p className="mt-2 max-w-[275px] text-[12px] leading-[18px] text-[#71869A]">

              Your BusinessFlow AI account has been
              <br />

              successfully activated.

            </p>

            {/* =================================================
                EMPLOYEE INFO
            ================================================= */}

            {employeeName && (
              <div className="mt-4 rounded-[8px] border border-[#E2EBF3] bg-[#F7FAFD] px-5 py-2.5">

                <p className="text-[9px] font-medium text-[#71869A]">
                  Welcome
                </p>

                <p className="mt-0.5 text-[11px] font-semibold text-[#193B5B]">
                  {employeeName}
                </p>

              </div>
            )}

            {/* =================================================
                SUCCESS STATUS
            ================================================= */}

            <div className="mt-4 flex items-center gap-2 rounded-full border border-[#DDF7EC] bg-[#F1FBF6] px-3 py-1.5">

              <span className="h-[6px] w-[6px] rounded-full bg-[#16A66A]" />

              <span className="text-[9px] font-medium text-[#16A66A]">
                Activation completed successfully
              </span>

            </div>

            {/* =================================================
                LOGIN BUTTON
            ================================================= */}

            <button
              type="button"
              onClick={handleLogin}
              className="
                mt-5
                flex
                h-[39px]
                w-full
                items-center
                justify-center
                gap-2
                rounded-[7px]
                bg-[#0B3D6B]
                px-4
                text-[11px]
                font-semibold
                text-white
                shadow-[0_5px_14px_rgba(11,61,107,0.16)]
                transition-all
                duration-200
                hover:bg-[#0A3156]
                hover:shadow-[0_7px_18px_rgba(11,61,107,0.22)]
                active:scale-[0.98]
              "
            >

              Go to Login

              <ArrowRight
                size={14}
                strokeWidth={2.2}
              />

            </button>

            {/* =================================================
                DIVIDER
            ================================================= */}

            <div className="mt-5 h-px w-full bg-[#E7EEF4]" />

            {/* =================================================
                WELCOME
            ================================================= */}

            <p className="mt-4 text-[10px] font-medium text-[#71869A]">
              Welcome to the BusinessFlow AI team! 🎉
            </p>

          </div>

        </section>

        {/* =================================================
            FOOTER
        ================================================= */}

        <div className="pt-7 text-center">

          <p className="text-[10px] font-medium tracking-[0.1px] text-[#71869A]">

            Secure

            <span className="mx-2 text-[#AAB8C6]">
              •
            </span>

            Fast

            <span className="mx-2 text-[#AAB8C6]">
              •
            </span>

            Reliable

          </p>

        </div>

      </div>

    </main>
  );
};

export default AccountActivated;