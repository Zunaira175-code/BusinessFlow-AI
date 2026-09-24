import { useEffect, useState } from "react";
import { Clock3 } from "lucide-react";

import Card from "../common/Card";

const API_URL = "http://localhost:5000/api";

// =====================================================
// DATE HELPERS
// =====================================================

const getDateParts = (dateValue) => {
  if (!dateValue) {
    return {
      month: "—",
      day: "—",
    };
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return {
      month: "—",
      day: "—",
    };
  }

  return {
    month: date
      .toLocaleDateString("en-US", {
        month: "short",
      })
      .toUpperCase(),

    day: String(
      date.getDate()
    ).padStart(2, "0"),
  };
};

// =====================================================
// TIME FORMATTER
// =====================================================

const formatTime = (dateValue) => {
  if (!dateValue) {
    return "—";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  const now = new Date();

  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  const tomorrow = new Date(today);

  tomorrow.setDate(
    tomorrow.getDate() + 1
  );

  const taskDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );

  const time = date.toLocaleTimeString(
    "en-US",
    {
      hour: "numeric",
      minute: "2-digit",
    }
  );

  if (
    taskDate.getTime() ===
    today.getTime()
  ) {
    return `Today ${time}`;
  }

  if (
    taskDate.getTime() ===
    tomorrow.getTime()
  ) {
    return time;
  }

  return time;
};

// =====================================================
// URGENT CHECK
// =====================================================

const isUrgentFollowUp = (
  dateValue,
  priority
) => {
  if (
    String(priority).toUpperCase() ===
    "HIGH"
  ) {
    return true;
  }

  if (!dateValue) {
    return false;
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return false;
  }

  const now = new Date();

  const endOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1
  );

  return date < endOfToday;
};

// =====================================================
// COMPONENT
// =====================================================

const UpcomingFollowUps = () => {
  const [followUps, setFollowUps] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // ===================================================
  // FETCH FOLLOW-UPS
  // ===================================================

  const fetchFollowUps = async () => {
    try {
      setLoading(true);
      setError("");

      const token =
        localStorage.getItem(
          "businessflow_token"
        );

      if (!token) {
        setError(
          "Authentication required."
        );
        return;
      }

      const response =
        await fetch(
          `${API_URL}/customers/me/follow-ups?limit=5`,
          {
            method: "GET",

            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type":
                "application/json",
            },
          }
        );

      const result =
        await response.json();

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.message ||
            "Failed to fetch upcoming follow-ups."
        );
      }

      setFollowUps(
        Array.isArray(result.data)
          ? result.data
          : []
      );
    } catch (err) {
      console.error(
        "Upcoming Follow-Ups Error:",
        err
      );

      setError(
        err.message ||
          "Failed to fetch upcoming follow-ups."
      );

      setFollowUps([]);
    } finally {
      setLoading(false);
    }
  };

  // ===================================================
  // INITIAL LOAD
  // ===================================================

  useEffect(() => {
    fetchFollowUps();
  }, []);

  return (
    <Card className="w-full overflow-hidden">
      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="px-4 pt-4">
        <div className="flex items-center justify-between gap-3">
          <h2
            className="
              text-[13px]
              font-bold
              text-[#17324D]
            "
          >
            Upcoming Follow-ups
          </h2>

          <button
            type="button"
            className="
              shrink-0
              text-[8px]
              font-semibold
              text-[#315D80]
              transition-colors
              hover:text-[#0B3D6B]
            "
          >
            View Calendar
          </button>
        </div>

        <div className="mt-2 h-px w-full bg-[#DCE5ED]" />
      </div>

      {/* =====================================================
          FOLLOW-UP LIST
      ====================================================== */}

      <div className="space-y-2.5 px-4 pb-4 pt-3">
        {/* ===================================================
            LOADING
        ==================================================== */}

        {loading && (
          <div className="flex min-h-[190px] items-center justify-center">
            <p className="text-[9px] text-[#8495A5]">
              Loading follow-ups...
            </p>
          </div>
        )}

        {/* ===================================================
            ERROR
        ==================================================== */}

        {!loading && error && (
          <div className="flex min-h-[190px] flex-col items-center justify-center">
            <p className="text-[9px] text-[#EF4444]">
              {error}
            </p>

            <button
              type="button"
              onClick={fetchFollowUps}
              className="
                mt-2
                text-[8px]
                font-semibold
                text-[#079BEA]
                hover:text-[#0B3D6B]
              "
            >
              Try Again
            </button>
          </div>
        )}

        {/* ===================================================
            EMPTY
        ==================================================== */}

        {!loading &&
          !error &&
          followUps.length === 0 && (
            <div className="flex min-h-[190px] items-center justify-center">
              <p className="text-[9px] text-[#8495A5]">
                No upcoming follow-ups.
              </p>
            </div>
          )}

        {/* ===================================================
            FOLLOW-UP ITEMS
        ==================================================== */}

        {!loading &&
          !error &&
          followUps.map((item) => {
            const dateParts =
              getDateParts(
                item.dueAt
              );

            const urgent =
              isUrgentFollowUp(
                item.dueAt,
                item.priority
              );

            const customerName =
              item.customer?.name ||
              "Customer";

            const companyName =
              item.customer
                ?.companyName;

            const displayName =
              companyName
                ? `${customerName} (${companyName})`
                : customerName;

            return (
              <div
                key={item.id}
                className="
                  flex
                  min-h-[62px]
                  items-center
                  gap-3
                  rounded-[6px]
                  border
                  border-[#DCE5ED]
                  bg-white
                  px-2.5
                  py-2
                "
              >
                {/* =================================================
                    DATE BOX
                ================================================== */}

                <div
                  className="
                    flex
                    h-[42px]
                    w-[40px]
                    shrink-0
                    flex-col
                    items-center
                    justify-center
                    rounded-[5px]
                    bg-[#E8F1FF]
                  "
                >
                  <span
                    className="
                      text-[7px]
                      font-semibold
                      uppercase
                      leading-none
                      text-[#718599]
                    "
                  >
                    {dateParts.month}
                  </span>

                  <span
                    className="
                      mt-[2px]
                      text-[14px]
                      font-bold
                      leading-none
                      text-[#17324D]
                    "
                  >
                    {dateParts.day}
                  </span>
                </div>

                {/* =================================================
                    CONTENT
                ================================================== */}

                <div className="min-w-0 flex-1">
                  <p
                    className="
                      truncate
                      text-[8px]
                      font-bold
                      text-[#17324D]
                    "
                  >
                    {displayName}
                  </p>

                  <p
                    className="
                      mt-[3px]
                      line-clamp-2
                      text-[8px]
                      leading-[12px]
                      text-[#718599]
                    "
                  >
                    {item.description ||
                      item.title ||
                      "Customer follow-up"}
                  </p>
                </div>

                {/* =================================================
                    TIME
                ================================================== */}

                <div className="shrink-0">
                  {urgent ? (
                    <span
                      className="
                        rounded-[4px]
                        bg-[#FFF3E6]
                        px-[6px]
                        py-[3px]
                        text-[7px]
                        font-semibold
                        text-[#F59E0B]
                      "
                    >
                      {formatTime(
                        item.dueAt
                      )}
                    </span>
                  ) : (
                    <span
                      className="
                        text-[7px]
                        font-medium
                        text-[#718599]
                      "
                    >
                      {formatTime(
                        item.dueAt
                      )}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
      </div>
    </Card>
  );
};

export default UpcomingFollowUps;