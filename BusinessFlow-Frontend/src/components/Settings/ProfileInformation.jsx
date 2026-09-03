import { useState } from "react";
import { Camera, Upload } from "lucide-react";

import Card from "../common/Card";
import Button from "../common/button";

const ProfileInformation = () => {
  const [profile, setProfile] = useState({
    firstName: "Alex",
    lastName: "Rivers",
    email: "alex.rivers@acme.corp",
    phone: "+1 (555) 123-4567",
    jobTitle: "Senior Account Executive",
  });

  const handleChange = (field, value) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    console.log("Profile saved:", profile);
  };

  const handleCancel = () => {
    setProfile({
      firstName: "Alex",
      lastName: "Rivers",
      email: "alex.rivers@acme.corp",
      phone: "+1 (555) 123-4567",
      jobTitle: "Senior Account Executive",
    });
  };

  return (
    <Card className="w-full overflow-hidden">

      {/* =================================================
          HEADER
      ================================================== */}

      <div className="px-4 pt-4">
        <h2 className="text-[13px] font-bold text-[#17324D]">
          Profile Information
        </h2>
      </div>


      <div className="px-4 pb-4 pt-4">

        {/* =================================================
            AVATAR
        ================================================== */}

        <div className="mb-5 flex items-center gap-3">

          {/* Avatar */}

          <div className="relative">
            <div
              className="
                flex
                h-[62px]
                w-[62px]
                items-center
                justify-center
                overflow-hidden
                rounded-full
                border
                border-[#DCE5ED]
                bg-[#EEF4F8]
              "
            >
              <span className="text-[18px] font-semibold text-[#315D80]">
                AR
              </span>
            </div>

            {/* Camera Button */}

            <button
              type="button"
              className="
                absolute
                bottom-0
                right-0
                flex
                h-[20px]
                w-[20px]
                items-center
                justify-center
                rounded-full
                border
                border-white
                bg-white
                text-[#315D80]
                shadow-sm
                hover:bg-[#F3F7FA]
              "
              aria-label="Change avatar"
            >
              <Camera size={10} strokeWidth={1.8} />
            </button>
          </div>


          {/* Upload */}

          <div>
            <Button
              type="button"
              variant="secondary"
              className="
                h-[30px]
                rounded-[6px]
                border-[#D8E2EA]
                bg-white
                px-3
                text-[9px]
                font-semibold
                text-[#29465F]
              "
            >
              <Upload
                size={11}
                strokeWidth={1.8}
                className="mr-1.5"
              />

              Upload New Avatar
            </Button>

            <p className="mt-1.5 text-[8px] text-[#8495A5]">
              JPG, GIF or PNG. Max size of 800K
            </p>
          </div>

        </div>


        {/* =================================================
            FIRST + LAST NAME
        ================================================== */}

        <div className="grid grid-cols-2 gap-4">

          <FormField
            label="First Name"
            value={profile.firstName}
            onChange={(value) =>
              handleChange("firstName", value)
            }
          />

          <FormField
            label="Last Name"
            value={profile.lastName}
            onChange={(value) =>
              handleChange("lastName", value)
            }
          />

        </div>


        {/* =================================================
            EMAIL + PHONE
        ================================================== */}

        <div className="mt-3 grid grid-cols-2 gap-4">

          <FormField
            label="Email Address"
            value={profile.email}
            onChange={(value) =>
              handleChange("email", value)
            }
            type="email"
          />

          <FormField
            label="Phone Number"
            value={profile.phone}
            onChange={(value) =>
              handleChange("phone", value)
            }
          />

        </div>


        {/* =================================================
            JOB TITLE
        ================================================== */}

        <div className="mt-3">

          <FormField
            label="Job Title"
            value={profile.jobTitle}
            onChange={(value) =>
              handleChange("jobTitle", value)
            }
          />

        </div>


        {/* =================================================
            DIVIDER
        ================================================== */}

        <div className="my-4 h-px w-full bg-[#DCE5ED]" />


        {/* =================================================
            ACTIONS
        ================================================== */}

        <div className="flex justify-end gap-2">

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
              text-[#29465F]
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

const FormField = ({
  label,
  value,
  onChange,
  type = "text",
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

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="
          h-[32px]
          w-full
          rounded-[6px]
          border
          border-[#DCE5ED]
          bg-white
          px-3
          text-[9px]
          text-[#29465F]
          outline-none
          transition-colors
          focus:border-[#8DA9C0]
        "
      />

    </div>
  );
};

export default ProfileInformation;