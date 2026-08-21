const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendWelcomeEmail = require("../utils/sendEmail");

// ======================================================
// REGISTER USER
// ======================================================

const registerUser = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            username,
            email,
            password
        } = req.body;

        // -----------------------------------------------
        // Check required fields
        // -----------------------------------------------

        if (
            !firstName ||
            !lastName ||
            !username ||
            !email ||
            !password
        ) {
            return res.status(400).json({
                success: false,
                message: "Please fill all fields"
            });
        }

        // -----------------------------------------------
        // Clean input
        // -----------------------------------------------

        const cleanFirstName = firstName.trim();
        const cleanLastName = lastName.trim();
        const cleanUsername = username.trim().toLowerCase();
        const cleanEmail = email.trim().toLowerCase();

        // -----------------------------------------------
        // Basic password validation
        // -----------------------------------------------

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters long"
            });
        }

        // -----------------------------------------------
        // Check Email
        // -----------------------------------------------

        const existingEmail = await User.findOne({
            email: cleanEmail
        });

        if (existingEmail) {
            return res.status(400).json({
                success: false,
                message: "Email already exists"
            });
        }

        // -----------------------------------------------
        // Check Username
        // -----------------------------------------------

        const existingUsername = await User.findOne({
            username: cleanUsername
        });

        if (existingUsername) {
            return res.status(400).json({
                success: false,
                message: "Username already exists"
            });
        }

        // -----------------------------------------------
        // Hash Password
        // -----------------------------------------------

        const hashedPassword = await bcrypt.hash(password, 10);

        // -----------------------------------------------
        // Create New User
        // -----------------------------------------------

        const newUser = new User({
            firstName: cleanFirstName,
            lastName: cleanLastName,
            username: cleanUsername,
            email: cleanEmail,
            password: hashedPassword
        });

        // -----------------------------------------------
        // Save User
        // -----------------------------------------------

        await newUser.save();

        console.log(
            "✅ User registered successfully:",
            newUser.email
        );

        // -----------------------------------------------
        // Send Welcome Email
        // -----------------------------------------------

        try {
            console.log(
                "📧 Sending welcome email to:",
                newUser.email
            );

            await sendWelcomeEmail(
                newUser.email,
                newUser.firstName
            );

            console.log(
                "✅ Welcome email sent successfully to:",
                newUser.email
            );

        } catch (emailError) {

            console.error(
                "❌ Welcome Email Error:",
                emailError.message
            );

            // Registration should NOT fail
            // if email sending fails.
        }

        // -----------------------------------------------
        // Registration Success
        // -----------------------------------------------

        return res.status(201).json({
            success: true,
            message: "Registration Successful"
        });

    } catch (error) {

        console.error(
            "❌ Register User Error:",
            error
        );

        // -----------------------------------------------
        // Handle MongoDB duplicate key error
        // -----------------------------------------------

        if (error.code === 11000) {

            const duplicateField =
                Object.keys(error.keyPattern || {})[0];

            let message = "Email or username already exists";

            if (duplicateField === "email") {
                message = "Email already exists";
            }

            if (duplicateField === "username") {
                message = "Username already exists";
            }

            return res.status(400).json({
                success: false,
                message
            });
        }

        // -----------------------------------------------
        // Server Error
        // -----------------------------------------------

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};


// ======================================================
// LOGIN USER
// ======================================================

const loginUser = async (req, res) => {
    try {

        const {
            email,
            password
        } = req.body;

        // -----------------------------------------------
        // Check Empty Fields
        // -----------------------------------------------

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please enter email and password"
            });
        }

        // -----------------------------------------------
        // Clean Email
        // -----------------------------------------------

        const cleanEmail = email
            .trim()
            .toLowerCase();

        // -----------------------------------------------
        // Find User
        // -----------------------------------------------

        const user = await User.findOne({
            email: cleanEmail
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // -----------------------------------------------
        // Compare Password
        // -----------------------------------------------

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid password"
            });
        }

        // -----------------------------------------------
        // Check JWT Secret
        // -----------------------------------------------

        if (!process.env.JWT_SECRET) {

            console.error(
                "❌ JWT_SECRET is missing"
            );

            return res.status(500).json({
                success: false,
                message: "JWT configuration missing"
            });
        }

        // -----------------------------------------------
        // Generate JWT Token
        // -----------------------------------------------

        const token = jwt.sign(
            {
                id: user._id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        // -----------------------------------------------
        // Login Success
        // -----------------------------------------------

        return res.status(200).json({
            success: true,
            message: "Login Successful",

            token,

            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage
            }
        });

    } catch (error) {

        console.error(
            "❌ Login User Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};


// ======================================================
// EXPORT
// ======================================================

module.exports = {
    registerUser,
    loginUser
};