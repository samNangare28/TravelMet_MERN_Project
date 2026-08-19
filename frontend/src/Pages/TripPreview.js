import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import api from "../api/axios";
import TripMap from "../components/TripMap";
import NearbyPlaces from "../components/NearbyPlaces";
import HotelRecommendations from "../components/HotelRecommendations";
import RideOptions from "../components/RideOptions";

import "../Css/TripPreview.css";

function TripPreview() {

    console.log("🔥 TripPreview Loaded");

    const { state } = useLocation();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [tripPlan, setTripPlan] = useState(null);

    const [mapPlaces, setMapPlaces] = useState([]);
    const [mapLoading, setMapLoading] = useState(false);

    const [destinationCenter, setDestinationCenter] =
        useState(null);

    const [mapRoute, setMapRoute] =
        useState(null);

    // NEW:
    // Currently selected place from Nearby Places / Hotels
    const [selectedMapPlace, setSelectedMapPlace] =
        useState(null);

    const mapSectionRef = useRef(null);

    // ============================================
    // GENERATE TRIP
    // ============================================

    useEffect(() => {

        if (state) {
            generateTrip();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const generateTrip = async () => {

        try {

            const response = await api.post(
                "/api/ai/generate-trip",
                state
            );

            setTripPlan(
                response.data.trip
            );

            fetchMapPlaces(
                response.data.trip.destination,
                response.data.trip.days
            );

        } catch (error) {

            console.error(
                "Trip Generation Error:",
                error
            );

            alert(
                "Unable to generate trip."
            );

        } finally {

            setLoading(false);

        }

    };

    // ============================================
    // FETCH MAP PLACES
    // ============================================

    const fetchMapPlaces = async (
        destination,
        days
    ) => {

        try {

            setMapLoading(true);

            const response = await api.post(
                "/api/trips/geocode-preview",
                {
                    destination,
                    source: state?.source,
                    days
                }
            );

            const itineraryPlaces =
                (response.data.days || [])
                    .flatMap(
                        (day) => day.places
                    )
                    .map(
                        (place) => ({
                            ...place,
                            markerType: "itinerary"
                        })
                    );

            const endpoints = [];

            if (
                response.data.sourceLocation
            ) {

                endpoints.push({

                    name:
                        state?.source ||
                        "Starting point",

                    latitude:
                        response.data
                            .sourceLocation
                            .latitude,

                    longitude:
                        response.data
                            .sourceLocation
                            .longitude,

                    markerType: "origin"

                });

            }

            if (
                response.data.destinationLocation
            ) {

                endpoints.push({

                    name: destination,

                    latitude:
                        response.data
                            .destinationLocation
                            .latitude,

                    longitude:
                        response.data
                            .destinationLocation
                            .longitude,

                    markerType: "destination"

                });

            }

            setMapPlaces([
                ...endpoints,
                ...itineraryPlaces
            ]);

            setDestinationCenter(
                response.data
                    .destinationLocation ||
                null
            );

            setMapRoute(
                response.data.route ||
                null
            );

        } catch (error) {

            console.error(
                "Map Geocode Error:",
                error
            );

            setMapPlaces([]);
            setMapRoute(null);

        } finally {

            setMapLoading(false);

        }

    };

    // ============================================
    // VIEW PLACE ON TRAVELMET MAP
    // ============================================

    const handleViewOnMap = (place) => {

        if (!place) return;

        const latitude =
            Number(place.latitude);

        const longitude =
            Number(place.longitude);

        if (
            !Number.isFinite(latitude) ||
            !Number.isFinite(longitude)
        ) {

            console.warn(
                "Invalid place coordinates:",
                place
            );

            return;

        }

        const mapPlace = {

            name:
                place.name ||
                "Selected place",

            latitude,

            longitude,

            address:
                place.address ||
                "",

            markerType:
                place.category === "hotels"
                    ? "hotel"
                    : "nearby"

        };

        // Add selected place to shared map

        setMapPlaces((prev) => {

            const existingIndex =
                prev.findIndex(
                    (p) =>
                        p.name === mapPlace.name
                );

            if (existingIndex !== -1) {

                return prev.map(
                    (p, index) =>
                        index === existingIndex
                            ? {
                                ...p,
                                ...mapPlace
                            }
                            : p
                );

            }

            return [
                ...prev,
                mapPlace
            ];

        });

        // Tell TripMap which place to focus

        setSelectedMapPlace(
            mapPlace
        );

        // Scroll to TravelMet's map

        setTimeout(() => {

            mapSectionRef.current?.scrollIntoView({

                behavior: "smooth",

                block: "center"

            });

        }, 50);

    };

    // ============================================
    // SAVE TRIP
    // ============================================

    const saveTrip = async () => {

        try {

            const user =
                JSON.parse(
                    localStorage.getItem("user")
                );

            await api.post(
                "/api/trips",
                {
                    ...state,

                    itinerary:
                        tripPlan.days,

                    estimatedBudget:
                        tripPlan.budget,

                    user: user.id
                }
            );

            alert(
                "Trip Saved Successfully ❤️"
            );

            navigate("/profile");

        } catch (error) {

            console.error(
                "Save Trip Error:",
                error
            );

            alert(
                "Failed to save trip."
            );

        }

    };

    // ============================================
    // TRIP DURATION
    // ============================================

    const tripDuration = (() => {

        if (
            !state?.startDate ||
            !state?.endDate
        ) {

            return null;

        }

        const start =
            new Date(state.startDate);

        const end =
            new Date(state.endDate);

        const diffDays =
            Math.round(
                (
                    end - start
                ) /
                (
                    1000 *
                    60 *
                    60 *
                    24
                )
            ) + 1;

        return diffDays > 0
            ? diffDays
            : null;

    })();

    // ============================================
    // REDBUS LINK
    // ============================================

    const redBusHref = (() => {

        if (
            !state?.source ||
            !tripPlan?.destination
        ) {

            return "https://www.redbus.in/";

        }

        const formatDate = (dateStr) => {

            if (!dateStr) return null;

            const d =
                new Date(dateStr);

            if (
                Number.isNaN(
                    d.getTime()
                )
            ) {

                return null;

            }

            const day =
                String(
                    d.getDate()
                ).padStart(2, "0");

            const month =
                d.toLocaleString(
                    "en-US",
                    {
                        month: "short"
                    }
                );

            const year =
                d.getFullYear();

            return `${day}-${month}-${year}`;

        };

        const onward =
            formatDate(
                state.startDate
            );

        const params =
            new URLSearchParams({

                fromCityName:
                    state.source,

                toCityName:
                    tripPlan.destination,

                ...(onward
                    ? { onward }
                    : {})

            });

        return `https://www.redbus.in/search?${params.toString()}`;

    })();

    // ============================================
    // RENDER
    // ============================================

    return (

        <div className="trip-preview">

            <div className="trip-card">

                <h1>
                    ✈ Your AI Travel Plan
                </h1>

                {loading ? (

                    <div className="loading">

                        <h2>
                            Generating your trip...
                        </h2>

                    </div>

                ) : (

                    <>

                        {tripPlan && (

                            <>

                                {/* ================= HEADER ================= */}

                                <div className="trip-header">

                                    <div className="trip-overlay">

                                        <h1>
                                            🌍{" "}
                                            {tripPlan.destination}
                                        </h1>

                                        <p>

                                            {state.startDate}
                                            {" • "}
                                            {state.endDate}

                                            {tripDuration && (

                                                <span
                                                    className="trip-duration-pill"
                                                >
                                                    {tripDuration}{" "}
                                                    {
                                                        tripDuration === 1
                                                            ? "day"
                                                            : "days"
                                                    }
                                                </span>

                                            )}

                                        </p>

                                    </div>

                                </div>

                                {/* ================= SUMMARY ================= */}

                                <div className="trip-summary">

                                    <div className="summary-card">

                                        <h3>👥</h3>

                                        <span>
                                            {state.travelers}
                                        </span>

                                        <p>
                                            Travellers
                                        </p>

                                    </div>

                                    <div className="summary-card">

                                        <h3>💰</h3>

                                        <span>
                                            {state.budget}
                                        </span>

                                        <p>
                                            Budget
                                        </p>

                                    </div>

                                    <div className="summary-card">

                                        <h3>🚗</h3>

                                        <span>
                                            {state.transport}
                                        </span>

                                        <p>
                                            Transport
                                        </p>

                                    </div>

                                    <div className="summary-card">

                                        <h3>🏨</h3>

                                        <span>
                                            {state.hotelType}
                                        </span>

                                        <p>
                                            Hotel
                                        </p>

                                    </div>

                                    {state.tripType && (

                                        <div className="summary-card">

                                            <h3>🧭</h3>

                                            <span>
                                                {state.tripType}
                                            </span>

                                            <p>
                                                Trip Type
                                            </p>

                                        </div>

                                    )}

                                </div>

                                {/* ================= DAILY PLAN ================= */}

                                {

                                    tripPlan.days.map(
                                        (
                                            day,
                                            dayIndex
                                        ) => (

                                            <details
                                                className="day-card"
                                                key={
                                                    day.day ||
                                                    dayIndex
                                                }
                                                open
                                            >

                                                <summary>

                                                    <span className="day-card-badge">

                                                        Day{" "}
                                                        {day.day}

                                                    </span>

                                                    <span className="day-card-title">

                                                        {
                                                            day.title
                                                        }

                                                    </span>

                                                </summary>

                                                <ul className="day-timeline">

                                                    {day.places.map(
                                                        (
                                                            place,
                                                            index
                                                        ) => {

                                                            const placeName =
                                                                typeof place === "string"
                                                                    ? place
                                                                    : place.name;

                                                            const time =
                                                                typeof place === "object"
                                                                    ? place.time
                                                                    : null;

                                                            const activity =
                                                                typeof place === "object"
                                                                    ? place.activity
                                                                    : null;

                                                            const duration =
                                                                typeof place === "object"
                                                                    ? place.duration
                                                                    : null;

                                                            return (

                                                                <li
                                                                    key={
                                                                        index
                                                                    }
                                                                >

                                                                    <span className="day-timeline-dot" />

                                                                    <div className="day-timeline-content">

                                                                        <div className="day-timeline-place">

                                                                            📍{" "}

                                                                            {
                                                                                placeName
                                                                            }

                                                                        </div>

                                                                        {time && (

                                                                            <div className="day-timeline-time">

                                                                                🕐{" "}
                                                                                {
                                                                                    time
                                                                                }

                                                                            </div>

                                                                        )}

                                                                        {activity && (

                                                                            <div className="day-timeline-activity">

                                                                                {
                                                                                    activity
                                                                                }

                                                                            </div>

                                                                        )}

                                                                        {duration && (

                                                                            <span className="day-timeline-duration">

                                                                                ⏱{" "}
                                                                                {
                                                                                    duration
                                                                                }

                                                                            </span>

                                                                        )}

                                                                    </div>

                                                                </li>

                                                            );

                                                        }
                                                    )}

                                                </ul>

                                            </details>

                                        )
                                    )
                                }

                                {/* ================= MAP ================= */}

                                <h2
                                    ref={
                                        mapSectionRef
                                    }
                                >
                                    🗺 Trip Map
                                </h2>

                                {selectedMapPlace && (

                                    <div
                                        className="selected-map-place"
                                        style={{
                                            marginBottom: "12px"
                                        }}
                                    >
                                        📍 Showing:
                                        {" "}
                                        <strong>
                                            {
                                                selectedMapPlace.name
                                            }
                                        </strong>
                                    </div>

                                )}

                                {mapLoading ? (

                                    <div className="trip-map-empty">

                                        Loading map...

                                    </div>

                                ) : (

                                    <TripMap
                                        places={
                                            mapPlaces
                                        }
                                        route={
                                            mapRoute
                                        }
                                        focusPlace={
                                            selectedMapPlace
                                        }
                                    />

                                )}

                                {/* ================= NEARBY PLACES ================= */}

                                <NearbyPlaces
                                    destination={
                                        tripPlan.destination
                                    }
                                    onViewOnMap={
                                        handleViewOnMap
                                    }
                                    onCenterResolved={
                                        setDestinationCenter
                                    }
                                />

                                {/* ================= HOTELS ================= */}

                                <HotelRecommendations
                                    destination={
                                        tripPlan.destination
                                    }
                                    startDate={
                                        state.startDate
                                    }
                                    endDate={
                                        state.endDate
                                    }
                                    travelers={
                                        state.travelers
                                    }
                                    onViewOnMap={
                                        handleViewOnMap
                                    }
                                />

                                {/* ================= RIDE ================= */}

                                <RideOptions
                                    destination={
                                        tripPlan.destination
                                    }
                                    center={
                                        destinationCenter
                                    }
                                />

                                {/* ================= BUS ================= */}

                                {state.transport === "Bus" && (

                                    <div className="bus-booking-card">

                                        <h2>
                                            🚌 Bus Travel
                                        </h2>

                                        <p>

                                            {state.source
                                                ? `Travelling from ${state.source} to ${tripPlan.destination} by bus? Search real routes and book directly on redBus.`
                                                : `Heading to ${tripPlan.destination} by bus? Search real routes and book directly on redBus.`}

                                        </p>

                                        <a
                                            className="redbus-btn"
                                            href={
                                                redBusHref
                                            }
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            Book on redBus →
                                        </a>

                                    </div>

                                )}

                                {/* ================= INFO GRID ================= */}

                                <div className="info-grid">

                                    <div className="budget-card">

                                        <h2>
                                            💰 Budget
                                        </h2>

                                        <p>
                                            Hotel :{" "}
                                            {
                                                tripPlan.budget.hotel
                                            }
                                        </p>

                                        <p>
                                            Food :{" "}
                                            {
                                                tripPlan.budget.food
                                            }
                                        </p>

                                        <p>
                                            Transport :{" "}
                                            {
                                                tripPlan.budget.transport
                                            }
                                        </p>

                                        <p>
                                            Activities :{" "}
                                            {
                                                tripPlan.budget.activities
                                            }
                                        </p>

                                        <p>

                                            <b>
                                                Total :{" "}
                                                {
                                                    tripPlan
                                                        .budget
                                                        .total
                                                }
                                            </b>

                                        </p>

                                    </div>

                                    <div className="food-card">

                                        <h2>
                                            🍕 Food
                                        </h2>

                                        <ul>

                                            {
                                                tripPlan.foods.map(
                                                    (
                                                        food,
                                                        index
                                                    ) => (

                                                        <li
                                                            key={
                                                                index
                                                            }
                                                        >
                                                            {food}
                                                        </li>

                                                    )
                                                )
                                            }

                                        </ul>

                                    </div>

                                    <div className="tips-card">

                                        <h2>
                                            💡 Travel Tips
                                        </h2>

                                        <ul>

                                            {
                                                tripPlan.tips.map(
                                                    (
                                                        tip,
                                                        index
                                                    ) => (

                                                        <li
                                                            key={
                                                                index
                                                            }
                                                        >
                                                            {tip}
                                                        </li>

                                                    )
                                                )
                                            }

                                        </ul>

                                    </div>

                                </div>

                                {/* ================= SAVE ================= */}

                                <button
                                    type="button"
                                    className="save-btn"
                                    onClick={
                                        saveTrip
                                    }
                                >
                                    💾 Save Trip
                                </button>

                            </>

                        )}

                    </>

                )}

            </div>

        </div>

    );

}

export default TripPreview;