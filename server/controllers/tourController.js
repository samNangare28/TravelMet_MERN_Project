const Tour = require("../models/Tour");
const TravelCompany = require("../models/TravelCompany");


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
            image
        } = req.body;


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
                    Number(maxTravelers),

                image:
                    image?.trim() || ""

            });


        await tour.save();


        // =================================================
        // RESPONSE
        // =================================================

        return res.status(201).json({

            success: true,

            message:
                "Tour added successfully ✅",

            tour

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


        return res.status(200).json({

            success: true,

            count:
                tours.length,

            tours

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
// This endpoint is used by Explore Tours.
//
// Rules:
// 1. Only active tours
// 2. End date must not be in the past
// 3. Company must be verified
// 4. Company information is populated
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
        // FIND PUBLIC TOURS
        // =================================================

        const tours =
            await Tour.find({

                status:
                    "active",

                endDate: {
                    $gte: today
                }

            })

            // =================================================
            // COMPANY DETAILS
            // =================================================

            .populate(

                "company",

                "companyName ownerName email phone website logo coverImage description verificationStatus"

            )

            // =================================================
            // SORT
            // =================================================

            .sort({

                startDate:
                    1

            });


        // =================================================
        // ONLY VERIFIED COMPANIES
        // =================================================

        const verifiedTours =
            tours.filter(

                (tour) =>

                    tour.company &&
                    tour.company.verificationStatus ===
                    "verified"

            );


        // =================================================
        // RESPONSE
        // =================================================

        return res.status(200).json({

            success: true,

            count:
                verifiedTours.length,

            tours:
                verifiedTours

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
        // RESPONSE
        // =================================================

        return res.status(200).json({

            success: true,

            tour

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
            status
        } = req.body;


        // =================================================
        // UPDATE PROVIDED VALUES
        // =================================================

        if (
            title !== undefined
        ) {

            tour.title =
                title.trim();

        }


        if (
            destination !== undefined
        ) {

            tour.destination =
                destination.trim();

        }


        if (
            description !== undefined
        ) {

            tour.description =
                description.trim();

        }


        if (
            price !== undefined
        ) {

            tour.price =
                Number(price);

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

            tour.duration =
                Number(duration);

        }


        if (
            maxTravelers !== undefined
        ) {

            tour.maxTravelers =
                Number(maxTravelers);

        }


        if (
            image !== undefined
        ) {

            tour.image =
                image.trim();

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
        // RESPONSE
        // =================================================

        return res.status(200).json({

            success: true,

            message:
                "Tour updated successfully ✅",

            tour

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