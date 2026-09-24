import { useEffect, useRef, useState } from "react";
import { Camera, Upload } from "lucide-react";

import Card from "../common/Card";
import Button from "../common/button";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const DEFAULT_PROFILE = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  jobTitle: "",
};

const ProfileInformation = () => {
  const fileInputRef = useRef(null);

  const [profile, setProfile] =
    useState(DEFAULT_PROFILE);

  const [savedProfile, setSavedProfile] =
    useState(DEFAULT_PROFILE);

  const [profileImage, setProfileImage] =
    useState(null);

  const [savedProfilePicture, setSavedProfilePicture] =
    useState(null);

  const [imageError, setImageError] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [uploadingImage, setUploadingImage] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  /* =====================================================
     TOKEN
  ====================================================== */

  const getToken = () => {
    return (
      localStorage.getItem("businessflow_token") ||
      sessionStorage.getItem("businessflow_token")
    );
  };

  /* =====================================================
     LOAD PROFILE
  ====================================================== */

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");
        setSuccess("");

        const token = getToken();

        if (!token) {
          setError(
            "Authentication token not found. Please login again."
          );
          return;
        }

        const response = await fetch(
          `${API_BASE_URL}/api/settings/account`,
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
            result.message ||
              "Failed to load profile information."
          );
        }

        const user = result?.data?.user;

        if (!user) {
          throw new Error(
            "Profile information was not returned."
          );
        }

        const loadedProfile = {
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          email: user.email || "",
          phone: user.phone || "",
          jobTitle: user.jobTitle || "",
        };

        setProfile(loadedProfile);
        setSavedProfile(loadedProfile);

        setSavedProfilePicture(
          user.profilePicture || null
        );
      } catch (err) {
        console.error(
          "Fetch Profile Error:",
          err
        );

        setError(
          err.message ||
            "Unable to load profile information."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  /* =====================================================
     HANDLE INPUT
  ====================================================== */

  const handleChange = (
    field,
    value
  ) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));

    setError("");
    setSuccess("");
  };

  /* =====================================================
     OPEN FILE PICKER
  ====================================================== */

  const handleUploadClick = () => {
    if (uploadingImage || saving) {
      return;
    }

    fileInputRef.current?.click();
  };

  /* =====================================================
     SELECT PROFILE PICTURE
  ====================================================== */

  const handleProfileImage = (
    event
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    setImageError("");
    setError("");
    setSuccess("");

    /* ---------------------------------------------------
       ALLOWED FILE TYPES
    --------------------------------------------------- */

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
    ];

    if (
      !allowedTypes.includes(
        file.type
      )
    ) {
      setImageError(
        "Please upload a JPG, PNG or GIF image."
      );

      event.target.value = "";
      return;
    }

    /* ---------------------------------------------------
       MAXIMUM 800 KB
    --------------------------------------------------- */

    if (
      file.size >
      800 * 1024
    ) {
      setImageError(
        "Image size must be less than 800K."
      );

      event.target.value = "";
      return;
    }

    /* ---------------------------------------------------
       REMOVE PREVIOUS TEMPORARY PREVIEW
    --------------------------------------------------- */

    if (profileImage?.preview) {
      URL.revokeObjectURL(
        profileImage.preview
      );
    }

    /* ---------------------------------------------------
       CREATE NEW PREVIEW
    --------------------------------------------------- */

    const imageUrl =
      URL.createObjectURL(file);

    setProfileImage({
      file,
      preview: imageUrl,
    });
  };

  /* =====================================================
     UPLOAD PROFILE PICTURE
  ====================================================== */

  const handleUploadProfilePicture =
    async () => {
      try {
        setImageError("");
        setError("");
        setSuccess("");

        /* -------------------------------------------------
           CHECK SELECTED IMAGE
        ------------------------------------------------- */

        if (!profileImage?.file) {
          setImageError(
            "Please select a profile picture first."
          );
          return;
        }

        /* -------------------------------------------------
           GET TOKEN
        ------------------------------------------------- */

        const token = getToken();

        if (!token) {
          setError(
            "Authentication token not found. Please login again."
          );
          return;
        }

        setUploadingImage(true);

        /* -------------------------------------------------
           FORM DATA
        ------------------------------------------------- */

        const formData =
          new FormData();

        formData.append(
          "profilePicture",
          profileImage.file
        );

        /* -------------------------------------------------
           UPLOAD TO BACKEND
        ------------------------------------------------- */

        const response =
          await fetch(
            `${API_BASE_URL}/api/settings/account/profile-picture`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
              },
              body: formData,
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
              "Failed to upload profile picture."
          );
        }

        /* -------------------------------------------------
           GET SAVED IMAGE URL
        ------------------------------------------------- */

        const uploadedPicture =
          result?.data?.profilePicture;

        if (!uploadedPicture) {
          throw new Error(
            "Profile picture URL was not returned."
          );
        }

        /* -------------------------------------------------
           SAVE IMAGE URL LOCALLY
        ------------------------------------------------- */

        setSavedProfilePicture(
          uploadedPicture
        );

        /* -------------------------------------------------
           REMOVE TEMPORARY PREVIEW
        ------------------------------------------------- */

        if (profileImage?.preview) {
          URL.revokeObjectURL(
            profileImage.preview
          );
        }

        setProfileImage(null);

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

        /* -------------------------------------------------
           IMPORTANT:
           UPDATE HEADER IMMEDIATELY
        ------------------------------------------------- */

        window.dispatchEvent(
          new CustomEvent(
            "businessflow-profile-updated",
            {
              detail: {
                profilePicture:
                  uploadedPicture,
              },
            }
          )
        );

        setSuccess(
          "Profile picture uploaded successfully."
        );
      } catch (err) {
        console.error(
          "Profile Picture Upload Error:",
          err
        );

        setError(
          err.message ||
            "Unable to upload profile picture."
        );
      } finally {
        setUploadingImage(false);
      }
    };

  /* =====================================================
     SAVE PROFILE INFORMATION
  ====================================================== */

  const handleSave =
    async () => {
      try {
        setSaving(true);
        setError("");
        setSuccess("");
        setImageError("");

        const token = getToken();

        if (!token) {
          setError(
            "Authentication token not found. Please login again."
          );
          return;
        }

        /* -------------------------------------------------
           VALIDATION
        ------------------------------------------------- */

        if (
          !profile.firstName.trim()
        ) {
          setError(
            "First name is required."
          );
          return;
        }

        if (
          !profile.lastName.trim()
        ) {
          setError(
            "Last name is required."
          );
          return;
        }

        if (
          !profile.email.trim()
        ) {
          setError(
            "Email address is required."
          );
          return;
        }

        /* -------------------------------------------------
           UPDATE USER INFORMATION
        ------------------------------------------------- */

        const response =
          await fetch(
            `${API_BASE_URL}/api/settings/account`,
            {
              method: "PATCH",
              headers: {
                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${token}`,

                Accept:
                  "application/json",
              },

              body: JSON.stringify({
                firstName:
                  profile.firstName.trim(),

                lastName:
                  profile.lastName.trim(),

                email:
                  profile.email.trim(),

                phone:
                  profile.phone.trim(),

                jobTitle:
                  profile.jobTitle.trim(),
              }),
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
              "Failed to save profile information."
          );
        }

        /* -------------------------------------------------
           UPDATED USER
        ------------------------------------------------- */

        const updatedUser =
          result?.data?.user;

        const updatedProfile = {
          firstName:
            updatedUser?.firstName ||
            profile.firstName.trim(),

          lastName:
            updatedUser?.lastName ||
            profile.lastName.trim(),

          email:
            updatedUser?.email ||
            profile.email.trim(),

          phone:
            updatedUser?.phone ||
            profile.phone.trim(),

          jobTitle:
            updatedUser?.jobTitle ||
            profile.jobTitle.trim(),
        };

        setProfile(
          updatedProfile
        );

        setSavedProfile(
          updatedProfile
        );

        /* -------------------------------------------------
           ALSO NOTIFY HEADER ABOUT USER DATA
        ------------------------------------------------- */

        window.dispatchEvent(
          new CustomEvent(
            "businessflow-profile-updated",
            {
              detail: {
                firstName:
                  updatedProfile.firstName,

                lastName:
                  updatedProfile.lastName,

                email:
                  updatedProfile.email,

                phone:
                  updatedProfile.phone,

                jobTitle:
                  updatedProfile.jobTitle,

                profilePicture:
                  savedProfilePicture,
              },
            }
          )
        );

        setSuccess(
          "Profile information updated successfully."
        );
      } catch (err) {
        console.error(
          "Save Profile Error:",
          err
        );

        setError(
          err.message ||
            "Unable to save profile information."
        );
      } finally {
        setSaving(false);
      }
    };

  /* =====================================================
     CANCEL
  ====================================================== */

  const handleCancel = () => {
    setProfile(
      savedProfile
    );

    setImageError("");
    setError("");
    setSuccess("");

    /* ---------------------------------------------------
       REMOVE UNSAVED IMAGE PREVIEW
    --------------------------------------------------- */

    if (profileImage?.preview) {
      URL.revokeObjectURL(
        profileImage.preview
      );
    }

    setProfileImage(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  /* =====================================================
     PROFILE INITIALS
  ====================================================== */

  const getInitials = () => {
    const first =
      profile.firstName
        ?.trim()
        ?.charAt(0) || "";

    const last =
      profile.lastName
        ?.trim()
        ?.charAt(0) || "";

    const initials =
      `${first}${last}`;

    return (
      initials || "U"
    ).toUpperCase();
  };

  /* =====================================================
     PROFILE IMAGE SOURCE
  ====================================================== */

  const profileImageSource =
    profileImage?.preview ||
    savedProfilePicture ||
    null;

  /* =====================================================
     UI
  ====================================================== */

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
            LOADING
        ================================================== */}

        {loading ? (
          <div className="flex min-h-[250px] items-center justify-center">
            <p className="text-[10px] text-[#8495A5]">
              Loading profile information...
            </p>
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

            {/* =================================================
                PROFILE PICTURE
            ================================================== */}

            <div className="mb-5 flex items-center gap-3">

              {/* Hidden File Input */}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif"
                onChange={
                  handleProfileImage
                }
                className="hidden"
              />

              {/* Profile Picture */}

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
                  {profileImageSource ? (
                    <img
                      src={
                        profileImageSource
                      }
                      alt="Profile"
                      className="
                        h-full
                        w-full
                        object-cover
                      "
                    />
                  ) : (
                    <span
                      className="
                        text-[18px]
                        font-semibold
                        text-[#315D80]
                      "
                    >
                      {getInitials()}
                    </span>
                  )}
                </div>

                {/* Camera Button */}

                <button
                  type="button"
                  onClick={
                    handleUploadClick
                  }
                  disabled={
                    saving ||
                    uploadingImage
                  }
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
                    transition-colors
                    hover:bg-[#F3F7FA]
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                  aria-label="Change profile picture"
                >
                  <Camera
                    size={10}
                    strokeWidth={1.8}
                  />
                </button>
              </div>

              {/* Upload Area */}

              <div>

                {/* Upload Profile Picture */}

                <Button
                  type="button"
                  variant="secondary"
                  onClick={
                    handleUploadProfilePicture
                  }
                  disabled={
                    saving ||
                    uploadingImage ||
                    !profileImage?.file
                  }
                  className="
                    h-[30px]
                    rounded-[6px]
                    border-[#D8E2EA]
                    bg-white
                    px-3
                    text-[9px]
                    font-semibold
                    text-[#29465F]
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                >
                  <Upload
                    size={11}
                    strokeWidth={1.8}
                    className="mr-1.5"
                  />

                  {uploadingImage
                    ? "Uploading..."
                    : "Upload Profile Picture"}
                </Button>

                <p className="mt-1.5 text-[8px] text-[#8495A5]">
                  JPG, GIF or PNG. Max size of 800K
                </p>

                {imageError && (
                  <p className="mt-1 text-[8px] text-red-500">
                    {imageError}
                  </p>
                )}
              </div>
            </div>

            {/* =================================================
                FIRST + LAST NAME
            ================================================== */}

            <div className="grid grid-cols-2 gap-4">

              <FormField
                label="First Name"
                value={
                  profile.firstName
                }
                onChange={(value) =>
                  handleChange(
                    "firstName",
                    value
                  )
                }
                disabled={
                  saving ||
                  uploadingImage
                }
              />

              <FormField
                label="Last Name"
                value={
                  profile.lastName
                }
                onChange={(value) =>
                  handleChange(
                    "lastName",
                    value
                  )
                }
                disabled={
                  saving ||
                  uploadingImage
                }
              />

            </div>

            {/* =================================================
                EMAIL + PHONE
            ================================================== */}

            <div className="mt-3 grid grid-cols-2 gap-4">

              <FormField
                label="Email Address"
                value={
                  profile.email
                }
                onChange={(value) =>
                  handleChange(
                    "email",
                    value
                  )
                }
                type="email"
                disabled={
                  saving ||
                  uploadingImage
                }
              />

              <FormField
                label="Phone Number"
                value={
                  profile.phone
                }
                onChange={(value) =>
                  handleChange(
                    "phone",
                    value
                  )
                }
                disabled={
                  saving ||
                  uploadingImage
                }
              />

            </div>

            {/* =================================================
                JOB TITLE
            ================================================== */}

            <div className="mt-3">

              <FormField
                label="Job Title"
                value={
                  profile.jobTitle
                }
                onChange={(value) =>
                  handleChange(
                    "jobTitle",
                    value
                  )
                }
                disabled={
                  saving ||
                  uploadingImage
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

              {/* Cancel */}

              <Button
                type="button"
                variant="secondary"
                onClick={
                  handleCancel
                }
                disabled={
                  saving ||
                  uploadingImage
                }
                className="
                  h-[30px]
                  rounded-[6px]
                  border-[#D8E2EA]
                  bg-white
                  px-3
                  text-[9px]
                  font-semibold
                  text-[#29465F]
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                Cancel
              </Button>

              {/* Save Changes */}

              <Button
                type="button"
                onClick={
                  handleSave
                }
                disabled={
                  saving ||
                  uploadingImage
                }
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
                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </Button>

            </div>
          </>
        )}
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
  disabled = false,
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
        onChange={(e) =>
          onChange(
            e.target.value
          )
        }
        disabled={disabled}
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
          disabled:cursor-not-allowed
          disabled:bg-[#F7F9FC]
        "
      />

    </div>
  );
};

export default ProfileInformation;