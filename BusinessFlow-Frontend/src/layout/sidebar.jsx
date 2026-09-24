import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  UsersRound,
  UserRoundPlus,
  BriefcaseBusiness,
  Users,
  ListTodo,
  BarChart3,
  Bell,
  Settings,
  CircleHelp,
  LogOut,
} from "lucide-react";

import logoWhite from "../assets/logos/Logo-w.png";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const mainMenu = [
  {
    name: "Dashboard",
    path: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Customers",
    path: "/admin/customers",
    icon: UsersRound,
  },
  {
    name: "Leads",
    path: "/admin/leads",
    icon: UserRoundPlus,
  },
  {
    name: "Deals",
    path: "/admin/deals",
    icon: BriefcaseBusiness,
  },
];

const managementMenu = [
  {
    name: "Employees",
    path: "/admin/employees",
    icon: Users,
  },
  {
    name: "Tasks",
    path: "/admin/tasks",
    icon: ListTodo,
  },
  {
    name: "Reports",
    path: "/admin/reports",
    icon: BarChart3,
  },
  {
    name: "Notifications",
    path: "/admin/notifications",
    icon: Bell,
    badge: 3,
  },
  {
    name: "Settings",
    path: "/admin/settings",
    icon: Settings,
  },
];

const Sidebar = () => {
  const navigate = useNavigate();

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
            "Failed to load sidebar user:",
            result.message
          );
          return;
        }

        setUser(result?.data?.user || null);
      } catch (error) {
        console.error(
          "Sidebar User Error:",
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
    const handleProfileUpdated = (event) => {
      const updatedData = event?.detail;

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
     USER INITIALS
  ====================================================== */

  const getInitials = () => {
    const firstInitial =
      user?.firstName
        ?.trim()
        ?.charAt(0) || "";

    const lastInitial =
      user?.lastName
        ?.trim()
        ?.charAt(0) || "";

    const initials =
      `${firstInitial}${lastInitial}`;

    return (
      initials || "U"
    ).toUpperCase();
  };

  /* =====================================================
     USER NAME
  ====================================================== */

  const userName = [
    user?.firstName,
    user?.lastName,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  /* =====================================================
     USER EMAIL
  ====================================================== */

  const userEmail =
    user?.email || "";

  /* =====================================================
     PROFILE PICTURE
  ====================================================== */

  const profilePicture =
    user?.profilePicture || null;

  /* =====================================================
     LOGOUT
  ====================================================== */

  const handleLogout = () => {
    localStorage.removeItem(
      "businessflow_token"
    );

    localStorage.removeItem(
      "businessflow_user"
    );

    sessionStorage.removeItem(
      "businessflow_token"
    );

    sessionStorage.removeItem(
      "businessflow_user"
    );

    navigate("/login", {
      replace: true,
    });
  };

  return (
    <aside
      className="
        fixed
        left-0
        top-0
        z-50
        flex
        h-screen
        w-[260px]
        flex-col
        border-r
        border-white/10
        bg-[#071D35]
        text-white
      "
    >
      {/* =====================================================
          BRAND
      ====================================================== */}

      <div
        className="
          flex
          h-[64px]
          items-center
          border-b
          border-white/10
          px-5
        "
      >
        <img
  src={logoWhite}
  alt="BusinessFlow AI"
  className="
    h-[42px]
    w-auto
    max-w-[260px]
    object-contain
    object-left
  "
/>
      </div>

      {/* =====================================================
          NAVIGATION
      ====================================================== */}

      <div
        className="
          flex
          flex-1
          flex-col
          overflow-y-auto
          px-3
          py-5
        "
      >
        {/* MAIN MENU */}

        <div>
          <p
            className="
              mb-2
              px-2
              text-[8px]
              font-semibold
              uppercase
              tracking-[0.8px]
              text-white/45
            "
          >
            Main Menu
          </p>

          <nav className="space-y-1">
            {mainMenu.map((item) => (
              <SidebarItem
                key={item.name}
                item={item}
              />
            ))}
          </nav>
        </div>

        {/* MANAGEMENT */}

        <div className="mt-6">
          <p
            className="
              mb-2
              px-2
              text-[8px]
              font-semibold
              uppercase
              tracking-[0.8px]
              text-white/45
            "
          >
            Management
          </p>

          <nav className="space-y-1">
            {managementMenu.map((item) => (
              <SidebarItem
                key={item.name}
                item={item}
              />
            ))}
          </nav>
        </div>
      </div>

      {/* =====================================================
          BOTTOM AREA
      ====================================================== */}

      <div className="px-3 pb-3">

        {/* SUPPORT */}

        <NavLink
          to="/admin/support"
          className="
            mb-3
            flex
            items-center
            gap-2.5
            rounded-md
            px-2.5
            py-2
            text-[11px]
            font-medium
            text-white/65
            transition-all
            duration-200
            hover:bg-white/[0.06]
            hover:text-white
          "
        >
          <CircleHelp
            size={14}
            strokeWidth={1.7}
          />

          <span>Support</span>
        </NavLink>

        {/* =================================================
            USER PROFILE
        ================================================== */}

        <div
          className="
            flex
            items-center
            gap-2.5
            rounded-lg
            border
            border-white/[0.06]
            bg-white/[0.07]
            px-2.5
            py-2.5
          "
        >
          {/* Avatar */}

          <div
            className="
              flex
              h-8
              w-8
              shrink-0
              items-center
              justify-center
              overflow-hidden
              rounded-full
              border
              border-white/20
              bg-white/10
              text-[9px]
              font-semibold
              text-white
            "
          >
            {profilePicture ? (
              <img
                src={profilePicture}
                alt={
                  userName ||
                  "Profile"
                }
                className="
                  h-full
                  w-full
                  object-cover
                "
              />
            ) : (
              getInitials()
            )}
          </div>

          {/* User info */}

          <div className="min-w-0 flex-1">
            <p
              className="
                truncate
                text-[10px]
                font-semibold
                text-white
              "
            >
              {userName || "User"}
            </p>

            <p
              className="
                mt-0.5
                truncate
                text-[7px]
                text-white/45
              "
            >
              {userEmail || "No email"}
            </p>
          </div>

          {/* =================================================
              LOGOUT
          ================================================== */}

          <div className="group relative shrink-0">

            {/* Logout Tooltip */}

            <div
              className="
                pointer-events-none
                absolute
                bottom-full
                right-0
                mb-2
                whitespace-nowrap
                rounded-[4px]
                bg-white
                px-2
                py-1
                text-[8px]
                font-semibold
                text-[#173B5C]
                opacity-0
                shadow-[0_4px_12px_rgba(0,0,0,0.18)]
                transition-all
                duration-150
                group-hover:translate-y-[-2px]
                group-hover:opacity-100
              "
            >
              Logout

              <span
                className="
                  absolute
                  right-2
                  top-full
                  h-0
                  w-0
                  border-l-[4px]
                  border-r-[4px]
                  border-t-[4px]
                  border-l-transparent
                  border-r-transparent
                  border-t-white
                "
              />
            </div>

            {/* Logout Icon */}

            <button
              type="button"
              onClick={handleLogout}
              aria-label="Logout"
              className="
                flex
                h-7
                w-7
                items-center
                justify-center
                rounded-md
                text-white/55
                transition-all
                duration-200
                hover:bg-white/10
                hover:text-white
                active:scale-95
              "
            >
              <LogOut
                size={13}
                strokeWidth={1.8}
              />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

/* =========================================================
   SIDEBAR ITEM
========================================================= */

const SidebarItem = ({ item }) => {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.path}
      className={({ isActive }) =>
        `
        group
        flex
        h-8
        items-center
        gap-2.5
        rounded-md
        px-2.5
        text-[10px]
        font-medium
        transition-all
        duration-200

        ${
          isActive
            ? "bg-white/[0.13] text-white shadow-sm"
            : "text-white/65 hover:bg-white/[0.07] hover:text-white"
        }
        `
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            size={13}
            strokeWidth={
              isActive ? 2 : 1.6
            }
            className={`
              shrink-0
              transition-colors

              ${
                isActive
                  ? "text-white"
                  : "text-white/60 group-hover:text-white"
              }
            `}
          />

          <span className="flex-1">
            {item.name}
          </span>

          {item.badge && (
            <span
              className="
                flex
                h-[16px]
                min-w-[16px]
                items-center
                justify-center
                rounded-full
                bg-[#079BEA]
                px-1
                text-[8px]
                font-semibold
                text-white
              "
            >
              {item.badge}
            </span>
          )}
        </>
      )}
    </NavLink>
  );
};

export default Sidebar;