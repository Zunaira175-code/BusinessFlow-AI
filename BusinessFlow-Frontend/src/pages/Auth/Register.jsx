import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Zap, Eye, EyeOff } from "lucide-react";

const API_URL = "http://localhost:5000/api";

const Register = () => {
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        companyName: "",
        password: "",
        confirmPassword: "",
        terms: false,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));

        // Clear previous messages when user changes form
        if (error) setError("");
        if (success) setSuccess("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        // Frontend validation
        if (
            !formData.firstName.trim() ||
            !formData.lastName.trim() ||
            !formData.email.trim() ||
            !formData.companyName.trim() ||
            !formData.password ||
            !formData.confirmPassword
        ) {
            setError("Please fill in all required fields.");
            return;
        }

        if (!formData.terms) {
            setError(
                "You must accept the Terms of Service and Privacy Policy."
            );
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(
                `${API_URL}/auth/register`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        firstName: formData.firstName.trim(),
                        lastName: formData.lastName.trim(),
                        email: formData.email.trim().toLowerCase(),
                        companyName: formData.companyName.trim(),
                        password: formData.password,
                        confirmPassword: formData.confirmPassword,
                        terms: formData.terms,
                    }),
                }
            );

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(
                    result.message || "Registration failed."
                );
            }

            // Save authentication data
            const token = result.data?.token;
            const user = result.data?.user;

            if (!token || !user) {
                throw new Error(
                    "Registration succeeded, but authentication data was not received."
                );
            }

            localStorage.setItem("businessflow_token", token);
            localStorage.setItem(
                "businessflow_user",
                JSON.stringify(user)
            );

            setSuccess("Account created successfully.");

            // Redirect to dashboard
            setTimeout(() => {
                navigate("/admin/dashboard");
            }, 500);
        } catch (error) {
            console.error("Register Error:", error);

            setError(
                error.message ||
                "Something went wrong. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        console.log("Continue with Google");
    };

    return (
        <div className="relative min-h-screen overflow-hidden bg-[#EEF5FF]">

            {/* =====================================================
              BACKGROUND DECORATION
          ====================================================== */}

            <div
                className="
                    pointer-events-none
                    absolute
                    -left-[100px]
                    -top-[100px]
                    h-[420px]
                    w-[420px]
                    rounded-full
                    bg-[#D7E8FF]
                    opacity-80
                    blur-[50px]
                "
            />

            <div
                className="
                    pointer-events-none
                    absolute
                    -bottom-[120px]
                    -right-[100px]
                    h-[400px]
                    w-[400px]
                    rounded-full
                    bg-[#D7E8FF]
                    opacity-80
                    blur-[50px]
                "
            />

            {/* =====================================================
              MAIN CONTAINER
          ====================================================== */}

            <div
                className="
                    relative
                    z-10
                    flex
                    min-h-screen
                    items-center
                    justify-center
                    px-4
                    py-10
                "
            >

                <div className="w-full max-w-[800px]">

                    {/* =================================================
                      BRAND
                  ================================================= */}

                    <div className="mb-5 flex flex-col items-center">

                        {/* Logo */}
                        <div
                            className="
                                flex
                                h-[36px]
                                w-[36px]
                                items-center
                                justify-center
                                rounded-[6px]
                                bg-[#0B3D6B]
                                text-white
                                shadow-sm
                            "
                        >
                            <Zap
                                size={18}
                                strokeWidth={2.2}
                            />
                        </div>

                        {/* Brand */}
                        <h1
                            className="
                                mt-2
                                text-[12px]
                                font-semibold
                                tracking-[-0.2px]
                                text-[#092D50]
                            "
                        >
                            BusinessFlow AI
                        </h1>

                    </div>


                    {/* =================================================
                      REGISTER CARD
                  ================================================= */}

                    <div
                        className="
                            mx-auto
                            w-full
                            max-w-[340px]
                            rounded-[9px]
                            border
                            border-[#DCE5EF]
                            bg-white
                            px-[22px]
                            py-[22px]
                            shadow-[0_10px_25px_rgba(15,45,75,0.11)]
                        "
                    >

                        {/* Heading */}
                        <div className="text-center">

                            <h2
                                className="
                                    text-[17px]
                                    font-semibold
                                    tracking-[-0.3px]
                                    text-[#092D50]
                                "
                            >
                                Create Your Account
                            </h2>

                            <p
                                className="
                                    mt-2
                                    text-[8px]
                                    leading-4
                                    text-[#70859A]
                                "
                            >
                                Start managing your business with an AI-powered CRM.
                            </p>

                        </div>


                        {/* =================================================
                          FORM
                      ================================================= */}

                        <form
                            onSubmit={handleSubmit}
                            className="mt-5"
                        >

                            {/* =================================================
                              ERROR MESSAGE
                          ================================================= */}

                            {error && (
                                <div
                                    className="
                                        mb-3
                                        rounded-[4px]
                                        border
                                        border-red-200
                                        bg-red-50
                                        px-3
                                        py-2
                                        text-[8px]
                                        leading-3
                                        text-red-600
                                    "
                                >
                                    {error}
                                </div>
                            )}

                            {/* =================================================
                              SUCCESS MESSAGE
                          ================================================= */}

                            {success && (
                                <div
                                    className="
                                        mb-3
                                        rounded-[4px]
                                        border
                                        border-green-200
                                        bg-green-50
                                        px-3
                                        py-2
                                        text-[8px]
                                        leading-3
                                        text-green-600
                                    "
                                >
                                    {success}
                                </div>
                            )}

                            {/* =================================================
                              FIRST NAME + LAST NAME
                          ================================================= */}

                            <div className="grid grid-cols-2 gap-3">

                                <FormField
                                    label="First Name"
                                    name="firstName"
                                    placeholder="First Name"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                />

                                <FormField
                                    label="Last Name"
                                    name="lastName"
                                    placeholder="Last Name"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                />

                            </div>


                            {/* =================================================
                              WORK EMAIL
                          ================================================= */}

                            <div className="mt-3">

                                <FormField
                                    label="Work Email"
                                    name="email"
                                    type="email"
                                    placeholder="you@company.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                />

                            </div>


                            {/* =================================================
                              COMPANY NAME
                          ================================================= */}

                            <div className="mt-3">

                                <FormField
                                    label="Company Name"
                                    name="companyName"
                                    placeholder="Company Name"
                                    value={formData.companyName}
                                    onChange={handleChange}
                                />

                            </div>


                            {/* =================================================
                              PASSWORD
                          ================================================= */}

                            <div className="mt-3">

                                <label
                                    htmlFor="password"
                                    className="
                                        mb-1.5
                                        block
                                        text-[8px]
                                        font-semibold
                                        text-[#173B5C]
                                    "
                                >
                                    Password
                                </label>

                                <div className="relative">

                                    <input
                                        id="password"
                                        name="password"
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        placeholder="Create a password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="
                                            h-[32px]
                                            w-full
                                            rounded-[4px]
                                            border
                                            border-[#D8E2EC]
                                            bg-white
                                            px-3
                                            pr-9
                                            text-[9px]
                                            text-[#173B5C]
                                            outline-none
                                            placeholder:text-[#9AAABA]
                                            focus:border-[#7AAFE4]
                                            focus:ring-1
                                            focus:ring-[#D9EAFB]
                                        "
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(
                                                (prev) => !prev
                                            )
                                        }
                                        className="
                                            absolute
                                            right-2
                                            top-1/2
                                            -translate-y-1/2
                                            text-[#7890A5]
                                            transition-colors
                                            hover:text-[#173B5C]
                                        "
                                        aria-label="Toggle password visibility"
                                    >
                                        {showPassword ? (
                                            <EyeOff size={13} />
                                        ) : (
                                            <Eye size={13} />
                                        )}
                                    </button>

                                </div>

                            </div>


                            {/* =================================================
                              CONFIRM PASSWORD
                          ================================================= */}

                            <div className="mt-3">

                                <label
                                    htmlFor="confirmPassword"
                                    className="
                                        mb-1.5
                                        block
                                        text-[8px]
                                        font-semibold
                                        text-[#173B5C]
                                    "
                                >
                                    Confirm Password
                                </label>

                                <div className="relative">

                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={
                                            showConfirmPassword
                                                ? "text"
                                                : "password"
                                        }
                                        placeholder="Confirm your password"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className="
                                            h-[32px]
                                            w-full
                                            rounded-[4px]
                                            border
                                            border-[#D8E2EC]
                                            bg-white
                                            px-3
                                            pr-9
                                            text-[9px]
                                            text-[#173B5C]
                                            outline-none
                                            placeholder:text-[#9AAABA]
                                            focus:border-[#7AAFE4]
                                            focus:ring-1
                                            focus:ring-[#D9EAFB]
                                        "
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowConfirmPassword(
                                                (prev) => !prev
                                            )
                                        }
                                        className="
                                            absolute
                                            right-2
                                            top-1/2
                                            -translate-y-1/2
                                            text-[#7890A5]
                                            transition-colors
                                            hover:text-[#173B5C]
                                        "
                                        aria-label="Toggle confirm password visibility"
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff size={13} />
                                        ) : (
                                            <Eye size={13} />
                                        )}
                                    </button>

                                </div>

                            </div>


                            {/* =================================================
                              TERMS
                          ================================================= */}

                            <label
                                className="
                                    mt-3
                                    flex
                                    cursor-pointer
                                    items-start
                                    gap-2
                                "
                            >

                                <input
                                    type="checkbox"
                                    name="terms"
                                    checked={formData.terms}
                                    onChange={handleChange}
                                    className="
                                        mt-[2px]
                                        h-[11px]
                                        w-[11px]
                                        accent-[#0B3D6B]
                                    "
                                />

                                <span
                                    className="
                                        text-[7px]
                                        leading-[11px]
                                        text-[#61788E]
                                    "
                                >
                                    I agree to the{" "}
                                    <a
                                        href="#"
                                        className="
                                            font-medium
                                            text-[#173B5C]
                                            hover:underline
                                        "
                                    >
                                        Terms of Service
                                    </a>{" "}
                                    and{" "}
                                    <a
                                        href="#"
                                        className="
                                            font-medium
                                            text-[#173B5C]
                                            hover:underline
                                        "
                                    >
                                        Privacy Policy
                                    </a>
                                </span>

                            </label>


                            {/* =================================================
                              CREATE ACCOUNT BUTTON
                          ================================================= */}

                            <button
                                type="submit"
                                disabled={loading}
                                className={`
                                    mt-3
                                    h-[32px]
                                    w-full
                                    rounded-[4px]
                                    text-[9px]
                                    font-semibold
                                    text-white
                                    transition-all
                                    duration-200
                                    active:scale-[0.99]
                                    ${loading
                                        ? "cursor-not-allowed bg-[#6F8AA3]"
                                        : "bg-[#0B3D6B] hover:bg-[#0A3156]"
                                    }
                                `}
                            >
                                {loading
                                    ? "Creating Account..."
                                    : "Create Account"}
                            </button>


                            {/* =================================================
                              OR DIVIDER
                          ================================================= */}

                            <div className="my-3 flex items-center gap-2.5">

                                <div className="h-px flex-1 bg-[#E3E9EF]" />

                                <span
                                    className="
                                        text-[7px]
                                        font-medium
                                        text-[#91A2B2]
                                    "
                                >
                                    OR
                                </span>

                                <div className="h-px flex-1 bg-[#E3E9EF]" />

                            </div>


                            {/* =================================================
                              GOOGLE BUTTON
                          ================================================= */}

                            <button
                                type="button"
                                onClick={handleGoogleLogin}
                                className="
                                    flex
                                    h-[32px]
                                    w-full
                                    items-center
                                    justify-center
                                    gap-2
                                    rounded-[4px]
                                    border
                                    border-[#D8E2EC]
                                    bg-white
                                    text-[9px]
                                    font-semibold
                                    text-[#173B5C]
                                    transition-all
                                    duration-200
                                    hover:bg-[#F8FAFC]
                                "
                            >
                                <svg
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                >
                                    <path
                                        fill="#4285F4"
                                        d="M21.35 12.23c0-.79-.07-1.55-.23-2.27H12v4.3h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.91-4.18 2.91-7.42z"
                                    />

                                    <path
                                        fill="#34A853"
                                        d="M12 21.5c2.63 0 4.84-.87 6.45-2.35l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.3v2.53A9.75 9.75 0 0 0 12 21.5z"
                                    />

                                    <path
                                        fill="#FBBC05"
                                        d="M6.54 13.59A5.86 5.86 0 0 1 6.23 12c0-.55.1-1.08.31-1.59V7.88H3.3A9.75 9.75 0 0 0 2.25 12c0 1.57.38 3.05 1.05 4.12l3.24-2.53z"
                                    />

                                    <path
                                        fill="#EA4335"
                                        d="M12 6.38c1.43 0 2.71.49 3.72 1.46l2.79-2.79C16.83 3.49 14.63 2.5 12 2.5a9.75 9.75 0 0 0-8.7 5.38l3.24 2.53C7.31 8.1 9.46 6.38 12 6.38z"
                                    />
                                </svg>

                                Continue with Google
                            </button>

                        </form>

                    </div>


                    {/* =================================================
                      SIGN IN
                  ================================================= */}

                    <div className="mt-5 text-center">

                        <p
                            className="
                                text-[8px]
                                text-[#667D92]
                            "
                        >
                            Already have an account?{" "}

                            <Link
                                to="/login"
                                className="
                                    font-semibold
                                    text-[#173B5C]
                                    hover:underline
                                "
                            >
                                Sign in
                            </Link>
                        </p>

                    </div>

                </div>

            </div>

        </div>
    );
};


/* =========================================================
   FORM FIELD
========================================================= */

const FormField = ({
    label,
    name,
    type = "text",
    placeholder,
    value,
    onChange,
}) => {
    return (
        <div>

            <label
                htmlFor={name}
                className="
                    mb-1.5
                    block
                    text-[8px]
                    font-semibold
                    text-[#173B5C]
                "
            >
                {label}
            </label>

            <input
                id={name}
                name={name}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className="
                    h-[32px]
                    w-full
                    rounded-[4px]
                    border
                    border-[#D8E2EC]
                    bg-white
                    px-3
                    text-[9px]
                    text-[#173B5C]
                    outline-none
                    placeholder:text-[#9AAABA]
                    focus:border-[#7AAFE4]
                    focus:ring-1
                    focus:ring-[#D9EAFB]
                "
            />

        </div>
    );
};

export default Register;