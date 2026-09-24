import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Trash2,
  Pencil,
  X,
  UserRound,
  Check,
} from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const LeadsTable = () => {
  const [leads, setLeads] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [employeesLoading, setEmployeesLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [modalError, setModalError] = useState("");

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [source, setSource] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  const [selectedLeads, setSelectedLeads] = useState([]);
  const [editingLead, setEditingLead] = useState(null);
  const [assignedTo, setAssignedTo] = useState("");

  const getToken = () => {
    const token =
      localStorage.getItem("businessflow_token") ||
      sessionStorage.getItem("businessflow_token");

    if (!token || token === "null" || token === "undefined") {
      return null;
    }

    return token.replace(/^Bearer\s+/i, "").trim();
  };

  const apiRequest = async (url, options = {}) => {
    const token = getToken();

    if (!token) {
      throw new Error("Authentication token is missing. Please log in again.");
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        Accept: "application/json",
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        Authorization: `Bearer ${token}`,
        ...(options.headers || {}),
      },
    });

    const text = await response.text();
    let result = null;

    if (text.trim()) {
      try {
        result = JSON.parse(text);
      } catch {
        throw new Error(`Server returned an unexpected response (${response.status}).`);
      }
    }

    if (!response.ok) {
      throw new Error(
        result?.message || `Request failed (${response.status}).`
      );
    }

    return result;
  };

  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });

      if (search.trim()) params.set("search", search.trim());
      if (status) params.set("status", status);
      if (source) params.set("source", source);

      const result = await apiRequest(
        `${API_BASE_URL}/api/admin/leads?${params.toString()}`
      );

      const data = result?.data || {};
      const leadData = Array.isArray(data.leads) ? data.leads : [];
      const p = data.pagination || {};

      setLeads(leadData);
      setPagination({
        page: Number(p.page) || page,
        limit: Number(p.limit) || limit,
        total: Number(p.total) || 0,
        totalPages: Number(p.totalPages) || 0,
        hasNextPage: Boolean(p.hasNextPage),
        hasPreviousPage: Boolean(p.hasPreviousPage),
      });
      setSelectedLeads([]);
    } catch (err) {
      console.error("Leads Error:", err);
      setLeads([]);
      setError(err?.message || "Unable to load leads.");
    } finally {
      setLoading(false);
    }
  }, [page, search, status, source]);

  const fetchEmployees = useCallback(async () => {
    try {
      setEmployeesLoading(true);
      setModalError("");

      const result = await apiRequest(`${API_BASE_URL}/api/employees`);
      const list = result?.data?.employees || [];

      setEmployees(
        Array.isArray(list)
          ? list.filter((employee) => employee?.isActive !== false)
          : []
      );
    } catch (err) {
      console.error("Employees Error:", err);
      setEmployees([]);
      setModalError(err?.message || "Unable to load employees.");
    } finally {
      setEmployeesLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(
      () => fetchLeads(),
      search.trim() ? 500 : 0
    );
    return () => clearTimeout(timer);
  }, [fetchLeads]);

  const openEditModal = async (lead) => {
    if (!lead?._id) return;

    setEditingLead(lead);
    setModalError("");

    const currentId =
      typeof lead.assignedTo === "object"
        ? lead.assignedTo?._id
        : lead.assignedTo;

    setAssignedTo(currentId ? String(currentId) : "");
    await fetchEmployees();
  };

  const closeEditModal = () => {
    if (saving) return;
    setEditingLead(null);
    setAssignedTo("");
    setModalError("");
  };

  const saveLeadAssignment = async () => {
    if (!editingLead?._id) return;

    try {
      setSaving(true);
      setModalError("");

      await apiRequest(
        `${API_BASE_URL}/api/admin/leads/${editingLead._id}`,
        {
          method: "PUT",
          body: JSON.stringify({
            assignedTo: assignedTo || null,
          }),
        }
      );

      setEditingLead(null);
      setAssignedTo("");
      await fetchLeads();
    } catch (err) {
      console.error("Assign Lead Error:", err);
      setModalError(err?.message || "Unable to assign this lead.");
    } finally {
      setSaving(false);
    }
  };

  const deleteLead = async (id) => {
    if (!id) return;

    if (!window.confirm("Are you sure you want to delete this lead?")) return;

    try {
      setError("");

      await apiRequest(`${API_BASE_URL}/api/admin/leads/${id}`, {
        method: "DELETE",
      });

      await fetchLeads();
    } catch (err) {
      setError(err?.message || "Unable to delete this lead.");
    }
  };

  const toggleSelectLead = (id) => {
    setSelectedLeads((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id]
    );
  };

  const allSelected =
    leads.length > 0 &&
    leads.every((lead) => selectedLeads.includes(lead._id));

  const toggleSelectAll = () => {
    setSelectedLeads(
      allSelected
        ? []
        : leads.map((lead) => lead._id).filter(Boolean)
    );
  };

  const getLeadName = (lead) =>
    `${lead?.firstName || ""} ${lead?.lastName || ""}`.trim() ||
    "Unnamed Lead";

  const getInitials = (person) => {
    const first = person?.firstName?.charAt(0)?.toUpperCase() || "";
    const last = person?.lastName?.charAt(0)?.toUpperCase() || "";
    return `${first}${last}` || "LD";
  };

  const getAssignedName = (lead) => {
    if (!lead?.assignedTo) return "Unassigned";

    if (typeof lead.assignedTo === "object") {
      return (
        `${lead.assignedTo.firstName || ""} ${
          lead.assignedTo.lastName || ""
        }`.trim() ||
        lead.assignedTo.email ||
        "Assigned User"
      );
    }

    return "Assigned User";
  };

  const formatCurrency = (value) => {
    const number = Number(value);
    if (!Number.isFinite(number)) return "$0";

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(number);
  };

  const getScore = (lead) => {
    const score = Number(lead?.score);
    return Number.isFinite(score) ? score : null;
  };

  const getScoreLabel = (score) => {
    if (score === null) return "—";
    if (score >= 80) return "High";
    if (score >= 50) return "Medium";
    return "Low";
  };

  const getScoreColor = (score) => {
    if (score === null) return "#8292A0";
    if (score >= 80) return "#16A05D";
    if (score >= 50) return "#D89400";
    return "#E05252";
  };

  const getStatusClass = (value) => {
    const styles = {
      New: "bg-[#EAF3FF] text-[#24598A]",
      Contacted: "bg-[#FFF4DD] text-[#9A6A00]",
      Qualified: "bg-[#DCEAFF] text-[#24598A]",
      "Proposal Sent": "bg-[#F0E8FF] text-[#6B42A5]",
      Converted: "bg-[#E2F7ED] text-[#168052]",
      Lost: "bg-[#FFE8E8] text-[#C43D3D]",
    };

    return styles[value] || "bg-[#F1F4F7] text-[#526B80]";
  };

  const pageNumbers = useMemo(() => {
    const total = pagination.totalPages;

    if (!total) return [];
    if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);

    const pages = [1];

    if (page > 3) pages.push("...");

    for (
      let current = Math.max(2, page - 1);
      current <= Math.min(total - 1, page + 1);
      current++
    ) {
      pages.push(current);
    }

    if (page < total - 2) pages.push("...");

    pages.push(total);
    return pages;
  }, [page, pagination.totalPages]);

  const showingFrom =
    pagination.total === 0 ? 0 : (page - 1) * limit + 1;

  const showingTo =
    pagination.total === 0
      ? 0
      : Math.min(page * limit, pagination.total);

  return (
    <>
      <section className="mt-[24px] w-full overflow-hidden rounded-[8px] border border-[#DCE5EE] bg-white">
        <div className="grid min-w-[950px] grid-cols-[45px_1.25fr_1.2fr_0.7fr_0.9fr_1fr_0.9fr_70px] items-center border-b border-[#DCE5EE] bg-[#F8FAFC] px-[12px] py-[10px]">
          <div className="flex items-center justify-center">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={toggleSelectAll}
              className="h-[11px] w-[11px] cursor-pointer accent-[#0B3D6B]"
            />
          </div>
          <TableHeader text="LEAD" />
          <TableHeader text="COMPANY" />
          <TableHeader text="SCORE" />
          <TableHeader text="STATUS" />
          <TableHeader text="ASSIGNED TO" />
          <TableHeader text="EST. VALUE" align="right" />
          <TableHeader text="ACTION" align="center" />
        </div>

        {loading && (
          <div className="flex h-[180px] items-center justify-center">
            <div className="flex items-center gap-[8px]">
              <RefreshCw size={15} className="animate-spin text-[#0B3D6B]" />
              <span className="text-[10px] font-medium text-[#667B8E]">
                Loading leads...
              </span>
            </div>
          </div>
        )}

        {!loading && error && (
          <div className="flex min-h-[180px] flex-col items-center justify-center gap-[10px] px-[20px]">
            <p className="max-w-[500px] text-center text-[11px] font-medium text-[#FF3B3B]">
              {error}
            </p>
            <button
              type="button"
              onClick={fetchLeads}
              className="flex h-[30px] items-center gap-[6px] rounded-[6px] border border-[#D7E2EC] bg-white px-[11px] text-[9px] font-semibold text-[#173B5C] hover:bg-[#F7F9FC]"
            >
              <RefreshCw size={11} />
              Retry
            </button>
          </div>
        )}

        {!loading && !error && leads.length === 0 && (
          <div className="flex h-[180px] items-center justify-center">
            <p className="text-[10px] font-medium text-[#8292A0]">
              No leads found.
            </p>
          </div>
        )}

        {!loading &&
          !error &&
          leads.map((lead) => {
            const score = getScore(lead);
            const leadName = getLeadName(lead);

            return (
              <div
                key={lead._id || lead.id}
                className="grid min-w-[950px] grid-cols-[45px_1.25fr_1.2fr_0.7fr_0.9fr_1fr_0.9fr_70px] items-center border-b border-[#E3EAF1] px-[12px] py-[9px] hover:bg-[#FAFCFE]"
              >
                <div className="flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked={selectedLeads.includes(lead._id)}
                    onChange={() => toggleSelectLead(lead._id)}
                    className="h-[11px] w-[11px] cursor-pointer accent-[#0B3D6B]"
                  />
                </div>

                <div className="flex min-w-0 items-center gap-[8px]">
                  <div className="flex h-[27px] w-[27px] shrink-0 items-center justify-center rounded-full bg-[#D9E8FF] text-[8px] font-semibold text-[#24598A]">
                    {getInitials(lead)}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-[9px] font-semibold text-[#173B5C]" title={leadName}>
                      {leadName}
                    </p>
                    <p className="truncate text-[8px] font-medium text-[#8292A0]" title={lead.email || ""}>
                      {lead.email || "No email"}
                    </p>
                  </div>
                </div>

                <div className="min-w-0 pr-[8px]">
                  <span className="block truncate text-[9px] font-medium text-[#526B80]">
                    {lead.company || "—"}
                  </span>
                </div>

                <div className="flex items-center gap-[5px]">
                  {score !== null && (
                    <span
                      className="h-[6px] w-[6px] rounded-full"
                      style={{ backgroundColor: getScoreColor(score) }}
                    />
                  )}
                  <span
                    className="text-[9px] font-semibold"
                    style={{ color: getScoreColor(score) }}
                  >
                    {score !== null ? score : "—"}
                  </span>
                  {score !== null && (
                    <span className="text-[8px] font-medium text-[#8292A0]">
                      ({getScoreLabel(score)})
                    </span>
                  )}
                </div>

                <div>
                  <span
                    className={`inline-flex whitespace-nowrap rounded-[5px] px-[8px] py-[4px] text-[8px] font-semibold ${getStatusClass(
                      lead.status
                    )}`}
                  >
                    {lead.status || "New"}
                  </span>
                </div>

                <div className="flex min-w-0 items-center gap-[7px]">
                  {lead.assignedTo ? (
                    <>
                      <div className="flex h-[19px] w-[19px] shrink-0 items-center justify-center rounded-full bg-[#DCE5ED] text-[7px] font-semibold text-[#526B80]">
                        {getInitials(
                          typeof lead.assignedTo === "object"
                            ? lead.assignedTo
                            : {}
                        )}
                      </div>
                      <span className="truncate text-[9px] font-medium text-[#526B80]">
                        {getAssignedName(lead)}
                      </span>
                    </>
                  ) : (
                    <span className="text-[9px] font-medium text-[#A0ADB8]">
                      Unassigned
                    </span>
                  )}
                </div>

                <div className="text-right">
                  <span className="text-[9px] font-semibold text-[#173B5C]">
                    {formatCurrency(lead.value)}
                  </span>
                </div>

                <div className="flex items-center justify-center gap-[4px]">
                  <button
                    type="button"
                    title="Edit / Assign lead"
                    onClick={() => openEditModal(lead)}
                    className="flex h-[25px] w-[25px] items-center justify-center rounded-[5px] text-[#526B80] hover:bg-[#EEF4F9]"
                  >
                    <Pencil size={11} />
                  </button>

                  <button
                    type="button"
                    title="Delete lead"
                    onClick={() => deleteLead(lead._id)}
                    className="flex h-[25px] w-[25px] items-center justify-center rounded-[5px] text-[#9A6A6A] hover:bg-[#FFF1F1]"
                  >
                    <Trash2 size={11} />
                  </button>
                </div>
              </div>
            );
          })}

        {!loading && !error && pagination.total > 0 && (
          <div className="flex min-h-[46px] items-center justify-between px-[17px]">
            <p className="text-[8px] font-medium text-[#667B8E]">
              Showing{" "}
              <span className="font-semibold text-[#173B5C]">{showingFrom}</span>{" "}
              to{" "}
              <span className="font-semibold text-[#173B5C]">{showingTo}</span>{" "}
              of{" "}
              <span className="font-semibold text-[#173B5C]">
                {pagination.total.toLocaleString()}
              </span>{" "}
              entries
            </p>

            <div className="flex items-center gap-[5px]">
              <button
                type="button"
                disabled={!pagination.hasPreviousPage}
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                className="flex h-[25px] w-[25px] items-center justify-center text-[#526B80] disabled:text-[#C3CCD4]"
              >
                <ChevronLeft size={12} />
              </button>

              {pageNumbers.map((number, index) =>
                number === "..." ? (
                  <span key={`dots-${index}`} className="px-[2px] text-[9px] text-[#8292A0]">
                    ...
                  </span>
                ) : (
                  <button
                    key={number}
                    type="button"
                    onClick={() => setPage(number)}
                    className={`flex h-[25px] min-w-[25px] items-center justify-center rounded-[4px] text-[9px] font-medium ${
                      number === page
                        ? "bg-[#0B3D6B] font-semibold text-white"
                        : "text-[#526B80] hover:bg-[#F3F6F9]"
                    }`}
                  >
                    {number}
                  </button>
                )
              )}

              <button
                type="button"
                disabled={!pagination.hasNextPage}
                onClick={() => setPage((p) => p + 1)}
                className="flex h-[25px] w-[25px] items-center justify-center text-[#526B80] disabled:text-[#C3CCD4]"
              >
                <ChevronRight size={12} />
              </button>
            </div>
          </div>
        )}
      </section>

      {/* EDIT / ASSIGN MODAL */}
      {editingLead && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#173B5C]/30 px-[20px] backdrop-blur-[2px]"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeEditModal();
          }}
        >
          <div className="w-full max-w-[430px] overflow-hidden rounded-[12px] border border-[#DCE5EE] bg-white shadow-[0_20px_60px_rgba(23,59,92,0.18)]">
            <div className="flex items-center justify-between border-b border-[#E3EAF1] px-[20px] py-[15px]">
              <div>
                <p className="text-[13px] font-semibold text-[#173B5C]">
                  Assign Lead
                </p>
                <p className="mt-[2px] text-[9px] font-medium text-[#8292A0]">
                  Select an employee for this lead.
                </p>
              </div>

              <button
                type="button"
                onClick={closeEditModal}
                disabled={saving}
                className="flex h-[28px] w-[28px] items-center justify-center rounded-[6px] text-[#667B8E] hover:bg-[#F3F6F9]"
              >
                <X size={14} />
              </button>
            </div>

            <div className="mx-[20px] mt-[18px] flex items-center gap-[10px] rounded-[8px] border border-[#E3EAF1] bg-[#F8FAFC] px-[12px] py-[10px]">
              <div className="flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-full bg-[#D9E8FF] text-[9px] font-semibold text-[#24598A]">
                {getInitials(editingLead)}
              </div>

              <div className="min-w-0">
                <p className="truncate text-[10px] font-semibold text-[#173B5C]">
                  {getLeadName(editingLead)}
                </p>
                <p className="truncate text-[8px] text-[#8292A0]">
                  {editingLead.email || "No email"}
                </p>
              </div>
            </div>

            <div className="px-[20px] py-[18px]">
              <label className="mb-[7px] flex items-center gap-[5px] text-[9px] font-semibold text-[#526B80]">
                <UserRound size={11} />
                Assigned To
              </label>

              <select
                value={assignedTo}
                onChange={(event) => setAssignedTo(event.target.value)}
                disabled={employeesLoading || saving}
                className="h-[40px] w-full rounded-[7px] border border-[#D7E2EC] bg-white px-[11px] text-[10px] font-medium text-[#173B5C] outline-none focus:border-[#7DA8CF] disabled:bg-[#F5F7F9]"
              >
                <option value="">Unassigned</option>

                {employees.map((employee) => (
                  <option key={employee._id} value={employee._id}>
                    {`${employee.firstName || ""} ${employee.lastName || ""}`.trim() ||
                      employee.email ||
                      "Employee"}
                  </option>
                ))}
              </select>

              {employeesLoading && (
                <p className="mt-[6px] flex items-center gap-[5px] text-[8px] text-[#8292A0]">
                  <RefreshCw size={9} className="animate-spin" />
                  Loading employees...
                </p>
              )}

              {!employeesLoading && employees.length === 0 && !modalError && (
                <p className="mt-[6px] text-[8px] text-[#C43D3D]">
                  No active employees found.
                </p>
              )}

              {modalError && (
                <p className="mt-[8px] rounded-[6px] bg-[#FFF1F1] px-[9px] py-[7px] text-[8px] font-medium text-[#C43D3D]">
                  {modalError}
                </p>
              )}

              <div className="mt-[20px] flex justify-end gap-[8px]">
                <button
                  type="button"
                  onClick={closeEditModal}
                  disabled={saving}
                  className="h-[34px] rounded-[6px] border border-[#D7E2EC] bg-white px-[13px] text-[9px] font-semibold text-[#526B80] hover:bg-[#F7F9FC]"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={saveLeadAssignment}
                  disabled={saving || employeesLoading}
                  className="flex h-[34px] items-center gap-[6px] rounded-[6px] bg-[#0B3D6B] px-[14px] text-[9px] font-semibold text-white hover:bg-[#092F54] disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <RefreshCw size={10} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check size={10} />
                      Save Assignment
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const TableHeader = ({ text, align = "left" }) => (
  <div
    className={`text-[8px] font-semibold tracking-[0.3px] text-[#62778B] ${
      align === "right"
        ? "text-right"
        : align === "center"
        ? "text-center"
        : "text-left"
    }`}
  >
    {text}
  </div>
);

export default LeadsTable;
