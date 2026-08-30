const Tour = require("../models/Tour");
const TravelCompany = require("../models/TravelCompany");
const TourBooking = require("../models/TourBooking");
const { getBookedTravelerCount } = require("../utils/tourCapacity");


// =====================================================
// ADD TOUR
// =====================================================

const addTour = async (req, res) => {

    try {

        const {
            title,
            destination,
            description,
            price,
            startDate,
            endDate,
            duration,
            maxTravelers,
            image,
            theme
        } = req.body;


        const VALID_THEMES = [
            "Adventure",
            "Beach",
            "Honeymoon",
            "Wildlife",
            "Pilgrimage",
            "Hill Station",
            "Cultural",
            "Family",
            "Cruise",
            "Trekking",
            "Other"
        ];


        // =================================================
        // CHECK REQUIRED FIELDS
        // =================================================

        if (
            !title ||
            !destination ||
            !description ||
            price === undefined ||
            !startDate ||
            !endDate ||
            !duration ||
            !maxTravelers
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Please fill all required tour fields"

            });

        }


        // =================================================
        // GET COMPANY
        // =================================================

        const company =
            await TravelCompany.findById(
                req.company.id
            );


        if (!company) {

            return res.status(404).json({

                success: false,

                message:
                    "Company not found"

            });

        }


        // =================================================
        // ONLY VERIFIED COMPANY CAN ADD TOUR
        // =================================================

        if (
            company.verificationStatus !==
            "verified"
        ) {

            return res.status(403).json({

                success: false,

                message:
                    "Only verified companies can add tours"

            });

        }


        // =================================================
        // DATE VALIDATION
        // =================================================

        const start =
            new Date(startDate);

        const end =
            new Date(endDate);


        if (
            Number.isNaN(start.getTime()) ||
            Number.isNaN(end.getTime())
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid tour dates"

            });

        }


        if (end < start) {

            return res.status(400).json({

                success: false,

                message:
                    "End date cannot be before start date"

            });

        }


        // =================================================
        // PREVENT PAST TOUR
        // =================================================

        const today =
            new Date();

        today.setHours(
            0,
            0,
            0,
            0
        );


        if (end < today) {

            return res.status(400).json({

                success: false,

                message:
                    "Tour end date cannot be in the past"

            });

        }


        // =================================================
        // VALIDATE MAX TRAVELERS
        // =================================================

        const travelers =
            Number(maxTravelers);


        if (
            !Number.isInteger(travelers) ||
            travelers <= 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Maximum travelers must be a positive number"

            });

        }


        // =================================================
        // CREATE TOUR
        // =================================================

        const tour =
            new Tour({

                company:
                    company._id,

                title:
                    title.trim(),

                destination:
                    destination.trim(),

                description:
                    description.trim(),

                price:
                    Number(price),

                startDate:
                    start,

                endDate:
                    end,

                duration:
                    Number(duration),

                maxTravelers:
                    travelers,

                image:
                    image?.trim() || "",

                theme:
                    VALID_THEMES.includes(theme) ?
                        theme :
                        "Other"

            });


        await tour.save();


        // =================================================
        // RESPONSE
        // =================================================

        return res.status(201).json({

            success: true,

            message:
                "Tour added successfully ✅",

            tour: {

                ...tour.toObject(),

                bookedTravelers: 0,

                remainingTravelers:
                    travelers,

                isFull: false

            }

        });

    }

    catch (error) {

        console.error(
            "❌ ADD TOUR ERROR:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Unable to add tour"

        });

    }

};



// =====================================================
// GET COMPANY TOURS
// =====================================================
//
// Company dashboard.
//
// IMPORTANT:
// Full tours are NOT removed here.
// Company must still be able to see/manage them.
//
// =====================================================

const getCompanyTours = async (req, res) => {

    try {

        const companyId =
            req.company.id;


        const tours =
            await Tour.find({

                company:
                    companyId

            })

            .sort({

                startDate:
                    1

            });


        // =================================================
        // ADD LIVE BOOKING COUNTS
        // =================================================

        const toursWithCapacity =
            await Promise.all(

                tours.map(
                    async (tour) => {

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


                        return {

                            ...tour.toObject(),

                            bookedTravelers,

                            remainingTravelers,

                            isFull:
                                remainingTravelers === 0

                        };

                    }
                )

            );


        return res.status(200).json({

            success: true,

            count:
                toursWithCapacity.length,

            tours:
                toursWithCapacity

        });

    }

    catch (error) {

        console.error(
            "❌ GET COMPANY TOURS ERROR:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Unable to fetch company tours"

        });

    }

};



// =====================================================
// GET ALL PUBLIC TOURS
// =====================================================
//
// Explore Tours.
//
// Rules:
// 1. Active only
// 2. Non-expired
// 3. Verified company
// 4. NOT FULL
//
// =====================================================

