import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Zap,
  Check,
  Loader2,
} from "lucide-react";

const ActivatingAccount = () => {
  const navigate = useNavigate();

  const [employee, setEmployee] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [pageReady, setPageReady] = useState(false);

  const hasNavigated = useRef(false);

  // =====================================================
  // READ ACTIVATED EMPLOYEE
  // =====================================================

  useEffect(() => {
    let mounted = true;

    const loadActivatedEmployee = () => {
      const storedEmployee =
        sessionStorage.getItem("activatedEmployee");

      if (!storedEmployee) {
        if (mounted) {
          navigate("/login", { replace: true });
        }

        return;
      }

      try {
        const parsedEmployee = JSON.parse(storedEmployee);

        if (
          !parsedEmployee ||
          typeof parsedEmployee !== "object"
        ) {
          throw new Error("Invalid activated employee data.");
        }

        if (mounted) {
          setEmployee(parsedEmployee);
          setPageReady(true);
        }
      } catch (error) {
        console.error(
          "Activated Employee Parse Error:",
          error
        );

        sessionStorage.removeItem("activatedEmployee");

        if (mounted) {
          navigate("/login", { replace: true });
        }
      }
    };

    loadActivatedEmployee();

    return () => {
      mounted = false;
    };
  }, [navigate]);

  // =====================================================
  // ACTIVATION ANIMATION
  // =====================================================

  useEffect(() => {
    if (!employee) return;

    let mounted = true;

    const stepTimers = [
      setTimeout(() => {
        if (mounted) {
          setCurrentStep(2);
        }
      }, 1100),

      setTimeout(() => {
        if (mounted) {
          setCurrentStep(3);
        }
      }, 2200),

      setTimeout(() => {
        if (mounted) {
          setCurrentStep(4);
        }
      }, 3200),
    ];

    const redirectTimer = setTimeout(() => {
      if (!mounted || hasNavigated.current) return;

      hasNavigated.current = true;

      navigate("/account-activated", {
        replace: true,
      });
    }, 3800);

    return () => {
      mounted = false;

      stepTimers.forEach((timer) => {
        clearTimeout(timer);
      });

      clearTimeout(redirectTimer);
    };
  }, [employee, navigate]);

  // =====================================================
  // EMPLOYEE NAME
  // =====================================================

  const employeeName = useMemo(() => {
    if (!employee) {
      return "your account";
    }

    const firstName = employee.firstName || "";
    const lastName = employee.lastName || "";

    const fullName =
      `${firstName} ${lastName}`.trim();

    return fullName || employee.name || "your account";
  }, [employee]);

  // =====================================================
  // PROGRESS
  // =====================================================

  const progress = useMemo(() => {
    switch (currentStep) {
      case 1:
        return 25;

      case 2:
        return 55;

      case 3:
        return 82;

      case 4:
        return 100;

      default:
        return 25;
    }
  }, [currentStep]);

  // =====================================================
  // STEP DATA
  // =====================================================

  const steps = [
    {
      id: 1,
      label: "Verifying invitation",
    },
    {
      id: 2,
      label: "Creating your account",
    },
    {
      id: 3,
      label: "Setting up workspace",
    },
  ];

  // =====================================================
  // PREVENT FLASH
  // =====================================================

  if (!pageReady || !employee) {
    return (
      <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#F4F8FD] px-4 py-6">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-[180px] -top-[180px] h-[520px] w-[520px] rounded-full bg-[#1677E8]/10 blur-[120px]" />

          <div className="absolute -bottom-[220px] -right-[150px] h-[550px] w-[550px] rounded-full bg-[#1677E8]/10 blur-[130px]" />

          <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/60 blur-[100px]" />
        </div>

        <div className="relative z-10 flex flex-col items-center">
          <div className="flex h-[48px] w-[48px] items-center justify-center rounded-full bg-[#E8F3FF] text-[#1677E8]">
            <Loader2
              size={23}
              strokeWidth={2}
              className="animate-spin"
            />
          </div>

          <p className="mt-4 text-[10px] font-medium text-[#71869A]">
            Preparing your account...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#F4F8FD] px-4 py-6">

      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        <div className="absolute -left-[180px] -top-[180px] h-[520px] w-[520px] rounded-full bg-[#1677E8]/10 blur-[120px]" />

        <div className="absolute -bottom-[220px] -right-[150px] h-[550px] w-[550px] rounded-full bg-[#1677E8]/10 blur-[130px]" />

        <div className="absolute left-[-140px] top-[18%] h-[650px] w-[250px] rotate-[24deg] bg-gradient-to-r from-[#1677E8]/10 to-transparent" />

        <div className="absolute bottom-[-280px] right-[-100px] h-[600px] w-[280px] rotate-[-25deg] bg-gradient-to-l from-[#1677E8]/10 to-transparent" />

        <div className="absolute bottom-[-150px] left-[-10%] h-[260px] w-[120%] rounded-[50%] border-t border-[#1677E8]/10 bg-[#EAF3FD]/60" />

      </div>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div className="relative z-10 flex w-full max-w-[390px] flex-col items-center">

        {/* =================================================
            BRAND
        ================================================= */}

        <div className="mb-7 flex flex-col items-center">

          <div className="flex items-center gap-3">

            <div className="flex h-[40px] w-[40px] items-center justify-center rounded-[8px] bg-[#0B3D6B] text-white shadow-[0_5px_16px_rgba(11,61,107,0.15)]">
              <Zap
                size={22}
                strokeWidth={2.2}
              />
            </div>

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
            CARD
        ================================================= */}

        <section className="w-full rounded-[12px] border border-[#D5E3F0] bg-white px-6 py-7 shadow-[0_15px_45px_rgba(28,67,105,0.10)]">

          <div className="flex flex-col items-center text-center">

            {/* =================================================
                ANIMATED ICON
            ================================================= */}

            <div className="relative mb-4 flex h-[52px] w-[52px] items-center justify-center">

              <div
                className={`absolute inset-0 rounded-full bg-[#E8F3FF] transition-all duration-500 ${
                  currentStep < 4
                    ? "animate-ping opacity-30"
                    : "opacity-0"
                }`}
              />

              <div className="relative flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[#E8F3FF] text-[#1677E8]">

                {currentStep >= 4 ? (
                  <Check
                    size={26}
                    strokeWidth={2.5}
                    className="text-[#16A66A]"
                  />
                ) : (
                  <Loader2
                    size={25}
                    strokeWidth={2}
                    className="animate-spin"
                    style={{
                      animationDuration: "1.8s",
                    }}
                  />
                )}

              </div>

            </div>

            {/* =================================================
                HEADING
            ================================================= */}

            <h2 className="text-[21px] font-semibold tracking-[-0.35px] text-[#092D50]">
              Activating Your Account
            </h2>

            <p className="mt-2 text-[12px] leading-[18px] text-[#71869A]">
              {currentStep >= 4
                ? "Your account has been successfully activated."
                : "Please wait while we finish"}
              {currentStep < 4 && (
                <>
                  <br />
                  setting up your account...
                </>
              )}
            </p>

            {/* =================================================
                EMPLOYEE INFO
            ================================================= */}

            <div className="mt-4 rounded-[7px] border border-[#E2EBF3] bg-[#F7FAFD] px-4 py-2.5">

              <p className="text-[10px] font-medium text-[#71869A]">
                Activating account for
              </p>

              <p className="mt-0.5 max-w-[240px] truncate text-[11px] font-semibold text-[#193B5B]">
                {employeeName}
              </p>

            </div>

            {/* =================================================
                PROGRESS
            ================================================= */}

            <div className="mt-5 w-full">

              <div className="flex items-center justify-between">

                <span className="text-[9px] font-medium text-[#71869A]">
                  Account setup
                </span>

                <span
                  className={`text-[9px] font-semibold ${
                    currentStep >= 4
                      ? "text-[#16A66A]"
                      : "text-[#1677E8]"
                  }`}
                >
                  {progress}%
                </span>

              </div>

              <div className="mt-2 h-[7px] w-full overflow-hidden rounded-full bg-[#E4ECF4]">

                <div
                  className={`h-full rounded-full transition-all duration-700 ease-out ${
                    currentStep >= 4
                      ? "bg-[#16A66A]"
                      : "bg-[#1677E8]"
                  }`}
                  style={{
                    width: `${progress}%`,
                  }}
                />

              </div>

            </div>

            {/* =================================================
                STEPS
            ================================================= */}

            <div className="mt-5 w-full space-y-3">

              {steps.map((step) => {

                const completed =
                  currentStep > step.id;

                const active =
                  currentStep === step.id;

                return (
                  <div
                    key={step.id}
                    className="flex items-center gap-3"
                  >

                    {/* STEP ICON */}

                    <div
                      className={`
                        flex
                        h-[21px]
                        w-[21px]
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        transition-all
                        duration-300
                        ${
                          completed
                            ? "bg-[#DDF7EC] text-[#16A66A]"
                            : active
                              ? "bg-[#E1F0FF] text-[#1677E8]"
                              : "bg-[#E8EEF4] text-[#91A3B3]"
                        }
                      `}
                    >

                      {completed ? (
                        <Check
                          size={12}
                          strokeWidth={2.7}
                        />
                      ) : active ? (
                        <span className="h-[6px] w-[6px] animate-pulse rounded-full bg-[#1677E8]" />
                      ) : (
                        <span className="h-[6px] w-[6px] rounded-full bg-[#91A3B3]" />
                      )}

                    </div>

                    {/* LABEL */}

                    <span
                      className={`
                        text-[11px]
                        transition-colors
                        duration-300
                        ${
                          completed
                            ? "font-medium text-[#557086]"
                            : active
                              ? "font-semibold text-[#193B5B]"
                              : "font-medium text-[#91A3B3]"
                        }
                      `}
                    >
                      {step.label}
                    </span>

                    {/* STATUS */}

                    {completed && (
                      <span className="ml-auto text-[8px] font-medium text-[#16A66A]">
                        Complete
                      </span>
                    )}

                    {active && (
                      <span className="ml-auto text-[8px] font-medium text-[#1677E8]">
                        In progress
                      </span>
                    )}

                  </div>
                );
              })}

            </div>

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

export default ActivatingAccount;