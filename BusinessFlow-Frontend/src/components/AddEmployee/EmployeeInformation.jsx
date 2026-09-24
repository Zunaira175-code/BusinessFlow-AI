import { useState } from "react";
import {
  UserRound,
  Mail,
  BriefcaseBusiness,
  Building2,
  Phone,
  Link as LinkIcon,
  ChevronDown,
  Copy,
  Check,
  MessageCircle,
  X,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const EmployeeInformation = () => {
  const navigate = useNavigate();

  // =====================================================
  // FORM STATE
  // =====================================================

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "employee",
    department: "",
    jobTitle: "",
    phone: "",
  });

  // =====================================================
  // UI STATE
  // =====================================================

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  const [invitationLink, setInvitationLink] = useState("");

  // =====================================================
  // INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  // =====================================================
  // CREATE INVITATION
  // =====================================================

  const handleCreateInvitation = async (e) => {
    e.preventDefault();

    setError("");
    setCopied(false);

    // -----------------------------------------------------
    // FRONTEND VALIDATION
    // -----------------------------------------------------

    if (!formData.firstName.trim()) {
      setError("First name is required.");
      return;
    }

    if (!formData.lastName.trim()) {
      setError("Last name is required.");
      return;
    }

    if (!formData.email.trim()) {
      setError("Work email is required.");
      return;
    }

    // -----------------------------------------------------
    // EMAIL VALIDATION
    // -----------------------------------------------------

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(formData.email.trim())) {
      setError("Please enter a valid work email address.");
      return;
    }

    try {
      setLoading(true);

      // ---------------------------------------------------
      // AUTH TOKEN
      // ---------------------------------------------------

     const token = localStorage.getItem("businessflow_token");

      if (!token) {
        setError("Your session has expired. Please login again.");
        return;
      }

      // ---------------------------------------------------
      // API REQUEST
      // ---------------------------------------------------

      const response = await fetch(
        "http://localhost:5000/api/employees",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            firstName: formData.firstName.trim(),
            lastName: formData.lastName.trim(),
            email: formData.email.trim().toLowerCase(),
            role: formData.role,
            department: formData.department,
            jobTitle: formData.jobTitle.trim(),
            phone: formData.phone.trim(),
          }),
        }
      );

      const data = await response.json();

      // ---------------------------------------------------
      // API ERROR
      // ---------------------------------------------------

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to create employee invitation."
        );
      }

      // ---------------------------------------------------
      // GET INVITATION LINK
      // ---------------------------------------------------

      const generatedLink = data?.data?.invitation?.link;

      if (!generatedLink) {
        throw new Error(
          "Invitation was created, but the invitation link was not returned."
        );
      }

      setInvitationLink(generatedLink);
      setSuccess(true);

    } catch (err) {
      console.error("Create Invitation Error:", err);

      setError(
        err.message ||
          "Something went wrong while creating the invitation."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // COPY INVITATION LINK
  // =====================================================

  const handleCopyLink = async () => {
    if (!invitationLink) return;

    try {
      await navigator.clipboard.writeText(invitationLink);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Copy Error:", error);
    }
  };

  // =====================================================
  // WHATSAPP SHARE
  // =====================================================

  const handleWhatsAppShare = () => {
    if (!invitationLink) return;

    const employeeName =
      `${formData.firstName} ${formData.lastName}`.trim();

    const message = `Hi ${employeeName},

You've been invited to join our BusinessFlow AI workspace.

Please use the invitation link below to create your account:

${invitationLink}

This invitation link is valid for 48 hours.`;

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
      message
    )}`;

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  // =====================================================
  // CANCEL
  // =====================================================

  const handleCancel = () => {
    navigate("/admin/employees");
  };

  // =====================================================
  // SUCCESS SCREEN
  // =====================================================

  if (success) {
    return (
      <section className="w-full overflow-hidden rounded-lg border border-[#DCE7F1] bg-white">

        {/* Header */}
        <div className="border-b border-[#E7EEF4] px-5 py-4">
          <div className="flex items-center gap-2.5">

            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EAF8F0] text-[#16A34A]">
              <Check size={17} strokeWidth={2.2} />
            </div>

            <div>
              <h2 className="text-[15px] font-semibold text-[#102F4B]">
                Invitation Created
              </h2>

              <p className="mt-0.5 text-[10px] text-[#71859A]">
                The employee invitation has been created successfully.
              </p>
            </div>

          </div>
        </div>

        {/* Success Content */}
        <div className="px-5 py-5">

          <div className="rounded-lg border border-[#DCE7F1] bg-[#F8FBFE] p-4">

            <div className="mb-3">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-[#71859A]">
                Employee
              </p>

              <p className="mt-1 text-[13px] font-semibold text-[#102F4B]">
                {formData.firstName} {formData.lastName}
              </p>

              <p className="text-[10px] text-[#71859A]">
                {formData.email}
              </p>
            </div>

            {/* Invitation Link */}
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold text-[#193B5B]">
                Invitation Link
              </label>

              <div className="flex items-center gap-2">

                <div className="flex min-w-0 flex-1 items-center rounded-md border border-[#D5E1EB] bg-white px-3">

                  <LinkIcon
                    size={14}
                    className="mr-2 shrink-0 text-[#71879A]"
                  />

                  <input
                    type="text"
                    value={invitationLink}
                    readOnly
                    className="h-[37px] min-w-0 flex-1 bg-transparent text-[10px] font-medium text-[#193B5B] outline-none"
                  />

                </div>

                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="flex h-[37px] shrink-0 items-center gap-1.5 rounded-md border border-[#D5E1EB] bg-white px-3 text-[10px] font-semibold text-[#193B5B] transition hover:bg-[#F4F8FB]"
                >
                  {copied ? (
                    <>
                      <Check size={13} />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy size={13} />
                      Copy
                    </>
                  )}
                </button>

              </div>
            </div>

            {/* WhatsApp */}
            <div className="mt-4">

              <button
                type="button"
                onClick={handleWhatsAppShare}
                className="flex h-[37px] w-full items-center justify-center gap-2 rounded-md bg-[#25D366] px-4 text-[11px] font-semibold text-white transition hover:bg-[#20BD5A] active:scale-[0.99]"
              >
                <MessageCircle size={15} />
                Share via WhatsApp
              </button>

            </div>

            <div className="mt-3 flex items-start gap-2 rounded-md border border-[#DDEAF6] bg-[#F4F9FE] px-3 py-2.5">

              <AlertCircle
                size={14}
                className="mt-0.5 shrink-0 text-[#1677E8]"
              />

              <p className="text-[9px] leading-[15px] text-[#617A91]">
                This invitation link expires after 48 hours. The employee
                will create their password after opening the invitation.
              </p>

            </div>

          </div>

        </div>

        {/* Bottom Actions */}
        <div className="flex justify-end gap-2 border-t border-[#EEF2F6] bg-[#FBFCFE] px-5 py-3">

          <button
            type="button"
            onClick={handleCancel}
            className="h-[34px] rounded-md border border-[#D5E1EB] bg-white px-4 text-[11px] font-semibold text-[#193B5B] transition hover:bg-[#F7F9FB]"
          >
            Back to Employees
          </button>

          <button
            type="button"
            onClick={() => {
              setSuccess(false);
              setInvitationLink("");
              setFormData({
                firstName: "",
                lastName: "",
                email: "",
                role: "employee",
                department: "",
                jobTitle: "",
                phone: "",
              });
            }}
            className="h-[34px] rounded-md bg-[#0B3D6B] px-4 text-[11px] font-semibold text-white transition hover:bg-[#09365F]"
          >
            Add Another Employee
          </button>

        </div>

      </section>
    );
  }

  // =====================================================
  // FORM
  // =====================================================

  return (
    <section className="w-full overflow-hidden rounded-lg border border-[#DCE7F1] bg-white">

      {/* Section Header */}
      <div className="flex min-h-[50px] items-center justify-between border-b border-[#E7EEF4] px-5">

        <div className="flex items-center gap-2.5">

          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#EEF5FF] text-[#1677E8]">
            <UserRound size={16} strokeWidth={1.9} />
          </div>

          <h2 className="text-[15px] font-semibold text-[#102F4B]">
            Employee Information
          </h2>

        </div>

        <p className="text-[10px] font-medium text-[#71859A]">
          All fields marked with{" "}
          <span className="text-[#EF4444]">*</span> are required
        </p>

      </div>

      {/* FORM */}
      <form onSubmit={handleCreateInvitation}>

        <div className="px-5 py-4">

          <div className="grid grid-cols-1 gap-x-5 gap-y-3.5 md:grid-cols-2">

            {/* First Name */}
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold text-[#193B5B]">
                First Name <span className="text-[#EF4444]">*</span>
              </label>

              <input
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Enter first name"
                className="h-[37px] w-full rounded-md border border-[#D5E1EB] bg-white px-3 text-[11px] font-medium text-[#193B5B] outline-none placeholder:text-[#91A4B7] transition focus:border-[#7EA9D0] focus:ring-2 focus:ring-[#0B3D6B]/5"
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold text-[#193B5B]">
                Last Name <span className="text-[#EF4444]">*</span>
              </label>

              <input
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Enter last name"
                className="h-[37px] w-full rounded-md border border-[#D5E1EB] bg-white px-3 text-[11px] font-medium text-[#193B5B] outline-none placeholder:text-[#91A4B7] transition focus:border-[#7EA9D0] focus:ring-2 focus:ring-[#0B3D6B]/5"
              />
            </div>

            {/* Work Email */}
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold text-[#193B5B]">
                Work Email <span className="text-[#EF4444]">*</span>
              </label>

              <div className="relative">

                <Mail
                  size={15}
                  strokeWidth={1.7}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#71879A]"
                />

                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="employee@company.com"
                  className="h-[37px] w-full rounded-md border border-[#D5E1EB] bg-white pl-9 pr-3 text-[11px] font-medium text-[#193B5B] outline-none placeholder:text-[#91A4B7] transition focus:border-[#7EA9D0] focus:ring-2 focus:ring-[#0B3D6B]/5"
                />

              </div>
            </div>

            {/* Role */}
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold text-[#193B5B]">
                Role <span className="text-[#EF4444]">*</span>
              </label>

              <div className="relative">

                <UserRound
                  size={15}
                  strokeWidth={1.7}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#71879A]"
                />

                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="h-[37px] w-full appearance-none rounded-md border border-[#D5E1EB] bg-white pl-9 pr-9 text-[11px] font-medium capitalize text-[#193B5B] outline-none transition focus:border-[#7EA9D0] focus:ring-2 focus:ring-[#0B3D6B]/5"
                >
                  <option value="employee">
                    Employee
                  </option>

                  <option value="admin">
                    Admin
                  </option>
                </select>

                <ChevronDown
                  size={14}
                  strokeWidth={1.8}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#5E7488]"
                />

              </div>
            </div>

            {/* Department */}
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold text-[#193B5B]">
                Department
              </label>

              <div className="relative">

                <Building2
                  size={15}
                  strokeWidth={1.7}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#71879A]"
                />

                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className={`h-[37px] w-full appearance-none rounded-md border border-[#D5E1EB] bg-white pl-9 pr-9 text-[11px] font-medium outline-none transition focus:border-[#7EA9D0] focus:ring-2 focus:ring-[#0B3D6B]/5 ${
                    formData.department
                      ? "text-[#193B5B]"
                      : "text-[#91A4B7]"
                  }`}
                >
                  <option value="" disabled>
                    Select department
                  </option>

                  <option value="Sales">Sales</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Development">Development</option>
                  <option value="HR">HR</option>
                </select>

                <ChevronDown
                  size={14}
                  strokeWidth={1.8}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#5E7488]"
                />

              </div>
            </div>

            {/* Job Title */}
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold text-[#193B5B]">
                Job Title
              </label>

              <div className="relative">

                <BriefcaseBusiness
                  size={15}
                  strokeWidth={1.7}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#71879A]"
                />

                <input
                  name="jobTitle"
                  type="text"
                  value={formData.jobTitle}
                  onChange={handleChange}
                  placeholder="Enter job title"
                  className="h-[37px] w-full rounded-md border border-[#D5E1EB] bg-white pl-9 pr-3 text-[11px] font-medium text-[#193B5B] outline-none placeholder:text-[#91A4B7] transition focus:border-[#7EA9D0] focus:ring-2 focus:ring-[#0B3D6B]/5"
                />

              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold text-[#193B5B]">
                Phone Number{" "}
                <span className="font-normal text-[#7A8EA1]">
                  (Optional)
                </span>
              </label>

              <div className="relative">

                <Phone
                  size={15}
                  strokeWidth={1.7}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#71879A]"
                />

                <input
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 123-4567"
                  className="h-[37px] w-full rounded-md border border-[#D5E1EB] bg-white pl-9 pr-3 text-[11px] font-medium text-[#193B5B] outline-none placeholder:text-[#91A4B7] transition focus:border-[#7EA9D0] focus:ring-2 focus:ring-[#0B3D6B]/5"
                />

              </div>
            </div>

            {/* Invitation Method */}
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold text-[#193B5B]">
                Invitation Method
              </label>

              <div className="flex h-[37px] items-center gap-2 rounded-md border border-[#D5E1EB] bg-[#F8FBFE] px-3">

                <LinkIcon
                  size={15}
                  strokeWidth={1.7}
                  className="text-[#71879A]"
                />

                <span className="text-[11px] font-medium text-[#193B5B]">
                  Generate invitation link
                </span>

              </div>

              <p className="mt-1.5 text-[9px] text-[#7C91A4]">
                Copy the generated link or share it directly via WhatsApp.
              </p>
            </div>

          </div>

          {/* ERROR */}
          {error && (
            <div className="mt-4 flex items-start gap-2 rounded-md border border-[#FECACA] bg-[#FEF2F2] px-3 py-2.5">

              <AlertCircle
                size={14}
                className="mt-0.5 shrink-0 text-[#DC2626]"
              />

              <p className="text-[10px] leading-[15px] text-[#B91C1C]">
                {error}
              </p>

              <button
                type="button"
                onClick={() => setError("")}
                className="ml-auto text-[#B91C1C]"
              >
                <X size={14} />
              </button>

            </div>
          )}

        </div>

        {/* Bottom Actions */}
        <div className="flex flex-col gap-3 border-t border-[#EEF2F6] bg-[#FBFCFE] px-5 py-3 sm:flex-row sm:items-center sm:justify-end">

          <button
            type="button"
            onClick={handleCancel}
            disabled={loading}
            className="h-[34px] rounded-md border border-[#D5E1EB] bg-white px-4 text-[11px] font-semibold text-[#193B5B] transition hover:bg-[#F7F9FB] disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="flex h-[34px] min-w-[160px] items-center justify-center gap-1.5 rounded-md bg-[#0B3D6B] px-4 text-[11px] font-semibold text-white transition hover:bg-[#09365F] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
          >

            {loading ? (
              <>
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                Creating...
              </>
            ) : (
              <>
                <LinkIcon size={13} strokeWidth={2} />
                Create Invitation
              </>
            )}

          </button>

        </div>

      </form>

    </section>
  );
};

export default EmployeeInformation;