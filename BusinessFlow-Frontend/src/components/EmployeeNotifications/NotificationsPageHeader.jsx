import { useState } from "react";

// =====================================================
// API
// =====================================================

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

// =====================================================
// AUTH TOKEN
// =====================================================

const getAuthToken = () => {
  return localStorage.getItem("businessflow_token");
};

// =====================================================
// NOTIFICATIONS PAGE HEADER
// =====================================================

const NotificationsPageHeader = ({
  onMarkAllRead,
}) => {
  const [loading, setLoading] = useState(false);

  // ===================================================
  // MARK ALL AS READ
  // ===================================================

  const handleMarkAllRead = async () => {
    if (loading) {
      return;
    }

    const token = getAuthToken();

    if (!token) {
      console.error(
        "Authentication token not found."
      );

      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_BASE_URL}/api/notifications/read-all`,
        {
          method: "PATCH",

          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();

      if (!response.ok || !result?.success) {
        throw new Error(
          result?.message ||
            "Unable to mark all notifications as read."
        );
      }

      // -----------------------------------------------
      // Notify parent components
      // -----------------------------------------------

      if (typeof onMarkAllRead === "function") {
        onMarkAllRead(result);
      }
    } catch (error) {
      console.error(
        "Mark All Notifications Read Error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <div className="flex w-full items-start justify-between">
      {/* =================================================
          TITLE
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
          Notifications
        </h1>

        <p className="mt-[3px] text-[10px] text-[#60758A]">
          Stay up to date with your leads, customers, deals,
          tasks, and meetings.
        </p>
      </div>

      {/* =================================================
          MARK ALL AS READ
      ================================================= */}

      <button
        type="button"
        onClick={handleMarkAllRead}
        disabled={loading}
        className="
          mt-1
          flex
          h-[30px]
          items-center
          gap-1.5
          rounded-[6px]
          border
          border-[#DCE5ED]
          bg-white
          px-3
          text-[8px]
          font-semibold
          text-[#17324D]
          transition
          hover:bg-[#F5F8FB]
          disabled:cursor-not-allowed
          disabled:opacity-60
        "
      >
        <span className="text-[10px]">
          {loading ? "…" : "✓"}
        </span>

        {loading
          ? "Marking..."
          : "Mark All as Read"}
      </button>
    </div>
  );
};

export default NotificationsPageHeader;