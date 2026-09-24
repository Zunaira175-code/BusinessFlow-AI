import { useCallback, useEffect, useState } from "react";

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
// PERSONAL INFORMATION
// =====================================================

const PersonalInformation = () => {
  const [form, setForm] = useState({
    fullName: "",
    jobTitle: "",
    email: "",
    phone: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  // ===================================================
  // FETCH LOGGED-IN EMPLOYEE
  // ===================================================

  const fetchProfile = useCallback(async () => {
    try {
      const token = getAuthToken();

      if (!token) {
        setError(
          "Authentication token not found. Please login again."
        );
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/api/auth/me`,
        {
          method: "GET",
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
            "Unable to load your personal information."
        );
      }

      const user = result?.data?.user || result?.data;

      if (!user) {
        throw new Error(
          "Employee information was not returned by the server."
        );
      }

      const firstName = user.firstName || "";
      const lastName = user.lastName || "";

      setForm({
        fullName: `${firstName} ${lastName}`.trim(),
        jobTitle: user.jobTitle || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    } catch (fetchError) {
      console.error(
        "Fetch Employee Profile Error:",
        fetchError
      );

      setError(
        fetchError?.message ||
          "Unable to load your personal information."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // ===================================================
  // INITIAL LOAD
  // ===================================================

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // ===================================================
  // SAVE / CONFIRM
  // ===================================================

  const handleSubmit = (event) => {
    event.preventDefault();

    /*
      Employee information is assigned by the admin.

      All fields are read-only, so there is nothing
      to update in the database from this screen.

      This button simply confirms the information
      currently displayed to the employee.
    */

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  // ===================================================
  // LOADING STATE
  // ===================================================

  if (loading) {
    return (
      <section
        className="
          mt-6
          rounded-[9px]
          border
          border-[#DCE5ED]
          bg-white
          px-4
          pb-4
          pt-4
        "
      >
        {/* Header Skeleton */}

        <div
          className="
            h-[13px]
            w-[125px]
            animate-pulse
            rounded
            bg-[#E8EEF3]
          "
        />

        {/* Fields Skeleton */}

        <div
          className="
            mt-4
            grid
            grid-cols-1
            gap-x-5
            gap-y-4
            md:grid-cols-2
          "
        >
          {[1, 2, 3, 4].map((item) => (
            <div key={item}>
              <div
                className="
                  mb-1.5
                  h-[7px]
                  w-[70px]
                  animate-pulse
                  rounded
                  bg-[#EEF2F5]
                "
              />

              <div
                className="
                  h-[33px]
                  w-full
                  animate-pulse
                  rounded-[6px]
                  bg-[#F1F5F8]
                "
              />
            </div>
          ))}
        </div>
      </section>
    );
  }

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <section
      className="
        mt-6
        rounded-[9px]
        border
        border-[#DCE5ED]
        bg-white
        px-4
        pb-4
        pt-4
      "
    >
      {/* =================================================
          CARD HEADER
      ================================================= */}

      <div
        className="
          border-b
          border-[#DCE5ED]
          pb-3
        "
      >
        <h2
          className="
            text-[13px]
            font-bold
            text-[#17324D]
          "
        >
          Personal Information
        </h2>
      </div>

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div
          className="
            mt-3
            rounded-[5px]
            border
            border-[#F3CCCC]
            bg-[#FFF7F7]
            px-3
            py-2
            text-[8px]
            text-[#C62828]
          "
        >
          {error}
        </div>
      )}

      {/* =================================================
          SUCCESS
      ================================================= */}

      {saved && (
        <div
          className="
            mt-3
            rounded-[5px]
            border
            border-[#CDE8D8]
            bg-[#F5FCF7]
            px-3
            py-2
            text-[8px]
            text-[#16804A]
          "
        >
          Your assigned information is up to date.
        </div>
      )}

      {/* =================================================
          FORM
      ================================================= */}

      <form onSubmit={handleSubmit}>
        <div
          className="
            mt-4
            grid
            grid-cols-1
            gap-x-5
            gap-y-4
            md:grid-cols-2
          "
        >
          {/* =============================================
              FULL NAME
          ============================================= */}

          <div>
            <label
              htmlFor="fullName"
              className="
                mb-1.5
                block
                text-[8px]
                font-semibold
                text-[#17324D]
              "
            >
              Full Name
            </label>

            <input
              id="fullName"
              type="text"
              value={form.fullName}
              readOnly
              className="
                h-[33px]
                w-full
                cursor-default
                rounded-[6px]
                border
                border-[#DCE5ED]
                bg-[#F8FAFC]
                px-3
                text-[9px]
                text-[#17324D]
                outline-none
              "
            />
          </div>

          {/* =============================================
              JOB TITLE
          ============================================= */}

          <div>
            <label
              htmlFor="jobTitle"
              className="
                mb-1.5
                block
                text-[8px]
                font-semibold
                text-[#17324D]
              "
            >
              Job Title
            </label>

            <input
              id="jobTitle"
              type="text"
              value={form.jobTitle}
              readOnly
              className="
                h-[33px]
                w-full
                cursor-default
                rounded-[6px]
                border
                border-[#DCE5ED]
                bg-[#F8FAFC]
                px-3
                text-[9px]
                text-[#17324D]
                outline-none
              "
            />
          </div>

          {/* =============================================
              EMAIL
          ============================================= */}

          <div>
            <label
              htmlFor="email"
              className="
                mb-1.5
                block
                text-[8px]
                font-semibold
                text-[#17324D]
              "
            >
              Email Address
            </label>

            <input
              id="email"
              type="email"
              value={form.email}
              readOnly
              className="
                h-[33px]
                w-full
                cursor-default
                rounded-[6px]
                border
                border-[#DCE5ED]
                bg-[#F8FAFC]
                px-3
                text-[9px]
                text-[#60758A]
                outline-none
              "
            />
          </div>

          {/* =============================================
              PHONE
          ============================================= */}

          <div>
            <label
              htmlFor="phone"
              className="
                mb-1.5
                block
                text-[8px]
                font-semibold
                text-[#17324D]
              "
            >
              Phone Number
            </label>

            <input
              id="phone"
              type="text"
              value={form.phone}
              readOnly
              className="
                h-[33px]
                w-full
                cursor-default
                rounded-[6px]
                border
                border-[#DCE5ED]
                bg-[#F8FAFC]
                px-3
                text-[9px]
                text-[#17324D]
                outline-none
              "
            />
          </div>
        </div>

        {/* =================================================
            SAVE
        ================================================= */}

        <div className="mt-5 flex justify-end">
          <button
            type="submit"
            className="
              h-[28px]
              rounded-[6px]
              bg-[#092D50]
              px-4
              text-[8px]
              font-medium
              text-white
              transition
              hover:bg-[#0D3D69]
            "
          >
            Save Changes
          </button>
        </div>
      </form>
    </section>
  );
};

export default PersonalInformation;