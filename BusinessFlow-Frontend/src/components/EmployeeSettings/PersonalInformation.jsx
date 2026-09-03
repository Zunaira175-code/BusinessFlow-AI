import { useState } from "react";

const PersonalInformation = () => {
  const [form, setForm] = useState({
    fullName: "Alex Morgan",
    jobTitle: "Sales Representative",
    email: "alex.morgan@acmecorp.com",
    phone: "+1 (409) 419-3632",
  });

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Personal information:", form);
  };

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
      {/* Card Header */}
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

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="mt-4 grid grid-cols-2 gap-x-5 gap-y-4">

          {/* Full Name */}
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
              onChange={(e) =>
                handleChange("fullName", e.target.value)
              }
              className="
                h-[33px]
                w-full
                rounded-[6px]
                border
                border-[#DCE5ED]
                bg-white
                px-3
                text-[9px]
                text-[#17324D]
                outline-none
                transition
                focus:border-[#8CB8DD]
                focus:ring-1
                focus:ring-[#DCEAFF]
              "
            />
          </div>

          {/* Job Title */}
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
              onChange={(e) =>
                handleChange("jobTitle", e.target.value)
              }
              className="
                h-[33px]
                w-full
                rounded-[6px]
                border
                border-[#DCE5ED]
                bg-white
                px-3
                text-[9px]
                text-[#17324D]
                outline-none
                transition
                focus:border-[#8CB8DD]
                focus:ring-1
                focus:ring-[#DCEAFF]
              "
            />
          </div>

          {/* Email */}
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

          {/* Phone */}
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
              onChange={(e) =>
                handleChange("phone", e.target.value)
              }
              className="
                h-[33px]
                w-full
                rounded-[6px]
                border
                border-[#DCE5ED]
                bg-white
                px-3
                text-[9px]
                text-[#17324D]
                outline-none
                transition
                focus:border-[#8CB8DD]
                focus:ring-1
                focus:ring-[#DCEAFF]
              "
            />
          </div>

        </div>

        {/* Save */}
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