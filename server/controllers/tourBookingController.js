const Tour = require("../models/Tour");

const TourBooking =
    require("../models/TourBooking");


// =====================================================
// HELPER
// GET TOUR CAPACITY
// =====================================================

const getTourCapacity = async (tourId) => {

    const tour =
        await Tour.findById(tourId);

    if (!tour) {
        return null;
    }


    const bookedTravelers =
        await TourBooking.countDocuments({

            tour: tourId,

            status: "confirmed"

        });


    const remainingTravelers =
        Math.max(

            tour.maxTravelers -
            bookedTravelers,

            0

        );


    return {

        maxTravelers:
            tour.maxTravelers,

        bookedTravelers,

        remainingTravelers,

        isFull:
            remainingTravelers === 0

    };

};


// =====================================================
// BOOK TOUR
// =====================================================
//
// POST /api/tour-bookings/:tourId
//
// USER ONLY
//
// =====================================================

const bookTour = async (req, res) => {

    try {

        const { tourId } =
            req.params;

        const userId =
            req.user.id;


        // =================================================
        // FIND TOUR
        // =================================================

        const tour =
            await Tour.findById(tourId);


        if (!tour) {

            return res.status(404).json({

                success: false,

                message:
                    "Tour not found"

            });

        }


        // =================================================
        // CHECK TOUR STATUS
        // =================================================

        if (tour.status !== "active") {

            return res.status(400).json({

                success: false,

                message:
                    "This tour is no longer available"

            });

        }


        // =================================================
        // CHECK TOUR EXPIRY
        // =================================================

        const today =
            new Date();

        today.setHours(
            0,
            0,
            0,
            0
        );


        const tourEndDate =
            new Date(tour.endDate);

        tourEndDate.setHours(
            0,
            0,
            0,
            0
        );


        if (tourEndDate < today) {

            return res.status(400).json({

                success: false,

                message:
                    "This tour has already expired"

            });

        }


        // =================================================
        // CHECK EXISTING BOOKING
        // =================================================

        const existingBooking =
            await TourBooking.findOne({

                tour: tourId,

                user: userId,

                status: "confirmed"

            });


        if (existingBooking) {

            return res.status(400).json({

                success: false,

                message:
                    "You have already registered for this tour",

                alreadyBooked: true

            });

        }


        // =================================================
        // COUNT CURRENT BOOKINGS
        // =================================================

        const bookedTravelers =
            await TourBooking.countDocuments({

                tour: tourId,

                status: "confirmed"

            });


        // =================================================
        // CHECK CAPACITY
        // =================================================

        if (
            bookedTravelers >=
            tour.maxTravelers
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "This tour is fully booked",

                isFull: true,

                tourCapacity: {

                    maxTravelers:
                        tour.maxTravelers,

                    bookedTravelers,

                    remainingTravelers: 0,

                    isFull: true

                }

            });

        }


        // =================================================
        // CREATE BOOKING
        // =================================================

        const booking =
            await TourBooking.create({

                tour: tourId,

                user: userId,

                company:
                    tour.company,

                status: "confirmed"

            });


        // =================================================
        // UPDATED CAPACITY
        // =================================================

        const updatedBookedTravelers =
            bookedTravelers + 1;


        const remainingTravelers =
            Math.max(

                tour.maxTravelers -
                updatedBookedTravelers,

                0

            );


        // =================================================
        // OPTIONAL:
        // MARK TOUR FULL
        // =================================================

        if (
            remainingTravelers === 0
        ) {

            tour.status =
                "completed";

            await tour.save();

        }


        // =================================================
        // RESPONSE
        // =================================================

        return res.status(201).json({

            success: true,

            message:
                "Tour registered successfully 🎉",

            booking,

            tourCapacity: {

                maxTravelers:
                    tour.maxTravelers,

                bookedTravelers:
                    updatedBookedTravelers,

                remainingTravelers,

                isFull:
                    remainingTravelers === 0

            }

        });

    }

    catch (error) {

        console.error(
            "❌ BOOK TOUR ERROR:",
            error
        );


        // =================================================
        // DUPLICATE BOOKING
        // =================================================

        if (
            error.code === 11000
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "You have already registered for this tour",

                alreadyBooked: true

            });

        }


        return res.status(500).json({

            success: false,

            message:
                "Unable to register for this tour"

        });

    }

};


// =====================================================
// CANCEL TOUR BOOKING
// =====================================================
//
// DELETE /api/tour-bookings/:tourId
//
// USER ONLY
//
// =====================================================

