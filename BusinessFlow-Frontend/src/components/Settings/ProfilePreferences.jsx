import { useState } from "react";
import { ChevronDown } from "lucide-react";

import Card from "../common/Card";

const ProfilePreferences = () => {
  const [preferences, setPreferences] = useState({
    timezone: "(GMT-08:00) Pacific Time (US & Canada)",
    language: "English (United States)",
    dateFormat: "MM/DD/YYYY",
  });

  const handleChange = (field, value) => {
    setPreferences((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Card className="mt-4 w-full overflow-hidden">

      {/* =================================================
          HEADER
      ================================================== */}

      <div className="px-4 pt-4">
        <h2 className="text-[13px] font-bold text-[#17324D]">
          Profile Preferences
        </h2>
      </div>


      {/* =================================================
          CONTENT
      ================================================== */}

      <div className="px-4 pb-4 pt-4">

        {/* =================================================
            TIMEZONE + LANGUAGE
        ================================================== */}

        <div className="grid grid-cols-2 gap-4">

          {/* Timezone */}

          <SelectField
            label="Timezone"
            value={preferences.timezone}
            onChange={(value) =>
              handleChange("timezone", value)
            }
            options={[
              "(GMT-08:00) Pacific Time (US & Canada)",
              "(GMT-05:00) Eastern Time (US & Canada)",
              "(GMT+00:00) London",
              "(GMT+05:00) Pakistan Standard Time",
            ]}
          />


          {/* Language */}

          <SelectField
            label="Language"
            value={preferences.language}
            onChange={(value) =>
              handleChange("language", value)
            }
            options={[
              "English (United States)",
              "English (United Kingdom)",
              "French",
              "Spanish",
            ]}
          />

        </div>


        {/* =================================================
            DATE FORMAT
        ================================================== */}

        <div className="mt-3 w-1/2 pr-2">

          <SelectField
            label="Date Format"
            value={preferences.dateFormat}
            onChange={(value) =>
              handleChange("dateFormat", value)
            }
            options={[
              "MM/DD/YYYY",
              "DD/MM/YYYY",
              "YYYY-MM-DD",
            ]}
          />

        </div>

      </div>

    </Card>
  );
};


/* =========================================================
   SELECT FIELD
========================================================= */

const SelectField = ({
  label,
  value,
  onChange,
  options,
}) => {
  return (
    <div className="w-full">

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

        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
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
          {options.map((option) => (
            <option
              key={option}
              value={option}
            >
              {option}
            </option>
          ))}
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
  );
};

export default ProfilePreferences;