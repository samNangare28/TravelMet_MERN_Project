require("dotenv").config();

const express = require("express");
const cors = require("cors");

const { generalLimiter } =
    require("./middleware/rateLimiter");

const connectDB =
    require("./config/db");

const cron =
    require("node-cron");

const cleanupExpiredTours =
    require("./utils/cleanupExpiredTours");


// ROUTES

const companyAuthRoutes =
    require("./routes/companyAuthRoutes");

const authRoutes =
    require("./routes/authRoutes");

const userRoutes =
    require("./routes/userRoutes");

const postRoutes =
    require("./routes/postRoutes");

const tripRoutes =
    require("./routes/tripRoutes");

const aiRoutes =
    require("./routes/aiRoutes");

const notificationRoutes =
    require("./routes/notificationRoutes");

const placesRoutes =
    require("./routes/placesRoutes");

const blogRoutes =
    require("./routes/blogRoutes");

const adminRoutes =
    require("./routes/adminRoutes");

const contactRoutes =
    require("./routes/contactRoutes");

const tourRoutes =
    require("./routes/tourRoutes");


// APP

const app =
    express();


// DATABASE

connectDB();


// =====================================================
// AUTO CLEANUP OF EXPIRED TOURS
// =====================================================
//
// Runs once shortly after startup, then every day at
// 00:15 server time — deletes tours whose end date has
// passed (plus a short grace period) along with all of
// their bookings and the travelers' personal details.
//
// =====================================================

setTimeout(cleanupExpiredTours, 10_000);

cron.schedule("15 0 * * *", cleanupExpiredTours);


// MIDDLEWARE

const allowedOrigins = [

    "http://localhost:3000",

    process.env.FRONTEND_URL

].filter(Boolean);


app.use(

    cors({

        origin: function (origin, callback) {

            // Allow requests without an origin
            // such as Postman/server-to-server requests

            if (
                !origin ||
                allowedOrigins.includes(origin)
            ) {

                callback(null, true);

            }

            else {

                callback(
                    new Error("Not allowed by CORS")
                );

            }

        },

        credentials: true

    })

);


app.use(
    express.json()
);


// RATE LIMITER

app.use(
    generalLimiter
);


// API ROUTES


// -----------------------------------------------------
// USER AUTH
// -----------------------------------------------------

app.use(
    "/api/auth",
    authRoutes
);


// -----------------------------------------------------
// ADMIN
// -----------------------------------------------------

app.use(
    "/api/admin",
    adminRoutes
);


// -----------------------------------------------------
// COMPANY AUTH
// -----------------------------------------------------

app.use(
    "/api/company-auth",
    companyAuthRoutes
);


// -----------------------------------------------------
// USERS
// -----------------------------------------------------

app.use(
    "/api/users",
    userRoutes
);


// -----------------------------------------------------
// POSTS
// -----------------------------------------------------

app.use(
    "/api/posts",
    postRoutes
);


// -----------------------------------------------------
// TRIPS
// -----------------------------------------------------

app.use(
    "/api/trips",
    tripRoutes
);


// -----------------------------------------------------
// AI
// -----------------------------------------------------

app.use(
    "/api/ai",
    aiRoutes
);


// -----------------------------------------------------
// NOTIFICATIONS
// -----------------------------------------------------

app.use(
    "/api/notifications",
    notificationRoutes
);


// -----------------------------------------------------
// PLACES
// -----------------------------------------------------

app.use(
    "/api/places",
    placesRoutes
);


// -----------------------------------------------------
// BLOGS
// -----------------------------------------------------

app.use(
    "/api/blogs",
    blogRoutes
);


// -----------------------------------------------------
// CONTACT
// -----------------------------------------------------

app.use(
    "/api/contact",
    contactRoutes
);


// -----------------------------------------------------
// TOURS
// -----------------------------------------------------

app.use(
    "/api/tours",
    tourRoutes
);


// HEALTH CHECK

app.get(
    "/",
    (req, res) => {

        res.status(200).send(
            "TravelMet Backend Running 🚀"
        );

    }
);


// 404 HANDLER

app.use(
    (req, res) => {

        res.status(404).json({

            success: false,

            message:
                "API route not found"

        });

    }
);


// ERROR HANDLER

app.use(
    (err, req, res, next) => {

        console.error(
            "SERVER ERROR:",
            err
        );


        res.status(500).json({

            success: false,

            message:
                "Internal Server Error"

        });

    }
);


// START SERVER

const PORT =
    process.env.PORT || 5000;


app.listen(
    PORT,
    () => {

        console.log(
            `🚀 TravelMet Backend running on port ${PORT}`
        );

    }
);
