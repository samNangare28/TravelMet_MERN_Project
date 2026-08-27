require("dotenv").config({
    path: require("path").resolve(__dirname, "../.env")
});

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const Admin = require("../models/Admin");
const connectDB = require("../config/db");

const createAdmin = async () => {

    try {

        await connectDB();

        const existingAdmin =
            await Admin.findOne({
                email: "admin@travelmet.com"
            });


        if (existingAdmin) {

            console.log(
                "⚠️ Admin already exists"
            );

            process.exit(0);

        }


        const adminPassword = "samuuu";

        const hashedPassword =
            await bcrypt.hash(
                adminPassword,
                10
            );


        const admin =
            new Admin({

                name: "TravelMet Admin",

                email:
                    "admin@travelmet.com",

                password:
                    hashedPassword,

                role: "admin"

            });


        await admin.save();


        console.log(
            "✅ Admin created successfully"
        );

        console.log(
            "📧 Email: admin@travelmet.com"
        );

        console.log(
            "🔐 Password: TravelMet@Admin123"
        );


        process.exit(0);

    }

    catch (error) {

        console.error(
            "❌ ADMIN CREATION ERROR:",
            error
        );

        process.exit(1);

    }

};


createAdmin();