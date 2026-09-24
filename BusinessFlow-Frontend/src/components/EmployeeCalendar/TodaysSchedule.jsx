import { useEffect, useState } from "react";
import { CalendarDays } from "lucide-react";

const API_BASE_URL =
  "http://localhost:5000";

const TodaysSchedule = () => {
  const [schedule, setSchedule] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // =====================================================
  // FETCH TODAY'S SCHEDULE
  // =====================================================

  const fetchTodaySchedule =
    async () => {
      try {
        setLoading(true);
        setError("");

        const token =
          localStorage.getItem(
            "businessflow_token"
          );

        if (!token) {
          setError(
            "Authentication token not found."
          );

          setSchedule([]);

          return;
        }

        const response =
          await fetch(
            `${API_BASE_URL}/api/calendar/me/today`,
            {
              method: "GET",

              headers: {
                Authorization: `Bearer ${token}`,
                Accept:
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
              "Failed to fetch today's schedule."
          );
        }

        setSchedule(
          Array.isArray(
            result.data
          )
            ? result.data
            : []
        );
      } catch (err) {
        console.error(
          "Today's Schedule Error:",
          err
        );

        setError(
          err.message ||
            "Unable to load today's schedule."
        );

        setSchedule([]);
      } finally {
        setLoading(false);
      }
    };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    fetchTodaySchedule();

    const handleCalendarUpdated =
      () => {
        fetchTodaySchedule();
      };

    window.addEventListener(
      "businessflow-calendar-updated",
      handleCalendarUpdated
    );

    return () => {
      window.removeEventListener(
        "businessflow-calendar-updated",
        handleCalendarUpdated
      );
    };
  }, []);

  // =====================================================
  // UI
  // =====================================================

  return (
    <div
      className="
        rounded-[9px]
        border
        border-[#DCE5ED]
        bg-white
        p-3
      "
    >
      {/* =================================================
          HEADER
      ================================================== */}

      <div className="flex items-center gap-2">
        <CalendarDays
          size={15}
          strokeWidth={1.8}
          className="text-[#0089D6]"
        />

        <h2
          className="
            text-[13px]
            font-bold
            text-[#17324D]
          "
        >
          Today's Schedule
        </h2>
      </div>

      {/* =================================================
          LOADING
      ================================================== */}

      {loading && (
        <div className="mt-3 space-y-2.5">
          {[1, 2, 3].map(
            (item) => (
              <div
                key={item}
                className="
                  border-l-2
                  border-[#E3EBF3]
                  pl-2.5
                "
              >
                <div className="h-2 w-14 animate-pulse rounded bg-[#EDF2F6]" />

                <div className="mt-1 h-2 w-32 animate-pulse rounded bg-[#F1F4F7]" />
              </div>
            )
          )}
        </div>
      )}

      {/* =================================================
          ERROR
      ================================================== */}

      {!loading &&
        error && (
          <div className="mt-3 rounded-[6px] bg-[#FFF8F8] px-2.5 py-2">
            <p
              className="
                text-[7px]
                font-medium
                text-[#EF4444]
              "
            >
              {error}
            </p>

            <button
              type="button"
              onClick={
                fetchTodaySchedule
              }
              className="
                mt-1.5
                rounded-[4px]
                bg-[#0B3D6B]
                px-2.5
                py-1
                text-[6px]
                font-semibold
                text-white
                hover:bg-[#082F54]
              "
            >
              Retry
            </button>
          </div>
        )}

      {/* =================================================
          EMPTY
      ================================================== */}

      {!loading &&
        !error &&
        schedule.length ===
          0 && (
          <div
            className="
              mt-3
              rounded-[6px]
              bg-[#F8FAFC]
              px-2.5
              py-4
              text-center
            "
          >
            <p
              className="
                text-[8px]
                font-semibold
                text-[#17324D]
              "
            >
              No events today
            </p>

            <p
              className="
                mt-1
                text-[6px]
                text-[#718599]
              "
            >
              Your schedule is clear for today.
            </p>
          </div>
        )}

      {/* =================================================
          SCHEDULE
      ================================================== */}

      {!loading &&
        !error &&
        schedule.length >
          0 && (
          <div className="mt-3 space-y-2.5">
            {schedule.map(
              (item) => (
                <ScheduleItem
                  key={
                    item._id
                  }
                  item={item}
                />
              )
            )}
          </div>
        )}
    </div>
  );
};

// =========================================================
// SCHEDULE ITEM
// =========================================================

const ScheduleItem = ({
  item,
}) => {
  const time =
    formatEventTime(
      item.startAt
    );

  const relatedName =
    getRelatedName(
      item
    );

  return (
    <div
      className="
        border-l-2
        border-[#C7DFF8]
        pl-2.5
      "
    >
      {/* Time */}

      <p
        className="
          text-[7px]
          font-bold
          text-[#17324D]
        "
      >
        {time}
      </p>

      {/* Event */}

      <p
        className="
          mt-0.5
          text-[7px]
          leading-[10px]
          text-[#60758A]
        "
      >
        {item.title ||
          "Untitled Event"}

        {relatedName && (
          <>
            {" "}
            —{" "}
            {relatedName}
          </>
        )}
      </p>
    </div>
  );
};

// =========================================================
// FORMAT EVENT TIME
// =========================================================

const formatEventTime = (
  value
) => {
  if (!value) {
    return "--";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "--";
  }

  return date.toLocaleTimeString(
    "en-US",
    {
      hour: "numeric",
      minute: "2-digit",
    }
  );
};

// =========================================================
// RELATED RECORD
// =========================================================

const getRelatedName = (
  event
) => {
  // Customer

  if (event.customerId) {
    const customer =
      event.customerId;

    if (
      customer.companyName
    ) {
      return customer.companyName;
    }

    const name =
      `${customer.firstName || ""} ${
        customer.lastName || ""
      }`.trim();

    if (name) {
      return name;
    }
  }

  // Lead

  if (event.leadId) {
    const lead =
      event.leadId;

    if (lead.company) {
      return lead.company;
    }

    const name =
      `${lead.firstName || ""} ${
        lead.lastName || ""
      }`.trim();

    if (name) {
      return name;
    }
  }

  // Deal

  if (event.dealId) {
    return (
      event.dealId.title ||
      ""
    );
  }

  return "";
};

export default TodaysSchedule;