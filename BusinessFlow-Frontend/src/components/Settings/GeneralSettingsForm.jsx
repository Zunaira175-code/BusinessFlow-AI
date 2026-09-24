import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

import Card from "../common/Card";
import Button from "../common/button";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const DEFAULT_FORM_DATA = {
  workspaceName: "",
  workspaceUrl: "",
  industry: "Enterprise CRM",
  timezone: "Asia/Karachi",
  dateFormat: "DD/MM/YYYY",
  language: "en-US",
  currency: "USD",
};

const GeneralSettings = () => {
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);
  const [savedData, setSavedData] = useState(DEFAULT_FORM_DATA);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* =====================================================
     GET TOKEN
  ====================================================== */

  const getToken = () => {
    return (
      localStorage.getItem("businessflow_token") ||
      sessionStorage.getItem("businessflow_token")
    );
  };

  /* =====================================================
     LOAD GENERAL SETTINGS
  ====================================================== */

  useEffect(() => {
    const fetchGeneralSettings = async () => {
      try {
        setLoading(true);
        setError("");
        setSuccess("");

        const token = getToken();

        if (!token) {
          setError("Authentication token not found. Please login again.");
          return;
        }

        const response = await fetch(
          `${API_BASE_URL}/api/settings/general`,
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
            result.message || "Failed to load general settings."
          );
        }

        const settings = result?.data?.settings;

        if (!settings) {
          throw new Error("General settings data was not returned.");
        }

        const loadedData = {
          workspaceName: settings.workspaceName || "",
          workspaceUrl: settings.workspaceSlug || "",
          industry: settings.industry || "Enterprise CRM",
          timezone: settings.timezone || "Asia/Karachi",
          dateFormat: settings.dateFormat || "DD/MM/YYYY",
          language: settings.language || "en-US",
          currency: settings.currency || "USD",
        };

        setFormData(loadedData);
        setSavedData(loadedData);
      } catch (err) {
        console.error("Fetch General Settings Error:", err);

        setError(
          err.message || "Unable to load general settings."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchGeneralSettings();
  }, []);

  /* =====================================================
     HANDLE INPUT
  ====================================================== */

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    setError("");
    setSuccess("");
  };

  /* =====================================================
     SAVE
  ====================================================== */

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const token = getToken();

      if (!token) {
        setError("Authentication token not found. Please login again.");
        return;
      }

      if (!formData.workspaceName.trim()) {
        setError("Workspace name is required.");
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/api/settings/general`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          body: JSON.stringify({
            workspaceName: formData.workspaceName.trim(),
            workspaceSlug: formData.workspaceUrl.trim(),
            industry: formData.industry,
            timezone: formData.timezone,
            dateFormat: formData.dateFormat,
            language: formData.language,
            currency: formData.currency,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to save general settings."
        );
      }

      const settings = result?.data?.settings;

      const updatedData = {
        workspaceName: settings?.workspaceName || formData.workspaceName,
        workspaceUrl: settings?.workspaceSlug || "",
        industry: settings?.industry || formData.industry,
        timezone: settings?.timezone || formData.timezone,
        dateFormat: settings?.dateFormat || formData.dateFormat,
        language: settings?.language || formData.language,
        currency: settings?.currency || formData.currency,
      };

      setFormData(updatedData);
      setSavedData(updatedData);

      setSuccess(
        result.message || "General settings updated successfully."
      );
    } catch (err) {
      console.error("Save General Settings Error:", err);

      setError(
        err.message || "Unable to save general settings."
      );
    } finally {
      setSaving(false);
    }
  };

  /* =====================================================
     CANCEL
  ====================================================== */

  const handleCancel = () => {
    setFormData(savedData);
    setError("");
    setSuccess("");
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
        {/* =================================================
            LOADING
        ================================================== */}

        {loading ? (
          <div className="flex min-h-[180px] items-center justify-center">
            <div className="text-[10px] font-medium text-[#657C90]">
              Loading general settings...
            </div>
          </div>
        ) : (
          <>
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
                  disabled={saving}
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
                    disabled={saving}
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
                  disabled={saving}
                  options={[
                    {
                      label: "Enterprise CRM",
                      value: "Enterprise CRM",
                    },
                    {
                      label: "Technology",
                      value: "Technology",
                    },
                    {
                      label: "Software",
                      value: "Software",
                    },
                    {
                      label: "Finance",
                      value: "Finance",
                    },
                    {
                      label: "Healthcare",
                      value: "Healthcare",
                    },
                    {
                      label: "Marketing",
                      value: "Marketing",
                    },
                    {
                      label: "E-commerce",
                      value: "E-commerce",
                    },
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
                  disabled={saving}
                  options={[
                    {
                      label:
                        "Pakistan Standard Time (UTC+05:00)",
                      value: "Asia/Karachi",
                    },
                    {
                      label:
                        "Eastern Time (UTC-05:00)",
                      value: "America/New_York",
                    },
                    {
                      label:
                        "Central European Time (UTC+01:00)",
                      value: "Europe/Berlin",
                    },
                    {
                      label:
                        "Greenwich Mean Time (UTC+00:00)",
                      value: "UTC",
                    },
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
                  disabled={saving}
                  options={[
                    {
                      label: "DD/MM/YYYY",
                      value: "DD/MM/YYYY",
                    },
                    {
                      label: "MM/DD/YYYY",
                      value: "MM/DD/YYYY",
                    },
                    {
                      label: "YYYY-MM-DD",
                      value: "YYYY-MM-DD",
                    },
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
                  disabled={saving}
                  options={[
                    {
                      label: "English (US)",
                      value: "en-US",
                    },
                    {
                      label: "English (UK)",
                      value: "en-GB",
                    },
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
                  disabled={saving}
                  options={[
                    {
                      label: "USD ($)",
                      value: "USD",
                    },
                    {
                      label: "EUR (€)",
                      value: "EUR",
                    },
                    {
                      label: "GBP (£)",
                      value: "GBP",
                    },
                    {
                      label: "PKR (₨)",
                      value: "PKR",
                    },
                    {
                      label: "AED",
                      value: "AED",
                    },
                    {
                      label: "SAR",
                      value: "SAR",
                    },
                  ]}
                />
              </FormField>
            </div>
          </>
        )}
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
            disabled={loading || saving}
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
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            Cancel
          </Button>

          <Button
            type="button"
            onClick={handleSave}
            disabled={loading || saving}
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
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            {saving ? "Saving..." : "Save Changes"}
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
  disabled = false,
}) => {
  return (
    <div className="relative w-full">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
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
          disabled:cursor-not-allowed
          disabled:bg-[#F7F9FC]
        "
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
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
  disabled:cursor-not-allowed
  disabled:bg-[#F7F9FC]
`;

export default GeneralSettings;