import {
  Plus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import Card from "../common/Card";
import Button from "../common/button";

/* =========================================================
   TEAM MEMBERS DATA
========================================================= */

const members = [
  {
    name: "Sarah Mitchell",
    role: "Admin",
    email: "sarah.m@businessflow.ai",
    status: "Active",
    lastActive: "Just now",
    avatar:
      "https://i.pravatar.cc/100?img=47",
  },
  {
    name: "Daniel Carter",
    role: "Sales Manager",
    email: "daniel.c@businessflow.ai",
    status: "Active",
    lastActive: "2 hours ago",
    avatar:
      "https://i.pravatar.cc/100?img=12",
  },
  {
    name: "Emily Watson",
    role: "Sales Representative",
    email: "emily.w@businessflow.ai",
    status: "Active",
    lastActive: "Yesterday",
    avatar:
      "https://i.pravatar.cc/100?img=32",
  },
  {
    name: "Michael Brown",
    role: "Support",
    email: "michael.b@businessflow.ai",
    status: "Active",
    lastActive: "Oct 24, 2023",
    initials: "MB",
  },
  {
    name: "Olivia Wilson",
    role: "Marketing",
    email: "olivia.w@businessflow.ai",
    status: "Pending",
    lastActive: "-",
    initials: "OW",
  },
];


/* =========================================================
   TEAM MEMBERS
========================================================= */

const TeamMembers = () => {

  const handleInviteMember = () => {
    console.log("Invite member clicked");
  };

  const handlePrevious = () => {
    console.log("Previous page");
  };

  const handleNext = () => {
    console.log("Next page");
  };


  return (
    <div className="w-full">

      {/* =================================================
          TITLE + INVITE BUTTON
      ================================================== */}

      <div className="mb-4 flex items-start justify-between gap-4">

        <div>
          <h2
            className="
              text-[18px]
              font-bold
              leading-[23px]
              tracking-[-0.3px]
              text-[#071D35]
            "
          >
            Team Members
          </h2>

          <p
            className="
              mt-1
              text-[9px]
              leading-[14px]
              text-[#60758A]
            "
          >
            12 members in your BusinessFlow AI workspace
          </p>
        </div>


        {/* Invite Member */}
        <Button
          type="button"
          onClick={handleInviteMember}
          className="
            flex
            h-[32px]
            items-center
            gap-1.5
            rounded-[6px]
            bg-[#0B3D6B]
            px-3
            text-[9px]
            font-semibold
            text-white
            shadow-none
            hover:bg-[#092F54]
          "
        >
          <Plus
            size={13}
            strokeWidth={2}
          />

          Invite Member
        </Button>

      </div>


      {/* =================================================
          MEMBERS CARD
      ================================================== */}

      <Card className="w-full overflow-hidden">

        {/* =================================================
            TABLE HEADER
        ================================================== */}

        <div
          className="
            grid
            grid-cols-[1.25fr_1.05fr_1.65fr_0.8fr_0.95fr]
            items-center
            border-b
            border-[#DCE5ED]
            bg-[#FBFCFE]
            px-3
            py-2.5
          "
        >

          <div className="text-[9px] font-semibold text-[#60758A]">
            Member
          </div>

          <div className="text-[9px] font-semibold text-[#60758A]">
            Role
          </div>

          <div className="text-[9px] font-semibold text-[#60758A]">
            Email
          </div>

          <div className="text-[9px] font-semibold text-[#60758A]">
            Status
          </div>

          <div className="text-[9px] font-semibold text-[#60758A]">
            Last
            <br />
            Active
          </div>

        </div>


        {/* =================================================
            MEMBER ROWS
        ================================================== */}

        {members.map((member, index) => {

          const isLast =
            index === members.length - 1;

          return (
            <div
              key={member.email}
              className={`
                grid
                min-h-[52px]
                grid-cols-[1.25fr_1.05fr_1.65fr_0.8fr_0.95fr]
                items-center
                px-3
                py-2
                ${
                  !isLast
                    ? "border-b border-[#E2E9EF]"
                    : ""
                }
              `}
            >

              {/* =================================================
                  MEMBER
              ================================================== */}

              <div className="flex min-w-0 items-center gap-2">

                {/* Avatar */}
                {member.avatar ? (
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="
                      h-[24px]
                      w-[24px]
                      shrink-0
                      rounded-full
                      object-cover
                    "
                  />
                ) : (
                  <div
                    className="
                      flex
                      h-[24px]
                      w-[24px]
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      bg-[#DCEAF9]
                      text-[8px]
                      font-bold
                      text-[#244E75]
                    "
                  >
                    {member.initials}
                  </div>
                )}

                {/* Name */}
                <div className="min-w-0">

                  <p
                    className="
                      text-[9px]
                      font-semibold
                      leading-[12px]
                      text-[#17324D]
                    "
                  >
                    {member.name.split(" ")[0]}
                  </p>

                  <p
                    className="
                      text-[9px]
                      font-semibold
                      leading-[12px]
                      text-[#17324D]
                    "
                  >
                    {member.name.split(" ").slice(1).join(" ")}
                  </p>

                </div>

              </div>


              {/* =================================================
                  ROLE
              ================================================== */}

              <div
                className="
                  pr-2
                  text-[8px]
                  leading-[12px]
                  text-[#60758A]
                "
              >
                {member.role}
              </div>


              {/* =================================================
                  EMAIL
              ================================================== */}

              <div
                className="
                  min-w-0
                  truncate
                  pr-2
                  text-[8px]
                  text-[#60758A]
                "
              >
                {member.email}
              </div>


              {/* =================================================
                  STATUS
              ================================================== */}

              <div>

                <span
                  className={`
                    inline-flex
                    items-center
                    rounded-full
                    px-2
                    py-[3px]
                    text-[7px]
                    font-semibold
                    ${
                      member.status === "Active"
                        ? "bg-[#E8F8EF] text-[#20A65A]"
                        : "bg-[#FFF2E5] text-[#E88918]"
                    }
                  `}
                >
                  {member.status}
                </span>

              </div>


              {/* =================================================
                  LAST ACTIVE
              ================================================== */}

              <div
                className="
                  text-[8px]
                  leading-[12px]
                  text-[#60758A]
                "
              >
                {member.lastActive === "2 hours ago" ? (
                  <>
                    2 hours
                    <br />
                    ago
                  </>
                ) : member.lastActive === "Oct 24, 2023" ? (
                  <>
                    Oct 24,
                    <br />
                    2023
                  </>
                ) : (
                  member.lastActive
                )}
              </div>

            </div>
          );
        })}


        {/* =================================================
            PAGINATION
        ================================================== */}

        <div
          className="
            flex
            min-h-[44px]
            items-center
            justify-between
            border-t
            border-[#E2E9EF]
            px-3
            py-2
          "
        >

          {/* Count */}
          <p
            className="
              text-[8px]
              text-[#60758A]
            "
          >
            Showing 1 to 5 of 12 members
          </p>


          {/* Buttons */}
          <div className="flex items-center gap-2">

            <button
              type="button"
              onClick={handlePrevious}
              className="
                flex
                h-[24px]
                items-center
                gap-1
                rounded-[5px]
                border
                border-[#DCE5ED]
                bg-white
                px-2
                text-[8px]
                font-medium
                text-[#A1AFBB]
                transition-colors
                hover:bg-[#F7F9FC]
              "
            >
              <ChevronLeft
                size={11}
                strokeWidth={1.8}
              />

              Prev
            </button>


            <button
              type="button"
              onClick={handleNext}
              className="
                flex
                h-[24px]
                items-center
                gap-1
                rounded-[5px]
                border
                border-[#DCE5ED]
                bg-white
                px-2
                text-[8px]
                font-medium
                text-[#60758A]
                transition-colors
                hover:bg-[#F7F9FC]
              "
            >
              Next

              <ChevronRight
                size={11}
                strokeWidth={1.8}
              />
            </button>

          </div>

        </div>

      </Card>

    </div>
  );
};

export default TeamMembers;