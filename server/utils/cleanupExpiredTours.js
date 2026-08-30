const Tour = require("../models/Tour");
const TourBooking = require("../models/TourBooking");


// =====================================================
// CLEANUP EXPIRED TOURS
// =====================================================
//
// Once a tour's end date has passed (with a small grace
// period so a tour doesn't vanish the moment it ends),
// there is no more reason to keep it or its travelers'
// personal details (name, email, phone, special requests)
// around — so this permanently deletes both the Tour and
// every TourBooking that points to it.
//
// Grace period: 1 day after endDate, so companies/users
// still have a short window to view a just-finished tour.
//
// =====================================================

const GRACE_PERIOD_DAYS = 1;

const cleanupExpiredTours = async () => {

    try {

        const cutoff =
            new Date();

        cutoff.setDate(
            cutoff.getDate() - GRACE_PERIOD_DAYS
        );

        cutoff.setHours(0, 0, 0, 0);


        const expiredTours =
            await Tour.find({

                endDate: { $lt: cutoff }

            }).select("_id title");


        if (expiredTours.length === 0) {

            console.log(
                "🧹 Tour cleanup: no expired tours to remove."
            );

            return {
                toursRemoved: 0,
                bookingsRemoved: 0
            };

        }


        const expiredTourIds =
            expiredTours.map((tour) => tour._id);


        const bookingResult =
            await TourBooking.deleteMany({

                tour: { $in: expiredTourIds }

            });


        const tourResult =
            await Tour.deleteMany({

                _id: { $in: expiredTourIds }

            });


        console.log(
            `🧹 Tour cleanup: removed ${tourResult.deletedCount} expired tour(s) ` +
            `and ${bookingResult.deletedCount} related booking(s).`
        );


        return {
            toursRemoved: tourResult.deletedCount,
            bookingsRemoved: bookingResult.deletedCount
        };

    } catch (error) {

        console.error(
            "❌ TOUR CLEANUP ERROR:",
            error
        );

        return {
            toursRemoved: 0,
            bookingsRemoved: 0,
            error: error.message
        };

    }

};

module.exports = cleanupExpiredTours;
