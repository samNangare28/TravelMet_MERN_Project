const mongoose = require("mongoose");


// =====================================================
// TOUR BOOKING SCHEMA
// =====================================================

const tourBookingSchema = new mongoose.Schema(

    {

        // =================================================
        // TOUR
        // =================================================

        tour: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "Tour",

            required: true,

            index: true

        },


        // =================================================
        // USER
        // =================================================

        user: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "User",

            required: true,

            index: true

        },


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
        // BOOKING STATUS
        // =================================================

        status: {

            type: String,

            enum: [

                "confirmed",

                "cancelled"

            ],

            default: "confirmed",

            index: true

        }

    },

    {

        timestamps: true

    }

);


// =====================================================
// PREVENT DUPLICATE BOOKING
// =====================================================
//
// Same user cannot register for same tour twice.
//
// User A + Tour X → Allowed
// User A + Tour X → Blocked
// User B + Tour X → Allowed
//
// IMPORTANT:
// This index works even if the user cancels.
// Therefore, after cancellation the same user cannot
// create another booking for the same tour.
//
// =====================================================

tourBookingSchema.index(

    {

        tour: 1,

        user: 1

    },

    {

        unique: true

    }

);


// =====================================================
// COMPANY + TOUR + STATUS INDEX
// =====================================================
//
// Useful for company dashboard:
//
// Company → Tour → Confirmed bookings
//
// =====================================================

tourBookingSchema.index({

    company: 1,

    tour: 1,

    status: 1

});


// =====================================================
// TOUR + STATUS INDEX
// =====================================================
//
// Makes counting confirmed travelers faster.
//
// Example:
//
// TourBooking.countDocuments({
//     tour: tourId,
//     status: "confirmed"
// })
//
// =====================================================

tourBookingSchema.index({

    tour: 1,

    status: 1

});


// =====================================================
// MODEL
// =====================================================

const TourBooking = mongoose.model(

    "TourBooking",

    tourBookingSchema

);


module.exports = TourBooking;