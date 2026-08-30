import { useEffect, useState } from "react";
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

    useEffect(() => {

        const fetchTours = async () => {

            try {

                setLoading(true);
                setError("");

                const response =
                    await api.get("/api/tours");

                setTours(
                    response.data.tours || []
                );

            }

            catch (error) {

                console.error(
                    "EXPLORE TOURS ERROR:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Unable to load tours."
                );

            }

            finally {

                setLoading(false);

            }

        };


        fetchTours();

    }, []);


    // =====================================================
    // FORMAT DATE
    // =====================================================

    const formatDate = (date) => {

        if (!date) {
            return "N/A";
        }

        return new Date(date).toLocaleDateString(
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

    const destinations = [
        "All",
        ...new Set(
            tours
                .map(
                    (tour) =>
                        tour.destination
                )
                .filter(Boolean)
        )
    ];


    // =====================================================
    // GET THEMES PRESENT IN CURRENT TOURS
    // =====================================================

    const availableThemes = [
        "All",
        ...TOUR_THEMES.filter((theme) =>
            tours.some((tour) => tour.theme === theme)
        )
    ];


    // =====================================================
    // FILTER TOURS
    // =====================================================

    const filteredTours =
        tours.filter((tour) => {

            const searchText =
                search
                    .toLowerCase()
                    .trim();


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
                    onClick={() =>
                        window.location.reload()
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


                    {/* =========================
                        SEARCH
                    ========================= */}

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


                    <div className="destination-filters">

                        {destinations.map(
                            (destination) => (

                                <button
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


                    {availableThemes.length > 1 && (

                        <div className="theme-filters">

                            {availableThemes.map(
                                (theme) => (

                                    <button
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
                                                {THEME_ICONS[theme] || "🌍"}
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
                            onClick={() => {

                                setSearch("");

                                setSelectedDestination(
                                    "All"
                                );

                            }}
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
                            (tour) => (

                                <article
                                    className="explore-tour-card"
                                    key={tour._id}
                                >


                                    {/* =========================
                                        IMAGE
                                    ========================= */}

                                    <div className="explore-tour-image">

                                        {tour.image ? (

                                            <img
                                                src={
                                                    tour.image
                                                }
                                                alt={
                                                    tour.title
                                                }
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


                                        <span className="explore-active-badge">
                                            ✓ Available
                                        </span>

                                        {tour.theme && (

                                            <span className="explore-theme-badge">
                                                {THEME_ICONS[tour.theme] || "🌍"}{" "}
                                                {tour.theme}
                                            </span>

                                        )}

                                    </div>


                                    {/* =========================
                                        CONTENT
                                    ========================= */}

                                    <div className="explore-tour-content">


                                        {/* COMPANY */}

                                        <div className="tour-company">

                                            {tour.company?.logo ? (

                                                <img
                                                    src={
                                                        tour.company.logo
                                                    }
                                                    alt={
                                                        tour.company.companyName
                                                    }
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
                                                tour.destination
                                            }

                                        </span>


                                        {/* TITLE */}

                                        <h3>
                                            {tour.title}
                                        </h3>


                                        {/* DESCRIPTION */}

                                        <p className="explore-tour-description">

                                            {tour.description?.length >
                                                110
                                                ? `${tour.description.substring(
                                                    0,
                                                    110
                                                )}...`
                                                : tour.description}

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
                                                {tour.duration}{" "}
                                                {tour.duration === 1
                                                    ? "Day"
                                                    : "Days"}
                                            </span>

                                            <span>
                                                👥{" "}
                                                {tour.maxTravelers}{" "}
                                                Seats
                                            </span>

                                        </div>


                                        {/* PRICE */}

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


                                            {/* VIEW */}

                                            <button
                                                className="explore-view-btn"
                                                onClick={() =>
                                                    navigate(
                                                        `/tour/${tour._id}`
                                                    )
                                                }
                                            >
                                                View Tour →
                                            </button>

                                        </div>

                                    </div>

                                </article>

                            )
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
