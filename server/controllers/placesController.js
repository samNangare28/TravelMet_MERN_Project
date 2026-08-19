const { searchNearbyPlaces } = require("../services/mapService");

const VALID_CATEGORIES = [
    "attractions",
    "restaurants",
    "cafes",
    "nature",
    "historical",
    "shopping",
    "entertainment",
    "hotels"
];

// Hard cap matches the project's own rule: never exceed 70km.
const MIN_RADIUS_KM = 5;
const MAX_RADIUS_KM = 70;
const DEFAULT_RADIUS_KM = 50;

// =====================================================
// GET NEARBY PLACES
// GET /api/places/nearby?destination=Nashik&category=restaurants&radius=50
// =====================================================

const getNearbyPlaces = async (req, res) => {

    try {

        const { destination, category, radius } = req.query;

        if (!destination || !destination.trim()) {

            return res.status(400).json({
                success: false,
                message: "destination is required"
            });

        }

        const safeCategory = VALID_CATEGORIES.includes(category)
            ? category
            : "attractions";

        let radiusKm = parseInt(radius, 10);

        if (Number.isNaN(radiusKm)) {
            radiusKm = DEFAULT_RADIUS_KM;
        }

        // Never allow a client-supplied radius outside the
        // project's own 5–70km rule, no matter what is sent.
        radiusKm = Math.min(
            Math.max(radiusKm, MIN_RADIUS_KM),
            MAX_RADIUS_KM
        );

        const { center, places } = await searchNearbyPlaces(
            destination.trim(),
            safeCategory,
            radiusKm
        );

        if (!center) {

            return res.status(200).json({
                success: false,
                places: [],
                message:
                    "Couldn't locate that destination, so nearby places aren't available right now."
            });

        }

        return res.status(200).json({
            success: true,
            center,
            radiusKm,
            category: safeCategory,
            places
        });

    } catch (error) {

        console.log("Get Nearby Places Error:", error);

        return res.status(200).json({
            success: false,
            places: [],
            message: "Nearby places are unavailable right now."
        });

    }

};

module.exports = { getNearbyPlaces };
