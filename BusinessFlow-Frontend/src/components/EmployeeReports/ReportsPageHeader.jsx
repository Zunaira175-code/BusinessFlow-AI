import { useState } from "react";
import { Download } from "lucide-react";

const ReportsPageHeader = () => {
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState("");

  // =====================================================
  // EXPORT REPORT
  // =====================================================

  const handleExportReport = async () => {
    try {
      setExporting(true);
      setExportError("");

      const token =
        localStorage.getItem(
          "businessflow_token"
        );

      if (!token) {
        throw new Error(
          "Authentication token not found."
        );
      }

      const response = await fetch(
        "http://localhost:5000/api/reports/export?period=30",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      const result =
        await response.json();

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.message ||
            "Unable to export report."
        );
      }

      // =================================================
      // CREATE DOWNLOAD FILE
      // =================================================

      const jsonData =
        JSON.stringify(
          result.data,
          null,
          2
        );

      const blob = new Blob(
        [jsonData],
        {
          type: "application/json",
        }
      );

      const url =
        window.URL.createObjectURL(
          blob
        );

      const link =
        document.createElement(
          "a"
        );

      link.href = url;

      link.download = `businessflow-report-${new Date()
        .toISOString()
        .slice(0, 10)}.json`;

      document.body.appendChild(
        link
      );

      link.click();

      link.remove();

      window.URL.revokeObjectURL(
        url
      );
    } catch (error) {
      console.error(
        "Export Report Error:",
        error
      );

      setExportError(
        error.message ||
          "Unable to export report."
      );
    } finally {
      setExporting(false);
    }
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="flex w-full items-start justify-between">
      {/* =================================================
          LEFT
      ================================================= */}

      <div>
        <h1
          className="
            text-[24px]
            font-bold
            leading-[30px]
            tracking-[-0.6px]
            text-[#071D35]
          "
        >
          Reports & Analytics
        </h1>

        <p
          className="
            mt-[3px]
            text-[10px]
            leading-[15px]
            text-[#60758A]
          "
        >
          Performance insights, sales metrics,
          and AI-driven growth analysis.
        </p>
      </div>

      {/* =================================================
          RIGHT ACTIONS
      ================================================= */}

      <div className="flex flex-col items-end gap-1 pt-1">
        <button
          type="button"
          onClick={
            handleExportReport
          }
          disabled={exporting}
          className="
            flex
            h-[27px]
            items-center
            gap-1.5
            rounded-[6px]
            border
            border-[#C9D8E5]
            bg-white
            px-3
            text-[8px]
            font-semibold
            text-[#17324D]
            transition
            hover:bg-[#F7F9FC]
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >
          <Download
            size={11}
            strokeWidth={1.8}
          />

          {exporting
            ? "Exporting..."
            : "Export Report"}
        </button>

        {/* Export Error */}
        {exportError && (
          <p
            className="
              max-w-[180px]
              text-right
              text-[6px]
              text-[#D64545]
            "
          >
            {exportError}
          </p>
        )}
      </div>
    </div>
  );
};

export default ReportsPageHeader;