const mongoose = require("mongoose");

// =====================================================
// TOUR SCHEMA
// =====================================================

const tourSchema = new mongoose.Schema(
    {

        company: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "TravelCompany",
            required: true,
            index: true
        },

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

        image: {
            type: String,
            default: "",
            trim: true
        },

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

        price: {
            type: Number,
            required: true,
            min: 0
        },

        startDate: {
            type: Date,
            required: true
        },

        endDate: {
            type: Date,
            required: true
        },

        duration: {
            type: Number,
            required: true,
            min: 1
        },

        maxTravelers: {
            type: Number,
            required: true,
            min: 1
        },

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

tourSchema.pre("save", function () {

    if (
        this.startDate &&
        this.endDate &&
        this.endDate < this.startDate
    ) {

        throw new Error(
            "End date cannot be before start date"
        );

    }

});


// =====================================================
// INDEXES
// =====================================================

tourSchema.index({
    company: 1,
    createdAt: -1
});

tourSchema.index({
    status: 1,
    endDate: 1
});

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