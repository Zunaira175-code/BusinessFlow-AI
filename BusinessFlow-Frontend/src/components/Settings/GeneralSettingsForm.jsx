import { useState } from "react";
import { ChevronDown } from "lucide-react";

import Card from "../common/Card";
import Button from "../common/button";

const GeneralSettings = () => {
  const [formData, setFormData] = useState({
    workspaceName: "Acme Corp Global",
    workspaceUrl: "global",
    industry: "Enterprise CRM",
    timezone: "Pakistan Standard Time (UTC+05:00)",
    dateFormat: "DD/MM/YYYY",
    language: "English (US)",
    currency: "USD ($)",
  });

  /* =====================================================
     HANDLE INPUT
  ====================================================== */

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  /* =====================================================
     SAVE
  ====================================================== */

  const handleSave = () => {
    console.log("General settings:", formData);
  };

  /* =====================================================
     CANCEL
  ====================================================== */

  const handleCancel = () => {
    setFormData({
      workspaceName: "Acme Corp Global",
      workspaceUrl: "global",
      industry: "Enterprise CRM",
      timezone: "Pakistan Standard Time (UTC+05:00)",
      dateFormat: "DD/MM/YYYY",
      language: "English (US)",
      currency: "USD ($)",
    });
  };

  return (
    <Card className="w-full overflow-hidden">
      {/* =================================================
          HEADER
      ================================================== */}

      <div className="px-[14px] pt-[15px] sm:px-4 sm:pt-4">
        <h2
          className="
            text-[13px]
            font-bold
            leading-[18px]
            text-[#17324D]
          "
        >
          General Settings
        </h2>

        <div className="mt-3 h-px w-full bg-[#DCE5ED]" />
      </div>

      {/* =================================================
          FORM
      ================================================== */}

      <div className="px-[14px] py-[15px] sm:px-4 sm:py-4">
        <div className="grid grid-cols-1 gap-x-4 gap-y-3.5 md:grid-cols-2">

          {/* =================================================
              WORKSPACE NAME
          ================================================== */}

          <FormField label="Workspace Name">
            <input
              type="text"
              value={formData.workspaceName}
              onChange={(e) =>
                handleChange(
                  "workspaceName",
                  e.target.value
                )
              }
              className={inputClass}
            />
          </FormField>

          {/* =================================================
              WORKSPACE URL
          ================================================== */}

          <FormField label="Workspace URL">
            <div className="flex h-[30px] w-full overflow-hidden rounded-[6px] border border-[#DCE5ED] bg-white">
              {/* Prefix */}
              <div
                className="
                  flex
                  w-[107px]
                  shrink-0
                  items-center
                  border-r
                  border-[#DCE5ED]
                  bg-[#F7F9FC]
                  px-2
                  text-[8px]
                  text-[#8293A3]
                "
              >
                acme.businessflow.ai/
              </div>

              {/* URL */}
              <input
                type="text"
                value={formData.workspaceUrl}
                onChange={(e) =>
                  handleChange(
                    "workspaceUrl",
                    e.target.value
                  )
                }
                className="
                  min-w-0
                  flex-1
                  bg-transparent
                  px-2
                  text-[9px]
                  text-[#17324D]
                  outline-none
                "
              />
            </div>
          </FormField>

          {/* =================================================
              INDUSTRY
          ================================================== */}

          <FormField label="Industry">
            <SelectField
              value={formData.industry}
              onChange={(value) =>
                handleChange("industry", value)
              }
              options={[
                "Enterprise CRM",
                "Technology",
                "Software",
                "Finance",
                "Healthcare",
                "Marketing",
                "E-commerce",
              ]}
            />
          </FormField>

          {/* =================================================
              TIMEZONE
          ================================================== */}

          <FormField label="Timezone">
            <SelectField
              value={formData.timezone}
              onChange={(value) =>
                handleChange("timezone", value)
              }
              options={[
                "Pakistan Standard Time (UTC+05:00)",
                "Eastern Time (UTC-05:00)",
                "Central European Time (UTC+01:00)",
                "Greenwich Mean Time (UTC+00:00)",
              ]}
            />
          </FormField>

          {/* =================================================
              DATE FORMAT
          ================================================== */}

          <FormField label="Date Format">
            <SelectField
              value={formData.dateFormat}
              onChange={(value) =>
                handleChange("dateFormat", value)
              }
              options={[
                "DD/MM/YYYY",
                "MM/DD/YYYY",
                "YYYY-MM-DD",
              ]}
            />
          </FormField>

          {/* =================================================
              LANGUAGE
          ================================================== */}

          <FormField label="Language">
            <SelectField
              value={formData.language}
              onChange={(value) =>
                handleChange("language", value)
              }
              options={[
                "English (US)",
                "English (UK)",
                "Urdu",
              ]}
            />
          </FormField>

          {/* =================================================
              CURRENCY
          ================================================== */}

          <FormField label="Currency">
            <SelectField
              value={formData.currency}
              onChange={(value) =>
                handleChange("currency", value)
              }
              options={[
                "USD ($)",
                "EUR (€)",
                "GBP (£)",
                "PKR (₨)",
              ]}
            />
          </FormField>
        </div>
      </div>

      {/* =================================================
          FOOTER ACTIONS
      ================================================== */}

      <div className="px-[14px] pb-[14px] sm:px-4 sm:pb-4">
        <div className="h-px w-full bg-[#DCE5ED]" />

        <div className="mt-3 flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={handleCancel}
            className="
              h-[30px]
              rounded-[6px]
              border-[#D8E2EA]
              bg-white
              px-3
              text-[9px]
              font-semibold
              text-[#526B80]
              shadow-none
              hover:bg-[#F7F9FB]
            "
          >
            Cancel
          </Button>

          <Button
            type="button"
            onClick={handleSave}
            className="
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
            Save Changes
          </Button>
        </div>
      </div>
    </Card>
  );
};

/* =========================================================
   FORM FIELD
========================================================= */

const FormField = ({ label, children }) => {
  return (
    <div className="w-full">
      <label
        className="
          mb-[5px]
          block
          text-[8px]
          font-semibold
          leading-[12px]
          text-[#17324D]
        "
      >
        {label}
      </label>

      {children}
    </div>
  );
};

/* =========================================================
   SELECT FIELD
========================================================= */

const SelectField = ({
  value,
  onChange,
  options,
}) => {
  return (
    <div className="relative w-full">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="
          h-[30px]
          w-full
          appearance-none
          rounded-[6px]
          border
          border-[#DCE5ED]
          bg-white
          px-2
          pr-8
          text-[9px]
          text-[#17324D]
          outline-none
          transition-colors
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
  );
};

/* =========================================================
   INPUT STYLE
========================================================= */

const inputClass = `
  h-[30px]
  w-full
  rounded-[6px]
  border
  border-[#DCE5ED]
  bg-white
  px-2
  text-[9px]
  text-[#17324D]
  outline-none
  transition-colors
  focus:border-[#8DA9C0]
`;

export default GeneralSettings;