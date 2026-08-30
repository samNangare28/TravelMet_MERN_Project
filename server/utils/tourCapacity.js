const mongoose = require("mongoose");
const TourBooking = require("../models/TourBooking");


// =====================================================
// GET BOOKED TRAVELER COUNT
// =====================================================
//
// A single confirmed booking can reserve more than one
// seat (numberOfTravelers), so capacity must always be
// computed by summing that field — never by counting
// booking documents.
//
// =====================================================

const getBookedTravelerCount = async (tourId) => {

    const result =
        await TourBooking.aggregate([

            {
                $match: {
                    tour:
                        new mongoose.Types.ObjectId(tourId),

                    status: "confirmed"
                }
            },

            {
                $group: {
                    _id: null,
                    total: { $sum: "$numberOfTravelers" }
                }
            }

        ]);

    return result[0]?.total || 0;

};

module.exports = { getBookedTravelerCount };
