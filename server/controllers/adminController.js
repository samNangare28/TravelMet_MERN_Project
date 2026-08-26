const Admin = require("../models/Admin");
const TravelCompany = require("../models/TravelCompany");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


// ADMIN LOGIN

const loginAdmin = async (req, res) => {

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


        const admin =
            await Admin.findOne({
                email: cleanEmail
            });


        if (!admin) {

            return res.status(401).json({

                success: false,

                message:
                    "Invalid admin credentials"

            });

        }


        const isMatch =
            await bcrypt.compare(
                password,
                admin.password
            );


        if (!isMatch) {

            return res.status(401).json({

                success: false,

                message:
                    "Invalid admin credentials"

            });

        }


        if (!process.env.JWT_SECRET) {

            return res.status(500).json({

                success: false,

                message:
                    "Server configuration error"

            });

        }


        const token =
            jwt.sign(

                {
                    id: admin._id,
                    type: "admin",
                    role: admin.role
                },

                process.env.JWT_SECRET,

                {
                    expiresIn: "1d"
                }

            );


        return res.status(200).json({

            success: true,

            message:
                "Admin login successful",

            token,

            admin: {

                id:
                    admin._id,

                name:
                    admin.name,

                email:
                    admin.email,

                role:
                    admin.role

            }

        });

    }

    catch (error) {

        console.error(
            "❌ ADMIN LOGIN ERROR:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Internal Server Error"

        });

    }

};


// GET PENDING COMPANIES

const getPendingCompanies = async (req, res) => {

    try {

        const companies =
            await TravelCompany.find({

                verificationStatus:
                    "pending"

            })
            .select("-password")
            .sort({
                createdAt: -1
            });


        return res.status(200).json({

            success: true,

            count:
                companies.length,

            companies

        });

    }

    catch (error) {

        console.error(
            "❌ GET PENDING COMPANIES ERROR:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to fetch pending companies"

        });

    }

};

// APPROVE COMPANY

const approveCompany = async (req, res) => {

    try {

        const { id } = req.params;


        const company =
            await TravelCompany.findById(id);


        if (!company) {

            return res.status(404).json({

                success: false,

                message:
                    "Company not found"

            });

        }


        // Already verified

        if (
            company.verificationStatus ===
            "verified"
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Company is already verified"

            });

        }


        company.verificationStatus =
            "verified";

        company.verifiedAt =
            new Date();

        company.verifiedBy =
            req.admin.id;

        company.rejectionReason = "";


        await company.save();


        return res.status(200).json({

            success: true,

            message:
                "Company verified successfully ✅",

            company: {

                id:
                    company._id,

                companyName:
                    company.companyName,

                verificationStatus:
                    company.verificationStatus,

                verifiedAt:
                    company.verifiedAt,

                verifiedBy:
                    company.verifiedBy

            }

        });

    }

    catch (error) {

        console.error(
            "❌ APPROVE COMPANY ERROR:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to verify company"

        });

    }

};

// =====================================================
// REJECT COMPANY
// =====================================================

const rejectCompany = async (req, res) => {

    try {

        const { id } = req.params;

        const {
            reason
        } = req.body;


        if (!reason || !reason.trim()) {

            return res.status(400).json({

                success: false,

                message:
                    "Rejection reason is required"

            });

        }


        const company =
            await TravelCompany.findById(id);


        if (!company) {

            return res.status(404).json({

                success: false,

                message:
                    "Company not found"

            });

        }


        company.verificationStatus =
            "rejected";

        company.rejectionReason =
            reason.trim();

        company.verifiedAt =
            null;

        company.verifiedBy =
            req.admin.id;


        await company.save();


        return res.status(200).json({

            success: true,

            message:
                "Company rejected successfully",

            company: {

                id:
                    company._id,

                companyName:
                    company.companyName,

                verificationStatus:
                    company.verificationStatus,

                rejectionReason:
                    company.rejectionReason

            }

        });

    }

    catch (error) {

        console.error(
            "❌ REJECT COMPANY ERROR:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to reject company"

        });

    }

};
// EXPORT

module.exports = {

    loginAdmin,

    getPendingCompanies,

    approveCompany,

    rejectCompany

};