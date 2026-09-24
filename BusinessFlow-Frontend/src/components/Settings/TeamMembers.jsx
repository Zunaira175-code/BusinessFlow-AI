import { useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import Card from "../common/Card";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const MEMBERS_PER_PAGE = 5;

/* =========================================================
   TEAM MEMBERS
========================================================= */

const TeamMembers = () => {
  const [members, setMembers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  /* =====================================================
     TOKEN
  ====================================================== */

  const getToken = () => {
    return (
      localStorage.getItem("businessflow_token") ||
      sessionStorage.getItem("businessflow_token")
    );
  };

  /* =====================================================
     LOAD TEAM MEMBERS
  ====================================================== */

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        setLoading(true);
        setError("");

        const token = getToken();

        if (!token) {
          setError(
            "Authentication token not found. Please login again."
          );
          return;
        }

        const response = await fetch(
          `${API_BASE_URL}/api/employees`,
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
          throw new Error(
            result.message ||
              "Failed to load team members."
          );
        }

        /*
         * Support the common response shapes:
         *
         * data.employees
         * data.members
         * data.users
         * data
         */

        const responseData =
          result?.data;

        let teamMembers = [];

        if (
          Array.isArray(
            responseData?.employees
          )
        ) {
          teamMembers =
            responseData.employees;
        } else if (
          Array.isArray(
            responseData?.members
          )
        ) {
          teamMembers =
            responseData.members;
        } else if (
          Array.isArray(
            responseData?.users
          )
        ) {
          teamMembers =
            responseData.users;
        } else if (
          Array.isArray(responseData)
        ) {
          teamMembers =
            responseData;
        }

        setMembers(teamMembers);
        setCurrentPage(1);
      } catch (err) {
        console.error(
          "Fetch Team Members Error:",
          err
        );

        setError(
          err.message ||
            "Unable to load team members."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, []);

  /* =====================================================
     PROFILE UPDATE EVENT
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

      /*
       * Update currently logged-in admin
       * inside team list if that user exists.
       */

      setMembers((currentMembers) =>
        currentMembers.map((member) => {
          const memberId =
            member?._id ||
            member?.id;

          const currentUserId =
            updatedData?.id ||
            updatedData?._id;

          if (
            currentUserId &&
            memberId &&
            String(memberId) ===
              String(currentUserId)
          ) {
            return {
              ...member,
              firstName:
                updatedData.firstName ??
                member.firstName,

              lastName:
                updatedData.lastName ??
                member.lastName,

              email:
                updatedData.email ??
                member.email,

              phone:
                updatedData.phone ??
                member.phone,

              jobTitle:
                updatedData.jobTitle ??
                member.jobTitle,

              profilePicture:
                updatedData.profilePicture ??
                member.profilePicture,
            };
          }

          return member;
        })
      );
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
     TOTAL PAGES
  ====================================================== */

  const totalPages = Math.max(
    1,
    Math.ceil(
      members.length /
        MEMBERS_PER_PAGE
    )
  );

  /* =====================================================
     CURRENT PAGE DATA
  ====================================================== */

  const currentMembers = useMemo(() => {
    const startIndex =
      (currentPage - 1) *
      MEMBERS_PER_PAGE;

    return members.slice(
      startIndex,
      startIndex + MEMBERS_PER_PAGE
    );
  }, [members, currentPage]);

  /* =====================================================
     PREVIOUS
  ====================================================== */

  const handlePrevious = () => {
    setCurrentPage((page) =>
      Math.max(1, page - 1)
    );
  };

  /* =====================================================
     NEXT
  ====================================================== */

  const handleNext = () => {
    setCurrentPage((page) =>
      Math.min(
        totalPages,
        page + 1
      )
    );
  };

  /* =====================================================
     MEMBER NAME
  ====================================================== */

  const getMemberName = (member) => {
    const firstName =
      member?.firstName ||
      "";

    const lastName =
      member?.lastName ||
      "";

    const fullName =
      `${firstName} ${lastName}`.trim();

    return fullName || "Unnamed User";
  };

  /* =====================================================
     MEMBER ROLE
  ====================================================== */

  const getMemberRole = (member) => {
    /*
     * Admin gets Admin label.
     * Employees show Job Title first,
     * then Department as fallback.
     */

    if (
      member?.role === "admin"
    ) {
      return "Admin";
    }

    return (
      member?.jobTitle ||
      member?.department ||
      "Employee"
    );
  };

  /* =====================================================
     MEMBER STATUS
  ====================================================== */

  const getMemberStatus = (member) => {
    /*
     * If backend already provides status,
     * use it.
     */

    if (member?.status) {
      return member.status;
    }

    /*
     * Pending invitation
     */

    if (
      member?.invitationAcceptedAt ===
        null &&
      member?.role === "employee"
    ) {
      return "Pending";
    }

    /*
     * Active / inactive account
     */

    if (
      member?.isActive === false
    ) {
      return "Inactive";
    }

    return "Active";
  };

  /* =====================================================
     LAST ACTIVE
  ====================================================== */

  const getLastActive = (member) => {
    /*
     * Use a real lastActive field if
     * backend provides one.
     */

    if (member?.lastActive) {
      return member.lastActive;
    }

    /*
     * User model currently does not have
     * a dedicated lastActive field.
     */

    return "—";
  };

  /* =====================================================
     DATE FORMAT
  ====================================================== */

  const formatDate = (date) => {
    if (!date) {
      return "—";
    }

    try {
      return new Date(
        date
      ).toLocaleDateString(
        "en-US",
        {
          month: "short",
          day: "numeric",
          year: "numeric",
        }
      );
    } catch {
      return "—";
    }
  };

  /* =====================================================
     AVATAR
  ====================================================== */

  const getAvatar = (member) => {
    return (
      member?.profilePicture ||
      null
    );
  };

  /* =====================================================
     INITIALS
  ====================================================== */

  const getInitials = (member) => {
    const first =
      member?.firstName
        ?.trim()
        ?.charAt(0) || "";

    const last =
      member?.lastName
        ?.trim()
        ?.charAt(0) || "";

    return (
      `${first}${last}` ||
      "U"
    ).toUpperCase();
  };

  /* =====================================================
     PAGINATION RANGE
  ====================================================== */

  const showingFrom =
    members.length === 0
      ? 0
      : (currentPage - 1) *
          MEMBERS_PER_PAGE +
        1;

  const showingTo = Math.min(
    currentPage *
      MEMBERS_PER_PAGE,
    members.length
  );

  return (
    <div className="w-full">

      {/* =================================================
          TITLE
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
            {loading
              ? "Loading team members..."
              : `${members.length} members in your BusinessFlow AI workspace`}
          </p>
        </div>

      </div>

      {/* =================================================
          ERROR
      ================================================== */}

      {error && (
        <div
          className="
            mb-3
            rounded-[6px]
            border
            border-red-200
            bg-red-50
            px-3
            py-2
            text-[9px]
            font-medium
            text-red-600
          "
        >
          {error}
        </div>
      )}

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
            LOADING
        ================================================== */}

        {loading ? (
          <div
            className="
              flex
              min-h-[260px]
              items-center
              justify-center
            "
          >
            <p className="text-[9px] text-[#8495A5]">
              Loading team members...
            </p>
          </div>
        ) : members.length === 0 ? (
          /* =================================================
             EMPTY STATE
          ================================================== */

          <div
            className="
              flex
              min-h-[180px]
              items-center
              justify-center
            "
          >
            <p className="text-[9px] text-[#8495A5]">
              No team members found.
            </p>
          </div>
        ) : (
          /* =================================================
             MEMBER ROWS
          ================================================== */

          currentMembers.map(
            (member, index) => {
              const isLast =
                index ===
                currentMembers.length -
                  1;

              const name =
                getMemberName(
                  member
                );

              const role =
                getMemberRole(
                  member
                );

              const status =
                getMemberStatus(
                  member
                );

              const avatar =
                getAvatar(member);

              const lastActive =
                getLastActive(
                  member
                );

              return (
                <div
                  key={
                    member?._id ||
                    member?.id ||
                    member?.email ||
                    index
                  }
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

                    {avatar ? (
                      <img
                        src={avatar}
                        alt={name}
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
                        {getInitials(
                          member
                        )}
                      </div>
                    )}

                    {/* Name */}

                    <div className="min-w-0">

                      <p
                        className="
                          truncate
                          text-[9px]
                          font-semibold
                          leading-[12px]
                          text-[#17324D]
                        "
                      >
                        {name}
                      </p>

                    </div>
                  </div>

                  {/* =================================================
                      ROLE
                  ================================================== */}

                  <div
                    className="
                      min-w-0
                      truncate
                      pr-2
                      text-[8px]
                      leading-[12px]
                      text-[#60758A]
                    "
                  >
                    {role}
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
                    {member?.email ||
                      "—"}
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
                          status ===
                          "Active"
                            ? "bg-[#E8F8EF] text-[#20A65A]"
                            : status ===
                              "Pending"
                            ? "bg-[#FFF2E5] text-[#E88918]"
                            : "bg-[#F1F3F5] text-[#75818D]"
                        }
                      `}
                    >
                      {status}
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
                    {lastActive ===
                    "—" ? (
                      "—"
                    ) : (
                      lastActive
                    )}
                  </div>

                </div>
              );
            }
          )
        )}

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
            Showing{" "}
            {showingFrom} to{" "}
            {showingTo} of{" "}
            {members.length} members
          </p>

          {/* Buttons */}

          <div className="flex items-center gap-2">

            {/* Previous */}

            <button
              type="button"
              onClick={
                handlePrevious
              }
              disabled={
                currentPage === 1 ||
                loading
              }
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
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              <ChevronLeft
                size={11}
                strokeWidth={1.8}
              />

              Prev
            </button>

            {/* Next */}

            <button
              type="button"
              onClick={
                handleNext
              }
              disabled={
                currentPage >=
                  totalPages ||
                loading
              }
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
                disabled:cursor-not-allowed
                disabled:opacity-50
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