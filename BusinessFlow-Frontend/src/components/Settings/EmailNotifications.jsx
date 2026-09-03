import { useState } from "react";
import { Check } from "lucide-react";

import Card from "../common/Card";

const EmailNotifications = () => {
  /* =====================================================
     EMAIL NOTIFICATIONS
  ====================================================== */

  const [emailNotifications, setEmailNotifications] = useState({
    newLead: true,
    newDeal: true,
    dealStage: true,
    taskAssignments: true,
    customerActivity: false,
    teamActivity: true,
    systemUpdates: true,
  });

  /* =====================================================
     IN-APP NOTIFICATIONS
  ====================================================== */

  const [inAppNotifications, setInAppNotifications] = useState({
    leadActivity: true,
    dealActivity: true,
    customerUpdates: true,
    teamMentions: true,
    taskReminders: true,
  });

  /* =====================================================
     NOTIFICATION SCHEDULE
  ====================================================== */

  const [schedule, setSchedule] = useState({
    quietHours: false,
    startTime: "10:00 PM",
    endTime: "07:00 AM",
    timezone: "UTC+05:00 Islamabad, Karachi",
  });

  /* =====================================================
     TOGGLE HANDLERS
  ====================================================== */

  const toggleEmail = (key) => {
    setEmailNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const toggleInApp = (key) => {
    setInAppNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const toggleQuietHours = () => {
    setSchedule((prev) => ({
      ...prev,
      quietHours: !prev.quietHours,
    }));
  };

  /* =====================================================
     DATA
  ====================================================== */

  const emailItems = [
    {
      key: "newLead",
      title: "New Lead Received",
      description: "When a new lead enters the pipeline",
    },
    {
      key: "newDeal",
      title: "New Deal Created",
      description: "When a deal is added to your account",
    },
    {
      key: "dealStage",
      title: "Deal Stage Changes",
      description: "When a deal moves to a new stage",
    },
    {
      key: "taskAssignments",
      title: "Task Assignments",
      description: "When you are assigned a new task",
    },
    {
      key: "customerActivity",
      title: "Customer Activity",
      description: "When a customer interacts with your content",
    },
    {
      key: "teamActivity",
      title: "Team Activity",
      description: "Updates from your team members",
    },
    {
      key: "systemUpdates",
      title: "System Updates",
      description: "Product news and maintenance alerts",
    },
  ];

  const inAppItems = [
    {
      key: "leadActivity",
      title: "Lead Activity",
      description: "Real-time alerts for new leads",
    },
    {
      key: "dealActivity",
      title: "Deal Activity",
      description: "Real-time alerts for deal progress",
    },
    {
      key: "customerUpdates",
      title: "Customer Updates",
      description: "Real-time alerts for customer actions",
    },
    {
      key: "teamMentions",
      title: "Team Mentions",
      description: "When you are @mentioned in comments",
    },
    {
      key: "taskReminders",
      title: "Task Reminders",
      description: "Alerts for upcoming or overdue tasks",
    },
  ];

  /* =====================================================
     TOGGLE COMPONENT
  ====================================================== */

  const Toggle = ({ enabled, onClick, label }) => {
    return (
      <button
        type="button"
        aria-label={label}
        aria-pressed={enabled}
        onClick={onClick}
        className={`
          relative
          h-[18px]
          w-[32px]
          shrink-0
          rounded-full
          transition-colors
          duration-200
          ${
            enabled
              ? "bg-[#0B3D6B]"
              : "bg-[#D5DEE7]"
          }
        `}
      >
        {/* Toggle Circle */}
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
        {/* Text */}
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

        {/* Toggle */}
        <Toggle
          enabled={enabled}
          onClick={onToggle}
          label={`Toggle ${item.title}`}
        />
      </div>
    );
  };

  /* =====================================================
     SAVE
  ====================================================== */

  const handleSave = () => {
    console.log("Notification settings saved:", {
      emailNotifications,
      inAppNotifications,
      schedule,
    });
  };

  /* =====================================================
     CANCEL
  ====================================================== */

  const handleCancel = () => {
    window.location.reload();
  };

  return (
    <div className="mt-4 w-full pb-8">
      {/* =================================================
          EMAIL NOTIFICATIONS
      ================================================== */}

      <Card className="w-full overflow-hidden">
        {/* Header */}
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

        {/* Items */}
        <div>
          {emailItems.map((item, index) => (
            <NotificationRow
              key={item.key}
              item={item}
              enabled={emailNotifications[item.key]}
              onToggle={() => toggleEmail(item.key)}
              isLast={index === emailItems.length - 1}
            />
          ))}
        </div>
      </Card>

      {/* =================================================
          IN-APP NOTIFICATIONS
      ================================================== */}

      <Card className="mt-4 w-full overflow-hidden">
        {/* Header */}
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

        {/* Items */}
        <div>
          {inAppItems.map((item, index) => (
            <NotificationRow
              key={item.key}
              item={item}
              enabled={inAppNotifications[item.key]}
              onToggle={() => toggleInApp(item.key)}
              isLast={index === inAppItems.length - 1}
            />
          ))}
        </div>
      </Card>

      {/* =================================================
          NOTIFICATION SCHEDULE
      ================================================== */}

      <Card className="mt-4 w-full overflow-hidden">
        {/* Header */}
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

        {/* Schedule Content */}
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
                type="text"
                value={schedule.startTime}
                onChange={(e) =>
                  setSchedule((prev) => ({
                    ...prev,
                    startTime: e.target.value,
                  }))
                }
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
                "
              />
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
                type="text"
                value={schedule.endTime}
                onChange={(e) =>
                  setSchedule((prev) => ({
                    ...prev,
                    endTime: e.target.value,
                  }))
                }
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
                "
              />
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
              onChange={(e) =>
                setSchedule((prev) => ({
                  ...prev,
                  timezone: e.target.value,
                }))
              }
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
              "
            >
              <option>
                UTC+05:00 Islamabad, Karachi
              </option>

              <option>
                UTC+00:00 London
              </option>

              <option>
                UTC-05:00 Eastern Time
              </option>

              <option>
                UTC-08:00 Pacific Time
              </option>
            </select>
          </div>
        </div>
      </Card>

     
    </div>
  );
};

export default EmailNotifications;