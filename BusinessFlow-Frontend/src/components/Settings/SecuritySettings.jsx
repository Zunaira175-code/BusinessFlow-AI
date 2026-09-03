import { useState } from "react";

import {
  Monitor,
  Laptop,
  Smartphone,
  ChevronDown,
  Check,
  Eye,
  EyeOff,
} from "lucide-react";

import Card from "../common/Card";
import Button from "../common/button";

/* =========================================================
   PASSWORD FIELD
========================================================= */

const PasswordField = ({
  label,
  value,
  onChange,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="mb-3 w-[70%] max-w-[360px]">
      <label
        className="
          mb-1.5
          block
          text-[9px]
          font-semibold
          text-[#17324D]
        "
      >
        {label}
      </label>

      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="••••••••"
          className="
            h-[32px]
            w-full
            rounded-[6px]
            border
            border-[#DCE5ED]
            bg-white
            px-3
            pr-9
            text-[10px]
            text-[#29465F]
            outline-none
            placeholder:text-[#7E8D9D]
            focus:border-[#8DA9C0]
          "
        />

        <button
          type="button"
          onClick={() =>
            setShowPassword((prev) => !prev)
          }
          aria-label={
            showPassword
              ? `Hide ${label}`
              : `Show ${label}`
          }
          className="
            absolute
            right-2
            top-1/2
            flex
            h-6
            w-6
            -translate-y-1/2
            items-center
            justify-center
            rounded-[4px]
            text-[#718599]
            transition-colors
            hover:bg-[#F3F6F9]
            hover:text-[#17324D]
          "
        >
          {showPassword ? (
            <EyeOff
              size={13}
              strokeWidth={1.8}
            />
          ) : (
            <Eye
              size={13}
              strokeWidth={1.8}
            />
          )}
        </button>
      </div>
    </div>
  );
};


/* =========================================================
   SESSION ROW
========================================================= */

const SessionRow = ({
  icon: Icon,
  title,
  location,
  action,
  current = false,
  onAction,
  last = false,
}) => {
  return (
    <div
      className={`
        flex
        min-h-[52px]
        items-center
        justify-between
        gap-4
        px-4
        py-2.5
        ${!last ? "border-b border-[#E2E9EF]" : ""}
      `}
    >
      {/* Left */}
      <div className="flex min-w-0 items-center gap-3">

        {/* Icon */}
        <div
          className="
            flex
            h-[25px]
            w-[25px]
            shrink-0
            items-center
            justify-center
          "
        >
          <Icon
            size={16}
            strokeWidth={1.6}
            className="text-[#718599]"
          />
        </div>

        {/* Information */}
        <div className="min-w-0">
          <p
            className="
              truncate
              text-[9px]
              font-semibold
              text-[#17324D]
            "
          >
            {title}
          </p>

          <p
            className="
              mt-[2px]
              truncate
              text-[8px]
              text-[#8A9AAA]
            "
          >
            {location}
          </p>
        </div>
      </div>

      {/* Action */}
      {current ? (
        <span
          className="
            shrink-0
            text-[8px]
            font-semibold
            text-[#20A65A]
          "
        >
          {action}
        </span>
      ) : (
        <button
          type="button"
          onClick={onAction}
          className="
            shrink-0
            text-[8px]
            font-semibold
            text-[#EF4444]
            transition-colors
            hover:text-[#C62828]
          "
        >
          {action}
        </button>
      )}
    </div>
  );
};


/* =========================================================
   SECURITY TOGGLE ROW
========================================================= */

const SecurityToggleRow = ({
  title,
  description,
  enabled,
  onToggle,
}) => {
  return (
    <div
      className="
        flex
        min-h-[42px]
        items-center
        justify-between
        gap-4
      "
    >
      <div className="min-w-0">
        <p
          className="
            text-[9px]
            font-semibold
            text-[#17324D]
          "
        >
          {title}
        </p>

        <p
          className="
            mt-[2px]
            text-[8px]
            text-[#8A9AAA]
          "
        >
          {description}
        </p>
      </div>

      <Toggle
        enabled={enabled}
        onClick={onToggle}
        label={`Toggle ${title}`}
      />
    </div>
  );
};


/* =========================================================
   TOGGLE
========================================================= */

const Toggle = ({
  enabled,
  onClick,
  label,
}) => {
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


/* =========================================================
   SECURITY SETTINGS
========================================================= */

const SecuritySettings = () => {

  /* =====================================================
     PASSWORD
  ====================================================== */

  const [passwords, setPasswords] = useState({
    current: "",
    newPassword: "",
    confirm: "",
  });


  /* =====================================================
     LOGIN SECURITY
  ====================================================== */

  const [loginSecurity, setLoginSecurity] = useState({
    loginAlerts: true,
    suspiciousDetection: true,
    sessionTimeout: "30 minutes",
  });


  /* =====================================================
     PASSWORD HANDLER
  ====================================================== */

  const handlePasswordChange = (
    field,
    value
  ) => {
    setPasswords((prev) => ({
      ...prev,
      [field]: value,
    }));
  };


  /* =====================================================
     LOGIN SECURITY TOGGLE
  ====================================================== */

  const toggleSecurity = (field) => {
    setLoginSecurity((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };


  /* =====================================================
     CHANGE PASSWORD
  ====================================================== */

  const handleChangePassword = () => {
    console.log(
      "Password change requested",
      passwords
    );
  };


  /* =====================================================
     SIGN OUT SESSION
  ====================================================== */

  const handleSignOut = (device) => {
    console.log("Sign out:", device);
  };


  /* =====================================================
     UI
  ====================================================== */

  return (
    <div className="mt-4 w-full pb-8">

      {/* =================================================
          PASSWORD & AUTHENTICATION
      ================================================== */}

      <Card className="w-full overflow-hidden">

        {/* Header */}
        <div className="px-4 pt-4">
          <h2
            className="
              text-[13px]
              font-bold
              text-[#17324D]
            "
          >
            Password & Authentication
          </h2>
        </div>

        {/* Password Fields */}
        <div className="px-4 pb-4 pt-4">

          {/* Current Password */}
          <PasswordField
            label="Current Password"
            value={passwords.current}
            onChange={(value) =>
              handlePasswordChange(
                "current",
                value
              )
            }
          />

          {/* New Password */}
          <PasswordField
            label="New Password"
            value={passwords.newPassword}
            onChange={(value) =>
              handlePasswordChange(
                "newPassword",
                value
              )
            }
          />

          {/* Confirm Password */}
          <PasswordField
            label="Confirm New Password"
            value={passwords.confirm}
            onChange={(value) =>
              handlePasswordChange(
                "confirm",
                value
              )
            }
          />

          {/* Change Password */}
          <Button
            type="button"
            onClick={handleChangePassword}
            className="
              mt-2
              h-[30px]
              rounded-[6px]
              bg-[#0B3D6B]
              px-3
              text-[9px]
              font-semibold
              text-white
              shadow-none
              hover:bg-[#092F54]
            "
          >
            Change Password
          </Button>

        </div>
      </Card>


      {/* =================================================
          TWO FACTOR AUTHENTICATION
      ================================================== */}

      <Card className="mt-4 w-full">

        <div
          className="
            flex
            min-h-[62px]
            items-center
            justify-between
            gap-4
            px-4
            py-3
          "
        >

          {/* Text */}
          <div className="min-w-0">

            <h2
              className="
                text-[13px]
                font-bold
                text-[#17324D]
              "
            >
              Two-Factor Authentication
            </h2>

            <p
              className="
                mt-1
                text-[8px]
                leading-[12px]
                text-[#8495A5]
              "
            >
              Protect your account with an additional
              verification step when signing in.
            </p>

          </div>


          {/* Right */}
          <div
            className="
              flex
              shrink-0
              items-center
              gap-3
            "
          >

            {/* Enabled */}
            <span
              className="
                flex
                items-center
                gap-1
                rounded-full
                bg-[#E8F8EF]
                px-2
                py-1
                text-[8px]
                font-semibold
                text-[#20A65A]
              "
            >
              <span
                className="
                  h-[5px]
                  w-[5px]
                  rounded-full
                  bg-[#20A65A]
                "
              />

              Enabled
            </span>


            {/* Configure */}
            <button
              type="button"
              className="
                text-[8px]
                font-semibold
                text-[#079BEA]
                transition-colors
                hover:text-[#0B3D6B]
              "
            >
              Configure
            </button>

          </div>
        </div>

      </Card>


      {/* =================================================
          ACTIVE SESSIONS
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
            Active Sessions
          </h2>

          <p
            className="
              mt-1
              text-[8px]
              leading-[12px]
              text-[#8495A5]
            "
          >
            Manage devices currently logged into your account.
          </p>
        </div>


        {/* Windows */}
        <SessionRow
          icon={Monitor}
          title="Windows PC — Chrome"
          location="Pakistan — Active now"
          action="Current"
          current
        />


        {/* MacBook */}
        <SessionRow
          icon={Laptop}
          title="MacBook Pro — Safari"
          location="Pakistan — 2 hours ago"
          action="Sign Out"
          onAction={() =>
            handleSignOut(
              "MacBook Pro — Safari"
            )
          }
        />


        {/* iPhone */}
        <SessionRow
          icon={Smartphone}
          title="iPhone — Mobile Browser"
          location="Pakistan — Yesterday"
          action="Sign Out"
          onAction={() =>
            handleSignOut(
              "iPhone — Mobile Browser"
            )
          }
          last
        />

      </Card>


      {/* =================================================
          LOGIN SECURITY
      ================================================== */}

      <Card className="mt-4 w-full overflow-hidden">

        {/* Header */}
        <div className="px-4 pt-4">
          <h2
            className="
              text-[13px]
              font-bold
              text-[#17324D]
            "
          >
            Login Security
          </h2>
        </div>


        <div className="px-4 pb-4 pt-3">

          {/* Login Alerts */}
          <SecurityToggleRow
            title="Login alerts"
            description="Get notified of logins from new devices."
            enabled={
              loginSecurity.loginAlerts
            }
            onToggle={() =>
              toggleSecurity("loginAlerts")
            }
          />


          {/* Suspicious Login */}
          <SecurityToggleRow
            title="Suspicious login detection"
            description="AI-powered analysis of login patterns."
            enabled={
              loginSecurity.suspiciousDetection
            }
            onToggle={() =>
              toggleSecurity(
                "suspiciousDetection"
              )
            }
          />


          {/* Divider */}
          <div
            className="
              my-3
              h-px
              w-full
              bg-[#DCE5ED]
            "
          />


          {/* Session Timeout */}
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
              Session timeout
            </label>


            <div className="relative w-[245px]">

              <select
                value={
                  loginSecurity.sessionTimeout
                }
                onChange={(e) =>
                  setLoginSecurity((prev) => ({
                    ...prev,
                    sessionTimeout:
                      e.target.value,
                  }))
                }
                className="
                  h-[32px]
                  w-full
                  appearance-none
                  rounded-[6px]
                  border
                  border-[#DCE5ED]
                  bg-white
                  px-3
                  pr-8
                  text-[9px]
                  text-[#29465F]
                  outline-none
                  focus:border-[#8DA9C0]
                "
              >
                <option>
                  15 minutes
                </option>

                <option>
                  30 minutes
                </option>

                <option>
                  1 hour
                </option>

                <option>
                  2 hours
                </option>

                <option>
                  4 hours
                </option>

              </select>


              <ChevronDown
                size={12}
                strokeWidth={1.8}
                className="
                  pointer-events-none
                  absolute
                  right-2.5
                  top-1/2
                  -translate-y-1/2
                  text-[#657C90]
                "
              />

            </div>

          </div>

        </div>

      </Card>

    </div>
  );
};


/* =========================================================
   ONLY DEFAULT EXPORT
========================================================= */

export default SecuritySettings;