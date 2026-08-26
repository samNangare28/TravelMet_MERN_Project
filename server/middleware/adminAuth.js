const jwt = require("jsonwebtoken");


// =====================================================
// ADMIN AUTHENTICATION MIDDLEWARE
// =====================================================

const adminAuth = (req, res, next) => {

    try {

        // ===============================
        // GET AUTHORIZATION HEADER
        // ===============================

        const authHeader =
            req.headers.authorization;


        if (!authHeader) {

            return res.status(401).json({

                success: false,

                message:
                    "Admin authentication required"

            });

        }


        // ===============================
        // CHECK BEARER TOKEN
        // ===============================

        if (!authHeader.startsWith("Bearer ")) {

            return res.status(401).json({

                success: false,

                message:
                    "Invalid authorization format"

            });

        }


        const token =
            authHeader.split(" ")[1];


        if (!token) {

            return res.status(401).json({

                success: false,

                message:
                    "Authentication token missing"

            });

        }


        // ===============================
        // JWT SECRET CHECK
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


        // ===============================
        // VERIFY TOKEN
        // ===============================

        const decoded =
            jwt.verify(
                token,
                process.env.JWT_SECRET
            );


        // ===============================
        // CHECK ADMIN TYPE
        // ===============================

        if (
            decoded.type !== "admin" ||
            decoded.role !== "admin"
        ) {

            return res.status(403).json({

                success: false,

                message:
                    "Admin access denied"

            });

        }


        // ===============================
        // ATTACH ADMIN DATA
        // ===============================

        req.admin = decoded;


        // ===============================
        // NEXT
        // ===============================

        next();

    }

    catch (error) {

        console.error(
            "❌ ADMIN AUTH ERROR:",
            error.message
        );


        if (
            error.name ===
            "JsonWebTokenError"
        ) {

            return res.status(401).json({

                success: false,

                message:
                    "Invalid admin token"

            });

        }


        if (
            error.name ===
            "TokenExpiredError"
        ) {

            return res.status(401).json({

                success: false,

                message:
                    "Admin session expired. Please login again."

            });

        }


        return res.status(500).json({

            success: false,

            message:
                "Authentication failed"

        });

    }

};


module.exports =
    adminAuth;