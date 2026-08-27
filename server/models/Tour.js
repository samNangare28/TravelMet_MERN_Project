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

            required: true

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

            default: "active"

        }

    },

    {

        // Automatically creates:
        // createdAt
        // updatedAt

        timestamps: true

    }

);


// =====================================================
// VALIDATE TOUR DATES
// =====================================================

tourSchema.pre("validate", function (next) {

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

// Helps quickly find tours belonging to a company

tourSchema.index({
    company: 1,
    createdAt: -1
});


// Helps Explore Tours find non-expired tours

tourSchema.index({
    endDate: 1
});


// =====================================================
// MODEL
// =====================================================

const Tour =
    mongoose.model(
        "Tour",
        tourSchema
    );


module.exports = Tour;