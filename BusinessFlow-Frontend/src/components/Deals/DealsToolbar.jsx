import { useEffect, useState } from "react";

import api from "../../services/api";

const DealsToolbar = ({
  filters,
  onFiltersChange,
  view,
  onViewChange,
}) => {
  // =====================================================
  // LOCAL SEARCH
  // =====================================================

  const [search, setSearch] = useState(
    filters?.search || ""
  );

  // =====================================================
  // EMPLOYEES
  // =====================================================

  const [employees, setEmployees] =
    useState([]);

  const [employeesLoading, setEmployeesLoading] =
    useState(false);

  // =====================================================
  // DROPDOWN STATES
  // =====================================================

  const [showOwnerMenu, setShowOwnerMenu] =
    useState(false);

  const [showValueMenu, setShowValueMenu] =
    useState(false);

  const [showCloseDateMenu, setShowCloseDateMenu] =
    useState(false);

  const [showMoreMenu, setShowMoreMenu] =
    useState(false);

  // =====================================================
  // FETCH EMPLOYEES
  // =====================================================

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setEmployeesLoading(true);

        /*
         * We use the account endpoint because it is
         * already authenticated and company-scoped.
         *
         * If your backend later has a dedicated
         * /users/employees endpoint, this can be
         * switched there without changing the UI.
         */

        const result = await api(
          "/settings/account"
        );

        /*
         * The account endpoint returns the current
         * logged-in user, not the full employee list.
         *
         * Therefore we do not assume employees from
         * this response.
         *
         * Owner dropdown will remain functional for
         * the currently selected assignedTo value,
         * while employee-list API can be connected
         * when available.
         */

        if (!result?.success) {
          return;
        }
      } catch (error) {
        console.error(
          "Deals Toolbar Employee Error:",
          error
        );
      } finally {
        setEmployeesLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  // =====================================================
  // SYNC SEARCH WITH PARENT
  // =====================================================

  useEffect(() => {
    const timer = setTimeout(() => {
      if (
        search !==
        (filters?.search || "")
      ) {
        onFiltersChange({
          ...filters,
          search,
        });
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [
    search,
    filters,
    onFiltersChange,
  ]);

  // =====================================================
  // SYNC EXTERNAL SEARCH RESET
  // =====================================================

  useEffect(() => {
    const parentSearch =
      filters?.search || "";

    if (parentSearch !== search) {
      setSearch(parentSearch);
    }
  }, [filters?.search]);

  // =====================================================
  // UPDATE FILTER
  // =====================================================

  const updateFilter = (
    name,
    value
  ) => {
    onFiltersChange({
      ...filters,
      [name]: value,
    });
  };

  // =====================================================
  // CLEAR FILTERS
  // =====================================================

  const clearFilters = () => {
    setSearch("");

    onFiltersChange({
      search: "",
      stage: "",
      status: "",
      assignedTo: "",
      leadId: "",
      customerId: "",
    });

    setShowOwnerMenu(false);
    setShowValueMenu(false);
    setShowCloseDateMenu(false);
    setShowMoreMenu(false);
  };

  // =====================================================
  // OWNER LABEL
  // =====================================================

  const selectedOwner =
    employees.find(
      (employee) =>
        String(employee?._id) ===
        String(filters?.assignedTo)
    );

  const selectedOwnerName =
    selectedOwner
      ? `${selectedOwner.firstName || ""} ${
          selectedOwner.lastName || ""
        }`.trim()
      : "";

  // =====================================================
  // VIEW
  // =====================================================

  return (
    <section className="mt-5 w-full">
      <div
        className="
          flex
          min-h-[62px]
          w-full
          items-center
          justify-between
          rounded-[8px]
          border
          border-[#DCE5EE]
          bg-white
          px-[12px]
          shadow-[0_1px_2px_rgba(15,42,66,0.03)]
        "
      >
        {/* =================================================
            LEFT CONTROLS
        ================================================= */}

        <div className="flex items-center gap-[8px]">

          {/* =================================================
              BOARD / LIST
          ================================================= */}

          <div
            className="
              flex
              h-[34px]
              items-center
              rounded-[5px]
              border
              border-[#DDE6EF]
              bg-[#F8FAFD]
              p-[3px]
            "
          >
            <button
              type="button"
              onClick={() =>
                onViewChange("board")
              }
              className={`
                flex
                h-[28px]
                items-center
                gap-[5px]
                rounded-[4px]
                px-[9px]
                text-[11px]
                font-medium
                transition
                ${
                  view === "board"
                    ? "bg-white text-[#183B5A] shadow-[0_1px_2px_rgba(15,42,66,0.05)]"
                    : "text-[#687C8F]"
                }
              `}
            >
              <span className="text-[11px]">
                ▣
              </span>

              Board
            </button>

            <button
              type="button"
              onClick={() =>
                onViewChange("list")
              }
              className={`
                flex
                h-[28px]
                items-center
                gap-[5px]
                rounded-[4px]
                px-[9px]
                text-[11px]
                font-medium
                transition
                ${
                  view === "list"
                    ? "bg-white text-[#183B5A] shadow-[0_1px_2px_rgba(15,42,66,0.05)]"
                    : "text-[#687C8F]"
                }
              `}
            >
              <span className="text-[10px]">
                ☷
              </span>

              List
            </button>
          </div>

          {/* Divider */}

          <div className="mx-[5px] h-[30px] w-px bg-[#E1E8EF]" />

          {/* =================================================
              OWNER
          ================================================= */}

          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowOwnerMenu(
                  (previous) =>
                    !previous
                );

                setShowValueMenu(false);
                setShowCloseDateMenu(false);
                setShowMoreMenu(false);
              }}
              className={`
                flex
                h-[34px]
                items-center
                gap-[7px]
                rounded-[5px]
                border
                border-[#DCE5EE]
                px-[10px]
                text-[11px]
                font-medium
                transition
                ${
                  filters?.assignedTo
                    ? "bg-[#EAF2FC] text-[#0B3D6B]"
                    : "bg-[#F8FAFD] text-[#60758A]"
                }
              `}
            >
              {selectedOwnerName ||
                "Owner"}

              <span className="text-[9px]">
                ▼
              </span>
            </button>

            {showOwnerMenu && (
              <div
                className="
                  absolute
                  left-0
                  top-[40px]
                  z-50
                  w-[190px]
                  rounded-[6px]
                  border
                  border-[#DCE5EE]
                  bg-white
                  p-[5px]
                  shadow-[0_8px_20px_rgba(15,42,66,0.12)]
                "
              >
                {/* All owners */}

                <button
                  type="button"
                  onClick={() =>
                    updateFilter(
                      "assignedTo",
                      ""
                    )
                  }
                  className="
                    w-full
                    rounded-[4px]
                    px-3
                    py-2
                    text-left
                    text-[10px]
                    text-[#60758A]
                    hover:bg-[#F5F8FB]
                  "
                >
                  All Owners
                </button>

                {/* Employee list */}

                {employeesLoading && (
                  <p className="px-3 py-2 text-[9px] text-[#91A2B2]">
                    Loading owners...
                  </p>
                )}

                {!employeesLoading &&
                  employees.length ===
                    0 && (
                    <p className="px-3 py-2 text-[9px] leading-[13px] text-[#91A2B2]">
                      Employee list API is not
                      connected yet.
                    </p>
                  )}

                {employees.map(
                  (employee) => (
                    <button
                      key={
                        employee._id
                      }
                      type="button"
                      onClick={() => {
                        updateFilter(
                          "assignedTo",
                          employee._id
                        );

                        setShowOwnerMenu(
                          false
                        );
                      }}
                      className="
                        w-full
                        rounded-[4px]
                        px-3
                        py-2
                        text-left
                        text-[10px]
                        text-[#60758A]
                        hover:bg-[#F5F8FB]
                      "
                    >
                      {employee.firstName}{" "}
                      {employee.lastName}
                    </button>
                  )
                )}
              </div>
            )}
          </div>

          {/* =================================================
              VALUE
          ================================================= */}

          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowValueMenu(
                  (previous) =>
                    !previous
                );

                setShowOwnerMenu(false);
                setShowCloseDateMenu(false);
                setShowMoreMenu(false);
              }}
              className="
                flex
                h-[34px]
                items-center
                gap-[7px]
                rounded-[5px]
                border
                border-[#DCE5EE]
                bg-[#F8FAFD]
                px-[10px]
                text-[11px]
                font-medium
                text-[#60758A]
              "
            >
              Value

              <span className="text-[9px]">
                ▼
              </span>
            </button>

            {showValueMenu && (
              <div
                className="
                  absolute
                  left-0
                  top-[40px]
                  z-50
                  w-[180px]
                  rounded-[6px]
                  border
                  border-[#DCE5EE]
                  bg-white
                  p-[10px]
                  shadow-[0_8px_20px_rgba(15,42,66,0.12)]
                "
              >
                <p className="text-[9px] leading-[13px] text-[#71869A]">
                  Value filtering is not
                  available in the current
                  admin deals API.
                </p>
              </div>
            )}
          </div>

          {/* =================================================
              CLOSE DATE
          ================================================= */}

          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowCloseDateMenu(
                  (previous) =>
                    !previous
                );

                setShowOwnerMenu(false);
                setShowValueMenu(false);
                setShowMoreMenu(false);
              }}
              className="
                flex
                h-[34px]
                items-center
                gap-[7px]
                rounded-[5px]
                border
                border-[#DCE5EE]
                bg-[#F8FAFD]
                px-[10px]
                text-[11px]
                font-medium
                text-[#60758A]
              "
            >
              Close Date

              <span className="text-[9px]">
                ▼
              </span>
            </button>

            {showCloseDateMenu && (
              <div
                className="
                  absolute
                  left-0
                  top-[40px]
                  z-50
                  w-[190px]
                  rounded-[6px]
                  border
                  border-[#DCE5EE]
                  bg-white
                  p-[10px]
                  shadow-[0_8px_20px_rgba(15,42,66,0.12)]
                "
              >
                <p className="text-[9px] leading-[13px] text-[#71869A]">
                  Close-date filtering is not
                  available in the current
                  admin deals API.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* =================================================
            MORE FILTERS
        ================================================= */}

        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowMoreMenu(
                (previous) =>
                  !previous
              );

              setShowOwnerMenu(false);
              setShowValueMenu(false);
              setShowCloseDateMenu(false);
            }}
            className="
              flex
              items-center
              gap-[5px]
              px-[8px]
              text-[11px]
              font-medium
              text-[#60758A]
              transition-colors
              hover:text-[#0B3D6B]
            "
          >
            <span className="text-[12px]">
              ≡
            </span>

            More Filters
          </button>

          {showMoreMenu && (
            <div
              className="
                absolute
                right-0
                top-[38px]
                z-50
                w-[210px]
                rounded-[6px]
                border
                border-[#DCE5EE]
                bg-white
                p-[10px]
                shadow-[0_8px_20px_rgba(15,42,66,0.12)]
              "
            >
              {/* Stage */}

              <label
                className="
                  mb-1
                  block
                  text-[9px]
                  font-semibold
                  text-[#60758A]
                "
              >
                Stage
              </label>

              <select
                value={
                  filters?.stage || ""
                }
                onChange={(e) =>
                  updateFilter(
                    "stage",
                    e.target.value
                  )
                }
                className="
                  mb-3
                  h-[32px]
                  w-full
                  rounded-[5px]
                  border
                  border-[#DCE5EE]
                  bg-[#F8FAFD]
                  px-2
                  text-[10px]
                  text-[#183B5A]
                  outline-none
                "
              >
                <option value="">
                  All Stages
                </option>

                <option value="Prospecting">
                  Prospecting
                </option>

                <option value="Qualification">
                  Qualification
                </option>

                <option value="Proposal">
                  Proposal
                </option>

                <option value="Negotiation">
                  Negotiation
                </option>

                <option value="Closed Won">
                  Closed Won
                </option>

                <option value="Closed Lost">
                  Closed Lost
                </option>
              </select>

              {/* Status */}

              <label
                className="
                  mb-1
                  block
                  text-[9px]
                  font-semibold
                  text-[#60758A]
                "
              >
                Status
              </label>

              <select
                value={
                  filters?.status || ""
                }
                onChange={(e) =>
                  updateFilter(
                    "status",
                    e.target.value
                  )
                }
                className="
                  mb-3
                  h-[32px]
                  w-full
                  rounded-[5px]
                  border
                  border-[#DCE5EE]
                  bg-[#F8FAFD]
                  px-2
                  text-[10px]
                  text-[#183B5A]
                  outline-none
                "
              >
                <option value="">
                  All Statuses
                </option>

                <option value="Open">
                  Open
                </option>

                <option value="Won">
                  Won
                </option>

                <option value="Lost">
                  Lost
                </option>
              </select>

              {/* Clear */}

              <button
                type="button"
                onClick={clearFilters}
                className="
                  h-[30px]
                  w-full
                  rounded-[5px]
                  border
                  border-[#DCE5EE]
                  bg-white
                  text-[10px]
                  font-semibold
                  text-[#60758A]
                  transition
                  hover:bg-[#F5F8FB]
                "
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default DealsToolbar;