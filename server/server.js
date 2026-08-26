require("dotenv").config();

const express = require("express");
const cors = require("cors");

const { generalLimiter } = require("./middleware/rateLimiter");

const connectDB =
    require("./config/db");

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

const contactRoutes = require("./routes/contactRoutes");


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

            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }

        },
        credentials: true
    })
);

app.use(
    express.json()
);

app.use(generalLimiter);


// ROUTES

app.use(
    "/api/auth",
    authRoutes
);

app.use(
    "/api/admin",
    adminRoutes
);

app.use(
    "/api/company-auth",
    companyAuthRoutes
);
app.use(
    "/api/users",
    userRoutes
);

app.use(
    "/api/posts",
    postRoutes
);

app.use(
    "/api/trips",
    tripRoutes
);

app.use(
    "/api/ai",
    aiRoutes
);

app.use(
    "/api/notifications",
    notificationRoutes
);

app.use(
    "/api/places",
    placesRoutes
);

app.use(
    "/api/blogs",
    blogRoutes
);
app.use("/api/contact", contactRoutes);


// HEALTH CHECK

app.get(
    "/",
    (req, res) => {

        res.status(200).send(
            "TravelMet Backend Running 🚀"
        );

    }
);


// 404

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