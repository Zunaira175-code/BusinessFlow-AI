import { useEffect, useState } from "react";
import {
  Search,
  CircleHelp,
  Bell,
  Plus,
  Menu,
} from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const Header = () => {
  const [user, setUser] = useState(null);

  /* =====================================================
     GET TOKEN
  ====================================================== */

  const getToken = () => {
    return (
      localStorage.getItem("businessflow_token") ||
      sessionStorage.getItem("businessflow_token")
    );
  };

  /* =====================================================
     LOAD CURRENT USER
  ====================================================== */

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = getToken();

        if (!token) {
          return;
        }

        const response = await fetch(
          `${API_BASE_URL}/api/auth/me`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          console.error(
            "Failed to load header user:",
            result.message
          );
          return;
        }

        setUser(
          result?.data?.user || null
        );
      } catch (error) {
        console.error(
          "Header user error:",
          error
        );
      }
    };

    loadUser();
  }, []);

  /* =====================================================
     LISTEN FOR PROFILE UPDATE
  ====================================================== */

  useEffect(() => {
    const handleProfileUpdated = (
      event
    ) => {
      const updatedData =
        event?.detail;

      if (!updatedData) {
        return;
      }

      setUser((currentUser) => ({
        ...(currentUser || {}),

        firstName:
          updatedData.firstName ??
          currentUser?.firstName ??
          "",

        lastName:
          updatedData.lastName ??
          currentUser?.lastName ??
          "",

        email:
          updatedData.email ??
          currentUser?.email ??
          "",

        phone:
          updatedData.phone ??
          currentUser?.phone ??
          "",

        jobTitle:
          updatedData.jobTitle ??
          currentUser?.jobTitle ??
          "",

        profilePicture:
          updatedData.profilePicture ??
          currentUser?.profilePicture ??
          null,
      }));
    };

    window.addEventListener(
      "businessflow-profile-updated",
      handleProfileUpdated
    );

    return () => {
      window.removeEventListener(
        "businessflow-profile-updated",
        handleProfileUpdated
      );
    };
  }, []);

  /* =====================================================
     INITIALS
  ====================================================== */

  const getInitials = () => {
    const first =
      user?.firstName
        ?.trim()
        ?.charAt(0) || "";

    const last =
      user?.lastName
        ?.trim()
        ?.charAt(0) || "";

    const initials =
      `${first}${last}`;

    return (
      initials || "U"
    ).toUpperCase();
  };

  /* =====================================================
     PROFILE PICTURE
  ====================================================== */

  const profilePicture =
    user?.profilePicture || null;

  return (
    <header className="sticky top-0 z-40 h-[58px] w-full border-b border-[#E6EBF0] bg-white">
      <div className="flex h-full w-full items-center px-3 sm:px-4 lg:px-5">

        {/* =========================
            LEFT — SEARCH
        ========================== */}

        <div className="min-w-0 flex-1 lg:flex-none">
          <div className="relative w-full sm:w-[235px] lg:w-[260px]">
            <Search
              size={15}
              strokeWidth={1.8}
              className="
                pointer-events-none
                absolute
                left-3
                top-1/2
                -translate-y-1/2
                text-[#64798D]
              "
            />

            <input
              type="text"
              placeholder="Search across workspace..."
              className="
                h-[36px]
                w-full
                rounded-[7px]
                border
                border-[#D9E2EA]
                bg-white
                pl-[37px]
                pr-3
                text-[11px]
                font-medium
                text-[#193B5B]
                outline-none
                placeholder:text-[#93A2B0]
                transition-all
                duration-200
                hover:border-[#C7D4DF]
                focus:border-[#9FB6CA]
                focus:ring-2
                focus:ring-[#0B3D6B]/5
              "
            />
          </div>
        </div>

        {/* =========================
            CENTER — NAVIGATION
        ========================== */}

        <nav
          className="
            mx-auto
            hidden
            items-center
            justify-center
            gap-7
            xl:flex
          "
        >
          <button
            type="button"
            className="
              whitespace-nowrap
              text-[11px]
              font-medium
              text-[#193B5B]
              transition-colors
              duration-200
              hover:text-[#0B3D6B]
            "
          >
            Direct Messages
          </button>

          <button
            type="button"
            className="
              whitespace-nowrap
              text-[11px]
              font-medium
              text-[#193B5B]
              transition-colors
              duration-200
              hover:text-[#0B3D6B]
            "
          >
            Reports
          </button>
        </nav>

        {/* =========================
            RIGHT — ACTIONS
        ========================== */}

        <div className="ml-auto flex shrink-0 items-center">

          {/* Import */}

          <button
            type="button"
            className="
              hidden
              h-[34px]
              items-center
              justify-center
              rounded-[7px]
              border
              border-[#D8E1E9]
              bg-white
              px-3
              text-[11px]
              font-medium
              text-[#193B5B]
              transition-all
              duration-200
              hover:border-[#C6D3DE]
              hover:bg-[#F8FAFC]
              sm:flex
            "
          >
            Import
          </button>

          {/* New Lead */}

          <button
            type="button"
            className="
              ml-2
              flex
              h-[34px]
              items-center
              justify-center
              gap-1.5
              rounded-[7px]
              bg-[#0B3D6B]
              px-3
              text-[11px]
              font-semibold
              text-white
              shadow-[0_2px_6px_rgba(11,61,107,0.10)]
              transition-all
              duration-200
              hover:bg-[#09365F]
              active:scale-[0.98]
            "
          >
            <Plus
              size={13}
              strokeWidth={2.4}
            />

            <span className="hidden whitespace-nowrap sm:inline">
              New Lead
            </span>
          </button>

          {/* Divider */}

          <div
            className="
              mx-2.5
              hidden
              h-[26px]
              w-px
              bg-[#E5EAF0]
              sm:block
            "
          />

          {/* Help */}

          <button
            type="button"
            aria-label="Help"
            className="
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-full
              text-[#304B64]
              transition-all
              duration-200
              hover:bg-[#F4F7FA]
              hover:text-[#0B3D6B]
            "
          >
            <CircleHelp
              size={18}
              strokeWidth={1.7}
            />
          </button>

          {/* Notifications */}

          <button
            type="button"
            aria-label="Notifications"
            className="
              relative
              ml-0.5
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-full
              text-[#304B64]
              transition-all
              duration-200
              hover:bg-[#F4F7FA]
              hover:text-[#0B3D6B]
            "
          >
            <Bell
              size={18}
              strokeWidth={1.7}
            />

            <span
              className="
                absolute
                right-[4px]
                top-[3px]
                h-[5px]
                w-[5px]
                rounded-full
                bg-[#EF4444]
                ring-2
                ring-white
              "
            />
          </button>

          {/* =================================================
              PROFILE
          ================================================== */}

          <button
            type="button"
            aria-label="Profile"
            className="
              ml-1.5
              flex
              h-[32px]
              w-[32px]
              shrink-0
              items-center
              justify-center
              overflow-hidden
              rounded-full
              border
              border-[#D8E1E9]
              bg-[#EAF0F5]
              text-[10px]
              font-semibold
              tracking-[0.2px]
              text-[#24445F]
              transition-all
              duration-200
              hover:border-[#C5D4E0]
              hover:bg-[#E2EAF1]
            "
          >
            {profilePicture ? (
              <img
                src={profilePicture}
                alt="Profile"
                className="
                  h-full
                  w-full
                  object-cover
                "
              />
            ) : (
              getInitials()
            )}
          </button>

          {/* Mobile Menu */}

          <button
            type="button"
            aria-label="Open menu"
            className="
              ml-1.5
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-full
              text-[#304B64]
              transition
              hover:bg-[#F4F7FA]
              xl:hidden
            "
          >
            <Menu
              size={18}
              strokeWidth={1.8}
            />
          </button>

        </div>
      </div>
    </header>
  );
};

export default Header;