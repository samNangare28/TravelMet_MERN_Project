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
        // CONTACT DETAILS
        // =================================================

        contactName: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100
        },


        contactEmail: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            maxlength: 150
        },


        contactPhone: {
            type: String,
            required: true,
            trim: true,
            maxlength: 20
        },


        // =================================================
        // NUMBER OF TRAVELERS
        // =================================================

        numberOfTravelers: {
            type: Number,
            required: true,
            min: 1,
            max: 10
        },


        // =================================================
        // SPECIAL REQUESTS
        // =================================================

        specialRequests: {
            type: String,
            trim: true,
            maxlength: 500,
            default: ""
        },


        // =================================================
        // BOOKING STATUS
        // =================================================
        //
        // pending   → User requested booking
        // confirmed → Company accepted booking
        // rejected  → Company rejected booking
        // cancelled → User cancelled confirmed booking
        //
        // IMPORTANT:
        // Booking is NOT confirmed when user submits it.
        //
        // =================================================

        status: {
            type: String,
            enum: [
                "pending",
                "confirmed",
                "rejected",
                "cancelled"
            ],
            default: "pending",
            index: true
        },

        rejectionReason: {
            type: String,
            trim: true,
            maxlength: 500,
            default: ""
        },

        confirmedAt: {
            type: Date,
            default: null
        },

        rejectedAt: {
            type: Date,
            default: null
        },


        // =================================================
        // COMPANY RESPONSE DETAILS
        // =================================================
        //
        // These fields help us track when and why the
        // company responded to the booking request.
        //
        // =================================================

        companyRespondedAt: {
            type: Date,
            default: null
        },


        rejectionReason: {
            type: String,
            trim: true,
            maxlength: 500,
            default: ""
        }

    },

    {
        timestamps: true
    }
);


// =====================================================
// ACTIVE BOOKING UNIQUE INDEX
// =====================================================
//
// Same user cannot have two CONFIRMED bookings
// for the same tour.
//
// Example:
//
// User A + Tour X → confirmed ✅
// User A + Tour X → blocked ❌
//
// If previous booking is:
//
// cancelled / rejected
//
// User can request/book again.
//
// =====================================================

tourBookingSchema.index(
    {
        tour: 1,
        user: 1
    },
    {
        unique: true,

        partialFilterExpression: {
            status: "confirmed"
        }
    }
);


// =====================================================
// COMPANY + STATUS INDEX
// =====================================================
//
// Useful for company dashboard.
//
// Example:
//
// Find all pending bookings for company.
//
// =====================================================

tourBookingSchema.index({
    company: 1,
    status: 1,
    createdAt: -1
});


// =====================================================
// COMPANY + TOUR + STATUS INDEX
// =====================================================

tourBookingSchema.index({
    company: 1,
    tour: 1,
    status: 1
});


// =====================================================
// TOUR + STATUS INDEX
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