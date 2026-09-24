import { useEffect, useMemo, useState } from "react";

import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const API_BASE_URL =
  "http://localhost:5000";

const days = [
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
  "Sun",
];

// =========================================================
// DATE HELPERS
// =========================================================

// Monday = 0
const getMondayIndex = (date) => {
  const day = date.getDay();

  return day === 0 ? 6 : day - 1;
};

const startOfCalendar = (
  year,
  month
) => {
  const firstDay =
    new Date(
      year,
      month,
      1
    );

  const mondayIndex =
    getMondayIndex(firstDay);

  return new Date(
    year,
    month,
    1 - mondayIndex
  );
};

const endOfCalendar = (
  year,
  month
) => {
  const lastDay =
    new Date(
      year,
      month + 1,
      0
    );

  const mondayIndex =
    getMondayIndex(lastDay);

  const daysToAdd =
    6 - mondayIndex;

  return new Date(
    year,
    month + 1,
    daysToAdd
  );
};

const formatMonthYear = (
  date
) => {
  return date.toLocaleDateString(
    "en-US",
    {
      month: "long",
      year: "numeric",
    }
  );
};

const formatDateForApi = (
  date
) => {
  const year =
    date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const isSameDay = (
  first,
  second
) => {
  return (
    first.getFullYear() ===
      second.getFullYear() &&
    first.getMonth() ===
      second.getMonth() &&
    first.getDate() ===
      second.getDate()
  );
};

const addDays = (
  date,
  amount
) => {
  const result =
    new Date(date);

  result.setDate(
    result.getDate() + amount
  );

  return result;
};

// =========================================================
// CALENDAR GRID
// =========================================================

const CalendarGrid = () => {
  // =======================================================
  // STATE
  // =======================================================

  const today = useMemo(
    () => new Date(),
    []
  );

  const [currentMonth, setCurrentMonth] =
    useState(
      new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      )
    );

  const [events, setEvents] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [view, setView] =
    useState("month");

  // =======================================================
  // CALENDAR RANGE
  // =======================================================

  const calendarStart =
    useMemo(
      () =>
        startOfCalendar(
          currentMonth.getFullYear(),
          currentMonth.getMonth()
        ),
      [currentMonth]
    );

  const calendarEnd =
    useMemo(
      () =>
        endOfCalendar(
          currentMonth.getFullYear(),
          currentMonth.getMonth()
        ),
      [currentMonth]
    );

  // =======================================================
  // CALENDAR DAYS
  // =======================================================

  const calendarDays =
    useMemo(() => {
      const result = [];

      let cursor =
        new Date(
          calendarStart
        );

      while (
        cursor <=
        calendarEnd
      ) {
        result.push(
          new Date(cursor)
        );

        cursor = addDays(
          cursor,
          1
        );
      }

      return result;
    }, [
      calendarStart,
      calendarEnd,
    ]);

  // =======================================================
  // FETCH EVENTS
  // =======================================================

  const fetchEvents = async () => {
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

      const start =
        formatDateForApi(
          calendarStart
        );

      const end =
        formatDateForApi(
          calendarEnd
        );

      const params =
        new URLSearchParams();

      params.set(
        "start",
        start
      );

      params.set(
        "end",
        end
      );

      const response =
        await fetch(
          `${API_BASE_URL}/api/calendar/me/events?${params.toString()}`,
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
            "Failed to fetch calendar events."
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
        "Calendar Events Error:",
        err
      );

      setError(
        err.message ||
          "Unable to load calendar events."
      );

      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  // =======================================================
  // LOAD EVENTS WHEN MONTH CHANGES
  // =======================================================

  useEffect(() => {
    fetchEvents();
  }, [
    currentMonth,
  ]);

  // =======================================================
  // REFRESH WHEN EVENT IS CREATED / UPDATED
  // =======================================================

  useEffect(() => {
    const handleCalendarUpdated =
      () => {
        fetchEvents();
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
  }, [
    calendarStart,
    calendarEnd,
  ]);

  // =======================================================
  // TODAY
  // =======================================================

  const handleToday = () => {
    setCurrentMonth(
      new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      )
    );
  };

  // =======================================================
  // PREVIOUS MONTH
  // =======================================================

  const handlePreviousMonth = () => {
    setCurrentMonth(
      (previous) =>
        new Date(
          previous.getFullYear(),
          previous.getMonth() - 1,
          1
        )
    );
  };

  // =======================================================
  // NEXT MONTH
  // =======================================================

  const handleNextMonth = () => {
    setCurrentMonth(
      (previous) =>
        new Date(
          previous.getFullYear(),
          previous.getMonth() + 1,
          1
        )
    );
  };

  // =======================================================
  // GROUP EVENTS BY DATE
  // =======================================================

  const eventsByDate =
    useMemo(() => {
      const grouped = {};

      events.forEach(
        (event) => {
          if (!event.startAt) {
            return;
          }

          const date =
            new Date(
              event.startAt
            );

          if (
            Number.isNaN(
              date.getTime()
            )
          ) {
            return;
          }

          const key =
            formatDateForApi(
              date
            );

          if (!grouped[key]) {
            grouped[key] = [];
          }

          grouped[key].push(
            event
          );
        }
      );

      Object.keys(
        grouped
      ).forEach((key) => {
        grouped[key].sort(
          (a, b) =>
            new Date(
              a.startAt
            ) -
            new Date(
              b.startAt
            )
        );
      });

      return grouped;
    }, [events]);

  // =======================================================
  // UI
  // =======================================================

  return (
    <div className="w-full overflow-hidden rounded-[9px] border border-[#DCE5ED] bg-white">
      {/* =====================================================
          CALENDAR TOOLBAR
      ====================================================== */}

      <div
        className="
          flex
          min-h-[44px]
          items-center
          justify-between
          gap-3
          border-b
          border-[#DCE5ED]
          px-2.5
          py-2
        "
      >
        {/* Left Controls */}

        <div className="flex items-center gap-2">
          {/* Today */}

          <button
            type="button"
            onClick={
              handleToday
            }
            className="
              h-[24px]
              rounded-[4px]
              border
              border-[#DCE5ED]
              bg-white
              px-2
              text-[7px]
              font-semibold
              text-[#17324D]
              hover:bg-[#F5F8FA]
            "
          >
            Today
          </button>

          {/* Previous */}

          <button
            type="button"
            onClick={
              handlePreviousMonth
            }
            className="
              flex
              h-6
              w-5
              items-center
              justify-center
              text-[#60758A]
              hover:text-[#17324D]
            "
            aria-label="Previous month"
          >
            <ChevronLeft
              size={12}
            />
          </button>

          {/* Next */}

          <button
            type="button"
            onClick={
              handleNextMonth
            }
            className="
              flex
              h-6
              w-5
              items-center
              justify-center
              text-[#60758A]
              hover:text-[#17324D]
            "
            aria-label="Next month"
          >
            <ChevronRight
              size={12}
            />
          </button>

          {/* Month */}

          <h2
            className="
              ml-1
              whitespace-nowrap
              text-[13px]
              font-bold
              text-[#17324D]
            "
          >
            {formatMonthYear(
              currentMonth
            )}
          </h2>
        </div>

        {/* View Switcher */}

        <div
          className="
            flex
            overflow-hidden
            rounded-[4px]
            border
            border-[#DCE5ED]
          "
        >
          <button
            type="button"
            onClick={() =>
              setView("month")
            }
            className={`
              h-[24px]
              px-2.5
              text-[7px]
              font-semibold
              ${
                view === "month"
                  ? "bg-[#F3F7FB] text-[#17324D]"
                  : "text-[#60758A] hover:bg-[#F7F9FC]"
              }
            `}
          >
            Month
          </button>

          <button
            type="button"
            onClick={() =>
              setView("week")
            }
            className={`
              h-[24px]
              px-2.5
              text-[7px]
              font-medium
              ${
                view === "week"
                  ? "bg-[#F3F7FB] text-[#17324D]"
                  : "text-[#60758A] hover:bg-[#F7F9FC]"
              }
            `}
          >
            Week
          </button>

          <button
            type="button"
            onClick={() =>
              setView("day")
            }
            className={`
              h-[24px]
              px-2.5
              text-[7px]
              font-medium
              ${
                view === "day"
                  ? "bg-[#F3F7FB] text-[#17324D]"
                  : "text-[#60758A] hover:bg-[#F7F9FC]"
              }
            `}
          >
            Day
          </button>
        </div>
      </div>

      {/* =====================================================
          ERROR
      ====================================================== */}

      {error && (
        <div
          className="
            flex
            items-center
            justify-between
            gap-3
            border-b
            border-[#DCE5ED]
            bg-[#FFF8F8]
            px-3
            py-2
          "
        >
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
              fetchEvents
            }
            className="
              shrink-0
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

      {/* =====================================================
          DAYS + GRID
      ====================================================== */}

      <div className="overflow-x-auto">
        <div className="min-w-[620px]">
          {/* Weekday Header */}

          <div className="grid grid-cols-7 border-b border-[#DCE5ED] bg-[#FBFCFD]">
            {days.map(
              (day) => (
                <div
                  key={day}
                  className="
                    flex
                    h-[28px]
                    items-center
                    justify-center
                    border-r
                    border-[#DCE5ED]
                    text-[7px]
                    font-semibold
                    text-[#60758A]
                    last:border-r-0
                  "
                >
                  {day}
                </div>
              )
            )}
          </div>

          {/* Calendar Cells */}

          <div className="grid grid-cols-7">
            {calendarDays.map(
              (date) => {
                const key =
                  formatDateForApi(
                    date
                  );

                const dayEvents =
                  eventsByDate[
                    key
                  ] || [];

                return (
                  <CalendarCell
                    key={key}
                    date={date}
                    currentMonth={
                      currentMonth
                    }
                    today={today}
                    events={
                      dayEvents
                    }
                    loading={
                      loading
                    }
                  />
                );
              }
            )}
          </div>
        </div>
      </div>

      {/* Bottom Empty Area */}

      <div className="h-[76px] border-t border-[#DCE5ED] bg-[#DCE6EF]" />
    </div>
  );
};

// =========================================================
// CALENDAR CELL
// =========================================================

const CalendarCell = ({
  date,
  currentMonth,
  today,
  events,
  loading,
}) => {
  const isMuted =
    date.getMonth() !==
    currentMonth.getMonth();

  const isToday =
    isSameDay(
      date,
      today
    );

  return (
    <div
      className="
        relative
        h-[92px]
        overflow-hidden
        border-b
        border-r
        border-[#DCE5ED]
        bg-white
        p-2
      "
    >
      {/* =================================================
          DATE
      ================================================== */}

      <div className="flex justify-end">
        <span
          className={`
            flex
            h-[18px]
            min-w-[18px]
            items-center
            justify-center
            rounded-full
            text-[7px]
            font-medium
            ${
              isToday
                ? "bg-[#071D35] text-white"
                : isMuted
                ? "text-[#9AA8B5]"
                : "text-[#60758A]"
            }
          `}
        >
          {date.getDate()}
        </span>
      </div>

      {/* =================================================
          LOADING
      ================================================== */}

      {loading && (
        <div className="mt-2">
          <div className="h-[18px] w-full animate-pulse rounded-[4px] bg-[#EDF3F8]" />
        </div>
      )}

      {/* =================================================
          EVENTS
      ================================================== */}

      {!loading &&
        events.length > 0 && (
          <div className="mt-2 space-y-1">
            {events
              .slice(0, 3)
              .map(
                (event) => (
                  <CalendarEvent
                    key={
                      event._id
                    }
                    event={
                      event
                    }
                  />
                )
              )}

            {/* More events */}

            {events.length >
              3 && (
              <p
                className="
                  px-1
                  text-[5px]
                  font-medium
                  text-[#60758A]
                "
              >
                +{events.length - 3} more
              </p>
            )}
          </div>
        )}
    </div>
  );
};

// =========================================================
// CALENDAR EVENT
// =========================================================

const CalendarEvent = ({
  event,
}) => {
  const start =
    event.startAt
      ? new Date(
          event.startAt
        )
      : null;

  const time =
    start &&
    !Number.isNaN(
      start.getTime()
    )
      ? start.toLocaleTimeString(
          "en-US",
          {
            hour: "numeric",
            minute: "2-digit",
          }
        )
      : "";

  return (
    <button
      type="button"
      className="
        block
        w-full
        overflow-hidden
        rounded-[4px]
        bg-[#D8E8FC]
        px-1.5
        py-1
        text-left
        text-[6px]
        font-medium
        leading-[9px]
        text-[#173B5C]
        transition-colors
        hover:bg-[#C9DDF7]
      "
      title={
        event.title
      }
    >
      <span className="block truncate">
        {time
          ? `${time} `
          : ""}
        {event.title ||
          "Untitled Event"}
      </span>
    </button>
  );
};

export default CalendarGrid;