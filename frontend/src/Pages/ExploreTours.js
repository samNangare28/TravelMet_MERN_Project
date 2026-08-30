import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { TOUR_THEMES, THEME_ICONS } from "../Data/tourThemes";
import "../Css/ExploreTours.css";

function ExploreTours() {
    const navigate = useNavigate();

    // =====================================================
    // STATES
    // =====================================================

    const [tours, setTours] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [selectedDestination, setSelectedDestination] =
        useState("All");
    const [selectedTheme, setSelectedTheme] =
        useState("All");

    // =====================================================
    // FETCH ALL TOURS
    // =====================================================

    const fetchTours = useCallback(async (showLoader = true) => {
        try {
            if (showLoader) {
                setLoading(true);
            }

            setError("");

            const response = await api.get("/api/tours");

            if (response.data?.success) {
                setTours(response.data.tours || []);
            } else {
                setTours([]);

                setError(
                    response.data?.message ||
                    "Unable to load tours."
                );
            }
        } catch (error) {
            console.error(
                "❌ EXPLORE TOURS ERROR:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Unable to load tours. Please try again."
            );
        } finally {
            if (showLoader) {
                setLoading(false);
            }
        }
    }, []);

    // =====================================================
    // INITIAL FETCH
    // =====================================================

    useEffect(() => {
        fetchTours(true);
    }, [fetchTours]);

    // =====================================================
    // REFRESH WHEN USER RETURNS TO PAGE
    // =====================================================

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === "visible") {
                fetchTours(false);
            }
        };

        document.addEventListener(
            "visibilitychange",
            handleVisibilityChange
        );

        return () => {
            document.removeEventListener(
                "visibilitychange",
                handleVisibilityChange
            );
        };
    }, [fetchTours]);

    // =====================================================
    // REFRESH WHEN WINDOW GETS FOCUS
    // =====================================================

    useEffect(() => {
        const handleWindowFocus = () => {
            fetchTours(false);
        };

        window.addEventListener(
            "focus",
            handleWindowFocus
        );

        return () => {
            window.removeEventListener(
                "focus",
                handleWindowFocus
            );
        };
    }, [fetchTours]);

    // =====================================================
    // FORMAT DATE
    // =====================================================

    const formatDate = (date) => {
        if (!date) {
            return "N/A";
        }

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return "N/A";
        }

        return parsedDate.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );
    };

    // =====================================================
    // GET UNIQUE DESTINATIONS
    // =====================================================

    const destinations = useMemo(() => {
        const uniqueDestinations = [
            ...new Set(
                tours
                    .map((tour) =>
                        tour.destination?.trim()
                    )
                    .filter(Boolean)
            )
        ];

        return [
            "All",
            ...uniqueDestinations
        ];
    }, [tours]);

    // =====================================================
    // GET THEMES PRESENT IN CURRENT TOURS
    // =====================================================

    const availableThemes = useMemo(() => {
        const presentThemes = TOUR_THEMES.filter(
            (theme) =>
                tours.some(
                    (tour) =>
                        tour.theme === theme
                )
        );

        return [
            "All",
            ...presentThemes
        ];
    }, [tours]);

    // =====================================================
    // FILTER TOURS
    // =====================================================

    const filteredTours = useMemo(() => {
        const searchText =
            search.toLowerCase().trim();

        return tours.filter((tour) => {
            const matchesSearch =
                !searchText ||
                tour.title
                    ?.toLowerCase()
                    .includes(searchText) ||
                tour.destination
                    ?.toLowerCase()
                    .includes(searchText) ||
                tour.company?.companyName
                    ?.toLowerCase()
                    .includes(searchText);

            const matchesDestination =
                selectedDestination === "All" ||
                tour.destination ===
                    selectedDestination;

            const matchesTheme =
                selectedTheme === "All" ||
                tour.theme === selectedTheme;

            return (
                matchesSearch &&
                matchesDestination &&
                matchesTheme
            );
        });
    }, [
        tours,
        search,
        selectedDestination,
        selectedTheme
    ]);

    // =====================================================
    // CLEAR FILTERS
    // =====================================================

    const clearFilters = () => {
        setSearch("");
        setSelectedDestination("All");
        setSelectedTheme("All");
    };

    // =====================================================
    // VIEW TOUR
    // =====================================================

    const handleViewTour = (tourId) => {
        if (!tourId) {
            return;
        }

        navigate(`/tour/${tourId}`);
    };

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {
        return (
            <div className="explore-tours-loading">
                <div className="explore-loader"></div>

                <h3>
                    Discovering Tours
                </h3>

                <p>
                    Finding the best travel experiences
                    for you...
                </p>
            </div>
        );
    }

    // =====================================================
    // ERROR
    // =====================================================

    if (error) {
        return (
            <div className="explore-tours-error">
                <div className="explore-error-icon">
                    ⚠️
                </div>

                <h2>
                    Unable to load tours
                </h2>

                <p>
                    {error}
                </p>

                <button
                    type="button"
                    onClick={() =>
                        fetchTours(true)
                    }
                >
                    Try Again
                </button>
            </div>
        );
    }

    // =====================================================
    // MAIN PAGE
    // =====================================================

    return (
        <div className="explore-tours-page">

            {/* =================================================
                HERO
            ================================================= */}

            <section className="explore-tours-hero">

                <div className="explore-hero-content">

                    <span className="explore-eyebrow">
                        TRAVELMET EXPERIENCES
                    </span>

                    <h1>
                        Explore Your Next
                        <span> Adventure</span>
                    </h1>

                    <p>
                        Discover curated travel tours
                        offered by verified travel companies
                        on TravelMet.
                    </p>

                    {/* SEARCH */}

                    <div className="tour-search-box">

                        <span>
                            🔍
                        </span>

                        <input
                            type="text"
                            placeholder="Search destination, tour or company..."
                            value={search}
                            onChange={(e) =>
                                setSearch(
                                    e.target.value
                                )
                            }
                            aria-label="Search tours"
                        />

                    </div>

                </div>

            </section>

            {/* =================================================
                CONTENT
            ================================================= */}

            <main className="explore-tours-container">

                {/* =================================================
                    FILTER BAR
                ================================================= */}

                <section className="tour-filter-section">

                    <div>

                        <span className="section-eyebrow">
                            FIND YOUR EXPERIENCE
                        </span>

                        <h2>
                            Available Tours
                        </h2>

                    </div>

                    {/* DESTINATION FILTERS */}

                    {destinations.length > 1 && (
                        <div className="destination-filters">

                            {destinations.map(
                                (destination) => (
                                    <button
                                        type="button"
                                        key={destination}
                                        className={
                                            selectedDestination ===
                                            destination
                                                ? "destination-filter active"
                                                : "destination-filter"
                                        }
                                        onClick={() =>
                                            setSelectedDestination(
                                                destination
                                            )
                                        }
                                    >
                                        {destination}
                                    </button>
                                )
                            )}

                        </div>
                    )}

                    {/* THEME FILTERS */}

                    {availableThemes.length > 1 && (
                        <div className="theme-filters">

                            {availableThemes.map(
                                (theme) => (
                                    <button
                                        type="button"
                                        key={theme}
                                        className={
                                            selectedTheme ===
                                            theme
                                                ? "theme-filter active"
                                                : "theme-filter"
                                        }
                                        onClick={() =>
                                            setSelectedTheme(
                                                theme
                                            )
                                        }
                                    >

                                        {theme !== "All" && (
                                            <span className="theme-filter-icon">
                                                {THEME_ICONS[
                                                    theme
                                                ] || "🌍"}
                                            </span>
                                        )}

                                        {theme}

                                    </button>
                                )
                            )}

                        </div>
                    )}

                </section>

                {/* =================================================
                    RESULTS COUNT
                ================================================= */}

                <div className="tour-results-info">

                    <p>
                        Showing{" "}
                        <strong>
                            {filteredTours.length}
                        </strong>{" "}
                        {filteredTours.length === 1
                            ? "tour"
                            : "tours"}
                    </p>

                </div>

                {/* =================================================
                    NO RESULTS
                ================================================= */}

                {filteredTours.length === 0 ? (

                    <div className="no-tours-found">

                        <div className="no-tours-icon">
                            🌍
                        </div>

                        <h3>
                            No tours found
                        </h3>

                        <p>
                            We couldn't find any tours
                            matching your search.
                        </p>

                        <button
                            type="button"
                            onClick={clearFilters}
                        >
                            Clear Filters
                        </button>

                    </div>

                ) : (

                    /* =================================================
                        TOUR GRID
                    ================================================= */

                    <div className="explore-tour-grid">

                        {filteredTours.map(
                            (tour) => {

                                // =================================================
                                // CAPACITY
                                // =================================================

                                const maxTravelers = Math.max(
                                    Number(
                                        tour.maxTravelers || 0
                                    ),
                                    0
                                );

                                const bookedTravelers = Math.max(
                                    Number(
                                        tour.bookedTravelers || 0
                                    ),
                                    0
                                );

                                let remainingTravelers;

                                if (
                                    tour.remainingTravelers !==
                                    undefined &&
                                    tour.remainingTravelers !==
                                    null
                                ) {
                                    remainingTravelers =
                                        Math.max(
                                            Number(
                                                tour.remainingTravelers
                                            ),
                                            0
                                        );
                                } else {
                                    remainingTravelers =
                                        Math.max(
                                            maxTravelers -
                                                bookedTravelers,
                                            0
                                        );
                                }

                                const isFull =
                                    Boolean(
                                        tour.isFull
                                    ) ||
                                    remainingTravelers <= 0;

                                // =================================================
                                // TOUR STATUS
                                // =================================================

                                const isActive =
                                    !tour.status ||
                                    tour.status ===
                                        "active";

                                // =================================================
                                // DISPLAY STATUS
                                // =================================================

                                const statusText =
                                    isFull
                                        ? "FULL"
                                        : isActive
                                            ? "✓ Available"
                                            : "Unavailable";

                                // =================================================
                                // DESCRIPTION
                                // =================================================

                                const description =
                                    tour.description ||
                                    "Discover an unforgettable travel experience with TravelMet.";

                                const shortDescription =
                                    description.length >
                                    110
                                        ? `${description.substring(
                                              0,
                                              110
                                          )}...`
                                        : description;

                                return (
                                    <article
                                        className="explore-tour-card"
                                        key={tour._id}
                                    >

                                        {/* =================================================
                                            IMAGE
                                        ================================================= */}

                                        <div className="explore-tour-image">

                                            {tour.image ? (
                                                <img
                                                    src={
                                                        tour.image
                                                    }
                                                    alt={
                                                        tour.title ||
                                                        "TravelMet tour"
                                                    }
                                                    loading="lazy"
                                                />
                                            ) : (
                                                <div className="explore-tour-placeholder">

                                                    <span>
                                                        ✈️
                                                    </span>

                                                    <small>
                                                        TravelMet
                                                    </small>

                                                </div>
                                            )}

                                            {/* AVAILABILITY */}

                                            <span
                                                className={
                                                    isFull
                                                        ? "explore-active-badge full"
                                                        : "explore-active-badge"
                                                }
                                            >
                                                {statusText}
                                            </span>

                                            {/* THEME */}

                                            {tour.theme && (
                                                <span className="explore-theme-badge">

                                                    {
                                                        THEME_ICONS[
                                                            tour.theme
                                                        ] ||
                                                        "🌍"
                                                    }{" "}

                                                    {tour.theme}

                                                </span>
                                            )}

                                        </div>

                                        {/* =================================================
                                            CONTENT
                                        ================================================= */}

                                        <div className="explore-tour-content">

                                            {/* COMPANY */}

                                            <div className="tour-company">

                                                {tour.company?.logo ? (
                                                    <img
                                                        src={
                                                            tour.company.logo
                                                        }
                                                        alt={
                                                            tour.company
                                                                ?.companyName ||
                                                            "Travel company"
                                                        }
                                                        loading="lazy"
                                                    />
                                                ) : (
                                                    <div className="tour-company-placeholder">
                                                        🏢
                                                    </div>
                                                )}

                                                <div>

                                                    <span>
                                                        ORGANIZED BY
                                                    </span>

                                                    <strong>
                                                        {
                                                            tour.company
                                                                ?.companyName ||
                                                            "Travel Company"
                                                        }
                                                    </strong>

                                                </div>

                                            </div>

                                            {/* DESTINATION */}

                                            <span className="explore-tour-destination">

                                                📍{" "}

                                                {
                                                    tour.destination ||
                                                    "Destination"
                                                }

                                            </span>

                                            {/* TITLE */}

                                            <h3>
                                                {
                                                    tour.title ||
                                                    "TravelMet Tour"
                                                }
                                            </h3>

                                            {/* DESCRIPTION */}

                                            <p className="explore-tour-description">
                                                {shortDescription}
                                            </p>

                                            {/* DATES */}

                                            <div className="explore-tour-dates">

                                                <div>

                                                    <span>
                                                        DEPARTURE
                                                    </span>

                                                    <strong>
                                                        {formatDate(
                                                            tour.startDate
                                                        )}
                                                    </strong>

                                                </div>

                                                <div>

                                                    <span>
                                                        RETURN
                                                    </span>

                                                    <strong>
                                                        {formatDate(
                                                            tour.endDate
                                                        )}
                                                    </strong>

                                                </div>

                                            </div>

                                            {/* META */}

                                            <div className="explore-tour-meta">

                                                <span>
                                                    ⏱{" "}
                                                    {tour.duration ||
                                                        1}{" "}
                                                    {(Number(
                                                        tour.duration
                                                    ) || 1) === 1
                                                        ? "Day"
                                                        : "Days"}
                                                </span>

                                                <span>
                                                    👥{" "}
                                                    {maxTravelers}{" "}
                                                    Seats
                                                </span>

                                            </div>

                                            {/* =================================================
                                                LIVE BOOKING STATUS
                                            ================================================= */}

                                            <div className="explore-tour-booking-status">

                                                <span>
                                                    👥{" "}
                                                    <strong>
                                                        {
                                                            bookedTravelers
                                                        }
                                                    </strong>{" "}
                                                    booked
                                                </span>

                                                <span>
                                                    {isFull
                                                        ? "Fully booked"
                                                        : `${remainingTravelers} seat${
                                                              remainingTravelers ===
                                                              1
                                                                  ? ""
                                                                  : "s"
                                                          } left`}
                                                </span>

                                            </div>

                                            {/* =================================================
                                                PRICE + VIEW BUTTON
                                            ================================================= */}

                                            <div className="explore-tour-bottom">

                                                <div className="explore-tour-price">

                                                    <small>
                                                        Starting from
                                                    </small>

                                                    <strong>
                                                        ₹
                                                        {Number(
                                                            tour.price ||
                                                                0
                                                        ).toLocaleString(
                                                            "en-IN"
                                                        )}
                                                    </strong>

                                                </div>

                                                <button
                                                    type="button"
                                                    className="explore-view-btn"
                                                    onClick={() =>
                                                        handleViewTour(
                                                            tour._id
                                                        )
                                                    }
                                                >
                                                    View Tour →
                                                </button>

                                            </div>

                                        </div>

                                    </article>
                                );
                            }
                        )}

                    </div>
                )}

            </main>

            {/* =================================================
                FOOTER NOTE
            ================================================= */}

            <section className="explore-tours-footer">

                <span>
                    TRAVELMET
                </span>

                <h3>
                    Travel more. Discover more.
                </h3>

                <p>
                    Find unique experiences from
                    verified travel companies.
                </p>

            </section>

        </div>
    );
}

export default ExploreTours;