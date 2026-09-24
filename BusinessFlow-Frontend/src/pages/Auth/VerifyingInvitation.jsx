import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Zap, AlertCircle, RefreshCw } from "lucide-react";

const API_BASE_URL = "http://localhost:5000/api";

const VerifyingInvitation = () => {
  const navigate = useNavigate();
  const { token } = useParams();

  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    let isMounted = true;
    let navigationTimer;

    const verifyInvitation = async () => {
      // --------------------------------------------------
      // BASIC TOKEN VALIDATION
      // --------------------------------------------------

      if (!token || !token.trim()) {
        if (isMounted) {
          setIsVerifying(false);
          setError("Invalid invitation link.");
        }

        return;
      }

      // --------------------------------------------------
      // REMOVE OLD INVITATION SESSION
      // --------------------------------------------------

      sessionStorage.removeItem("invitationToken");
      sessionStorage.removeItem("invitation");

      try {
        // --------------------------------------------------
        // VERIFY INVITATION WITH BACKEND
        // --------------------------------------------------

        const encodedToken = encodeURIComponent(token.trim());

        const response = await fetch(
          `${API_BASE_URL}/employees/invitation/${encodedToken}`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
          }
        );

        // --------------------------------------------------
        // SAFELY PARSE RESPONSE
        // --------------------------------------------------

        let data = null;

        try {
          data = await response.json();
        } catch {
          throw new Error(
            "Unable to verify the invitation. The server returned an invalid response."
          );
        }

        // --------------------------------------------------
        // BACKEND VALIDATION
        // --------------------------------------------------

        if (!response.ok || !data?.success) {
          throw new Error(
            data?.message ||
              "This invitation link is invalid or expired."
          );
        }

        // --------------------------------------------------
        // COMPONENT MAY HAVE UNMOUNTED
        // --------------------------------------------------

        if (!isMounted) {
          return;
        }

        // --------------------------------------------------
        // SAVE INVITATION TOKEN
        // --------------------------------------------------

        sessionStorage.setItem(
          "invitationToken",
          token.trim()
        );

        // --------------------------------------------------
        // SAVE VERIFIED INVITATION DATA
        // --------------------------------------------------

        sessionStorage.setItem(
          "invitation",
          JSON.stringify(data.data)
        );

        // --------------------------------------------------
        // OPTIONAL: SAVE EXPIRY INFORMATION SEPARATELY
        // --------------------------------------------------

        if (data.data?.expiresAt) {
          sessionStorage.setItem(
            "invitationExpiresAt",
            data.data.expiresAt
          );
        }

        // --------------------------------------------------
        // SMALL UX DELAY
        // --------------------------------------------------

        navigationTimer = setTimeout(() => {
          if (!isMounted) {
            return;
          }

          navigate("/invitation", {
            replace: true,
          });
        }, 700);
      } catch (err) {
        console.error(
          "Invitation Verification Error:",
          err
        );

        if (!isMounted) {
          return;
        }

        // --------------------------------------------------
        // REMOVE INVALID SESSION DATA
        // --------------------------------------------------

        sessionStorage.removeItem("invitationToken");
        sessionStorage.removeItem("invitation");
        sessionStorage.removeItem("invitationExpiresAt");

        setIsVerifying(false);

        setError(
          err instanceof Error
            ? err.message
            : "Unable to verify invitation."
        );
      }
    };

    verifyInvitation();

    // --------------------------------------------------
    // CLEANUP
    // --------------------------------------------------

    return () => {
      isMounted = false;

      if (navigationTimer) {
        clearTimeout(navigationTimer);
      }
    };
  }, [token, navigate]);

  // --------------------------------------------------
  // RETRY
  // --------------------------------------------------

  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#F3F8FE] px-4 py-6">

      {/* =================================================
          SOFT BACKGROUND
      ================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        <div className="absolute -left-[180px] -top-[180px] h-[500px] w-[500px] rounded-full bg-[#B9D8FF]/35 blur-[110px]" />

        <div className="absolute -bottom-[220px] -right-[180px] h-[560px] w-[560px] rounded-full bg-[#C9E3FF]/45 blur-[120px]" />

        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/60 blur-[100px]" />

      </div>

      {/* =================================================
          CONTENT
      ================================================== */}

      <div className="relative z-10 flex w-full max-w-[420px] flex-col items-center">

        {/* =================================================
            BRAND
        ================================================== */}

        <div className="mb-8 flex flex-col items-center">

          <div className="flex items-center gap-3">

            {/* Logo */}

            <div className="flex h-[42px] w-[42px] items-center justify-center rounded-[8px] bg-[#0B4678] text-white shadow-[0_6px_18px_rgba(11,70,120,0.16)]">

              <Zap
                size={25}
                strokeWidth={2.2}
              />

            </div>

            {/* Brand Name */}

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

        {/* =================================================
            CARD
        ================================================== */}

        <section className="w-full rounded-[12px] border border-[#D9E5F0] bg-white px-7 py-10 shadow-[0_12px_35px_rgba(30,75,115,0.08)]">

          {error ? (

            /* =================================================
                ERROR STATE
            ================================================== */

            <div className="flex flex-col items-center text-center">

              {/* Error Icon */}

              <div className="mb-5 flex h-[58px] w-[58px] items-center justify-center rounded-full bg-[#FEF2F2] text-[#DC2626]">

                <AlertCircle
                  size={30}
                  strokeWidth={1.9}
                />

              </div>

              {/* Heading */}

              <h2 className="text-[21px] font-semibold tracking-[-0.35px] text-[#092D50]">
                Invalid Invitation
              </h2>

              {/* Error */}

              <p className="mt-3 max-w-[290px] text-[12px] leading-[19px] text-[#71869A]">
                {error}
              </p>

              {/* Actions */}

              <div className="mt-7 flex items-center gap-2">

                <button
                  type="button"
                  onClick={handleRetry}
                  className="flex h-[36px] items-center justify-center gap-1.5 rounded-md border border-[#D5E1EB] bg-white px-4 text-[11px] font-semibold text-[#193B5B] transition hover:bg-[#F5F8FB] active:scale-[0.98]"
                >

                  <RefreshCw
                    size={13}
                    strokeWidth={2}
                  />

                  Try Again

                </button>

                <button
                  type="button"
                  onClick={() =>
                    navigate("/login", {
                      replace: true,
                    })
                  }
                  className="h-[36px] rounded-md bg-[#0B3D6B] px-5 text-[11px] font-semibold text-white transition hover:bg-[#09365F] active:scale-[0.98]"
                >
                  Go to Login
                </button>

              </div>

            </div>

          ) : (

            /* =================================================
                VERIFYING STATE
            ================================================== */

            <div className="flex flex-col items-center text-center">

              {/* Spinner */}

              <div className="relative mb-7 flex h-[58px] w-[58px] items-center justify-center">

                <div className="absolute inset-0 rounded-full border-[6px] border-[#E5EDF6]" />

                <div className="absolute inset-0 animate-spin rounded-full border-[6px] border-transparent border-r-[#168AF0] border-t-[#168AF0]" />

                <div className="absolute h-[10px] w-[10px] rounded-full bg-[#168AF0]/15" />

              </div>

              {/* Heading */}

              <h2 className="text-[21px] font-semibold tracking-[-0.35px] text-[#092D50]">
                Verifying Invitation
              </h2>

              {/* Description */}

              <p className="mt-3 max-w-[280px] text-[12px] leading-[19px] text-[#71869A]">

                {isVerifying ? (
                  <>
                    Please wait while we verify
                    <br />
                    your invitation link...
                  </>
                ) : (
                  <>
                    Preparing your invitation...
                    <br />
                    Please wait a moment.
                  </>
                )}

              </p>

              {/* Progress Dots */}

              <div className="mt-8 flex items-center gap-2">

                <span className="h-[11px] w-[11px] animate-pulse rounded-full bg-[#168AF0] shadow-[0_0_10px_rgba(22,138,240,0.35)]" />

                <span
                  className="h-[11px] w-[11px] rounded-full bg-[#D5E3F1]"
                  style={{
                    animation:
                      "invitationDot 1.4s ease-in-out infinite",
                    animationDelay: "0.2s",
                  }}
                />

                <span
                  className="h-[11px] w-[11px] rounded-full bg-[#D5E3F1]"
                  style={{
                    animation:
                      "invitationDot 1.4s ease-in-out infinite",
                    animationDelay: "0.4s",
                  }}
                />

              </div>

            </div>

          )}

        </section>

        {/* =================================================
            FOOTER
        ================================================== */}

        <div className="mt-10 text-center">

          <p className="text-[10px] font-medium tracking-[0.1px] text-[#71869A]">

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

      {/* =================================================
          ANIMATION
      ================================================== */}

      <style>
        {`
          @keyframes invitationDot {
            0%,
            100% {
              opacity: 0.45;
              transform: translateY(0);
            }

            50% {
              opacity: 1;
              transform: translateY(-2px);
            }
          }
        `}
      </style>

    </main>
  );
};

export default VerifyingInvitation;