const cancelBooking = async (
    req,
    res
) => {

    try {

        const { tourId } =
            req.params;

        const userId =
            req.user.id;


        // =================================================
        // FIND BOOKING
        // =================================================

        const booking =
            await TourBooking.findOne({

                tour: tourId,

                user: userId,

                status: "confirmed"

            });


        if (!booking) {

            return res.status(404).json({

                success: false,

                message:
                    "Active booking not found"

            });

        }


        // =================================================
        // CANCEL
        // =================================================

        booking.status =
            "cancelled";

        await booking.save();


        // =================================================
        // GET UPDATED CAPACITY
        // =================================================

        const capacity =
            await getTourCapacity(
                tourId
            );


        // =================================================
        // IF TOUR EXISTS
        // =================================================

        if (capacity) {

            const tour =
                await Tour.findById(
                    tourId
                );


            // If tour was automatically marked
            // completed because it became full,
            // make it active again after cancellation.

            if (
                tour &&
                tour.status === "completed" &&
                capacity.remainingTravelers > 0
            ) {

                const today =
                    new Date();

                today.setHours(
                    0,
                    0,
                    0,
                    0
                );


                const endDate =
                    new Date(
                        tour.endDate
                    );

                endDate.setHours(
                    0,
                    0,
                    0,
                    0
                );


                if (endDate >= today) {

                    tour.status =
                        "active";

                    await tour.save();

                }

            }

        }


        // =================================================
        // RESPONSE
        // =================================================

        return res.status(200).json({

            success: true,

            message:
                "Tour booking cancelled successfully",

            tourCapacity:
                capacity

        });

    }

    catch (error) {

        console.error(
            "❌ CANCEL TOUR BOOKING ERROR:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Unable to cancel tour booking"

        });

    }

};


// =====================================================
// GET TOUR BOOKING COUNT
// =====================================================
//
// GET /api/tour-bookings/:tourId/count
//
// PUBLIC
//
// =====================================================

const getTourBookingCount =
    async (req, res) => {

        try {

            const { tourId } =
                req.params;


            const capacity =
                await getTourCapacity(
                    tourId
                );


            if (!capacity) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Tour not found"

                });

            }


            return res.status(200).json({

                success: true,

                tourCapacity:
                    capacity

            });

        }

        catch (error) {

            console.error(
                "❌ GET TOUR BOOKING COUNT ERROR:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "Unable to get tour availability"

            });

        }

    };


// =====================================================
// GET MY TOUR BOOKING
// =====================================================
//
// GET /api/tour-bookings/:tourId/my-booking
//
// USER ONLY
//
// =====================================================

const getMyTourBooking =
    async (req, res) => {

        try {

            const { tourId } =
                req.params;

            const userId =
                req.user.id;


            const booking =
                await TourBooking.findOne({

                    tour: tourId,

                    user: userId,

                    status: "confirmed"

                });


            return res.status(200).json({

                success: true,

                booked:
                    !!booking,

                booking:
                    booking || null

            });

        }

        catch (error) {

            console.error(
                "❌ GET MY TOUR BOOKING ERROR:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "Unable to check your booking"

            });

        }

    };


// =====================================================
// GET TOUR BOOKINGS
// =====================================================
//
// COMPANY SIDE
//
// GET /api/tour-bookings/company/:tourId
//
// =====================================================

const getTourBookings =
    async (req, res) => {

        try {

            const { tourId } =
                req.params;

            const companyId =
                req.company.id;


            // =================================================
            // FIND TOUR BELONGING TO COMPANY
            // =================================================

            const tour =
                await Tour.findOne({

                    _id: tourId,

                    company: companyId

                });


            if (!tour) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Tour not found or you do not have permission"

                });

            }


            // =================================================
            // GET BOOKINGS
            // =================================================

            const bookings =
                await TourBooking.find({

                    tour: tourId,

                    status: "confirmed"

                })

                .populate(

                    "user",

                    "firstName lastName username email profileImage"

                )

                .sort({

                    createdAt: 1

                });


            // =================================================
            // RESPONSE
            // =================================================

            return res.status(200).json({

                success: true,

                count:
                    bookings.length,

                maxTravelers:
                    tour.maxTravelers,

                remainingTravelers:
                    Math.max(

                        tour.maxTravelers -
                        bookings.length,

                        0

                    ),

                bookings

            });

        }

        catch (error) {

            console.error(
                "❌ GET TOUR BOOKINGS ERROR:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "Unable to fetch tour bookings"

            });

        }

    };


// =====================================================
// EXPORT
// =====================================================

module.exports = {

    bookTour,

    cancelBooking,

    getTourBookingCount,

    getMyTourBooking,

    getTourBookings

};