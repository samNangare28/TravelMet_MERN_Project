const mongoose = require("mongoose");

const Tour = require("../models/Tour");
const TourBooking = require("../models/TourBooking");
const TravelCompany = require("../models/TravelCompany");

const {
    sendTourBookingUserEmail,
    sendTourBookingCompanyEmail
} = require("../utils/sendEmail");

const {
    getBookedTravelerCount
} = require("../utils/tourCapacity");


// =====================================================
// HELPER
// CHECK VALID MONGODB ID
// =====================================================

const isValidObjectId = (id) => {
    return mongoose.Types.ObjectId.isValid(id);
};


// =====================================================
// HELPER
// GET TOUR CAPACITY
// =====================================================
//
// IMPORTANT:
// getBookedTravelerCount() should count ONLY
// confirmed bookings.
//
// Pending / rejected / cancelled bookings
// should NOT occupy seats.
//
// =====================================================

const getTourCapacity = async (tourId) => {

    const tour = await Tour.findById(tourId);

    if (!tour) {
        return null;
    }

    const bookedTravelers =
        await getBookedTravelerCount(tourId);

    const remainingTravelers =
        Math.max(
            tour.maxTravelers - bookedTravelers,
            0
        );

    return {
        maxTravelers: tour.maxTravelers,
        bookedTravelers,
        remainingTravelers,
        isFull: remainingTravelers <= 0
    };
};


// =====================================================
// BOOK TOUR
// POST /api/tour-bookings/:tourId
// USER ONLY
// =====================================================
//
// FLOW:
//
// User books
//      ↓
// PENDING
//      ↓
// Company gets notification/email
//      ↓
// Company confirms/rejects
//
// NO USER CONFIRMATION EMAIL HERE.
//
// =====================================================

