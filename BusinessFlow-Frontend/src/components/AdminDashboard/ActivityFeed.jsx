import { useCallback, useEffect, useState } from "react";

import {
  SlidersHorizontal,
  Mail,
} from "lucide-react";

import Card from "../common/Card";
import Avatar from "../common/Avatar";
import IconButton from "../common/IconButton";

const API_URL = "http://localhost:5000/api";

// =====================================================
// ACTIVITY FEED
// =====================================================

const ActivityFeed = () => {
  const [activities, setActivities] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // =====================================================
  // FETCH ACTIVITIES
  // =====================================================

  const fetchActivities = useCallback(
    async () => {
      try {
        setLoading(true);
        setError("");

        const token =
          localStorage.getItem(
            "businessflow_token"
          );

        if (!token) {
          throw new Error(
            "Authentication required. Please login again."
          );
        }

        const response =
          await fetch(
            `${API_URL}/admin/dashboard/activity?limit=6`,
            {
              method: "GET",

              headers: {
                Accept:
                  "application/json",

                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        let result = null;

        try {
          result =
            await response.json();
        } catch {
          result = null;
        }

        if (!response.ok) {
          throw new Error(
            result?.message ||
              `Request failed with status ${response.status}`
          );
        }

        if (!result?.success) {
          throw new Error(
            result?.message ||
              "Unable to load activities."
          );
        }

        const activityData =
          result?.data?.activities;

        setActivities(
          Array.isArray(activityData)
            ? activityData
            : []
        );
      } catch (err) {
        console.error(
          "Activity Feed Error:",
          err
        );

        setError(
          err?.message ||
            "Unable to load activities."
        );

        setActivities([]);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <Card className="h-[330px] overflow-hidden">
      {/* Header */}

      <div
        className="
          flex
          h-[55px]
          items-center
          justify-between
          border-b
          border-[#DCE5ED]
          px-[14px]
        "
      >
        <h2
          className="
            text-[13px]
            font-bold
            tracking-[-0.1px]
            text-[#102F4A]
          "
        >
          Activity Feed
        </h2>

        <IconButton
          icon={SlidersHorizontal}
          label="Filter activity"
          size={14}
          className="
            h-6
            w-6
            rounded-[6px]
            text-[#60778B]
            hover:bg-[#F4F7FA]
          "
        />
      </div>

      {/* =====================================================
          LOADING
      ===================================================== */}

      {loading && (
        <div className="px-[14px] py-[12px]">
          {Array.from({
            length: 4,
          }).map((_, index) => (
            <div
              key={index}
              className="
                flex
                min-h-[58px]
                animate-pulse
              "
            >
              <div
                className="
                  h-[27px]
                  w-[27px]
                  shrink-0
                  rounded-full
                  bg-[#EEF2F6]
                "
              />

              <div className="ml-[10px] flex-1">
                <div
                  className="
                    h-[10px]
                    w-[80%]
                    rounded
                    bg-[#EEF2F6]
                  "
                />

                <div
                  className="
                    mt-[7px]
                    h-[8px]
                    w-[35%]
                    rounded
                    bg-[#F2F5F8]
                  "
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* =====================================================
          ERROR
      ===================================================== */}

      {!loading && error && (
        <div
          className="
            flex
            h-[274px]
            flex-col
            items-center
            justify-center
            px-4
            text-center
          "
        >
          <p
            className="
              text-[11px]
              font-semibold
              text-[#102F4A]
            "
          >
            Unable to load activity
          </p>

          <p
            className="
              mt-1
              max-w-[220px]
              text-[9px]
              font-medium
              text-[#8A99A7]
            "
          >
            {error}
          </p>

          <button
            type="button"
            onClick={fetchActivities}
            className="
              mt-3
              rounded-[7px]
              border
              border-[#D8E4EF]
              px-3
              py-2
              text-[9px]
              font-semibold
              text-[#315D80]
              transition
              hover:bg-[#F4F7FA]
            "
          >
            Retry
          </button>
        </div>
      )}

      {/* =====================================================
          EMPTY
      ===================================================== */}

      {!loading &&
        !error &&
        activities.length === 0 && (
          <div
            className="
              flex
              h-[274px]
              items-center
              justify-center
              px-4
              text-center
            "
          >
            <div>
              <p
                className="
                  text-[11px]
                  font-semibold
                  text-[#102F4A]
                "
              >
                No recent activity
              </p>

              <p
                className="
                  mt-1
                  text-[9px]
                  font-medium
                  text-[#8A99A7]
                "
              >
                Recent customer activities
                will appear here.
              </p>
            </div>
          </div>
        )}

      {/* =====================================================
          ACTIVITY LIST
      ===================================================== */}

      {!loading &&
        !error &&
        activities.length > 0 && (
          <div className="px-[14px] py-[12px]">
            {activities.map(
              (activity, index) => {
                const isLast =
                  index ===
                  activities.length - 1;

                return (
                  <div
                    key={
                      activity.id ||
                      `${activity.text}-${index}`
                    }
                    className="
                      relative
                      flex
                      min-h-[58px]
                    "
                  >
                    {/* Timeline */}

                    {!isLast && (
                      <div
                        className="
                          absolute
                          left-[13px]
                          top-[27px]
                          h-[45px]
                          w-px
                          bg-[#DCE5ED]
                        "
                      />
                    )}

                    {/* Avatar / System Icon */}

                    <div
                      className="
                        relative
                        z-10
                        shrink-0
                      "
                    >
                      {activity.type ===
                        "user" ? (
                        activity.avatar ? (
                          <Avatar
                            src={
                              activity.avatar
                            }
                            alt={
                              activity.name ||
                              "User"
                            }
                            size="sm"
                          />
                        ) : (
                          <div
                            className="
                              flex
                              h-[27px]
                              w-[27px]
                              items-center
                              justify-center
                              rounded-full
                              border
                              border-[#D8E4EF]
                              bg-[#EEF4FA]
                              text-[8px]
                              font-bold
                              text-[#315D80]
                            "
                          >
                            {getInitials(
                              activity.name
                            )}
                          </div>
                        )
                      ) : (
                        <div
                          className="
                            flex
                            h-[27px]
                            w-[27px]
                            items-center
                            justify-center
                            rounded-full
                            border
                            border-[#D8E4EF]
                            bg-[#EEF4FA]
                            text-[#315D80]
                          "
                        >
                          <Mail
                            size={12}
                            strokeWidth={
                              1.8
                            }
                          />
                        </div>
                      )}
                    </div>

                    {/* Content */}

                    <div
                      className="
                        ml-[10px]
                        min-w-0
                        pt-0
                      "
                    >
                      <p
                        className="
                          max-w-[200px]
                          text-[9px]
                          font-medium
                          leading-[13px]
                          text-[#28445D]
                        "
                      >
                        {activity.type ===
                          "user" &&
                          activity.name && (
                            <span className="font-bold">
                              {
                                activity.name
                              }{" "}
                            </span>
                          )}

                        {activity.text}
                      </p>

                      <p
                        className="
                          mt-[2px]
                          text-[8px]
                          font-medium
                          leading-[11px]
                          text-[#8A99A7]
                        "
                      >
                        {activity.time ||
                          "Just now"}
                      </p>
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

// =====================================================
// HELPERS
// =====================================================

const getInitials = (name) => {
  if (!name) {
    return "U";
  }

  const parts =
    name.trim().split(/\s+/);

  if (parts.length === 1) {
    return parts[0]
      .charAt(0)
      .toUpperCase();
  }

  return (
    parts[0].charAt(0) +
    parts[parts.length - 1].charAt(0)
  ).toUpperCase();
};

export default ActivityFeed;