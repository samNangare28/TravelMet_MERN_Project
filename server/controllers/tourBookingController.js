const Tour = require("../models/Tour");

const TourBooking =
    require("../models/TourBooking");

const TravelCompany =
    require("../models/TravelCompany");

const {
    sendTourBookingUserEmail,
    sendTourBookingCompanyEmail
} = require("../utils/sendEmail");

const { getBookedTravelerCount } =
    require("../utils/tourCapacity");


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
        await getBookedTravelerCount(tourId);


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

        const {
            contactName,
            contactEmail,
            contactPhone,
            numberOfTravelers,
            specialRequests
        } = req.body;


        // =================================================
        // VALIDATE BOOKING FORM
        // =================================================

        if (
            !contactName?.trim() ||
            !contactEmail?.trim() ||
            !contactPhone?.trim()
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Please provide your name, email and phone number"

            });

        }


        const travelers =
            Number(numberOfTravelers);


        if (
            !Number.isInteger(travelers) ||
            travelers < 1
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Number of travelers must be at least 1"

            });

        }


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
        // COUNT CURRENT BOOKINGS (BY SEATS, NOT DOCUMENTS)
        // =================================================

        const bookedTravelers =
            await getBookedTravelerCount(tourId);


        // =================================================
        // CHECK CAPACITY
        // =================================================

        const remainingBeforeBooking =
            Math.max(
                tour.maxTravelers - bookedTravelers,
                0
            );


        if (
            travelers >
            remainingBeforeBooking
        ) {

            return res.status(400).json({

                success: false,

                message:
                    remainingBeforeBooking === 0
                        ? "This tour is fully booked"
                        : `Only ${remainingBeforeBooking} seat(s) left for this tour`,

                isFull:
                    remainingBeforeBooking === 0,

                tourCapacity: {

                    maxTravelers:
                        tour.maxTravelers,

                    bookedTravelers,

                    remainingTravelers:
                        remainingBeforeBooking,

                    isFull:
                        remainingBeforeBooking === 0

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

                status: "confirmed",

                numberOfTravelers:
                    travelers,

                contactName:
                    contactName.trim(),

                contactEmail:
                    contactEmail.trim().toLowerCase(),

                contactPhone:
                    contactPhone.trim(),

                specialRequests:
                    specialRequests?.trim() || ""

            });


        // =================================================
        // UPDATED CAPACITY
        // =================================================

        const updatedBookedTravelers =
            bookedTravelers + travelers;


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
        // NOTIFY USER + COMPANY BY EMAIL
        // =================================================
        //
        // Booking is already confirmed at this point — an
        // email failure here should never fail the booking
        // itself, so this is best-effort and logged only.
        //
        // =================================================

        (async () => {

            try {

                const company =
                    await TravelCompany.findById(tour.company);

                if (company?.email) {

                    await sendTourBookingCompanyEmail({
                        companyOwnerName: company.ownerName,
                        companyEmail: company.email,
                        tourTitle: tour.title,
                        destination: tour.destination,
                        startDate: tour.startDate,
                        endDate: tour.endDate,
                        contactName: booking.contactName,
                        contactEmail: booking.contactEmail,
                        contactPhone: booking.contactPhone,
                        numberOfTravelers: booking.numberOfTravelers,
                        specialRequests: booking.specialRequests
                    });

                }

            } catch (emailError) {

                console.error(
                    "❌ COMPANY BOOKING EMAIL ERROR:",
                    emailError.message
                );

            }


            try {

                await sendTourBookingUserEmail({
                    name: booking.contactName,
                    email: booking.contactEmail,
                    tourTitle: tour.title,
                    destination: tour.destination,
                    startDate: tour.startDate,
                    endDate: tour.endDate,
                    numberOfTravelers: booking.numberOfTravelers
                });

            } catch (emailError) {

                console.error(
                    "❌ USER BOOKING EMAIL ERROR:",
                    emailError.message
                );

            }

        })();


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
            // TOTAL SEATS BOOKED (NOT BOOKING DOCUMENTS)
            // =================================================

            const bookedTravelers =
                bookings.reduce(

                    (total, booking) =>
                        total + (booking.numberOfTravelers || 1),

                    0

                );


            // =================================================
            // RESPONSE
            // =================================================

            return res.status(200).json({

                success: true,

                count:
                    bookings.length,

                bookedTravelers,

                maxTravelers:
                    tour.maxTravelers,

                remainingTravelers:
                    Math.max(

                        tour.maxTravelers -
                        bookedTravelers,

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