const bookTour = async (req, res) => {

    try {

        const { tourId } = req.params;
        const userId = req.user.id;


        // =================================================
        // VALIDATE TOUR ID
        // =================================================

        if (!isValidObjectId(tourId)) {

            return res.status(400).json({
                success: false,
                message: "Invalid tour ID"
            });

        }


        // =================================================
        // GET FORM DATA
        // =================================================

        const {
            contactName,
            contactEmail,
            contactPhone,
            numberOfTravelers,
            specialRequests
        } = req.body;


        // =================================================
        // BASIC VALIDATION
        // =================================================

        if (!contactName?.trim()) {

            return res.status(400).json({
                success: false,
                message: "Please enter your full name"
            });

        }


        if (!contactEmail?.trim()) {

            return res.status(400).json({
                success: false,
                message: "Please enter your email address"
            });

        }


        if (!contactPhone?.trim()) {

            return res.status(400).json({
                success: false,
                message: "Please enter your phone number"
            });

        }


        // =================================================
        // EMAIL VALIDATION
        // =================================================

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (
            !emailPattern.test(
                contactEmail.trim()
            )
        ) {

            return res.status(400).json({
                success: false,
                message: "Please enter a valid email address"
            });

        }


        // =================================================
        // PHONE VALIDATION
        // =================================================

        const cleanPhone =
            contactPhone
                .trim()
                .replace(/[\s-]/g, "");


        if (
            !/^\+?\d{7,15}$/.test(
                cleanPhone
            )
        ) {

            return res.status(400).json({
                success: false,
                message: "Please enter a valid phone number"
            });

        }


        // =================================================
        // TRAVELER VALIDATION
        // =================================================

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
        // MAX 10 TRAVELERS
        // =================================================

        if (travelers > 10) {

            return res.status(400).json({
                success: false,
                message:
                    "Maximum 10 travelers are allowed per booking"
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
                message: "Tour not found"
            });

        }


        // =================================================
        // TOUR STATUS
        // =================================================

        if (tour.status !== "active") {

            return res.status(400).json({
                success: false,
                message:
                    tour.status === "cancelled"
                        ? "This tour has been cancelled"
                        : "This tour is no longer available"
            });

        }


        // =================================================
        // TOUR EXPIRY
        // =================================================

        const now = new Date();

        const tourEndDate =
            new Date(tour.endDate);


        if (tourEndDate < now) {

            return res.status(400).json({
                success: false,
                message:
                    "This tour has already expired"
            });

        }


        // =================================================
        // CHECK EXISTING ACTIVE REQUEST
        // =================================================
        //
        // User cannot send another request while one
        // is already pending or confirmed.
        //
        // Rejected/cancelled booking can be requested again.
        //
        // =================================================

        const existingBooking =
            await TourBooking.findOne({
                tour: tourId,
                user: userId,
                status: {
                    $in: [
                        "pending",
                        "confirmed"
                    ]
                }
            });


        if (existingBooking) {

            if (
                existingBooking.status ===
                "pending"
            ) {

                return res.status(400).json({
                    success: false,
                    message:
                        "Your booking request is already pending for this tour",
                    alreadyRequested: true,
                    booking: existingBooking
                });

            }


            return res.status(400).json({
                success: false,
                message:
                    "You have already registered for this tour",
                alreadyBooked: true,
                booking: existingBooking
            });

        }


        // =================================================
        // CHECK CURRENT CONFIRMED CAPACITY
        // =================================================
        //
        // IMPORTANT:
        // Pending bookings do NOT occupy seats.
        //
        // Only confirmed bookings are counted.
        //
        // =================================================

        const bookedTravelers =
            await getBookedTravelerCount(
                tourId
            );


        const remainingBeforeRequest =
            Math.max(
                tour.maxTravelers -
                bookedTravelers,
                0
            );


        // =================================================
        // FULL TOUR
        // =================================================

        if (
            remainingBeforeRequest <= 0
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
        // REQUESTED TRAVELERS > AVAILABLE SEATS
        // =================================================

        if (
            travelers >
            remainingBeforeRequest
        ) {

            return res.status(400).json({
                success: false,
                message:
                    `Only ${remainingBeforeRequest} seat(s) left for this tour`,
                isFull: false,
                tourCapacity: {
                    maxTravelers:
                        tour.maxTravelers,

                    bookedTravelers,

                    remainingTravelers:
                        remainingBeforeRequest,

                    isFull: false
                }
            });

        }


        // =================================================
        // CREATE PENDING BOOKING
        // =================================================

        let booking;


        try {

            booking =
                await TourBooking.create({

                    tour: tourId,

                    user: userId,

                    company:
                        tour.company,

                    contactName:
                        contactName.trim(),

                    contactEmail:
                        contactEmail
                            .trim()
                            .toLowerCase(),

                    contactPhone:
                        cleanPhone,

                    numberOfTravelers:
                        travelers,

                    specialRequests:
                        specialRequests?.trim() || "",

                    status:
                        "pending"

                });

        }
        catch (createError) {

            // =============================================
            // DUPLICATE KEY
            // =============================================

            if (
                createError.code === 11000
            ) {

                return res.status(400).json({
                    success: false,
                    message:
                        "You already have an active booking for this tour",
                    alreadyBooked: true
                });

            }

            throw createError;

        }


        // =================================================
        // SEND COMPANY NOTIFICATION EMAIL
        // =================================================
        //
        // Company receives booking request.
        //
        // User DOES NOT receive confirmation email here.
        //
        // =================================================

        try {

            const company =
                await TravelCompany.findById(
                    tour.company
                );


            if (company?.email) {

                await sendTourBookingCompanyEmail({

                    companyOwnerName:
                        company.ownerName,

                    companyEmail:
                        company.email,

                    tourTitle:
                        tour.title,

                    destination:
                        tour.destination,

                    startDate:
                        tour.startDate,

                    endDate:
                        tour.endDate,

                    contactName:
                        booking.contactName,

                    contactEmail:
                        booking.contactEmail,

                    contactPhone:
                        booking.contactPhone,

                    numberOfTravelers:
                        booking.numberOfTravelers,

                    specialRequests:
                        booking.specialRequests,

                    bookingId:
                        booking._id

                });

            }

        }
        catch (emailError) {

            console.error(
                "❌ COMPANY BOOKING EMAIL ERROR:",
                emailError.message
            );

        }


        // =================================================
        // RESPONSE
        // =================================================

        return res.status(201).json({

            success: true,

            message:
                "Booking request sent successfully. Waiting for company confirmation.",

            booking,

            bookingStatus:
                "pending",

            tourCapacity: {

                maxTravelers:
                    tour.maxTravelers,

                bookedTravelers,

                remainingTravelers:
                    remainingBeforeRequest,

                isFull:
                    remainingBeforeRequest <= 0

            }

        });

    }
    catch (error) {

        console.error(
            "❌ BOOK TOUR ERROR:",
            error
        );


        return res.status(500).json({
            success: false,
            message:
                "Unable to send booking request"
        });

    }

};


// =====================================================
// CONFIRM TOUR BOOKING
// PATCH /api/tour-bookings/company/:bookingId/confirm
// COMPANY ONLY
// =====================================================
//
// Company confirms pending booking.
//
// THEN:
// booking → confirmed
// user → confirmation email
//
// =====================================================

const confirmBooking = async (req, res) => {

    try {

        const { bookingId } = req.params;

        const companyId =
            req.company.id;


        // =================================================
        // VALIDATE BOOKING ID
        // =================================================

        if (
            !isValidObjectId(
                bookingId
            )
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Invalid booking ID"
            });

        }


        // =================================================
        // FIND PENDING BOOKING
        // =================================================

        const booking =
            await TourBooking.findOne({
                _id: bookingId,
                company: companyId,
                status: "pending"
            });


        if (!booking) {

            return res.status(404).json({
                success: false,
                message:
                    "Pending booking not found or already processed"
            });

        }


        // =================================================
        // FIND TOUR
        // =================================================

        const tour =
            await Tour.findOne({
                _id: booking.tour,
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
        // TOUR STATUS
        // =================================================

        if (
            tour.status !== "active"
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "This tour is no longer available"
            });

        }


        // =================================================
        // CHECK CAPACITY AGAIN
        // =================================================
        //
        // Another booking may have been confirmed
        // after this request was created.
        //
        // Therefore capacity MUST be checked again.
        //
        // =================================================

        const bookedTravelers =
            await getBookedTravelerCount(
                tour._id
            );


        const remainingTravelers =
            Math.max(
                tour.maxTravelers -
                bookedTravelers,
                0
            );


        if (
            booking.numberOfTravelers >
            remainingTravelers
        ) {

            return res.status(400).json({

                success: false,

                message:
                    `Cannot confirm. Only ${remainingTravelers} seat(s) are available.`,

                tourCapacity: {

                    maxTravelers:
                        tour.maxTravelers,

                    bookedTravelers,

                    remainingTravelers,

                    isFull:
                        remainingTravelers <= 0

                }

            });

        }


        // =================================================
        // CONFIRM BOOKING
        // =================================================

        booking.status =
            "confirmed";

        booking.companyRespondedAt =
            new Date();

        booking.rejectionReason =
            "";

        await booking.save();


        // =================================================
        // SEND CONFIRMATION EMAIL TO USER
        // =================================================

        try {

            await sendTourBookingUserEmail({

                name:
                    booking.contactName,

                email:
                    booking.contactEmail,

                tourTitle:
                    tour.title,

                destination:
                    tour.destination,

                startDate:
                    tour.startDate,

                endDate:
                    tour.endDate,

                numberOfTravelers:
                    booking.numberOfTravelers

            });

        }
        catch (emailError) {

            console.error(
                "❌ USER CONFIRMATION EMAIL ERROR:",
                emailError.message
            );

        }


        // =================================================
        // UPDATED CAPACITY
        // =================================================

        const updatedBookedTravelers =
            bookedTravelers +
            booking.numberOfTravelers;


        const updatedRemainingTravelers =
            Math.max(
                tour.maxTravelers -
                updatedBookedTravelers,
                0
            );


        // =================================================
        // RESPONSE
        // =================================================

        return res.status(200).json({

            success: true,

            message:
                "Booking confirmed successfully. Confirmation email sent to the user.",

            booking,

            tourCapacity: {

                maxTravelers:
                    tour.maxTravelers,

                bookedTravelers:
                    updatedBookedTravelers,

                remainingTravelers:
                    updatedRemainingTravelers,

                isFull:
                    updatedRemainingTravelers <= 0

            }

        });

    }
    catch (error) {

        console.error(
            "❌ CONFIRM BOOKING ERROR:",
            error
        );


        return res.status(500).json({
            success: false,
            message:
                "Unable to confirm booking"
        });

    }

};


