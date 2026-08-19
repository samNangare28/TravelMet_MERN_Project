const axios = require("axios");
const { haversineDistanceKm } = require("../utils/geo");

console.log(
    "Mapbox Token:",
    process.env.MAPBOX_ACCESS_TOKEN
        ? "TOKEN FOUND ✅"
        : "TOKEN NOT FOUND ❌"
);


// =====================================================
// GEOCODE SINGLE PLACE
// =====================================================

const geocodePlace = async (place, destination) => {

    try {

        const query = `${place}, ${destination}, India`;

        console.log("🔎 Searching:", query);

        const response = await axios.get(
            "https://api.mapbox.com/search/geocode/v6/forward",
            {
                params: {
                    q: query,
                    access_token: process.env.MAPBOX_ACCESS_TOKEN,
                    country: "IN",
                    language: "en",
                    limit: 5
                }
            }
        );

        const features = response.data.features;

        if (!features || features.length === 0) {

            console.log(
                "❌ Location not found:",
                query
            );

            return null;
        }


        // -------------------------------------------------
        // Find the best valid Indian result
        // -------------------------------------------------

        let selectedFeature = null;

        for (const feature of features) {

            const coordinates =
                feature.geometry?.coordinates;

            if (!coordinates || coordinates.length < 2) {
                continue;
            }

            const [longitude, latitude] = coordinates;

            // India boundary check
            const isIndiaLocation =
                latitude >= 6 &&
                latitude <= 37 &&
                longitude >= 68 &&
                longitude <= 98;

            if (!isIndiaLocation) {
                continue;
            }

            selectedFeature = feature;

            break;
        }


        if (!selectedFeature) {

            console.log(
                "❌ No valid Indian location found:",
                query
            );

            return null;
        }


        const [longitude, latitude] =
            selectedFeature.geometry.coordinates;


        console.log(
            "✅ Found:",
            place,
            "→",
            latitude,
            longitude
        );


        return {

            name: place,

            latitude: latitude,

            longitude: longitude

        };

    }

    catch (error) {

        console.log(
            "❌ Geocoding Error:",
            error.response?.data || error.message
        );

        return null;
    }
};


// =====================================================
// GEOCODE COMPLETE ITINERARY
// =====================================================

const geocodeItinerary = async (
    days,
    destination
) => {

    const updatedDays = [];

    for (const day of days) {

        const places = [];

        for (const place of day.places) {

            /*
             * AI may return:
             *
             * "Ramkund"
             *
             * OR
             *
             * {
             *   name: "Ramkund",
             *   latitude: ...,
             *   longitude: ...
             * }
             */

            const placeName =
                typeof place === "string"
                    ? place
                    : place.name;


            if (!placeName) {
                continue;
            }


            const location =
                await geocodePlace(
                    placeName,
                    destination
                );


            if (location) {

                places.push(location);

            }

        }


        updatedDays.push({

            day: day.day,

            title: day.title,

            places: places

        });

    }

    return updatedDays;
};


// =====================================================
// GEOCODE DESTINATION
// Used as the center point for:
// - Nearby Places
// - Hotels
// - Map
// =====================================================

const geocodeDestination = async (
    destination
) => {

    try {

        const response = await axios.get(
            "https://api.mapbox.com/search/geocode/v6/forward",
            {
                params: {

                    q: `${destination}, India`,

                    access_token:
                        process.env.MAPBOX_ACCESS_TOKEN,

                    country: "IN",

                    language: "en",

                    limit: 5

                }
            }
        );


        const features =
            response.data.features;


        if (
            !features ||
            features.length === 0
        ) {

            return null;

        }


        for (const feature of features) {

            const coordinates =
                feature.geometry?.coordinates;


            if (
                !coordinates ||
                coordinates.length < 2
            ) {

                continue;

            }


            const [
                longitude,
                latitude
            ] = coordinates;


            const isIndiaLocation =
                latitude >= 6 &&
                latitude <= 37 &&
                longitude >= 68 &&
                longitude <= 98;


            if (!isIndiaLocation) {
                continue;
            }


            return {

                latitude,

                longitude

            };

        }


        return null;

    }

    catch (error) {

        console.log(
            "❌ Destination Geocoding Error:",
            error.response?.data ||
            error.message
        );

        return null;

    }

};


// =====================================================
// NEARBY PLACE CATEGORY QUERIES
// =====================================================

const NEARBY_CATEGORY_QUERIES = {

    attractions:
        "tourist attractions",

    restaurants:
        "restaurants",

    cafes:
        "cafes",

    nature:
        "nature parks",

    historical:
        "historical monuments",

    shopping:
        "shopping malls",

    entertainment:
        "entertainment",

    hotels:
        "hotels"

};


// =====================================================
// SEARCH NEARBY PLACES
//
// IMPORTANT:
// Mapbox Search Geocoding v6 does NOT accept
// types: "poi" in this request.
// Therefore we use:
// - text query
// - destination
// - proximity
// - Haversine radius filtering
//
// This keeps results geographically relevant.
// =====================================================

