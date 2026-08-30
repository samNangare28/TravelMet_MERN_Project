const mongoose = require("mongoose");

// =====================================================
// TOUR SCHEMA
// =====================================================

const tourSchema = new mongoose.Schema(
    {

        // =================================================
        // COMPANY
        // =================================================

        company: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "TravelCompany",
            required: true,
            index: true
        },

        // =================================================
        // TOUR BASIC INFORMATION
        // =================================================

        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 150
        },

        destination: {
            type: String,
            required: true,
            trim: true,
            maxlength: 150
        },

        description: {
            type: String,
            required: true,
            trim: true,
            maxlength: 2000
        },

        // =================================================
        // TOUR IMAGE
        // =================================================

        image: {
            type: String,
            default: "",
            trim: true
        },

        // =================================================
        // TOUR THEME
        // =================================================

        theme: {
            type: String,

            enum: [
                "Adventure",
                "Beach",
                "Honeymoon",
                "Wildlife",
                "Pilgrimage",
                "Hill Station",
                "Cultural",
                "Family",
                "Cruise",
                "Trekking",
                "Other"
            ],

            default: "Other"
        },

        // =================================================
        // PRICE
        // =================================================

        price: {
            type: Number,
            required: true,
            min: 0
        },

        // =================================================
        // TOUR DATES
        // =================================================

        startDate: {
            type: Date,
            required: true
        },

        endDate: {
            type: Date,
            required: true
        },

        // =================================================
        // DURATION
        // =================================================

        duration: {
            type: Number,
            required: true,
            min: 1
        },

        // =================================================
        // MAX TRAVELERS
        // =================================================

        maxTravelers: {
            type: Number,
            required: true,
            min: 1
        },

        // =================================================
        // TOUR STATUS
        // =================================================

        status: {
            type: String,

            enum: [
                "active",
                "cancelled",
                "completed"
            ],

            default: "active",

            index: true
        }

    },

    {
        timestamps: true
    }
);


// =====================================================
// VALIDATE TOUR DATES
// =====================================================

tourSchema.pre("save", function (next) {

    if (
        this.startDate &&
        this.endDate &&
        this.endDate < this.startDate
    ) {

        return next(
            new Error(
                "End date cannot be before start date"
            )
        );

    }

    next();

});


// =====================================================
// INDEXES
// =====================================================

// Company tours

tourSchema.index({
    company: 1,
    createdAt: -1
});


// Explore active/upcoming tours

tourSchema.index({
    status: 1,
    endDate: 1
});


// Theme filtering

tourSchema.index({
    theme: 1,
    status: 1,
    startDate: 1
});


// =====================================================
// MODEL
// =====================================================

const Tour = mongoose.model(
    "Tour",
    tourSchema
);

module.exports = Tour;