const getAllTours = async (req, res) => {

    try {

        // =================================================
        // CURRENT DATE
        // =================================================

        const today =
            new Date();

        today.setHours(
            0,
            0,
            0,
            0
        );


        // =================================================
        // OPTIONAL THEME FILTER
        // =================================================
        //
        // GET /api/tours?theme=Adventure
        //
        // =================================================

        const { theme } = req.query;

        const query = {

            status:
                "active",

            endDate: {
                $gte: today
            }

        };

        if (theme && theme !== "All") {
            query.theme = theme;
        }


        // =================================================
        // FIND ACTIVE + NON-EXPIRED TOURS
        // =================================================

        const tours =
            await Tour.find(query)

            .populate(

                "company",

                "companyName ownerName email phone website logo coverImage description verificationStatus"

            )

            .sort({

                startDate:
                    1

            });


        // =================================================
        // VERIFIED COMPANIES ONLY
        // =================================================

        const verifiedTours =
            tours.filter(

                (tour) =>

                    tour.company &&
                    tour.company.verificationStatus ===
                    "verified"

            );


        // =================================================
        // CHECK BOOKING CAPACITY
        // =================================================

        const availableTours =
            await Promise.all(

                verifiedTours.map(
                    async (tour) => {

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


                        // FULL TOUR SHOULD NOT
                        // APPEAR PUBLICLY

                        if (
                            remainingTravelers <= 0
                        ) {

                            return null;

                        }


                        return {

                            ...tour.toObject(),

                            bookedTravelers,

                            remainingTravelers,

                            isFull: false

                        };

                    }
                )

            );


        const filteredTours =
            availableTours.filter(
                Boolean
            );


        // =================================================
        // RESPONSE
        // =================================================

        return res.status(200).json({

            success: true,

            count:
                filteredTours.length,

            tours:
                filteredTours

        });

    }

    catch (error) {

        console.error(
            "❌ GET ALL TOURS ERROR:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Unable to fetch tours"

        });

    }

};



// =====================================================
// GET SINGLE TOUR
// =====================================================

const getSingleTour = async (req, res) => {

    try {

        const {
            id
        } = req.params;


        const tour =
            await Tour.findById(id)

                .populate(

                    "company",

                    "companyName ownerName email phone website logo coverImage description verificationStatus"

                );


        if (!tour) {

            return res.status(404).json({

                success: false,

                message:
                    "Tour not found"

            });

        }


        // =================================================
        // CHECK EXPIRED TOUR
        // =================================================

        const today =
            new Date();

        today.setHours(
            0,
            0,
            0,
            0
        );


        if (
            tour.endDate < today
        ) {

            return res.status(404).json({

                success: false,

                message:
                    "This tour has expired"

            });

        }


        // =================================================
        // CHECK COMPANY
        // =================================================

        if (
            !tour.company ||
            tour.company.verificationStatus !==
            "verified"
        ) {

            return res.status(404).json({

                success: false,

                message:
                    "Tour is not available"

            });

        }


        // =================================================
        // GET LIVE BOOKING COUNT
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


        const isFull =
            remainingTravelers === 0;


        // =================================================
        // RESPONSE
        // =================================================

        return res.status(200).json({

            success: true,

            tour: {

                ...tour.toObject(),

                bookedTravelers,

                remainingTravelers,

                isFull

            }

        });

    }

    catch (error) {

        console.error(
            "❌ GET SINGLE TOUR ERROR:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Unable to fetch tour"

        });

    }

};



// =====================================================
// UPDATE TOUR
// =====================================================

