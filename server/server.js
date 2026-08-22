require("dotenv").config();

const express = require("express");
const { generalLimiter } = require("./middleware/rateLimiter");

const cors = require("cors");
app.use(generalLimiter);

const connectDB =
    require("./config/db");


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

const contactRoutes = require("./routes/contactRoutes");


const app =
    express();


// DATABASE

connectDB();


// MIDDLEWARE

app.use(
    cors({
        origin: true,
        credentials: true
    })
);

app.use(
    express.json()
);


// ROUTES

app.use(
    "/api/auth",
    authRoutes
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