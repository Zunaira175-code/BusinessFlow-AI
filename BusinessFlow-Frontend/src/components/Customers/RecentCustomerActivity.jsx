import { useCallback, useEffect, useState } from "react";

import {
  Filter,
  Headphones,
  CalendarDays,
  FileText,
  Mail,
  Phone,
  MessageSquare,
  CircleDollarSign,
  CheckSquare,
} from "lucide-react";

import Card from "../common/Card";
import Avatar from "../common/Avatar";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const RecentCustomerActivity = () => {
  const [activities, setActivities] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /*
  |--------------------------------------------------------------------------
  | Fetch Recent Customer Activity
  |--------------------------------------------------------------------------
  */

  const fetchActivities = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem(
        "businessflow_token"
      );

      if (!token) {
        throw new Error(
          "Authentication required. Please login again."
        );
      }

      const response = await fetch(
        `${API_BASE_URL}/api/customers/activity?limit=5`,
        {
          method: "GET",

          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.message ||
            "Failed to load customer activity."
        );
      }

      setActivities(
        Array.isArray(result?.data)
          ? result.data
          : []
      );
    } catch (err) {
      console.error(
        "Recent Customer Activity Error:",
        err
      );

      setError(
        err?.message ||
          "Unable to load recent customer activity."
      );

      setActivities([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Initial Load
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  /*
  |--------------------------------------------------------------------------
  | Format Relative Time
  |--------------------------------------------------------------------------
  */

  const formatTime = (dateValue) => {
    if (!dateValue) {
      return "";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "";
    }

    const now = new Date();

    const diffMs =
      now.getTime() - date.getTime();

    const diffMinutes = Math.floor(
      diffMs / (1000 * 60)
    );

    if (diffMinutes < 1) {
      return "Just now";
    }

    if (diffMinutes < 60) {
      return `${diffMinutes} ${
        diffMinutes === 1 ? "min" : "mins"
      } ago`;
    }

    const diffHours = Math.floor(
      diffMinutes / 60
    );

    if (diffHours < 24) {
      return `${diffHours} ${
        diffHours === 1 ? "hour" : "hours"
      } ago`;
    }

    const diffDays = Math.floor(
      diffHours / 24
    );

    if (diffDays === 1) {
      return "Yesterday";
    }

    if (diffDays < 7) {
      return `${diffDays} days ago`;
    }

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year:
        date.getFullYear() !==
        now.getFullYear()
          ? "numeric"
          : undefined,
    });
  };

  /*
  |--------------------------------------------------------------------------
  | Get Initials
  |--------------------------------------------------------------------------
  */

  const getInitials = (name) => {
    if (!name) {
      return "U";
    }

    const words = name
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    if (words.length === 1) {
      return words[0]
        .substring(0, 2)
        .toUpperCase();
    }

    return `${words[0][0]}${words[1][0]}`.toUpperCase();
  };

  /*
  |--------------------------------------------------------------------------
  | Activity Icon
  |--------------------------------------------------------------------------
  */

  const getActivityIcon = (type) => {
    switch (type) {
      case "call":
        return (
          <Phone
            size={10}
            strokeWidth={1.8}
          />
        );

      case "email":
        return (
          <Mail
            size={10}
            strokeWidth={1.8}
          />
        );

      case "meeting":
        return (
          <CalendarDays
            size={10}
            strokeWidth={1.8}
          />
        );

      case "deal":
        return (
          <CircleDollarSign
            size={10}
            strokeWidth={1.8}
          />
        );

      case "task":
        return (
          <CheckSquare
            size={10}
            strokeWidth={1.8}
          />
        );

      case "message":
        return (
          <MessageSquare
            size={10}
            strokeWidth={1.8}
          />
        );

      case "note":
        return (
          <FileText
            size={10}
            strokeWidth={1.8}
          />
        );

      case "payment":
        return (
          <CircleDollarSign
            size={10}
            strokeWidth={1.8}
          />
        );

      default:
        return (
          <Headphones
            size={10}
            strokeWidth={1.8}
          />
        );
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <Card
        className="
          mt-5
          w-full
          overflow-hidden
          rounded-[9px]
          border-[#DCE5ED]
          bg-white
        "
      >
        {/* Header */}

        <div
          className="
            flex
            h-[47px]
            items-center
            justify-between
            border-b
            border-[#DDE5EC]
            px-[14px]
          "
        >
          <h2
            className="
              text-[12px]
              font-bold
              text-[#102F4A]
            "
          >
            Recent Customer Activity
          </h2>

          <div className="h-6 w-6 animate-pulse rounded-md bg-[#F1F5F9]" />
        </div>

        {/* Skeleton */}

        <div className="px-[14px] py-[9px]">
          {[1, 2, 3, 4, 5].map(
            (item) => (
              <div
                key={item}
                className="
                  flex
                  min-h-[47px]
                  items-center
                  gap-[10px]
                "
              >
                <div className="h-[21px] w-[21px] shrink-0 animate-pulse rounded-full bg-[#EDF2F7]" />

                <div className="flex-1">
                  <div className="h-[8px] w-[260px] max-w-[70%] animate-pulse rounded bg-[#EDF2F7]" />

                  <div className="mt-[4px] h-[6px] w-[55px] animate-pulse rounded bg-[#F1F5F9]" />
                </div>
              </div>
            )
          )}
        </div>
      </Card>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Error
  |--------------------------------------------------------------------------
  */

  if (error) {
    return (
      <Card
        className="
          mt-5
          w-full
          overflow-hidden
          rounded-[9px]
          border-[#DCE5ED]
          bg-white
        "
      >
        <div
          className="
            flex
            h-[47px]
            items-center
            justify-between
            border-b
            border-[#DDE5EC]
            px-[14px]
          "
        >
          <h2
            className="
              text-[12px]
              font-bold
              text-[#102F4A]
            "
          >
            Recent Customer Activity
          </h2>

          <button
            type="button"
            onClick={fetchActivities}
            className="
              rounded-[5px]
              bg-[#F3F6F9]
              px-2
              py-1
              text-[8px]
              font-semibold
              text-[#173B5C]
            "
          >
            Retry
          </button>
        </div>

        <div className="flex min-h-[120px] items-center justify-center px-4">
          <p className="text-[9px] text-[#C24141]">
            {error}
          </p>
        </div>
      </Card>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Main UI
  |--------------------------------------------------------------------------
  */

  return (
    <Card
      className="
        mt-5
        w-full
        overflow-hidden
        rounded-[9px]
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
          h-[47px]
          items-center
          justify-between
          border-b
          border-[#DDE5EC]
          px-[14px]
        "
      >
        <h2
          className="
            text-[12px]
            font-bold
            text-[#102F4A]
          "
        >
          Recent Customer Activity
        </h2>

        <button
          type="button"
          aria-label="Filter activity"
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
            hover:text-[#173B5C]
          "
        >
          <Filter
            size={13}
            strokeWidth={1.8}
          />
        </button>
      </div>

      {/* =====================================================
          EMPTY STATE
      ====================================================== */}

      {activities.length === 0 ? (
        <div className="flex min-h-[120px] items-center justify-center px-4">
          <div className="text-center">
            <p className="text-[10px] font-semibold text-[#526A80]">
              No recent customer activity
            </p>

            <p className="mt-1 text-[8px] text-[#91A0AE]">
              Customer activity will appear here.
            </p>
          </div>
        </div>
      ) : (
        /* =====================================================
            ACTIVITY LIST
        ====================================================== */

        <div className="px-[14px] py-[9px]">
          {activities.map(
            (activity, index) => {
              const isLast =
                index ===
                activities.length - 1;

              const userName =
                activity?.user?.name || "";

              const customerName =
                activity?.customer?.name || "";

              const customerCompany =
                activity?.customer
                  ?.companyName || "";

              return (
                <div
                  key={
                    activity?.id ||
                    `${activity?.title}-${index}`
                  }
                  className="
                    relative
                    flex
                    min-h-[47px]
                  "
                >
                  {/* =================================================
                      TIMELINE LINE
                  ================================================== */}

                  {!isLast && (
                    <span
                      className="
                        absolute
                        left-[10px]
                        top-[28px]
                        h-[31px]
                        w-px
                        bg-[#DDE5EC]
                      "
                    />
                  )}

                  {/* =================================================
                      AVATAR / ICON
                  ================================================== */}

                  <div className="relative z-10 mr-[10px] shrink-0">
                    {userName ? (
                      /*
                       * We currently don't have a
                       * user avatar URL in the backend.
                       * Use initials instead.
                       */
                      <div
                        className="
                          flex
                          h-[21px]
                          w-[21px]
                          items-center
                          justify-center
                          rounded-full
                          border
                          border-white
                          bg-[#E6EFF8]
                          text-[6px]
                          font-bold
                          text-[#426685]
                        "
                      >
                        {getInitials(userName)}
                      </div>
                    ) : (
                      <div
                        className="
                          flex
                          h-[21px]
                          w-[21px]
                          items-center
                          justify-center
                          rounded-full
                          border
                          border-[#DCE6F0]
                          bg-[#EEF4FC]
                          text-[#496A87]
                        "
                      >
                        {getActivityIcon(
                          activity?.type
                        )}
                      </div>
                    )}
                  </div>

                  {/* =================================================
                      ACTIVITY CONTENT
                  ================================================== */}

                  <div className="min-w-0 pt-[1px]">
                    <p
                      className="
                        text-[8px]
                        font-semibold
                        leading-[12px]
                        text-[#17324D]
                      "
                    >
                      {userName && (
                        <span>
                          {userName}{" "}
                        </span>
                      )}

                      <span className="font-semibold">
                        {activity?.title}
                      </span>
                    </p>

                    {activity?.description && (
                      <p
                        className="
                          mt-[1px]
                          truncate
                          text-[7px]
                          font-medium
                          leading-[10px]
                          text-[#718599]
                        "
                      >
                        {activity.description}
                      </p>
                    )}

                    {customerName && (
                      <p
                        className="
                          mt-[1px]
                          truncate
                          text-[7px]
                          font-medium
                          leading-[10px]
                          text-[#91A0AE]
                        "
                      >
                        {customerName}
                        {customerCompany
                          ? ` • ${customerCompany}`
                          : ""}
                      </p>
                    )}

                    {activity?.createdAt && (
                      <p
                        className="
                          mt-[2px]
                          text-[7px]
                          font-medium
                          leading-[10px]
                          text-[#91A0AE]
                        "
                      >
                        {formatTime(
                          activity.createdAt
                        )}
                      </p>
                    )}
                  </div>
                </div>
              );
            }
          )}
        </div>
      )}
    </Card>
  );
};

export default RecentCustomerActivity;