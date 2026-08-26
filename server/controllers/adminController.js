const Admin = require("../models/Admin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


// =====================================================
// ADMIN LOGIN
// =====================================================

const loginAdmin = async (req, res) => {

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
        // FIND ADMIN
        // ===============================

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


        // ===============================
        // PASSWORD CHECK
        // ===============================

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
        // CREATE ADMIN TOKEN
        // ===============================

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


        // ===============================
        // SUCCESS
        // ===============================

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


module.exports = {

    loginAdmin

};