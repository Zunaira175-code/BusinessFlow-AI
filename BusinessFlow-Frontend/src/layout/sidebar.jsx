import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  UsersRound,
  UserRoundPlus,
  BriefcaseBusiness,
  Users,
  BarChart3,
  Bell,
  Settings,
  CircleHelp,
  LogOut,
  Zap,
} from "lucide-react";

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
  return (
    <aside
  className="
    fixed left-0 top-0 z-50
    flex h-screen w-[260px] flex-col
    border-r border-white/10
    bg-[#071D35]
    text-white
  "
>
      {/* =====================================================
          BRAND
      ====================================================== */}
      <div className="flex h-[64px] items-center border-b border-white/10 px-5">
        <div className="flex items-center gap-2.5">
          {/* Logo */}
          <div
            className="
              flex h-8 w-8 items-center justify-center
              rounded-[7px]
              bg-white
              text-[#0B3D6B]
              shadow-sm
            "
          >
            <Zap size={17} strokeWidth={2.7} />
          </div>

          {/* Brand */}
          <div className="leading-none">
            <h1 className="text-[14px] font-semibold tracking-[-0.2px]">
              BusinessFlow AI
            </h1>

            <p className="mt-1 text-[7px] font-medium uppercase tracking-[0.7px] text-white/55">
              Enterprise CRM
            </p>
          </div>
        </div>
      </div>

      {/* =====================================================
          NAVIGATION
      ====================================================== */}
      <div className="flex flex-1 flex-col overflow-y-auto px-3 py-5">

        {/* MAIN MENU */}
        <div>
          <p
            className="
              mb-2 px-2
              text-[8px] font-semibold uppercase
              tracking-[0.8px]
              text-white/45
            "
          >
            Main Menu
          </p>

          <nav className="space-y-1">
            {mainMenu.map((item) => (
              <SidebarItem key={item.name} item={item} />
            ))}
          </nav>
        </div>

        {/* MANAGEMENT */}
        <div className="mt-6">
          <p
            className="
              mb-2 px-2
              text-[8px] font-semibold uppercase
              tracking-[0.8px]
              text-white/45
            "
          >
            Management
          </p>

          <nav className="space-y-1">
            {managementMenu.map((item) => (
              <SidebarItem key={item.name} item={item} />
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
            mb-3 flex items-center gap-2.5
            rounded-md px-2.5 py-2
            text-[11px] font-medium
            text-white/65
            transition-all duration-200
            hover:bg-white/[0.06]
            hover:text-white
          "
        >
          <CircleHelp size={14} strokeWidth={1.7} />

          <span>Support</span>
        </NavLink>

        {/* USER PROFILE */}
        <div
          className="
            flex items-center gap-2.5
            rounded-lg
            border border-white/[0.06]
            bg-white/[0.07]
            px-2.5 py-2.5
          "
        >
          {/* Avatar */}
          <div
            className="
              h-8 w-8 shrink-0 overflow-hidden
              rounded-full
              border border-white/20
              bg-white/10
            "
          >
            <img
              src="https://i.pravatar.cc/100?img=12"
              alt="Admin User"
              className="h-full w-full object-cover"
            />
          </div>

          {/* User info */}
          <div className="min-w-0 flex-1">
            <p className="truncate text-[10px] font-semibold text-white">
              Admin User
            </p>

            <p className="mt-0.5 truncate text-[7px] text-white/45">
              admin@businessflow.ai
            </p>
          </div>

          {/* Logout */}
          <button
            type="button"
            aria-label="Logout"
            className="
              flex h-7 w-7 shrink-0
              items-center justify-center
              rounded-md
              text-white/55
              transition-colors
              hover:bg-white/10
              hover:text-white
            "
          >
            <LogOut size={13} strokeWidth={1.8} />
          </button>
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
        group flex h-8 items-center gap-2.5
        rounded-md px-2.5
        text-[10px] font-medium
        transition-all duration-200

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
            strokeWidth={isActive ? 2 : 1.6}
            className={`
              shrink-0 transition-colors
              ${isActive ? "text-white" : "text-white/60 group-hover:text-white"}
            `}
          />

          <span className="flex-1">{item.name}</span>

          {item.badge && (
            <span
              className="
                flex h-[16px] min-w-[16px]
                items-center justify-center
                rounded-full
                bg-[#079BEA]
                px-1
                text-[8px] font-semibold
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