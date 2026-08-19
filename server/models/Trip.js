
const mongoose = require("mongoose");


// =====================================================
// PLACE SCHEMA
// =====================================================

const placeSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        latitude: {
            type: Number,
            required: true,
            min: -90,
            max: 90
        },

        longitude: {
            type: Number,
            required: true,
            min: -180,
            max: 180
        }
    },
    {
        _id: false
    }
);


// =====================================================
// DAY SCHEMA
// =====================================================

const daySchema = new mongoose.Schema(
    {
        day: {
            type: Number,
            required: true,
            min: 1
        },

        title: {
            type: String,
            required: true,
            trim: true
        },

        places: {
            type: [placeSchema],
            required: true,
            validate: {
                validator: function (places) {
                    return places.length >= 1;
                },
                message: "Each day must contain at least one place."
            }
        }
    },
    {
        _id: false
    }
);


// =====================================================
// ESTIMATED BUDGET SCHEMA
// =====================================================

const estimatedBudgetSchema = new mongoose.Schema(
    {
        hotel: {
            type: String,
            default: "₹0"
        },

        food: {
            type: String,
            default: "₹0"
        },

        transport: {
            type: String,
            default: "₹0"
        },

        activities: {
            type: String,
            default: "₹0"
        },

        total: {
            type: String,
            default: "₹0"
        }
    },
    {
        _id: false
    }
);


// =====================================================
// TRIP SCHEMA
// =====================================================

const tripSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },


        destination: {
            type: String,
            required: true,
            trim: true
        },


        // Optional — older trips saved before this field
        // existed won't have it, so it's not required.
        source: {
            type: String,
            trim: true
        },


        startDate: {
            type: Date,
            required: true
        },


        endDate: {
            type: Date,
            required: true
        },


        travelers: {
            type: Number,
            required: true,
            min: 1
        },


        // =============================================
        // Budget Type
        // =============================================

        budget: {
            type: String,

            enum: [
                "Low",
                "Medium",
                "Luxury"
            ],

            required: true
        },


        // =============================================
        // AI Estimated Budget
        // =============================================

        estimatedBudget: {
            type: estimatedBudgetSchema,
            default: () => ({})
        },


        // =============================================
        // Transport
        // =============================================

        transport: {
            type: String,

            enum: [
                "Flight",
                "Train",
                "Bus",
                "Car"
            ],

            required: true
        },


        // =============================================
        // Hotel
        // =============================================

        hotelType: {
            type: String,

            enum: [
                "Budget",
                "Standard",
                "Luxury"
            ],

            default: "Standard"
        },


        // =============================================
        // Trip Type
        // =============================================

        tripType: {
            type: String,

            enum: [
                "Solo",
                "Family",
                "Friends",
                "Couple"
            ],

            default: "Solo"
        },


        // =============================================
        // AI ITINERARY + MAP LOCATIONS
        // =============================================

        itinerary: {
            type: [daySchema],
            default: []
        }
    },


    {
        timestamps: true
    }
);

// =====================================================
// DATE VALIDATION
// =====================================================

tripSchema.pre("validate", function () {

    if (this.startDate && this.endDate) {

        if (this.endDate < this.startDate) {

            throw new Error(
                "End date cannot be before start date."
            );

        }

    }

});

module.exports = mongoose.model("Trip", tripSchema);
