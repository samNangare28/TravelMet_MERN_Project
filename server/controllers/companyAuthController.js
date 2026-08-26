const TravelCompany = require("../models/TravelCompany");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


// =====================================================
// REGISTER TRAVEL COMPANY
// =====================================================

const registerCompany = async (req, res) => {

    try {

        const {
            companyName,
            ownerName,
            email,
            phone,
            password,
            address,
            description,
            website,
            certificate
        } = req.body;


        // ===============================
        // VALIDATION
        // ===============================

        if (
            !companyName ||
            !ownerName ||
            !email ||
            !phone ||
            !password ||
            !address ||
            !certificate
        ) {

            return res.status(400).json({
                success: false,
                message: "Please fill all required fields"
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


        // ===============================
        // CHECK COMPANY EMAIL
        // ===============================

        const existingCompany =
            await TravelCompany.findOne({
                email: cleanEmail
            });


        if (existingCompany) {

            return res.status(400).json({
                success: false,
                message: "Company email already exists"
            });

        }


        // ===============================
        // HASH PASSWORD
        // ===============================

        const hashedPassword =
            await bcrypt.hash(password, 10);


        // ===============================
        // CREATE COMPANY
        // ===============================

        const company =
            new TravelCompany({

                companyName:
                    companyName.trim(),

                ownerName:
                    ownerName.trim(),

                email:
                    cleanEmail,

                phone:
                    phone.trim(),

                password:
                    hashedPassword,

                address:
                    address.trim(),

                description:
                    description?.trim() || "",

                website:
                    website?.trim() || "",

                certificate:
                    certificate.trim(),

                verificationStatus:
                    "pending"

            });


        await company.save();


        console.log(
            "🏢 COMPANY REGISTERED:",
            cleanEmail
        );


        return res.status(201).json({

            success: true,

            message:
                "Company registration submitted successfully. Your application is pending verification."

        });

    }

    catch (error) {

        console.error(
            "❌ COMPANY REGISTER ERROR:",
            error
        );


        if (error.code === 11000) {

            return res.status(400).json({

                success: false,

                message:
                    "Company email already exists"

            });

        }


        return res.status(500).json({

            success: false,

            message:
                "Company registration failed. Please try again."

        });

    }

};


// =====================================================
// LOGIN TRAVEL COMPANY
// =====================================================

const loginCompany = async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;


        if (!email || !password) {

            return res.status(400).json({

                success: false,

                message:
                    "Please enter email and password"

            });

        }


        const cleanEmail =
            email.trim().toLowerCase();


        const company =
            await TravelCompany.findOne({
                email: cleanEmail
            });


        if (!company) {

            return res.status(404).json({

                success: false,

                message:
                    "Company not found"

            });

        }


        const isMatch =
            await bcrypt.compare(
                password,
                company.password
            );


        if (!isMatch) {

            return res.status(401).json({

                success: false,

                message:
                    "Invalid password"

            });

        }


        // ===============================
        // CHECK VERIFICATION
        // ===============================

        if (
            company.verificationStatus !==
            "verified"
        ) {

            return res.status(403).json({

                success: false,

                message:
                    company.verificationStatus === "pending"
                        ? "Your company is still waiting for verification."
                        : "Your company verification was rejected."

            });

        }


        // ===============================
        // JWT SECRET
        // ===============================

        if (!process.env.JWT_SECRET) {

            return res.status(500).json({

                success: false,

                message:
                    "Server configuration error"

            });

        }


        // ===============================
        // CREATE COMPANY JWT
        // ===============================

        const token =
            jwt.sign(

                {
                    id: company._id,
                    type: "company"
                },

                process.env.JWT_SECRET,

                {
                    expiresIn: "7d"
                }

            );


        return res.status(200).json({

            success: true,

            message:
                "Company login successful",

            token,

            company: {

                id:
                    company._id,

                companyName:
                    company.companyName,

                ownerName:
                    company.ownerName,

                email:
                    company.email,

                verificationStatus:
                    company.verificationStatus,

                logo:
                    company.logo || ""

            }

        });

    }

    catch (error) {

        console.error(
            "❌ COMPANY LOGIN ERROR:",
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

    registerCompany,

    loginCompany

};