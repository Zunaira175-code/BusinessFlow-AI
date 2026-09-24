import { useEffect, useState } from "react";

import {
  CalendarDays,
  ChevronRight,
} from "lucide-react";

const API_BASE_URL =
  "http://localhost:5000";

const UpcomingEvents = () => {
  const [events, setEvents] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // =====================================================
  // FETCH UPCOMING EVENTS
  // =====================================================

  const fetchUpcomingEvents =
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

          setEvents([]);

          return;
        }

        const response =
          await fetch(
            `${API_BASE_URL}/api/calendar/me/upcoming?limit=5`,
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
              "Failed to fetch upcoming events."
          );
        }

        setEvents(
          Array.isArray(
            result.data
          )
            ? result.data
            : []
        );
      } catch (err) {
        console.error(
          "Upcoming Events Error:",
          err
        );

        setError(
          err.message ||
            "Unable to load upcoming events."
        );

        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    fetchUpcomingEvents();

    const handleCalendarUpdated =
      () => {
        fetchUpcomingEvents();
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
          Upcoming Events
        </h2>
      </div>

      {/* =================================================
          LOADING
      ================================================== */}

      {loading && (
        <div className="mt-3 space-y-3">
          {[1, 2].map(
            (item) => (
              <div
                key={item}
                className="
                  flex
                  items-center
                  justify-between
                  gap-2
                "
              >
                <div className="min-w-0 flex-1">
                  <div className="h-2 w-32 animate-pulse rounded bg-[#EDF2F6]" />

                  <div className="mt-1.5 h-2 w-12 animate-pulse rounded bg-[#F1F4F7]" />
                </div>

                <div className="h-3 w-3 animate-pulse rounded bg-[#EDF2F6]" />
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
                fetchUpcomingEvents
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
        events.length ===
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
              No upcoming events
            </p>

            <p
              className="
                mt-1
                text-[6px]
                text-[#718599]
              "
            >
              You don't have any upcoming events.
            </p>
          </div>
        )}

      {/* =================================================
          EVENTS
      ================================================== */}

      {!loading &&
        !error &&
        events.length >
          0 && (
          <div className="mt-3 space-y-3">
            {events.map(
              (event) => (
                <UpcomingEvent
                  key={
                    event._id
                  }
                  event={
                    event
                  }
                />
              )
            )}
          </div>
        )}

      {/* =================================================
          VIEW ALL
      ================================================== */}

      {!loading &&
        !error &&
        events.length >
          0 && (
          <button
            type="button"
            className="
              mt-4
              text-[7px]
              font-semibold
              text-[#0089D6]
              hover:underline
            "
          >
            View All
          </button>
        )}
    </div>
  );
};

// =========================================================
// UPCOMING EVENT
// =========================================================

const UpcomingEvent = ({
  event,
}) => {
  return (
    <div
      className="
        flex
        items-center
        justify-between
        gap-2
      "
    >
      {/* Content */}

      <div className="min-w-0">
        <p
          className="
            truncate
            text-[7px]
            font-bold
            text-[#17324D]
          "
        >
          {event.title ||
            "Untitled Event"}
        </p>

        <p
          className="
            mt-1
            text-[7px]
            text-[#718599]
          "
        >
          {formatEventDate(
            event.startAt
          )}
        </p>
      </div>

      {/* Arrow */}

      <ChevronRight
        size={11}
        strokeWidth={1.7}
        className="
          shrink-0
          text-[#60758A]
        "
      />
    </div>
  );
};

// =========================================================
// FORMAT EVENT DATE
// =========================================================

const formatEventDate = (
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

  return date.toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
    }
  );
};

export default UpcomingEvents;