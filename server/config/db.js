const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.ATLAS_DB);
        console.log("✅ MongoDB Connected Successfully to DB:", mongoose.connection.name); // ही line add कर
    } catch (error) {
        console.log("MongoDB Connection Error:", error.message);
        process.exit(1);
    }
};

module.exports = connectDB;