// =====================================================
// REJECT TOUR BOOKING
// PATCH /api/tour-bookings/company/:bookingId/reject
// COMPANY ONLY
// =====================================================
//
// Company rejects pending booking.
//
// booking → rejected
//
// User receives rejection email.
//
// =====================================================

const rejectBooking = async (req, res) => {

    try {

        const { bookingId } = req.params;

        const companyId =
            req.company.id;

        const {
            rejectionReason
        } = req.body;


        // =================================================
        // VALIDATE BOOKING ID
        // =================================================

        if (
            !isValidObjectId(
                bookingId
            )
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Invalid booking ID"
            });

        }


        // =================================================
        // FIND PENDING BOOKING
        // =================================================

        const booking =
            await TourBooking.findOne({
                _id: bookingId,
                company: companyId,
                status: "pending"
            });


        if (!booking) {

            return res.status(404).json({
                success: false,
                message:
                    "Pending booking not found or already processed"
            });

        }


        // =================================================
        // FIND TOUR
        // =================================================

        const tour =
            await Tour.findOne({
                _id: booking.tour,
                company: companyId
            });


        if (!tour) {

            return res.status(404).json({
                success: false,
                message:
                    "Tour not found"
            });

        }


        // =================================================
        // UPDATE BOOKING
        // =================================================

        booking.status =
            "rejected";

        booking.companyRespondedAt =
            new Date();

        booking.rejectionReason =
            rejectionReason?.trim() || "";

        await booking.save();


        // =================================================
        // USER REJECTION EMAIL
        // =================================================

        try {

            await sendTourBookingUserEmail({

                name:
                    booking.contactName,

                email:
                    booking.contactEmail,

                tourTitle:
                    tour.title,

                destination:
                    tour.destination,

                startDate:
                    tour.startDate,

                endDate:
                    tour.endDate,

                numberOfTravelers:
                    booking.numberOfTravelers,

                status:
                    "rejected",

                rejectionReason:
                    booking.rejectionReason

            });

        }
        catch (emailError) {

            console.error(
                "❌ USER REJECTION EMAIL ERROR:",
                emailError.message
            );

        }


        // =================================================
        // RESPONSE
        // =================================================

        return res.status(200).json({

            success: true,

            message:
                "Booking request rejected successfully",

            booking

        });

    }
    catch (error) {

        console.error(
            "❌ REJECT BOOKING ERROR:",
            error
        );


        return res.status(500).json({
            success: false,
            message:
                "Unable to reject booking"
        });

    }

};


