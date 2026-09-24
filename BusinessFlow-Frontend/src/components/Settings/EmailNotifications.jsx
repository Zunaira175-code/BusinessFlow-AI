import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";

import { Check } from "lucide-react";

import Card from "../common/Card";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

/* =========================================================
   DEFAULT SETTINGS
========================================================= */

const DEFAULT_EMAIL = {
  newLead: true,
  newDeal: true,
  dealStage: true,
  taskAssignments: true,
  customerActivity: false,
  teamActivity: true,
  systemUpdates: true,
};

const DEFAULT_IN_APP = {
  leadActivity: true,
  dealActivity: true,
  customerUpdates: true,
  teamMentions: true,
  taskReminders: true,
};

const DEFAULT_SCHEDULE = {
  quietHours: false,
  startTime: "22:00",
  endTime: "07:00",
  timezone: "Asia/Karachi",
};

/* =========================================================
   TOKEN
========================================================= */

const getToken = () => {
  return (
    localStorage.getItem("businessflow_token") ||
    sessionStorage.getItem("businessflow_token")
  );
};

/* =========================================================
   COMPONENT
========================================================= */

const EmailNotifications = forwardRef((props, ref) => {
  /* =======================================================
     EMAIL NOTIFICATIONS
  ======================================================== */

  const [emailNotifications, setEmailNotifications] =
    useState(DEFAULT_EMAIL);

  const [savedEmailNotifications, setSavedEmailNotifications] =
    useState(DEFAULT_EMAIL);

  /* =======================================================
     IN-APP NOTIFICATIONS
  ======================================================== */

  const [inAppNotifications, setInAppNotifications] =
    useState(DEFAULT_IN_APP);

  const [savedInAppNotifications, setSavedInAppNotifications] =
    useState(DEFAULT_IN_APP);

  /* =======================================================
     NOTIFICATION SCHEDULE
  ======================================================== */

  const [schedule, setSchedule] =
    useState(DEFAULT_SCHEDULE);

  const [savedSchedule, setSavedSchedule] =
    useState(DEFAULT_SCHEDULE);

  /* =======================================================
     UI STATE
  ======================================================== */

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  /* =====================================================
     LOAD SETTINGS
  ====================================================== */

  useEffect(() => {
    const fetchNotificationSettings = async () => {
      try {
        setLoading(true);
        setError("");
        setSuccess("");

        const token = getToken();

        if (!token) {
          setError(
            "Authentication token not found. Please login again."
          );
          return;
        }

        const response = await fetch(
          `${API_BASE_URL}/api/settings/notifications`,
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
              "Failed to load notification settings."
          );
        }

        const preferences =
          result?.data?.notificationPreferences;

        if (!preferences) {
          throw new Error(
            "Notification settings were not returned."
          );
        }

        /* ===============================================
           EMAIL
        ================================================ */

        const loadedEmail = {
          newLead:
            preferences.email?.newLead ?? true,

          newDeal:
            preferences.email?.newDeal ?? true,

          dealStage:
            preferences.email?.dealStage ?? true,

          taskAssignments:
            preferences.email?.taskAssignments ?? true,

          customerActivity:
            preferences.email?.customerActivity ?? false,

          teamActivity:
            preferences.email?.teamActivity ?? true,

          systemUpdates:
            preferences.email?.systemUpdates ?? true,
        };

        /* ===============================================
           IN-APP
        ================================================ */

        const loadedInApp = {
          leadActivity:
            preferences.inApp?.leadActivity ?? true,

          dealActivity:
            preferences.inApp?.dealActivity ?? true,

          customerUpdates:
            preferences.inApp?.customerUpdates ?? true,

          teamMentions:
            preferences.inApp?.teamMentions ?? true,

          taskReminders:
            preferences.inApp?.taskReminders ?? true,
        };

        /* ===============================================
           SCHEDULE
        ================================================ */

        const loadedSchedule = {
          quietHours:
            preferences.schedule?.quietHours ?? false,

          startTime:
            preferences.schedule?.startTime ?? "22:00",

          endTime:
            preferences.schedule?.endTime ?? "07:00",

          timezone:
            preferences.schedule?.timezone ||
            "Asia/Karachi",
        };

        setEmailNotifications(loadedEmail);
        setSavedEmailNotifications(loadedEmail);

        setInAppNotifications(loadedInApp);
        setSavedInAppNotifications(loadedInApp);

        setSchedule(loadedSchedule);
        setSavedSchedule(loadedSchedule);
      } catch (err) {
        console.error(
          "Fetch Notification Settings Error:",
          err
        );

        setError(
          err.message ||
            "Unable to load notification settings."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchNotificationSettings();
  }, []);

  /* =====================================================
     TOGGLE EMAIL
  ====================================================== */

  const toggleEmail = (key) => {
    setEmailNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));

    setError("");
    setSuccess("");
  };

  /* =====================================================
     TOGGLE IN-APP
  ====================================================== */

  const toggleInApp = (key) => {
    setInAppNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));

    setError("");
    setSuccess("");
  };

  /* =====================================================
     TOGGLE QUIET HOURS
  ====================================================== */

  const toggleQuietHours = () => {
    setSchedule((prev) => ({
      ...prev,
      quietHours: !prev.quietHours,
    }));

    setError("");
    setSuccess("");
  };

  /* =====================================================
     DATA
  ====================================================== */

  const emailItems = [
    {
      key: "newLead",
      title: "New Lead Received",
      description:
        "When a new lead enters the pipeline",
    },
    {
      key: "newDeal",
      title: "New Deal Created",
      description:
        "When a deal is added to your account",
    },
    {
      key: "dealStage",
      title: "Deal Stage Changes",
      description:
        "When a deal moves to a new stage",
    },
    {
      key: "taskAssignments",
      title: "Task Assignments",
      description:
        "When you are assigned a new task",
    },
    {
      key: "customerActivity",
      title: "Customer Activity",
      description:
        "When a customer interacts with your content",
    },
    {
      key: "teamActivity",
      title: "Team Activity",
      description:
        "Updates from your team members",
    },
    {
      key: "systemUpdates",
      title: "System Updates",
      description:
        "Product news and maintenance alerts",
    },
  ];

  const inAppItems = [
    {
      key: "leadActivity",
      title: "Lead Activity",
      description:
        "Real-time alerts for new leads",
    },
    {
      key: "dealActivity",
      title: "Deal Activity",
      description:
        "Real-time alerts for deal progress",
    },
    {
      key: "customerUpdates",
      title: "Customer Updates",
      description:
        "Real-time alerts for customer actions",
    },
    {
      key: "teamMentions",
      title: "Team Mentions",
      description:
        "When you are @mentioned in comments",
    },
    {
      key: "taskReminders",
      title: "Task Reminders",
      description:
        "Alerts for upcoming or overdue tasks",
    },
  ];

  /* =====================================================
     TOGGLE COMPONENT
  ====================================================== */

  const Toggle = ({
    enabled,
    onClick,
    label,
    disabled = false,
  }) => {
    return (
      <button
        type="button"
        aria-label={label}
        aria-pressed={enabled}
        onClick={onClick}
        disabled={disabled}
        className={`
          relative
          h-[18px]
          w-[32px]
          shrink-0
          rounded-full
          transition-colors
          duration-200
          disabled:cursor-not-allowed
          disabled:opacity-60
          ${
            enabled
              ? "bg-[#0B3D6B]"
              : "bg-[#D5DEE7]"
          }
        `}
      >
        <span
          className={`
            absolute
            top-[2px]
            flex
            h-[14px]
            w-[14px]
            items-center
            justify-center
            rounded-full
            bg-white
            shadow-sm
            transition-transform
            duration-200
            ${
              enabled
                ? "translate-x-[16px]"
                : "translate-x-[2px]"
            }
          `}
        >
          {enabled && (
            <Check
              size={9}
              strokeWidth={3}
              className="text-[#2563EB]"
            />
          )}
        </span>
      </button>
    );
  };

  /* =====================================================
     NOTIFICATION ROW
  ====================================================== */

  const NotificationRow = ({
    item,
    enabled,
    onToggle,
    isLast,
  }) => {
    return (
      <div
        className={`
          flex
          min-h-[54px]
          items-center
          justify-between
          gap-4
          px-4
          py-2.5
          ${
            !isLast
              ? "border-b border-dashed border-[#DCE5ED]"
              : ""
          }
        `}
      >
        <div className="min-w-0">
          <h3
            className="
              text-[10px]
              font-semibold
              leading-[14px]
              text-[#17324D]
            "
          >
            {item.title}
          </h3>

          <p
            className="
              mt-[2px]
              text-[8px]
              leading-[11px]
              text-[#8A9AAA]
            "
          >
            {item.description}
          </p>
        </div>

        <Toggle
          enabled={enabled}
          onClick={onToggle}
          label={`Toggle ${item.title}`}
          disabled={saving}
        />
      </div>
    );
  };

  /* =====================================================
     SAVE SETTINGS
  ====================================================== */

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const token = getToken();

      if (!token) {
        setError(
          "Authentication token not found. Please login again."
        );
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/api/settings/notifications`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          body: JSON.stringify({
            email: emailNotifications,
            inApp: inAppNotifications,
            schedule,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Failed to save notification settings."
        );
      }

      const saved =
        result?.data?.notificationPreferences;

      if (saved) {
        const updatedEmail = {
          newLead:
            saved.email?.newLead ?? true,

          newDeal:
            saved.email?.newDeal ?? true,

          dealStage:
            saved.email?.dealStage ?? true,

          taskAssignments:
            saved.email?.taskAssignments ?? true,

          customerActivity:
            saved.email?.customerActivity ?? false,

          teamActivity:
            saved.email?.teamActivity ?? true,

          systemUpdates:
            saved.email?.systemUpdates ?? true,
        };

        const updatedInApp = {
          leadActivity:
            saved.inApp?.leadActivity ?? true,

          dealActivity:
            saved.inApp?.dealActivity ?? true,

          customerUpdates:
            saved.inApp?.customerUpdates ?? true,

          teamMentions:
            saved.inApp?.teamMentions ?? true,

          taskReminders:
            saved.inApp?.taskReminders ?? true,
        };

        const updatedSchedule = {
          quietHours:
            saved.schedule?.quietHours ?? false,

          startTime:
            saved.schedule?.startTime ?? "22:00",

          endTime:
            saved.schedule?.endTime ?? "07:00",

          timezone:
            saved.schedule?.timezone ||
            "Asia/Karachi",
        };

        setEmailNotifications(updatedEmail);
        setSavedEmailNotifications(updatedEmail);

        setInAppNotifications(updatedInApp);
        setSavedInAppNotifications(updatedInApp);

        setSchedule(updatedSchedule);
        setSavedSchedule(updatedSchedule);
      } else {
        setSavedEmailNotifications(
          emailNotifications
        );

        setSavedInAppNotifications(
          inAppNotifications
        );

        setSavedSchedule(schedule);
      }

      setSuccess(
        "Notification settings updated successfully."
      );
    } catch (err) {
      console.error(
        "Save Notification Settings Error:",
        err
      );

      setError(
        err.message ||
          "Unable to save notification settings."
      );
    } finally {
      setSaving(false);
    }
  };

  /* =====================================================
     CANCEL SETTINGS
  ====================================================== */

  const handleCancel = () => {
    setEmailNotifications(
      savedEmailNotifications
    );

    setInAppNotifications(
      savedInAppNotifications
    );

    setSchedule(savedSchedule);

    setError("");
    setSuccess("");
  };

  /* =====================================================
     EXPOSE SAVE / CANCEL TO PARENT
  ====================================================== */

  useImperativeHandle(ref, () => ({
    saveSettings: handleSave,
    cancelSettings: handleCancel,
  }));

  /* =====================================================
     FORMAT TIME
  ====================================================== */

  const formatTime = (time) => {
    if (!time) return "";

    const [hours, minutes] = time.split(":");

    const hourNumber = Number(hours);

    if (
      Number.isNaN(hourNumber) ||
      !minutes
    ) {
      return time;
    }

    const period =
      hourNumber >= 12 ? "PM" : "AM";

    const displayHour =
      hourNumber % 12 || 12;

    return `${String(displayHour).padStart(
      2,
      "0"
    )}:${minutes} ${period}`;
  };

  /* =====================================================
     LOADING
  ====================================================== */

  if (loading) {
    return (
      <div className="mt-4 w-full pb-8">
        <Card className="flex min-h-[250px] w-full items-center justify-center">
          <p className="text-[10px] text-[#8495A5]">
            Loading notification settings...
          </p>
        </Card>
      </div>
    );
  }

  /* =====================================================
     UI
  ====================================================== */

  return (
    <div className="mt-4 w-full pb-8">

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
          SUCCESS
      ================================================== */}

      {success && (
        <div
          className="
            mb-3
            rounded-[6px]
            border
            border-green-200
            bg-green-50
            px-3
            py-2
            text-[9px]
            font-medium
            text-green-600
          "
        >
          {success}
        </div>
      )}

      {/* =================================================
          EMAIL NOTIFICATIONS
      ================================================== */}

      <Card className="w-full overflow-hidden">

        <div
          className="
            border-b
            border-[#DCE5ED]
            px-4
            py-3
          "
        >
          <h2
            className="
              text-[13px]
              font-bold
              text-[#17324D]
            "
          >
            Email Notifications
          </h2>

          <p
            className="
              mt-1
              text-[8px]
              leading-[12px]
              text-[#7B8D9E]
            "
          >
            Select which updates you want to receive via email.
          </p>
        </div>

        <div>
          {emailItems.map((item, index) => (
            <NotificationRow
              key={item.key}
              item={item}
              enabled={
                emailNotifications[item.key]
              }
              onToggle={() =>
                toggleEmail(item.key)
              }
              isLast={
                index ===
                emailItems.length - 1
              }
            />
          ))}
        </div>
      </Card>

      {/* =================================================
          IN-APP NOTIFICATIONS
      ================================================== */}

      <Card className="mt-4 w-full overflow-hidden">

        <div
          className="
            border-b
            border-[#DCE5ED]
            px-4
            py-3
          "
        >
          <h2
            className="
              text-[13px]
              font-bold
              text-[#17324D]
            "
          >
            In-App Notifications
          </h2>

          <p
            className="
              mt-1
              text-[8px]
              leading-[12px]
              text-[#7B8D9E]
            "
          >
            Control which alerts appear within the application dashboard.
          </p>
        </div>

        <div>
          {inAppItems.map((item, index) => (
            <NotificationRow
              key={item.key}
              item={item}
              enabled={
                inAppNotifications[item.key]
              }
              onToggle={() =>
                toggleInApp(item.key)
              }
              isLast={
                index ===
                inAppItems.length - 1
              }
            />
          ))}
        </div>
      </Card>

      {/* =================================================
          NOTIFICATION SCHEDULE
      ================================================== */}

      <Card className="mt-4 w-full overflow-hidden">

        <div
          className="
            border-b
            border-[#DCE5ED]
            px-4
            py-3
          "
        >
          <h2
            className="
              text-[13px]
              font-bold
              text-[#17324D]
            "
          >
            Notification Schedule
          </h2>

          <p
            className="
              mt-1
              text-[8px]
              leading-[12px]
              text-[#7B8D9E]
            "
          >
            Configure when you want to receive alerts to maintain focus.
          </p>
        </div>

        <div className="px-4 py-3">

          {/* Quiet Hours */}

          <div
            className="
              flex
              items-center
              justify-between
            "
          >
            <div>
              <h3
                className="
                  text-[10px]
                  font-semibold
                  text-[#17324D]
                "
              >
                Quiet Hours
              </h3>

              <p
                className="
                  mt-[2px]
                  text-[8px]
                  text-[#8A9AAA]
                "
              >
                Pause notifications during specific times
              </p>
            </div>

            <Toggle
              enabled={schedule.quietHours}
              onClick={toggleQuietHours}
              label="Toggle quiet hours"
              disabled={saving}
            />
          </div>

          {/* Time Inputs */}

          <div className="mt-4 grid grid-cols-2 gap-3">

            {/* Start Time */}

            <div>
              <label
                className="
                  mb-1.5
                  block
                  text-[9px]
                  font-semibold
                  text-[#17324D]
                "
              >
                Start Time
              </label>

              <input
                type="time"
                value={schedule.startTime}
                onChange={(e) => {
                  setSchedule((prev) => ({
                    ...prev,
                    startTime:
                      e.target.value,
                  }));

                  setError("");
                  setSuccess("");
                }}
                disabled={saving}
                className="
                  h-[34px]
                  w-full
                  rounded-[6px]
                  border
                  border-[#DCE5ED]
                  bg-white
                  px-3
                  text-[9px]
                  text-[#60758A]
                  outline-none
                  transition-colors
                  focus:border-[#8BA9C2]
                  disabled:cursor-not-allowed
                  disabled:bg-[#F7F9FC]
                "
              />

              <p className="mt-1 text-[7px] text-[#8495A5]">
                {formatTime(schedule.startTime)}
              </p>
            </div>

            {/* End Time */}

            <div>
              <label
                className="
                  mb-1.5
                  block
                  text-[9px]
                  font-semibold
                  text-[#17324D]
                "
              >
                End Time
              </label>

              <input
                type="time"
                value={schedule.endTime}
                onChange={(e) => {
                  setSchedule((prev) => ({
                    ...prev,
                    endTime:
                      e.target.value,
                  }));

                  setError("");
                  setSuccess("");
                }}
                disabled={saving}
                className="
                  h-[34px]
                  w-full
                  rounded-[6px]
                  border
                  border-[#DCE5ED]
                  bg-white
                  px-3
                  text-[9px]
                  text-[#60758A]
                  outline-none
                  transition-colors
                  focus:border-[#8BA9C2]
                  disabled:cursor-not-allowed
                  disabled:bg-[#F7F9FC]
                "
              />

              <p className="mt-1 text-[7px] text-[#8495A5]">
                {formatTime(schedule.endTime)}
              </p>
            </div>
          </div>

          {/* Timezone */}

          <div className="mt-3">
            <label
              className="
                mb-1.5
                block
                text-[9px]
                font-semibold
                text-[#17324D]
              "
            >
              Timezone
            </label>

            <select
              value={schedule.timezone}
              onChange={(e) => {
                setSchedule((prev) => ({
                  ...prev,
                  timezone:
                    e.target.value,
                }));

                setError("");
                setSuccess("");
              }}
              disabled={saving}
              className="
                h-[34px]
                w-full
                appearance-none
                rounded-[6px]
                border
                border-[#DCE5ED]
                bg-white
                px-3
                text-[9px]
                text-[#60758A]
                outline-none
                focus:border-[#8BA9C2]
                disabled:cursor-not-allowed
                disabled:bg-[#F7F9FC]
              "
            >
              <option value="Asia/Karachi">
                UTC+05:00 Islamabad, Karachi
              </option>

              <option value="UTC">
                UTC+00:00 London
              </option>

              <option value="America/New_York">
                UTC-05:00 Eastern Time
              </option>

              <option value="America/Los_Angeles">
                UTC-08:00 Pacific Time
              </option>

              <option value="Europe/Berlin">
                UTC+01:00 Central European Time
              </option>
            </select>
          </div>
        </div>
      </Card>
    </div>
  );
});

EmailNotifications.displayName =
  "EmailNotifications";

export default EmailNotifications;