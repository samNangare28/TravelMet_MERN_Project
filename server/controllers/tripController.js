const Trip = require("../models/Trip");

const {
    geocodeItinerary,
    geocodeDestination,
    getRoute
} = require("../services/mapService");


// =====================================================
// CREATE TRIP
// =====================================================

const createTrip = async (req, res) => {

    try {

        console.log("📥 Trip received");


        const tripData = {
            ...req.body,
            // Trip always belongs to the authenticated
            // user, never a client-supplied id.
            user: req.user.id
        };


        // =============================================
        // BASIC VALIDATION
        // =============================================

        if (!tripData.destination) {

            return res.status(400).json({
                success: false,
                message: "Destination is required"
            });

        }


        if (!tripData.startDate || !tripData.endDate) {

            return res.status(400).json({
                success: false,
                message: "Start date and end date are required"
            });

        }


        // =============================================
        // DATE VALIDATION
        // =============================================

        const startDate =
            new Date(tripData.startDate);

        const endDate =
            new Date(tripData.endDate);


        if (isNaN(startDate.getTime()) ||
            isNaN(endDate.getTime())) {

            return res.status(400).json({
                success: false,
                message: "Invalid start or end date"
            });

        }


        if (endDate < startDate) {

            return res.status(400).json({
                success: false,
                message:
                    "End date cannot be before start date"
            });

        }


        // =============================================
        // ITINERARY
        // =============================================

        if (!Array.isArray(tripData.itinerary)) {

            return res.status(400).json({
                success: false,
                message: "Itinerary must be an array"
            });

        }


        console.log(
            "📍 Geocoding itinerary..."
        );


        // =============================================
        // GEOCODE PLACES
        // =============================================

        const geocodedItinerary =
            await geocodeItinerary(
                tripData.itinerary,
                tripData.destination
            );


        tripData.itinerary =
            geocodedItinerary;


        console.log(
            "📍 Geocoding completed"
        );


        // =============================================
        // SAVE TRIP
        // =============================================

        const trip =
            await Trip.create(tripData);


        console.log(
            "✅ Trip saved successfully:",
            trip._id
        );


        // =============================================
        // RESPONSE
        // =============================================

        res.status(201).json({

            success: true,

            message:
                "Trip Created Successfully",

            trip

        });

    }


    catch (error) {

        console.log(
            "❌ Create Trip Error:",
            error
        );


        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


// =====================================================
// GET ALL USER TRIPS
// =====================================================

const getUserTrips = async (req, res) => {

    try {

        const { id } = req.params;


        const trips =
            await Trip.find({
                user: id
            })
            .sort({
                createdAt: -1
            });


        res.status(200).json({

            success: true,

            trips

        });

    }


    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


// =====================================================
// GET SINGLE TRIP
// =====================================================

const getTripById = async (req, res) => {

    try {

        const { id } = req.params;


        const trip =
            await Trip.findById(id);


        if (!trip) {

            return res.status(404).json({

                success: false,

                message: "Trip Not Found"

            });

        }


        res.status(200).json({

            success: true,

            trip

        });

    }


    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


// =====================================================
// DELETE TRIP
// =====================================================

const deleteTrip = async (req, res) => {

    try {

        const { id } = req.params;


        const trip =
            await Trip.findById(id);


        if (!trip) {

            return res.status(404).json({

                success: false,

                message: "Trip Not Found"

            });

        }


        // Only the trip's owner can delete it.
        if (trip.user.toString() !== req.user.id) {

            return res.status(403).json({

                success: false,

                message: "You can only delete your own trips"

            });

        }


        await Trip.findByIdAndDelete(id);


        res.status(200).json({

            success: true,

            message:
                "Trip Deleted Successfully"

        });

    }


    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


// =====================================================
// EXPORT
// =====================================================

// =====================================================
// GEOCODE PREVIEW
// POST /api/trips/geocode-preview
//
// Lets TripPreview show a real map with real coordinates
// for a generated-but-not-yet-saved trip, by reusing the
// exact same geocoding logic createTrip already relies on
// — no duplicate implementation, no invented coordinates.
// =====================================================

const geocodePreview = async (req, res) => {

    try {

        const { destination, source, days } = req.body;

        if (!destination || !Array.isArray(days)) {

            return res.status(400).json({

                success: false,

                message: "destination and days are required"

            });

        }

        // Itinerary places (existing behaviour, unchanged).
        const geocodedDays = await geocodeItinerary(
            days,
            destination
        );

        // Destination centre — used as the "end" pin and as
        // the anchor nearby-places/hotels already search
        // around, so the map and those sections agree on
        // where "the destination" actually is.
        const destinationLocation = await geocodeDestination(
            destination
        );

        // Source is optional — older trips / direct itinerary
        // views may not have it, so everything degrades
        // gracefully rather than failing the whole map.
        let sourceLocation = null;
        let route = null;

        if (source && source.trim()) {

            sourceLocation = await geocodeDestination(source.trim());

            if (sourceLocation && destinationLocation) {

                route = await getRoute(
                    sourceLocation,
                    destinationLocation
                );

            }

        }

        return res.status(200).json({

            success: true,

            days: geocodedDays,

            sourceLocation,

            destinationLocation,

            route

        });

    } catch (error) {

        console.log("Geocode Preview Error:", error);

        // A geocoding hiccup shouldn't block the rest of the
        // trip preview — the frontend just skips the map.
        return res.status(200).json({

            success: false,

            days: [],

            sourceLocation: null,

            destinationLocation: null,

            route: null,

            message: "Map unavailable right now"

        });

    }

};


module.exports = {

    createTrip,

    getUserTrips,

    getTripById,

    deleteTrip,

    geocodePreview

};