// =====================================================
// CANCEL TOUR BOOKING
// DELETE /api/tour-bookings/:tourId
// USER ONLY
// =====================================================
//
// Only CONFIRMED booking can be cancelled.
//
// Pending request should NOT use this endpoint.
// We can add separate cancel-request endpoint later
// if needed.
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
        // VALIDATE TOUR ID
        // =================================================

        if (
            !isValidObjectId(tourId)
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Invalid tour ID"
            });

        }


        // =================================================
        // FIND CONFIRMED BOOKING
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
                    "Active confirmed booking not found"
            });

        }


        // =================================================
        // CANCEL
        // =================================================

        booking.status =
            "cancelled";

        await booking.save();


        // =================================================
        // UPDATED CAPACITY
        // =================================================

        const capacity =
            await getTourCapacity(
                tourId
            );


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
// GET /api/tour-bookings/:tourId/count
// PUBLIC
// =====================================================

const getTourBookingCount =
    async (req, res) => {

        try {

            const { tourId } =
                req.params;


            // =================================================
            // VALIDATE TOUR ID
            // =================================================

            if (
                !isValidObjectId(tourId)
            ) {

                return res.status(400).json({
                    success: false,
                    message:
                        "Invalid tour ID"
                });

            }


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
// GET /api/tour-bookings/:tourId/my-booking
// USER ONLY
// =====================================================
//
// Returns pending OR confirmed booking.
//
// This is important because user needs to see:
//
// PENDING 🟡
// CONFIRMED 🟢
// REJECTED 🔴
//
/* Rejected bookings can also be fetched if needed */
// =====================================================

const getMyTourBooking =
    async (req, res) => {

        try {

            const { tourId } =
                req.params;

            const userId =
                req.user.id;


            // =================================================
            // VALIDATE TOUR ID
            // =================================================

            if (
                !isValidObjectId(tourId)
            ) {

                return res.status(400).json({
                    success: false,
                    message:
                        "Invalid tour ID"
                });

            }


            // =================================================
            // FIND LATEST BOOKING
            // =================================================

            const booking =
                await TourBooking.findOne({

                    tour: tourId,

                    user: userId

                })
                .sort({
                    createdAt: -1
                });


            return res.status(200).json({

                success: true,

                booked:
                    booking?.status ===
                    "confirmed",

                hasRequest:
                    !!booking,

                status:
                    booking?.status || null,

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
// COMPANY ONLY
// GET /api/tour-bookings/company/:tourId
// =====================================================
//
// Company sees:
//
// pending
// confirmed
// rejected
// cancelled
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
            // VALIDATE TOUR ID
            // =================================================

            if (
                !isValidObjectId(tourId)
            ) {

                return res.status(400).json({
                    success: false,
                    message:
                        "Invalid tour ID"
                });

            }


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

                    company: companyId

                })
                .populate(
                    "user",
                    "firstName lastName username email profileImage"
                )
                .sort({
                    createdAt: -1
                });


            // =================================================
            // CALCULATE CONFIRMED TRAVELERS
            // =================================================

            const confirmedBookings =
                bookings.filter(
                    (booking) =>
                        booking.status ===
                        "confirmed"
                );


            const bookedTravelers =
                confirmedBookings.reduce(
                    (total, booking) => {

                        return total +
                            (
                                Number(
                                    booking.numberOfTravelers
                                ) || 0
                            );

                    },
                    0
                );


            const pendingBookings =
                bookings.filter(
                    (booking) =>
                        booking.status ===
                        "pending"
                );


            const pendingTravelers =
                pendingBookings.reduce(
                    (total, booking) => {

                        return total +
                            (
                                Number(
                                    booking.numberOfTravelers
                                ) || 0
                            );

                    },
                    0
                );


            const remainingTravelers =
                Math.max(
                    tour.maxTravelers -
                    bookedTravelers,
                    0
                );


            // =================================================
            // RESPONSE
            // =================================================

            return res.status(200).json({

                success: true,

                count:
                    bookings.length,

                pendingCount:
                    pendingBookings.length,

                confirmedCount:
                    confirmedBookings.length,

                bookedTravelers,

                pendingTravelers,

                maxTravelers:
                    tour.maxTravelers,

                remainingTravelers,

                isFull:
                    remainingTravelers <= 0,

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
// GET ALL COMPANY PENDING BOOKINGS
// GET /api/tour-bookings/company/pending
// COMPANY ONLY
// =====================================================
//
// This will be useful for the COMPANY DASHBOARD.
//
// Company can see all pending requests from all its tours.
//
// =====================================================

const getCompanyPendingBookings =
    async (req, res) => {

        try {

            const companyId =
                req.company.id;


            const bookings =
                await TourBooking.find({

                    company: companyId,

                    status: "pending"

                })
                .populate(
                    "user",
                    "firstName lastName username email profileImage"
                )
                .populate(
                    "tour",
                    "title destination startDate endDate maxTravelers"
                )
                .sort({
                    createdAt: -1
                });


            return res.status(200).json({

                success: true,

                count:
                    bookings.length,

                bookings

            });

        }
        catch (error) {

            console.error(
                "❌ GET COMPANY PENDING BOOKINGS ERROR:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "Unable to fetch pending booking requests"

            });

        }

    };


// =====================================================
// EXPORT
// =====================================================

module.exports = {

    bookTour,

    confirmBooking,

    rejectBooking,

    cancelBooking,

    getTourBookingCount,

    getMyTourBooking,

    getTourBookings,

    getCompanyPendingBookings

};