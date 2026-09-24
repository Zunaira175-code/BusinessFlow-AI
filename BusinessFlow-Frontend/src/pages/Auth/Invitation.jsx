import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  UserRound,
  BriefcaseBusiness,
  Building2,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";

const Invitation = () => {
  const navigate = useNavigate();

  const [invitation, setInvitation] = useState(null);
  const [error, setError] = useState("");

  // =========================================
  // LOAD VERIFIED INVITATION
  // =========================================

  useEffect(() => {
    const storedInvitation =
      sessionStorage.getItem("invitation");

    const storedToken =
      sessionStorage.getItem("invitationToken");

    if (!storedInvitation || !storedToken) {
      setError(
        "Your invitation session has expired. Please open the invitation link again."
      );
      return;
    }

    try {
      const parsedInvitation =
        JSON.parse(storedInvitation);

      if (!parsedInvitation?.employee) {
        throw new Error("Invalid invitation data.");
      }

      setInvitation(parsedInvitation);
    } catch (err) {
      console.error(
        "Invitation Data Error:",
        err
      );

      setError(
        "Unable to load invitation details. Please open the invitation link again."
      );
    }
  }, []);

  // =========================================
  // CONTINUE TO CREATE PASSWORD
  // =========================================

  const handleContinue = () => {
    const token =
      sessionStorage.getItem("invitationToken");

    if (!token) {
      setError(
        "Your invitation session has expired. Please open the invitation link again."
      );
      return;
    }

    navigate("/create-password");
  };

  // =========================================
  // GO BACK TO LOGIN
  // =========================================

  const handleLogin = () => {
    sessionStorage.removeItem("invitation");
    sessionStorage.removeItem("invitationToken");

    navigate("/login", {
      replace: true,
    });
  };

  // =========================================
  // ERROR STATE
  // =========================================

  if (error) {
    return (
      <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#F4F8FD] px-4 py-5">

        {/* Background */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">

          <div className="absolute -left-[180px] -top-[180px] h-[520px] w-[520px] rounded-full bg-[#1677E8]/10 blur-[120px]" />

          <div className="absolute -bottom-[220px] -right-[150px] h-[550px] w-[550px] rounded-full bg-[#1677E8]/10 blur-[130px]" />

          <div className="absolute left-[-140px] top-[18%] h-[650px] w-[250px] rotate-[24deg] bg-gradient-to-r from-[#1677E8]/10 to-transparent" />

          <div className="absolute bottom-[-280px] right-[-100px] h-[600px] w-[280px] rotate-[-25deg] bg-gradient-to-l from-[#1677E8]/10 to-transparent" />

        </div>

        <div className="relative z-10 flex w-full max-w-[370px] flex-col items-center">

          {/* Brand */}
          <div className="mb-5 flex flex-col items-center">

            <div className="flex items-center gap-2.5">

              <div className="flex h-[36px] w-[36px] items-center justify-center rounded-[7px] bg-[#0B3D6B] text-white shadow-[0_4px_15px_rgba(11,61,107,0.15)]">
                <span className="text-[18px] font-bold">
                  B
                </span>
              </div>

              <div>
                <h1 className="text-[17px] font-semibold tracking-[-0.3px] text-[#092D50]">
                  BusinessFlow AI
                </h1>

                <p className="mt-0 text-[7px] font-medium tracking-[0.3px] text-[#71869A]">
                  Work Smarter. Grow Faster.
                </p>
              </div>

            </div>

          </div>

          {/* Error Card */}
          <section className="w-full rounded-[11px] border border-[#D5E3F0] bg-white px-5 py-7 shadow-[0_15px_45px_rgba(28,67,105,0.10)]">

            <div className="flex flex-col items-center text-center">

              <div className="mb-4 flex h-[48px] w-[48px] items-center justify-center rounded-full bg-[#FEF2F2] text-[#DC2626]">
                <AlertCircle
                  size={25}
                  strokeWidth={1.9}
                />
              </div>

              <h2 className="text-[19px] font-semibold tracking-[-0.3px] text-[#092D50]">
                Invitation Unavailable
              </h2>

              <p className="mt-2 max-w-[285px] text-[11px] leading-[17px] text-[#71869A]">
                {error}
              </p>

              <button
                type="button"
                onClick={handleLogin}
                className="mt-5 h-[38px] rounded-[7px] bg-[#0B3D6B] px-5 text-[11px] font-semibold text-white transition hover:bg-[#09365F]"
              >
                Go to Login
              </button>

            </div>

          </section>

          {/* Footer */}
          <div className="pt-5 text-center">
            <p className="text-[9px] font-medium tracking-[0.1px] text-[#71869A]">
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
  }

  // =========================================
  // LOADING STATE
  // =========================================

  if (!invitation) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F4F8FD]">
        <div className="flex flex-col items-center">

          <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-[#D9E7F4] border-t-[#1677E8]" />

          <p className="mt-3 text-[10px] font-medium text-[#71869A]">
            Loading invitation...
          </p>

        </div>
      </main>
    );
  }

  // =========================================
  // INVITATION DATA
  // =========================================

  const employee = invitation.employee;

  const fullName = [
    employee.firstName,
    employee.lastName,
  ]
    .filter(Boolean)
    .join(" ");

  // =========================================
  // MAIN UI
  // =========================================

  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#F4F8FD] px-4 py-5">

      {/* =========================
          SOFT BACKGROUND
      ========================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        {/* Top Left Glow */}
        <div className="absolute -left-[180px] -top-[180px] h-[520px] w-[520px] rounded-full bg-[#1677E8]/10 blur-[120px]" />

        {/* Bottom Right Glow */}
        <div className="absolute -bottom-[220px] -right-[150px] h-[550px] w-[550px] rounded-full bg-[#1677E8]/10 blur-[130px]" />

        {/* Left Light */}
        <div className="absolute left-[-140px] top-[18%] h-[650px] w-[250px] rotate-[24deg] bg-gradient-to-r from-[#1677E8]/10 to-transparent" />

        {/* Right Light */}
        <div className="absolute bottom-[-280px] right-[-100px] h-[600px] w-[280px] rotate-[-25deg] bg-gradient-to-l from-[#1677E8]/10 to-transparent" />

        {/* Bottom Curve */}
        <div className="absolute bottom-[-150px] left-[-10%] h-[260px] w-[120%] rounded-[50%] border-t border-[#1677E8]/10 bg-[#EAF3FD]/60" />

      </div>

      {/* =========================
          CONTENT
      ========================== */}

      <div className="relative z-10 flex w-full max-w-[370px] flex-col items-center">

        {/* =========================
            BRAND
        ========================== */}

        <div className="mb-5 flex flex-col items-center">

          <div className="flex items-center gap-2.5">

            <div className="flex h-[36px] w-[36px] items-center justify-center rounded-[7px] bg-[#0B3D6B] text-white shadow-[0_4px_15px_rgba(11,61,107,0.15)]">
              <span className="text-[18px] font-bold">
                B
              </span>
            </div>

            <div>

              <h1 className="text-[17px] font-semibold tracking-[-0.3px] text-[#092D50]">
                BusinessFlow AI
              </h1>

              <p className="mt-0 text-[7px] font-medium tracking-[0.3px] text-[#71869A]">
                Work Smarter. Grow Faster.
              </p>

            </div>

          </div>

        </div>

        {/* =========================
            INVITATION CARD
        ========================== */}

        <section className="w-full rounded-[11px] border border-[#D5E3F0] bg-white px-5 py-5 shadow-[0_15px_45px_rgba(28,67,105,0.10)]">

          {/* Icon */}

          <div className="mb-3 flex justify-center">

            <div className="flex h-[44px] w-[44px] items-center justify-center rounded-full bg-[#E8F3FF] text-[#1677E8]">

              <Mail
                size={21}
                strokeWidth={1.9}
              />

            </div>

          </div>

          {/* Heading */}

          <div className="text-center">

            <h2 className="text-[19px] font-semibold tracking-[-0.3px] text-[#092D50]">
              You're Invited!
            </h2>

            <p className="mt-1.5 text-[11px] leading-[17px] text-[#71869A]">
              You've been invited to join
              <br />
              <span className="font-semibold text-[#557086]">
                {employee.companyName ||
                  "BusinessFlow AI"}
              </span>
              .
            </p>

          </div>

          {/* =========================
              EMPLOYEE DETAILS
          ========================== */}

          <div className="mt-4 rounded-[7px] bg-[#F2F6FA] px-3.5 py-3">

            {/* Name */}

            <div className="flex items-center gap-2.5">

              <UserRound
                size={14}
                strokeWidth={1.8}
                className="shrink-0 text-[#60788F]"
              />

              <span className="w-[65px] shrink-0 text-[10px] text-[#71869A]">
                Name
              </span>

              <span className="min-w-0 truncate text-[10px] font-semibold text-[#193B5B]">
                {fullName || "Employee"}
              </span>

            </div>

            {/* Email */}

            <div className="mt-2.5 flex items-center gap-2.5">

              <Mail
                size={14}
                strokeWidth={1.8}
                className="shrink-0 text-[#60788F]"
              />

              <span className="w-[65px] shrink-0 text-[10px] text-[#71869A]">
                Email
              </span>

              <span className="min-w-0 truncate text-[10px] font-semibold text-[#193B5B]">
                {employee.email || "—"}
              </span>

            </div>

            {/* Role */}

            <div className="mt-2.5 flex items-center gap-2.5">

              <BriefcaseBusiness
                size={14}
                strokeWidth={1.8}
                className="shrink-0 text-[#60788F]"
              />

              <span className="w-[65px] shrink-0 text-[10px] text-[#71869A]">
                Role
              </span>

              <span className="text-[10px] font-semibold capitalize text-[#193B5B]">
                {employee.role || "employee"}
              </span>

            </div>

            {/* Department */}

            <div className="mt-2.5 flex items-center gap-2.5">

              <Building2
                size={14}
                strokeWidth={1.8}
                className="shrink-0 text-[#60788F]"
              />

              <span className="w-[65px] shrink-0 text-[10px] text-[#71869A]">
                Department
              </span>

              <span className="min-w-0 truncate text-[10px] font-semibold text-[#193B5B]">
                {employee.department || "—"}
              </span>

            </div>

            {/* Job Title */}

            {employee.jobTitle && (
              <div className="mt-2.5 flex items-center gap-2.5">

                <BriefcaseBusiness
                  size={14}
                  strokeWidth={1.8}
                  className="shrink-0 text-[#60788F]"
                />

                <span className="w-[65px] shrink-0 text-[10px] text-[#71869A]">
                  Position
                </span>

                <span className="min-w-0 truncate text-[10px] font-semibold text-[#193B5B]">
                  {employee.jobTitle}
                </span>

              </div>
            )}

          </div>

          {/* =========================
              VERIFIED STATUS
          ========================== */}

          <div className="mt-3 flex items-center justify-center gap-1.5">

            <ShieldCheck
              size={13}
              strokeWidth={2}
              className="text-[#16B875]"
            />

            <span className="text-[9px] font-medium text-[#557086]">
              Invitation verified successfully
            </span>

          </div>

          {/* =========================
              CTA
          ========================== */}

          <button
            type="button"
            onClick={handleContinue}
            className="mt-4 flex h-[39px] w-full items-center justify-center gap-2 rounded-[7px] bg-[#0B3D6B] text-[11px] font-semibold text-white shadow-[0_4px_12px_rgba(11,61,107,0.14)] transition hover:bg-[#09365F] active:scale-[0.99]"
          >
            Create Your Account

            <ArrowRight
              size={14}
              strokeWidth={2}
            />

          </button>

          {/* =========================
              EXPIRY
          ========================== */}

          <p className="mt-3 text-center text-[9px] text-[#71869A]">
            This invitation link is valid for 48 hours.
          </p>

        </section>

        {/* =========================
            FOOTER
        ========================== */}

        <div className="pt-5 text-center">

          <p className="text-[9px] font-medium tracking-[0.1px] text-[#71869A]">

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

export default Invitation;