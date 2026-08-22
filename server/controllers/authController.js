const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendWelcomeEmail } = require("../utils/sendEmail");

// =====================================================
// REGISTER USER
// =====================================================

const registerUser = async (req, res) => {

    try {

        const {
            firstName,
            lastName,
            username,
            email,
            password
        } = req.body;


        // ===============================
        // VALIDATION
        // ===============================

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


        if (password.length < 6) {

            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters"
            });

        }


        const cleanEmail =
            email.trim().toLowerCase();

        const cleanUsername =
            username.trim().toLowerCase();


        // ===============================
        // CHECK EMAIL
        // ===============================

        const existingEmail =
            await User.findOne({
                email: cleanEmail
            });

        if (existingEmail) {

            return res.status(400).json({
                success: false,
                message: "Email already exists"
            });

        }


        // ===============================
        // CHECK USERNAME
        // ===============================

        const existingUsername =
            await User.findOne({
                username: cleanUsername
            });

        if (existingUsername) {

            return res.status(400).json({
                success: false,
                message: "Username already exists"
            });

        }


        // ===============================
        // HASH PASSWORD
        // ===============================

        const hashedPassword =
            await bcrypt.hash(password, 10);


        // ===============================
        // CREATE USER
        // ===============================

        const newUser = new User({

            firstName: firstName.trim(),

            lastName: lastName.trim(),

            username: cleanUsername,

            email: cleanEmail,

            password: hashedPassword

        });


        await newUser.save();


        console.log(
            "✅ USER REGISTERED:",
            cleanEmail
        );


        // =================================================
        // SEND SUCCESS RESPONSE FIRST
        // =================================================
        //
        // Email problem should NEVER make registration
        // fail or keep the frontend loading.
        //
        // =================================================

        res.status(201).json({

            success: true,

            message:
                "Registration Successful! Welcome to TravelMet 🌍"

        });


        // =================================================
        // SEND WELCOME EMAIL
        // =================================================
        //
        // This runs after successful registration.
        // If email fails, user is STILL registered.
        //
        // =================================================

        try {

            await sendWelcomeEmail({

                name: firstName,

                email: cleanEmail

            });

        }

        catch (emailError) {

            console.log(
                "⚠️ Welcome email failed:",
                emailError.message
            );

        }

    }

    catch (error) {

        console.error(
            "❌ REGISTER ERROR:",
            error
        );


        // Duplicate MongoDB key error

        if (error.code === 11000) {

            const duplicateField =
                Object.keys(error.keyPattern || {})[0];

            return res.status(400).json({

                success: false,

                message:
                    duplicateField === "email"
                        ? "Email already exists"
                        : "Username already exists"

            });

        }


        return res.status(500).json({

            success: false,

            message:
                "Registration failed. Please try again."

        });

    }

};


// =====================================================
// LOGIN USER
// =====================================================

const loginUser = async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;


        // ===============================
        // VALIDATION
        // ===============================

        if (!email || !password) {

            return res.status(400).json({

                success: false,

                message:
                    "Please enter email and password"

            });

        }


        const cleanEmail =
            email.trim().toLowerCase();


        // ===============================
        // FIND USER
        // ===============================

        const user =
            await User.findOne({
                email: cleanEmail
            });


        if (!user) {

            return res.status(404).json({

                success: false,

                message:
                    "User not found"

            });

        }


        // ===============================
        // PASSWORD CHECK
        // ===============================

        const isMatch =
            await bcrypt.compare(
                password,
                user.password
            );


        if (!isMatch) {

            return res.status(401).json({

                success: false,

                message:
                    "Invalid password"

            });

        }


        // ===============================
        // JWT
        // ===============================

        if (!process.env.JWT_SECRET) {

            console.error(
                "❌ JWT_SECRET is missing"
            );

            return res.status(500).json({

                success: false,

                message:
                    "Server configuration error"

            });

        }


        const token =
            jwt.sign(

                {
                    id: user._id
                },

                process.env.JWT_SECRET,

                {
                    expiresIn: "7d"
                }

            );


        // ===============================
        // SUCCESS
        // ===============================

        return res.status(200).json({

            success: true,

            message:
                "Login Successful",

            token,

            user: {

                id: user._id,

                firstName:
                    user.firstName,

                lastName:
                    user.lastName,

                username:
                    user.username,

                email:
                    user.email,

                profileImage:
                    user.profileImage || ""

            }

        });

    }

    catch (error) {

        console.error(
            "❌ LOGIN ERROR:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Internal Server Error"

        });

    }

};


module.exports = {

    registerUser,

    loginUser

};