const searchNearbyPlaces = async (
    destination,
    categoryKey,
    radiusKm
) => {

    try {

        // -------------------------------------------------
        // Find destination center
        // -------------------------------------------------

        const center =
            await geocodeDestination(
                destination
            );


        if (!center) {

            return {

                center: null,

                places: []

            };

        }


        // -------------------------------------------------
        // Select search query
        // -------------------------------------------------

        const queryText =
            NEARBY_CATEGORY_QUERIES[
                categoryKey
            ] ||
            NEARBY_CATEGORY_QUERIES.attractions;


        // -------------------------------------------------
        // Search attempts
        //
        // NO "types: poi"
        // because Mapbox rejects it.
        // -------------------------------------------------

        const attempts = [

            `${queryText} in ${destination}`,

            `${queryText} ${destination}`,

            `${queryText} near ${destination}`

        ];


        // -------------------------------------------------
        // Run one search attempt
        // -------------------------------------------------

        const runAttempt = async (query) => {

            const response =
                await axios.get(
                    "https://api.mapbox.com/search/geocode/v6/forward",
                    {
                        params: {

                            q: query,

                            access_token:
                                process.env
                                    .MAPBOX_ACCESS_TOKEN,

                            country: "IN",

                            language: "en",

                            proximity:
                                `${center.longitude},${center.latitude}`,

                            limit: 10

                        }
                    }
                );


            const features =
                response.data.features || [];


            return features

                .map((feature) => {

                    const coordinates =
                        feature.geometry?.coordinates;


                    if (
                        !coordinates ||
                        coordinates.length < 2
                    ) {

                        return null;

                    }


                    const [
                        longitude,
                        latitude
                    ] = coordinates;


                    // -------------------------------------
                    // Calculate actual distance
                    // -------------------------------------

                    const distanceKm =
                        haversineDistanceKm(

                            center.latitude,

                            center.longitude,

                            latitude,

                            longitude

                        );


                    return {

                        name:
                            feature.properties?.name ||
                            feature.properties?.name_preferred ||
                            "Unnamed place",


                        address:
                            feature.properties?.full_address ||
                            feature.properties?.place_formatted ||
                            "",


                        category:
                            categoryKey,


                        latitude,

                        longitude,


                        distanceKm:
                            Math.round(
                                distanceKm * 10
                            ) / 10

                    };

                })


                // Remove invalid results
                .filter(
                    (place) =>
                        place !== null
                )


                // Keep only results inside requested radius
                .filter(
                    (place) =>
                        place.distanceKm <= radiusKm
                )


                // Nearest first
                .sort(
                    (a, b) =>
                        a.distanceKm -
                        b.distanceKm
                );

        };


        // -------------------------------------------------
        // Try all search queries
        // -------------------------------------------------

        for (
            const query of attempts
        ) {

            try {

                console.log(
                    `🔎 Nearby Search: ${query}`
                );


                const places =
                    await runAttempt(
                        query
                    );


                if (
                    places.length > 0
                ) {

                    console.log(
                        `✅ Found ${places.length} nearby ${categoryKey}`
                    );


                    return {

                        center,

                        places

                    };

                }

            }

            catch (error) {

                console.log(
                    "❌ Nearby Search Attempt Error:",
                    error.response?.data ||
                    error.message
                );

            }

        }


        // -------------------------------------------------
        // No real results found
        // -------------------------------------------------

        console.log(
            `⚠️ No nearby ${categoryKey} found for ${destination}`
        );


        return {

            center,

            places: []

        };

    }

    catch (error) {

        console.log(
            "❌ Nearby Places Error:",
            error.response?.data ||
            error.message
        );


        return {

            center: null,

            places: []

        };

    }

};


// =====================================================
// ROUTE BETWEEN TWO POINTS
// Mapbox Directions API
// =====================================================

const getRoute = async (
    source,
    destination
) => {

    if (
        !source ||
        !destination
    ) {

        return null;

    }


    try {

        const coordString =
            `${source.longitude},${source.latitude};` +
            `${destination.longitude},${destination.latitude}`;


        const response =
            await axios.get(

                `https://api.mapbox.com/directions/v5/mapbox/driving/${coordString}`,

                {
                    params: {

                        access_token:
                            process.env.MAPBOX_ACCESS_TOKEN,

                        geometries:
                            "geojson",

                        overview:
                            "simplified"

                    }

                }

            );


        const route =
            response.data.routes?.[0];


        if (
            !route ||
            !route.geometry?.coordinates
        ) {

            return null;

        }


        return {

            coordinates:
                route.geometry.coordinates,


            distanceKm:
                Math.round(
                    (route.distance / 1000) * 10
                ) / 10,


            durationMin:
                Math.round(
                    route.duration / 60
                )

        };

    }

    catch (error) {

        console.log(
            "❌ Directions Error:",
            error.response?.data ||
            error.message
        );


        // Map still works even if route fails.
        return null;

    }

};


// =====================================================
// EXPORTS
// =====================================================

module.exports = {

    geocodePlace,

    geocodeItinerary,

    geocodeDestination,

    searchNearbyPlaces,

    getRoute

};