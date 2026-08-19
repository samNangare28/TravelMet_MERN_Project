import { useState, useEffect, useCallback } from "react";
import api from "../api/axios";
import "../Css/NearbyPlaces.css";

const CATEGORIES = [
    { key: "attractions", label: "Attractions" },
    { key: "restaurants", label: "Restaurants" },
    { key: "cafes", label: "Cafes" },
    { key: "nature", label: "Nature" },
    { key: "historical", label: "Historical" },
    { key: "shopping", label: "Shopping" },
    { key: "entertainment", label: "Entertainment" }
];

const RADIUS_OPTIONS = [50, 70];
const PLACES_PER_PAGE = 5;

function NearbyPlaces({
    destination,
    onViewOnMap,
    onCenterResolved
}) {

    const [category, setCategory] = useState("attractions");
    const [radius, setRadius] = useState(50);

    const [places, setPlaces] = useState([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [currentPage, setCurrentPage] = useState(1);

    // ============================================
    // FETCH PLACES
    // ============================================

    const fetchPlaces = useCallback(async () => {

        if (!destination) return;

        try {

            setLoading(true);
            setError("");

            const response = await api.get(
                "/api/places/nearby",
                {
                    params: {
                        destination,
                        category,
                        radius
                    }
                }
            );

            if (response.data.success) {

                setPlaces(response.data.places || []);

                if (response.data.center) {

                    onCenterResolved?.(
                        response.data.center
                    );

                }

            } else {

                setPlaces([]);

                setError(
                    response.data.message ||
                    "Unable to load nearby places."
                );

            }

        } catch (err) {

            console.error(
                "Nearby Places Fetch Error:",
                err
            );

            setPlaces([]);

            setError(
                "Unable to load nearby places."
            );

        } finally {

            setLoading(false);

        }

    }, [
        destination,
        category,
        radius,
        onCenterResolved
    ]);

    useEffect(() => {

        fetchPlaces();

    }, [fetchPlaces]);

    // ============================================
    // RESET PAGE
    // ============================================

    useEffect(() => {

        setCurrentPage(1);

    }, [category, radius]);

    // ============================================
    // PAGINATION
    // ============================================

    const totalPages = Math.ceil(
        places.length / PLACES_PER_PAGE
    );

    const startIndex =
        (currentPage - 1) * PLACES_PER_PAGE;

    const currentPlaces =
        places.slice(
            startIndex,
            startIndex + PLACES_PER_PAGE
        );

    const goToPage = (page) => {

        if (
            page < 1 ||
            page > totalPages
        ) {
            return;
        }

        setCurrentPage(page);

    };

    return (

        <div className="nearby-places">

            <h2>📍 Nearby Places</h2>

            {/* =====================================
                FILTERS
            ====================================== */}

            <div className="nearby-filters">

                <div className="nearby-category-chips">

                    {CATEGORIES.map((c) => (

                        <button
                            type="button"
                            key={c.key}
                            className={
                                category === c.key
                                    ? "nearby-chip active"
                                    : "nearby-chip"
                            }
                            onClick={() => {

                                setCategory(c.key);
                                setCurrentPage(1);

                            }}
                        >
                            {c.label}
                        </button>

                    ))}

                </div>

                <div className="nearby-radius-toggle">

                    {RADIUS_OPTIONS.map((r) => (

                        <button
                            type="button"
                            key={r}
                            className={
                                radius === r
                                    ? "nearby-radius-btn active"
                                    : "nearby-radius-btn"
                            }
                            onClick={() => {

                                setRadius(r);
                                setCurrentPage(1);

                            }}
                        >
                            {r} km
                        </button>

                    ))}

                </div>

            </div>

            {/* =====================================
                CONTENT
            ====================================== */}

            {loading ? (

                <p className="nearby-empty">
                    Finding places nearby...
                </p>

            ) : error ? (

                <p className="nearby-empty">
                    {error}
                </p>

            ) : places.length === 0 ? (

                <p className="nearby-empty">

                    No{" "}

                    {
                        CATEGORIES.find(
                            (c) => c.key === category
                        )?.label.toLowerCase()
                    }

                    {" "}found within {radius} km.

                </p>

            ) : (

                <>

                    {/* =================================
                        PLACES GRID
                    ================================== */}

                    <div className="nearby-grid">

                        {currentPlaces.map(
                            (place, index) => (

                                <div
                                    className="nearby-card"
                                    key={`${place.name}-${index}`}
                                >

                                    <h3>
                                        {place.name}
                                    </h3>

                                    {place.address && (

                                        <p className="nearby-address">
                                            {place.address}
                                        </p>

                                    )}

                                    <span className="nearby-distance">
                                        {place.distanceKm} km away
                                    </span>

                                    <button
                                        type="button"
                                        className="nearby-view-btn"
                                        onClick={() =>
                                            onViewOnMap?.(place)
                                        }
                                    >
                                        View on Map
                                    </button>

                                </div>

                            )
                        )}

                    </div>

                    {/* =================================
                        PAGINATION
                    ================================== */}

                    {totalPages > 1 && (

                        <div className="nearby-pagination">

                            <button
                                type="button"
                                className="nearby-page-btn"
                                disabled={currentPage === 1}
                                onClick={() =>
                                    goToPage(
                                        currentPage - 1
                                    )
                                }
                            >
                                ← Previous
                            </button>

                            <div className="nearby-page-numbers">

                                {Array.from(
                                    {
                                        length: totalPages
                                    },
                                    (_, index) => {

                                        const page = index + 1;

                                        return (

                                            <button
                                                type="button"
                                                key={page}
                                                className={
                                                    currentPage === page
                                                        ? "nearby-page-number active"
                                                        : "nearby-page-number"
                                                }
                                                onClick={() =>
                                                    goToPage(page)
                                                }
                                            >
                                                {page}
                                            </button>

                                        );

                                    }
                                )}

                            </div>

                            <button
                                type="button"
                                className="nearby-page-btn"
                                disabled={
                                    currentPage === totalPages
                                }
                                onClick={() =>
                                    goToPage(
                                        currentPage + 1
                                    )
                                }
                            >
                                Next →
                            </button>

                        </div>

                    )}

                </>

            )}

        </div>

    );
}

export default NearbyPlaces;