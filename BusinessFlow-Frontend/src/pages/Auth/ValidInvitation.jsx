import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Zap,
  UserRound,
  Mail,
  BriefcaseBusiness,
  Building2,
  ArrowRight,
} from "lucide-react";

const ValidInvitation = () => {
  const navigate = useNavigate();

  const employee = {
    name: "Zunaira Ismail",
    email: "zunaira@company.com",
    role: "Employee",
    department: "Marketing",
  };

  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#F3F8FE] px-4 py-6">

      {/* =========================================
          SOFT BACKGROUND
      ========================================== */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        {/* Top-left glow */}
        <div className="absolute -left-[180px] -top-[180px] h-[500px] w-[500px] rounded-full bg-[#B9D8FF]/35 blur-[110px]" />

        {/* Bottom-right glow */}
        <div className="absolute -bottom-[220px] -right-[180px] h-[560px] w-[560px] rounded-full bg-[#C9E3FF]/45 blur-[120px]" />

        {/* Center glow */}
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/60 blur-[100px]" />

      </div>

      {/* =========================================
          MAIN CONTENT
      ========================================== */}
      <div className="relative z-10 flex w-full max-w-[420px] flex-col items-center">

        {/* =====================================
            BRAND
        ====================================== */}
        <div className="mb-7 flex flex-col items-center">

          <div className="flex items-center gap-3">

            {/* Logo */}
            <div className="flex h-[42px] w-[42px] items-center justify-center rounded-[8px] bg-[#0B4678] text-white shadow-[0_6px_18px_rgba(11,70,120,0.16)]">
              <Zap
                size={25}
                strokeWidth={2.2}
              />
            </div>

            <div>
              <h1 className="text-[18px] font-semibold tracking-[-0.3px] text-[#092D50]">
                BusinessFlow AI
              </h1>

              <p className="mt-[1px] text-[8px] font-medium tracking-[0.2px] text-[#71869A]">
                Work Smarter. Grow Faster.
              </p>
            </div>

          </div>
        </div>

        {/* =====================================
            INVITATION CARD
        ====================================== */}
        <section
          className="
            w-full
            rounded-[12px]
            border
            border-[#D9E5F0]
            bg-white
            px-6
            py-7
            shadow-[0_12px_35px_rgba(30,75,115,0.08)]
          "
        >

          {/* Invitation Icon */}
          <div className="flex flex-col items-center text-center">

            <div className="flex h-[54px] w-[54px] items-center justify-center rounded-full bg-[#EAF4FF] text-[#168AF0]">
              <Mail
                size={25}
                strokeWidth={1.9}
              />
            </div>

            {/* Heading */}
            <h2 className="mt-5 text-[21px] font-semibold tracking-[-0.35px] text-[#092D50]">
              You're Invited!
            </h2>

            {/* Description */}
            <p className="mt-2 max-w-[285px] text-[12px] leading-[18px] text-[#71869A]">
              You've been invited to join
              <br />
              BusinessFlow AI.
            </p>

          </div>

          {/* =====================================
              EMPLOYEE DETAILS
          ====================================== */}
          <div className="mt-6 rounded-[9px] border border-[#E1EAF2] bg-[#F7FAFD] px-4 py-3.5">

            {/* Name */}
            <div className="flex items-center gap-3">

              <UserRound
                size={16}
                strokeWidth={1.8}
                className="shrink-0 text-[#71869A]"
              />

              <span className="w-[70px] text-[11px] font-medium text-[#71869A]">
                Name
              </span>

              <span className="min-w-0 flex-1 text-right text-[11px] font-semibold text-[#193B5B]">
                {employee.name}
              </span>

            </div>

            {/* Email */}
            <div className="mt-3 flex items-center gap-3">

              <Mail
                size={16}
                strokeWidth={1.8}
                className="shrink-0 text-[#71869A]"
              />

              <span className="w-[70px] text-[11px] font-medium text-[#71869A]">
                Email
              </span>

              <span className="min-w-0 flex-1 truncate text-right text-[11px] font-semibold text-[#193B5B]">
                {employee.email}
              </span>

            </div>

            {/* Role */}
            <div className="mt-3 flex items-center gap-3">

              <BriefcaseBusiness
                size={16}
                strokeWidth={1.8}
                className="shrink-0 text-[#71869A]"
              />

              <span className="w-[70px] text-[11px] font-medium text-[#71869A]">
                Role
              </span>

              <span className="min-w-0 flex-1 text-right text-[11px] font-semibold text-[#193B5B]">
                {employee.role}
              </span>

            </div>

            {/* Department */}
            <div className="mt-3 flex items-center gap-3">

              <Building2
                size={16}
                strokeWidth={1.8}
                className="shrink-0 text-[#71869A]"
              />

              <span className="w-[70px] text-[11px] font-medium text-[#71869A]">
                Department
              </span>

              <span className="min-w-0 flex-1 text-right text-[11px] font-semibold text-[#193B5B]">
                {employee.department}
              </span>

            </div>

          </div>

          {/* =====================================
              CREATE ACCOUNT BUTTON
          ====================================== */}
          <button
            type="button"
            onClick={() => navigate("/create-password")}
            className="
              mt-5
              flex
              h-[42px]
              w-full
              items-center
              justify-center
              gap-2
              rounded-[8px]
              bg-[#0B3D6B]
              px-4
              text-[12px]
              font-semibold
              text-white
              shadow-[0_5px_14px_rgba(22,138,240,0.18)]
              transition-all
              duration-200
              hover:bg-[#0A3156]
              hover:shadow-[0_7px_18px_rgba(22,138,240,0.24)]
              active:scale-[0.98]
            "
          >
            Create Your Account

            <ArrowRight
              size={15}
              strokeWidth={2}
            />
          </button>

          {/* Expiration */}
          <p className="mt-4 text-center text-[10px] font-medium text-[#71869A]">
            This invitation link is valid for 48 hours.
          </p>

        </section>

        {/* =====================================
            FOOTER
        ====================================== */}
        <div className="mt-9 text-center">

          <p className="text-[10px] font-medium tracking-[0.1px] text-[#71869A]">
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

export default ValidInvitation;