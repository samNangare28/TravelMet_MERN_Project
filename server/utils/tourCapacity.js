const mongoose = require("mongoose");
const TourBooking = require("../models/TourBooking");


// =====================================================
// GET BOOKED TRAVELER COUNT
// =====================================================
//
// Counts total seats booked for a tour.
//
// IMPORTANT:
// One booking document can contain multiple travelers.
// Therefore we SUM `numberOfTravelers` instead of counting
// booking documents.
//
// Only `confirmed` bookings consume tour capacity.
// Cancelled bookings are automatically excluded.
//
// =====================================================

const getBookedTravelerCount = async (tourId) => {

    try {

        // =================================================
        // VALIDATE TOUR ID
        // =================================================

        if (
            !tourId ||
            !mongoose.Types.ObjectId.isValid(tourId)
        ) {

            return 0;

        }


        // =================================================
        // CONVERT TO OBJECT ID
        // =================================================

        const tourObjectId =
            new mongoose.Types.ObjectId(
                tourId
            );


        // =================================================
        // CALCULATE BOOKED SEATS
        // =================================================

        const result =
            await TourBooking.aggregate([

                // -----------------------------------------
                // ONLY CONFIRMED BOOKINGS
                // -----------------------------------------

                {
                    $match: {

                        tour:
                            tourObjectId,

                        status:
                            "confirmed"

                    }
                },


                // -----------------------------------------
                // SUM NUMBER OF TRAVELERS
                // -----------------------------------------

                {
                    $group: {

                        _id:
                            null,

                        total: {

                            $sum: {

                                $cond: [

                                    {
                                        $and: [

                                            {
                                                $ne: [
                                                    "$numberOfTravelers",
                                                    null
                                                ]
                                            },

                                            {
                                                $gte: [
                                                    "$numberOfTravelers",
                                                    1
                                                ]
                                            }

                                        ]
                                    },

                                    "$numberOfTravelers",

                                    0

                                ]

                            }

                        }

                    }

                }

            ]);


        // =================================================
        // RETURN TOTAL
        // =================================================

        const totalBooked =
            Number(
                result[0]?.total || 0
            );


        // Never return a negative value.

        return Math.max(
            totalBooked,
            0
        );

    }

    catch (error) {

        console.error(
            "❌ GET BOOKED TRAVELER COUNT ERROR:",
            error
        );


        // Do not crash the complete API because of
        // capacity calculation.

        return 0;

    }

};


// =====================================================
// EXPORT
// =====================================================

module.exports = {
    getBookedTravelerCount
};
