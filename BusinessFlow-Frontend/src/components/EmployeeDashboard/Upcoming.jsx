import { useEffect, useState } from "react";
import { Clock3, MoreHorizontal } from "lucide-react";

const API_URL = "http://localhost:5000/api";

const getDateInfo = (dateValue) => {
  if (!dateValue) {
    return {
      day: "—",
      date: "—",
    };
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return {
      day: "—",
      date: "—",
    };
  }

  const now = new Date();

  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const taskDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );

  let day;

  if (taskDate.getTime() === today.getTime()) {
    day = "TODAY";
  } else if (taskDate.getTime() === tomorrow.getTime()) {
    day = "TMRW";
  } else {
    day = date
      .toLocaleDateString([], {
        weekday: "short",
      })
      .toUpperCase();
  }

  return {
    day,
    date: date.getDate(),
  };
};

const formatTime = (dateValue) => {
  if (!dateValue) return "";

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
};

const Upcoming = () => {
  const [upcomingItems, setUpcomingItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUpcoming = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("businessflow_token");

      if (!token) {
        setError("Authentication required.");
        return;
      }

      const response = await fetch(
        `${API_URL}/tasks?view=upcoming&page=1&limit=2`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to load upcoming schedule."
        );
      }

      setUpcomingItems(result.data || []);
    } catch (err) {
      console.error("Upcoming Tasks Error:", err);
      setError(
        err.message || "Failed to load upcoming schedule."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUpcoming();
  }, []);

  return (
    <div
      className="
        w-full
        overflow-hidden
        rounded-[9px]
        border
        border-[#DCE5ED]
        bg-white
      "
    >
      {/* =====================================================
          HEADER
      ====================================================== */}
      <div
        className="
          flex
          min-h-[48px]
          items-center
          justify-between
          border-b
          border-[#DCE5ED]
          px-3
          py-2.5
        "
      >
        <div>
          <h2
            className="
              text-[13px]
              font-bold
              leading-[16px]
              text-[#17324D]
            "
          >
            Upcoming
          </h2>

          <p
            className="
              mt-0.5
              text-[7px]
              leading-[10px]
              text-[#8495A5]
            "
          >
            Your schedule
          </p>
        </div>

        {/* More */}
        <button
          type="button"
          onClick={fetchUpcoming}
          aria-label="Refresh upcoming schedule"
          className="
            flex
            h-6
            w-6
            items-center
            justify-center
            rounded-md
            text-[#718599]
            transition-colors
            hover:bg-[#F3F6F9]
            hover:text-[#17324D]
          "
        >
          <MoreHorizontal
            size={13}
            strokeWidth={2}
          />
        </button>
      </div>

      {/* =====================================================
          UPCOMING ITEMS
      ====================================================== */}
      <div>
        {/* Loading */}
        {loading && (
          <div className="flex min-h-[104px] items-center justify-center">
            <p className="text-[8px] text-[#8495A5]">
              Loading schedule...
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="flex min-h-[104px] items-center justify-center px-3">
            <div className="text-center">
              <p className="text-[8px] text-[#EF4444]">
                {error}
              </p>

              <button
                type="button"
                onClick={fetchUpcoming}
                className="
                  mt-1.5
                  text-[8px]
                  font-semibold
                  text-[#079BEA]
                  hover:text-[#0B3D6B]
                "
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Empty */}
        {!loading &&
          !error &&
          upcomingItems.length === 0 && (
            <div className="flex min-h-[104px] items-center justify-center">
              <p className="text-[8px] text-[#8495A5]">
                No upcoming tasks.
              </p>
            </div>
          )}

        {/* Upcoming Items */}
        {!loading &&
          !error &&
          upcomingItems.length > 0 &&
          upcomingItems.map((item, index) => {
            const dateInfo = getDateInfo(item.dueAt);
            const time = formatTime(item.dueAt);

            return (
              <div
                key={item._id}
                className={`
                  flex
                  min-h-[52px]
                  items-center
                  gap-2.5
                  px-2.5
                  py-2
                  ${
                    index !== upcomingItems.length - 1
                      ? "border-b border-[#E2E9EF]"
                      : ""
                  }
                `}
              >
                {/* Date Box */}
                <div
                  className="
                    flex
                    h-[35px]
                    w-[35px]
                    shrink-0
                    flex-col
                    items-center
                    justify-center
                    rounded-[4px]
                    border
                    border-[#DCE5ED]
                    bg-[#F8FAFC]
                  "
                >
                  <span
                    className="
                      text-[6px]
                      font-semibold
                      leading-[8px]
                      text-[#079BEA]
                    "
                  >
                    {dateInfo.day}
                  </span>

                  <span
                    className="
                      mt-0.5
                      text-[11px]
                      font-bold
                      leading-[12px]
                      text-[#17324D]
                    "
                  >
                    {dateInfo.date}
                  </span>
                </div>

                {/* Event Information */}
                <div className="min-w-0 flex-1">
                  <p
                    className="
                      truncate
                      text-[10px]
                      font-semibold
                      leading-[13px]
                      text-[#17324D]
                    "
                  >
                    {item.title}
                  </p>

                  <div
                    className="
                      mt-1
                      flex
                      items-center
                      gap-1
                      text-[7px]
                      leading-[10px]
                      text-[#8A9AAA]
                    "
                  >
                    <Clock3
                      size={8}
                      strokeWidth={1.7}
                    />

                    <span>{time}</span>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Upcoming;