const updateTour = async (req, res) => {

    try {

        const {
            id
        } = req.params;


        const companyId =
            req.company.id;


        // =================================================
        // FIND COMPANY'S TOUR
        // =================================================

        const tour =
            await Tour.findOne({

                _id:
                    id,

                company:
                    companyId

            });


        if (!tour) {

            return res.status(404).json({

                success: false,

                message:
                    "Tour not found or you do not have permission"

            });

        }


        const {
            title,
            destination,
            description,
            price,
            startDate,
            endDate,
            duration,
            maxTravelers,
            image,
            status,
            theme
        } = req.body;

        const VALID_THEMES = [
            "Adventure",
            "Beach",
            "Honeymoon",
            "Wildlife",
            "Pilgrimage",
            "Hill Station",
            "Cultural",
            "Family",
            "Cruise",
            "Trekking",
            "Other"
        ];


        // =================================================
        // UPDATE PROVIDED VALUES
        // =================================================

        if (
            title !== undefined
        ) {

            if (
                !title.trim()
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Tour title cannot be empty"

                });

            }

            tour.title =
                title.trim();

        }


        if (
            destination !== undefined
        ) {

            if (
                !destination.trim()
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Destination cannot be empty"

                });

            }

            tour.destination =
                destination.trim();

        }


        if (
            description !== undefined
        ) {

            if (
                !description.trim()
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Description cannot be empty"

                });

            }

            tour.description =
                description.trim();

        }


        if (
            price !== undefined
        ) {

            const newPrice =
                Number(price);


            if (
                Number.isNaN(newPrice) ||
                newPrice < 0
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Invalid tour price"

                });

            }


            tour.price =
                newPrice;

        }


        if (
            startDate !== undefined
        ) {

            const newStartDate =
                new Date(startDate);


            if (
                Number.isNaN(
                    newStartDate.getTime()
                )
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Invalid start date"

                });

            }


            tour.startDate =
                newStartDate;

        }


        if (
            endDate !== undefined
        ) {

            const newEndDate =
                new Date(endDate);


            if (
                Number.isNaN(
                    newEndDate.getTime()
                )
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Invalid end date"

                });

            }


            tour.endDate =
                newEndDate;

        }


        if (
            duration !== undefined
        ) {

            const newDuration =
                Number(duration);


            if (
                !Number.isInteger(
                    newDuration
                ) ||
                newDuration <= 0
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Duration must be a positive number"

                });

            }


            tour.duration =
                newDuration;

        }


        if (
            maxTravelers !== undefined
        ) {

            const newMaxTravelers =
                Number(maxTravelers);


            if (
                !Number.isInteger(
                    newMaxTravelers
                ) ||
                newMaxTravelers <= 0
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Maximum travelers must be a positive number"

                });

            }


            // =================================================
            // DO NOT REDUCE CAPACITY BELOW CURRENT BOOKINGS
            // =================================================

            const bookedTravelers =
                await getBookedTravelerCount(
                    tour._id
                );


            if (
                newMaxTravelers <
                bookedTravelers
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        `Maximum travelers cannot be less than current bookings (${bookedTravelers})`

                });

            }


            tour.maxTravelers =
                newMaxTravelers;

        }


        if (
            image !== undefined
        ) {

            tour.image =
                image.trim();

        }


        if (
            theme !== undefined &&
            VALID_THEMES.includes(theme)
        ) {

            tour.theme =
                theme;

        }


        if (
            status !== undefined &&
            [
                "active",
                "cancelled",
                "completed"
            ].includes(status)
        ) {

            tour.status =
                status;

        }


        // =================================================
        // DATE VALIDATION
        // =================================================

        if (
            tour.startDate &&
            tour.endDate &&
            tour.endDate <
            tour.startDate
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "End date cannot be before start date"

            });

        }


        // =================================================
        // PREVENT MOVING END DATE INTO PAST
        // =================================================

        const today =
            new Date();

        today.setHours(
            0,
            0,
            0,
            0
        );


        if (
            tour.endDate < today
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Tour end date cannot be in the past"

            });

        }


        // =================================================
        // SAVE
        // =================================================

        await tour.save();


        // =================================================
        // GET UPDATED BOOKING COUNT
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


        // =================================================
        // RESPONSE
        // =================================================

        return res.status(200).json({

            success: true,

            message:
                "Tour updated successfully ✅",

            tour: {

                ...tour.toObject(),

                bookedTravelers,

                remainingTravelers,

                isFull:
                    remainingTravelers === 0

            }

        });

    }

    catch (error) {

        console.error(
            "❌ UPDATE TOUR ERROR:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Unable to update tour"

        });

    }

};



// =====================================================
// DELETE TOUR
// =====================================================

const deleteTour = async (req, res) => {

    try {

        const {
            id
        } = req.params;


        const companyId =
            req.company.id;


        // =================================================
        // DELETE ONLY COMPANY'S OWN TOUR
        // =================================================

        const tour =
            await Tour.findOneAndDelete({

                _id:
                    id,

                company:
                    companyId

            });


        if (!tour) {

            return res.status(404).json({

                success: false,

                message:
                    "Tour not found or you do not have permission"

            });

        }


        // =================================================
        // DELETE RELATED BOOKINGS
        // =================================================

        await TourBooking.deleteMany({

            tour:
                tour._id

        });


        // =================================================
        // RESPONSE
        // =================================================

        return res.status(200).json({

            success: true,

            message:
                "Tour deleted successfully 🗑️",

            tour: {

                id:
                    tour._id,

                title:
                    tour.title

            }

        });

    }

    catch (error) {

        console.error(
            "❌ DELETE TOUR ERROR:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Unable to delete tour"

        });

    }

};



// =====================================================
// EXPORT
// =====================================================

module.exports = {

    addTour,

    getCompanyTours,

    getAllTours,

    getSingleTour,

    updateTour,

    deleteTour

};