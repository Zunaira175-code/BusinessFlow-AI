import {
  ShieldCheck,
  UserCog,
  Headset,
  UserRound,
  ArrowRight,
} from "lucide-react";

import Card from "../common/Card";

const roles = [
  {
    title: "Admin",
    description:
      "Full access to all settings, billing, and member management.",
    icon: ShieldCheck,
  },
  {
    title: "Manager",
    description:
      "Can manage leads, deals, and view team analytics. Cannot manage billing.",
    icon: UserCog,
  },
  {
    title: "Sales Representative",
    description:
      "Can view and edit their own assigned leads and deals. Basic analytics.",
    icon: UserRound,
  },
  {
    title: "Support",
    description:
      "Read-only access to customer data for troubleshooting and assistance.",
    icon: Headset,
  },
];

const RolesPermissions = () => {
  const handleManageRoles = () => {
    console.log("Manage Roles clicked");
  };

  return (
    <Card className="mt-4 w-full overflow-hidden">
      {/* =================================================
          HEADER
      ================================================== */}

      <div className="px-4 pt-4">
        <div className="flex items-center justify-between gap-4">

          <h2
            className="
              text-[14px]
              font-bold
              leading-[18px]
              text-[#071D35]
            "
          >
            Roles & Permissions
          </h2>

          

        </div>

        <p
          className="
            mt-1
            text-[8px]
            leading-[12px]
            text-[#60758A]
          "
        >
          Manage what members can see and do in the workspace.
        </p>
      </div>


      {/* =================================================
          ROLES GRID
      ================================================== */}

      <div className="grid grid-cols-2 gap-3 px-4 pb-4 pt-2.5">

        {roles.map((role) => {
          const Icon = role.icon;

          return (
            <div
              key={role.title}
              className="
                min-h-[64px]
                rounded-[7px]
                border
                border-[#DCE5ED]
                bg-white
                px-3
                py-2.5
                transition-colors
                hover:border-[#C8D8E6]
                hover:bg-[#FCFDFE]
              "
            >

              {/* Role Title */}
              <div className="flex items-center gap-1.5">

                <Icon
                  size={14}
                  strokeWidth={1.8}
                  className="shrink-0 text-[#071D35]"
                />

                <h3
                  className="
                    text-[9px]
                    font-bold
                    text-[#17324D]
                  "
                >
                  {role.title}
                </h3>

              </div>


              {/* Description */}
              <p
                className="
                  mt-1.5
                  max-w-[250px]
                  text-[8px]
                  leading-[12px]
                  text-[#60758A]
                "
              >
                {role.description}
              </p>

            </div>
          );
        })}

      </div>
    </Card>
  );
};

export default RolesPermissions;