const bcrypt = require("bcryptjs");

const User = require("../models/User");
const Company = require("../models/Company");
const generateToken = require("../utils/generateToken");
const crypto = require("crypto");

const register = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            companyName,
            password,
            confirmPassword,
            terms,
        } = req.body;

        // -----------------------------
        // Required fields
        // -----------------------------
        if (
            !firstName ||
            !lastName ||
            !email ||
            !companyName ||
            !password ||
            !confirmPassword
        ) {
            return res.status(400).json({
                success: false,
                message: "All required fields must be provided.",
            });
        }

        // -----------------------------
        // Terms validation
        // -----------------------------
        if (!terms) {
            return res.status(400).json({
                success: false,
                message: "You must accept the Terms of Service and Privacy Policy.",
            });
        }

        // -----------------------------
        // Password confirmation
        // -----------------------------
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match.",
            });
        }

        // -----------------------------
        // Check existing email
        // -----------------------------
        const normalizedEmail = email.trim().toLowerCase();

        const existingUser = await User.findOne({
            email: normalizedEmail,
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "An account with this email already exists.",
            });
        }

        // -----------------------------
        // Create company
        // -----------------------------
        const company = await Company.create({
            name: companyName.trim(),
        });

        // -----------------------------
        // Hash password
        // -----------------------------
        const hashedPassword = await bcrypt.hash(password, 12);

        // -----------------------------
        // Create first user
        // FIRST USER = ADMIN
        // -----------------------------
        const user = await User.create({
            companyId: company._id,
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: normalizedEmail,
            password: hashedPassword,
            role: "admin",
            isActive: true,
        });

        // -----------------------------
        // Generate JWT
        // -----------------------------
        const token = generateToken(user);

        // -----------------------------
        // Response
        // -----------------------------
        return res.status(201).json({
            success: true,
            message: "Account created successfully.",
            data: {
                token,
                user: {
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    companyId: user.companyId,
                    companyName: company.name,
                    role: user.role,
                    isActive: user.isActive,
                },
            },
        });
    } catch (error) {
        console.error("Register Error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong while creating the account.",
        });
    }
};
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required.",
            });
        }

        // Normalize email
        const normalizedEmail = email.trim().toLowerCase();

        // Find user
        const user = await User.findOne({
            email: normalizedEmail,
        }).populate("companyId", "name");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password.",
            });
        }

        // Check account status
        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: "Your account is inactive. Please contact your administrator.",
            });
        }

        // Compare password
        const isPasswordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password.",
            });
        }

        // Generate JWT
        const token = generateToken(user);

        return res.status(200).json({
            success: true,
            message: "Login successful.",
            data: {
                token,
                user: {
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    companyId: user.companyId._id,
                    companyName: user.companyId.name,
                    role: user.role,
                    isActive: user.isActive,
                },
            },
        });
    } catch (error) {
        console.error("Login Error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong while logging in.",
        });
    }
};
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email address is required.",
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const user = await User.findOne({
            email: normalizedEmail,
        });

        /*
         * Security:
         * Do not reveal whether an email exists in the system.
         */
        if (!user) {
            return res.status(200).json({
                success: true,
                message:
                    "If an account exists with this email, password reset instructions have been sent.",
            });
        }

        /*
         * Generate secure random token.
         * Raw token is NEVER stored in MongoDB.
         */
        const resetToken = crypto.randomBytes(32).toString("hex");

        /*
         * Hash token before storing it.
         */
        const resetTokenHash = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        /*
         * Token expires in 15 minutes.
         */
        const resetTokenExpiry = new Date(
            Date.now() + 15 * 60 * 1000
        );

        user.resetPasswordTokenHash = resetTokenHash;
        user.resetPasswordExpiresAt = resetTokenExpiry;

        await user.save();

        /*
         * Frontend reset URL.
         */
        const frontendUrl =
            process.env.FRONTEND_URL || "http://localhost:5173";

        const resetUrl =
            `${frontendUrl}/reset-password?token=${resetToken}`;

        /*
         * DEVELOPMENT MODE
         *
         * Later we will send this URL through email.
         */
        console.log("======================================");
        console.log("PASSWORD RESET URL:");
        console.log(resetUrl);
        console.log("======================================");

        return res.status(200).json({
            success: true,
            message:
                "If an account exists with this email, password reset instructions have been sent.",
            data: {
                /*
                 * Temporary local-development helper.
                 * Remove this before production.
                 */
                resetUrl,
            },
        });
    } catch (error) {
        console.error("Forgot Password Error:", error);

        return res.status(500).json({
            success: false,
            message:
                "Something went wrong while processing your password reset request.",
        });
    }
};
const resetPassword = async (req, res) => {
    try {
        const {
            token,
            password,
            confirmPassword,
        } = req.body;

        // =====================================================
        // VALIDATION
        // =====================================================

        if (!token) {
            return res.status(400).json({
                success: false,
                message: "Password reset token is required.",
            });
        }

        if (!password || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message:
                    "Password and confirm password are required.",
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message:
                    "Password must be at least 6 characters.",
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match.",
            });
        }

        // =====================================================
        // HASH TOKEN
        // =====================================================

        const resetTokenHash = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        // =====================================================
        // FIND USER WITH VALID TOKEN
        // =====================================================

        const user = await User.findOne({
            resetPasswordTokenHash: resetTokenHash,
            resetPasswordExpiresAt: {
                $gt: new Date(),
            },
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message:
                    "This password reset link is invalid or has expired.",
            });
        }

        // =====================================================
        // HASH NEW PASSWORD
        // =====================================================

        const hashedPassword = await bcrypt.hash(
            password,
            12
        );

        // =====================================================
        // UPDATE PASSWORD
        // =====================================================

        user.password = hashedPassword;

        // =====================================================
        // INVALIDATE RESET TOKEN
        // =====================================================

        user.resetPasswordTokenHash = null;
        user.resetPasswordExpiresAt = null;

        await user.save();

        return res.status(200).json({
            success: true,
            message:
                "Password has been reset successfully. You can now login with your new password.",
        });
    } catch (error) {
        console.error("Reset Password Error:", error);

        return res.status(500).json({
            success: false,
            message:
                "Something went wrong while resetting your password.",
        });
    }
};
const getMe = async (req, res) => {
    try {
        const user = req.user;

        return res.status(200).json({
            success: true,
            message: "Current user retrieved successfully.",
            data: {
                user: {
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,

                    phone: user.phone || "",
                    jobTitle: user.jobTitle || "",
                    department: user.department || "",

                    profilePicture: user.profilePicture || null,

                    companyId: user.companyId._id,
                    companyName: user.companyId.name,

                    role: user.role,
                    isActive: user.isActive,
                    workStatus: user.workStatus,
                },
            },
        });
    } catch (error) {
        console.error("Get Me Error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong while retrieving your account.",
        });
    }
};

module.exports = {
    register,
    login,
    getMe,
    forgotPassword,
    resetPassword,
};