require("dotenv").config();

const express = require("express");
const cors = require("cors");

const { generalLimiter } =
    require("./middleware/rateLimiter");

const connectDB =
    require("./config/db");


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


// TOUR BOOKING ROUTES

const tourBookingRoutes =
    require("./routes/tourBookingRoutes");


// APP

const app =
    express();


// DATABASE

connectDB();


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


// TOUR BOOKINGS
//
// User:
// POST   /api/tour-bookings/:tourId
// DELETE /api/tour-bookings/:tourId
//
// Public:
// GET    /api/tour-bookings/:tourId/count
//
// User:
// GET    /api/tour-bookings/:tourId/my-booking
//
// Company:
// GET    /api/tour-bookings/company/:tourId
//

app.use(
    "/api/tour-bookings",
    tourBookingRoutes
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
