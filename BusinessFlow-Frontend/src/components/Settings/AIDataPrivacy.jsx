import { useState } from "react";
import {
  ShieldCheck,
  Info,
} from "lucide-react";

import Card from "../common/Card";

const AIDataPrivacy = () => {
  const [settings, setSettings] = useState({
    workspaceData: true,
    activityLogging: true,
  });

  const toggleSetting = (key) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <Card className="mt-4 w-full overflow-hidden">

      {/* =================================================
          HEADER
      ================================================== */}

      <div
        className="
          flex
          items-center
          gap-2
          border-b
          border-[#DCE5ED]
          px-4
          py-3
        "
      >
        <ShieldCheck
          size={14}
          strokeWidth={1.8}
          className="text-[#173B5C]"
        />

        <h2
          className="
            text-[13px]
            font-bold
            text-[#17324D]
          "
        >
          AI Data & Privacy
        </h2>
      </div>


      {/* =================================================
          SETTINGS
      ================================================== */}

      <div className="px-4 py-3">

        {/* =================================================
            WORKSPACE DATA
        ================================================== */}

        <PrivacyToggleRow
          title="Use Workspace Data for AI"
          description="Allow AI models to learn from your organization's anonymized CRM patterns."
          enabled={settings.workspaceData}
          onToggle={() => toggleSetting("workspaceData")}
        />


        {/* Divider */}

        <div className="my-3 h-px w-full bg-[#E2E9EF]" />


        {/* =================================================
            ACTIVITY LOGGING
        ================================================== */}

        <PrivacyToggleRow
          title="AI Activity Logging"
          description="Keep an audit trail of actions taken or suggested by the AI."
          enabled={settings.activityLogging}
          onToggle={() => toggleSetting("activityLogging")}
        />


        {/* =================================================
            PRIVACY INFO BOX
        ================================================== */}

        <div
          className="
            mt-3
            flex
            items-start
            gap-2
            rounded-[5px]
            border
            border-[#CFE2FF]
            bg-[#EEF6FF]
            px-3
            py-2.5
          "
        >

          {/* Info Icon */}

          <Info
            size={13}
            strokeWidth={2}
            className="
              mt-[1px]
              shrink-0
              text-[#1683D8]
            "
          />


          {/* Text */}

          <p
            className="
              text-[8px]
              leading-[12px]
              text-[#526B82]
            "
          >
            Your workspace data remains protected according to your
            organization's security settings. BusinessFlow AI does not
            use your private customer data to train public models.
          </p>

        </div>

      </div>

    </Card>
  );
};


/* =========================================================
   PRIVACY TOGGLE ROW
========================================================= */

const PrivacyToggleRow = ({
  title,
  description,
  enabled,
  onToggle,
}) => {
  return (
    <div
      className="
        flex
        min-h-[50px]
        items-center
        justify-between
        gap-4
      "
    >

      {/* =================================================
          CONTENT
      ================================================== */}

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
            mt-1
            max-w-[620px]
            text-[8px]
            leading-[12px]
            text-[#718599]
          "
        >
          {description}
        </p>

      </div>


      {/* =================================================
          TOGGLE
      ================================================== */}

      <button
        type="button"
        aria-label={`Toggle ${title}`}
        aria-pressed={enabled}
        onClick={onToggle}
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
            <span
              className="
                text-[8px]
                font-bold
                text-[#2563EB]
              "
            >
              ✓
            </span>
          )}

        </span>

      </button>

    </div>
  );
};

export default AIDataPrivacy;