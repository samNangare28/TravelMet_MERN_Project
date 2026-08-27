const jwt = require("jsonwebtoken");


// =====================================================
// COMPANY AUTHENTICATION MIDDLEWARE
// =====================================================

const companyAuth = (req, res, next) => {

    try {

        const authHeader =
            req.headers.authorization;


        // =================================================
        // CHECK AUTHORIZATION HEADER
        // =================================================

        if (!authHeader) {

            return res.status(401).json({

                success: false,

                message:
                    "Company authentication required"

            });

        }


        // =================================================
        // CHECK BEARER TOKEN
        // =================================================

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


        // =================================================
        // JWT SECRET
        // =================================================

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


        // =================================================
        // VERIFY TOKEN
        // =================================================

        const decoded =
            jwt.verify(
                token,
                process.env.JWT_SECRET
            );


        // =================================================
        // CHECK COMPANY TOKEN
        // =================================================

        if (
            decoded.type !== "company"
        ) {

            return res.status(403).json({

                success: false,

                message:
                    "Company access denied"

            });

        }


        // =================================================
        // ATTACH COMPANY DATA
        // =================================================

        req.company = decoded;


        next();

    }

    catch (error) {

        console.error(
            "❌ COMPANY AUTH ERROR:",
            error.message
        );


        if (
            error.name ===
            "TokenExpiredError"
        ) {

            return res.status(401).json({

                success: false,

                message:
                    "Company session expired. Please login again."

            });

        }


        if (
            error.name ===
            "JsonWebTokenError"
        ) {

            return res.status(401).json({

                success: false,

                message:
                    "Invalid company token"

            });

        }


        return res.status(500).json({

            success: false,

            message:
                "Company authentication failed"

        });

    }

};


module.exports =
    companyAuth;
