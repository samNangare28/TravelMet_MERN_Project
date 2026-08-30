import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import BookTourModal from "../components/BookTourModal";
import { THEME_ICONS } from "../Data/tourThemes";
import "../Css/TourDetails.css";

function TourDetails() {

    const { id } = useParams();
    const navigate = useNavigate();

    // =====================================================
    // TOUR STATES
    // =====================================================

    const [tour, setTour] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // =====================================================
    // BOOKING STATES
    // =====================================================

    const [bookingLoading, setBookingLoading] = useState(false);
    const [cancelLoading, setCancelLoading] = useState(false);

    const [bookingChecked, setBookingChecked] = useState(false);
    const [isBooked, setIsBooked] = useState(false);
    const [booking, setBooking] = useState(null);

    const [bookingMessage, setBookingMessage] = useState("");
    const [bookingError, setBookingError] = useState("");

    const [showBookingModal, setShowBookingModal] = useState(false);

    // =====================================================
    // CAPACITY STATES
    // =====================================================

    const [tourCapacity, setTourCapacity] = useState({
        maxTravelers: 0,
        bookedTravelers: 0,
        remainingTravelers: 0,
        isFull: false
    });

    // =====================================================
    // FETCH TOUR DETAILS
    // =====================================================

    const fetchTour = useCallback(async () => {

        try {

            setLoading(true);
            setError("");

            const response = await api.get(
                `/api/tours/${id}`
            );

            if (response.data.success) {

                setTour(response.data.tour);

            } else {

                setError(
                    response.data.message ||
                    "Unable to load tour details."
                );

            }

        } catch (error) {

            console.error(
                "❌ TOUR DETAILS ERROR:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Unable to load tour details."
            );

        } finally {

            setLoading(false);

        }

    }, [id]);

    // =====================================================
    // FETCH TOUR CAPACITY
    // =====================================================

    const fetchCapacity = useCallback(async () => {

        try {

            const response = await api.get(
                `/api/tour-bookings/${id}/count`
            );

            if (response.data.success) {

                setTourCapacity(
                    response.data.tourCapacity
                );

            }

        } catch (error) {

            console.error(
                "❌ TOUR CAPACITY ERROR:",
                error
            );

        }

    }, [id]);

    // =====================================================
    // CHECK MY BOOKING
    // =====================================================

    const checkMyBooking = useCallback(async () => {

        const token =
            localStorage.getItem("token");

        // -------------------------------------------------
        // USER NOT LOGGED IN
        // -------------------------------------------------

        if (!token) {

            setIsBooked(false);
            setBooking(null);
            setBookingChecked(true);

            return;

        }

        try {

            setBookingChecked(false);

            const response =
                await api.get(
                    `/api/tour-bookings/${id}/my-booking`,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );

            if (response.data.success) {

                setIsBooked(
                    response.data.booked
                );

                setBooking(
                    response.data.booking
                );

            } else {

                setIsBooked(false);
                setBooking(null);

            }

        } catch (error) {

            console.error(
                "❌ CHECK TOUR BOOKING ERROR:",
                error
            );

            // If token expired/invalid,
            // don't break the whole tour page.

            if (
                error.response?.status === 401 ||
                error.response?.status === 403
            ) {

                setIsBooked(false);
                setBooking(null);

            }

        } finally {

            setBookingChecked(true);

        }

    }, [id]);

    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {

        if (!id) {
            return;
        }

        fetchTour();
        fetchCapacity();
        checkMyBooking();

    }, [
        id,
        fetchTour,
        fetchCapacity,
        checkMyBooking
    ]);

    // =====================================================
    // REFRESH CAPACITY WHEN USER RETURNS
    // =====================================================

    useEffect(() => {

        const handleVisibilityChange = () => {

            if (
                document.visibilityState === "visible"
            ) {

                fetchCapacity();
                checkMyBooking();

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

    }, [
        fetchCapacity,
        checkMyBooking
    ]);

    // =====================================================
    // REFRESH WHEN WINDOW GETS FOCUS
    // =====================================================

    useEffect(() => {

        const handleWindowFocus = () => {

            fetchCapacity();
            checkMyBooking();

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

    }, [
        fetchCapacity,
        checkMyBooking
    ]);

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
                month: "long",
                year: "numeric"
            }
        );

    };

    // =====================================================
    // OPEN BOOKING MODAL
    // =====================================================

    const openBookingModal = () => {

        const token =
            localStorage.getItem("token");

        if (!token) {

            const shouldLogin =
                window.confirm(
                    "Please login to register for this tour.\n\nGo to login page?"
                );

            if (shouldLogin) {
                navigate("/login");
            }

            return;

        }

        if (isBooked) {

            setBookingMessage(
                "You have already registered for this tour."
            );

            return;

        }

        if (isFull) {

            setBookingError(
                "This tour is fully booked."
            );

            return;

        }

        if (isUnavailable) {

            return;

        }

        setBookingError("");
        setBookingMessage("");
        setShowBookingModal(true);

    };

    // =====================================================
    // SUBMIT BOOKING
    // =====================================================

    const handleConfirmBooking = async (formValues) => {

        const token =
            localStorage.getItem("token");

        if (!token) {

            setShowBookingModal(false);
            navigate("/login");

            return;

        }

        if (bookingLoading) {
            return;
        }

        // -------------------------------------------------
        // EXTRA FRONTEND CAPACITY CHECK
        // -------------------------------------------------

        const requestedTravelers =
            Number(
                formValues?.numberOfTravelers
            );

        if (
            !Number.isInteger(
                requestedTravelers
            ) ||
            requestedTravelers < 1
        ) {

            setBookingError(
                "Number of travelers must be at least 1."
            );

            return;

        }

        if (
            requestedTravelers >
            remainingTravelers
        ) {

            setBookingError(
                remainingTravelers === 0
                    ? "This tour is fully booked."
                    : `Only ${remainingTravelers} seat(s) left for this tour.`
            );

            await fetchCapacity();

            return;

        }

        setBookingLoading(true);
        setBookingMessage("");
        setBookingError("");

        try {

            const response =
                await api.post(

                    `/api/tour-bookings/${id}`,

                    {
                        ...formValues,
                        numberOfTravelers:
                            requestedTravelers
                    },

                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }

                );

            if (response.data.success) {

                // -------------------------------------------------
                // UPDATE BOOKING STATE
                // -------------------------------------------------

                setIsBooked(true);

                setBooking(
                    response.data.booking ||
                    null
                );

                // -------------------------------------------------
                // UPDATE CAPACITY IMMEDIATELY
                // -------------------------------------------------

                if (
                    response.data.tourCapacity
                ) {

                    setTourCapacity(
                        response.data.tourCapacity
                    );

                } else {

                    await fetchCapacity();

                }

                // -------------------------------------------------
                // UPDATE TOUR STATUS IF NECESSARY
                // -------------------------------------------------

                if (
                    response.data.tourCapacity?.isFull
                ) {

                    setTour((previousTour) => {

                        if (!previousTour) {
                            return previousTour;
                        }

                        return {
                            ...previousTour,
                            status: "completed"
                        };

                    });

                }

                setBookingMessage(
                    response.data.message ||
                    "Tour registered successfully 🎉"
                );

                setShowBookingModal(false);

            }

        } catch (error) {

            console.error(
                "❌ BOOK TOUR ERROR:",
                error
            );

            // -------------------------------------------------
            // REFRESH CAPACITY AFTER BOOKING ERROR
            // This handles another user booking the
            // last seats at the same time.
            // -------------------------------------------------

            await fetchCapacity();

            const serverMessage =
                error.response?.data?.message ||
                "Unable to register for this tour.";

            setBookingError(
                serverMessage
            );

            // -------------------------------------------------
            // IF SERVER SAYS ALREADY BOOKED
            // -------------------------------------------------

            if (
                error.response?.data?.alreadyBooked
            ) {

                setIsBooked(true);

                await checkMyBooking();

            }

        } finally {

            setBookingLoading(false);

        }

    };

    // =====================================================
    // CANCEL BOOKING
    // =====================================================

    const handleCancelBooking = async () => {

        const token =
            localStorage.getItem("token");

        if (!token) {

            navigate("/login");

            return;

        }

        if (cancelLoading) {
            return;
        }

        const confirmCancel =
            window.confirm(
                "Are you sure you want to cancel your tour booking?"
            );

        if (!confirmCancel) {
            return;
        }

        setCancelLoading(true);
        setBookingMessage("");
        setBookingError("");

        try {

            const response =
                await api.delete(

                    `/api/tour-bookings/${id}`,

                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }

                );

            if (response.data.success) {

                // -------------------------------------------------
                // UPDATE BOOKING STATE
                // -------------------------------------------------

                setIsBooked(false);
                setBooking(null);

                // -------------------------------------------------
                // UPDATE CAPACITY
                // -------------------------------------------------

                if (
                    response.data.tourCapacity
                ) {

                    setTourCapacity(
                        response.data.tourCapacity
                    );

                } else {

                    await fetchCapacity();

                }

                // -------------------------------------------------
                // IF TOUR BECOMES AVAILABLE AGAIN
                // -------------------------------------------------

                if (
                    response.data.tourCapacity &&
                    response.data.tourCapacity.remainingTravelers > 0
                ) {

                    setTour((previousTour) => {

                        if (!previousTour) {
                            return previousTour;
                        }

                        if (
                            previousTour.status ===
                            "completed"
                        ) {

                            return {
                                ...previousTour,
                                status: "active"
                            };

                        }

                        return previousTour;

                    });

                }

                setBookingMessage(
                    response.data.message ||
                    "Tour booking cancelled successfully."
                );

            }

        } catch (error) {

            console.error(
                "❌ CANCEL BOOKING ERROR:",
                error
            );

            setBookingError(
                error.response?.data?.message ||
                "Unable to cancel tour booking."
            );

            // Refresh latest state
            await fetchCapacity();
            await checkMyBooking();

        } finally {

            setCancelLoading(false);

        }

    };

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div className="tour-details-loading">

                <div className="tour-details-loader"></div>

                <h3>
                    Loading Tour Details...
                </h3>

                <p>
                    Please wait while we prepare the
                    tour information.
                </p>

            </div>

        );

    }

    // =====================================================
    // ERROR
    // =====================================================

    if (error || !tour) {

        return (

            <div className="tour-details-error-page">

                <div className="tour-error-icon">
                    ⚠️
                </div>

                <h2>
                    Tour Not Available
                </h2>

                <p>
                    {error ||
                        "This tour could not be found."}
                </p>

                <button
                    onClick={() =>
                        navigate("/explore-tours")
                    }
                >
                    ← Back to Explore Tours
                </button>

            </div>

        );

    }

    // =====================================================
    // COMPANY
    // =====================================================

    const company =
        tour.company || {};

    // =====================================================
    // EXPIRY
    // =====================================================

    const isExpired =
        tour.endDate &&
        new Date(tour.endDate) < new Date();

    // =====================================================
    // TOUR STATUS
    // =====================================================

    const isCancelled =
        tour.status === "cancelled";

    const isCompleted =
        tour.status === "completed";

    const isUnavailable =
        isExpired ||
        isCancelled ||
        isCompleted;

    // =====================================================
    // CAPACITY
    // =====================================================

    const maxTravelers =
        Number(
            tourCapacity.maxTravelers ||
            tour.maxTravelers ||
            0
        );

    const bookedTravelers =
        Number(
            tourCapacity.bookedTravelers || 0
        );

    const remainingTravelers =
        tourCapacity.remainingTravelers !== undefined
            ? Number(
                tourCapacity.remainingTravelers
            )
            : Math.max(
                maxTravelers -
                bookedTravelers,
                0
            );

    const isFull =
        Boolean(
            tourCapacity.isFull ||
            remainingTravelers <= 0
        );

    const bookingPercentage =
        maxTravelers > 0
            ? Math.min(
                Math.round(
                    (
                        bookedTravelers /
                        maxTravelers
                    ) * 100
                ),
                100
            )
            : 0;

    // =====================================================
    // MAIN PAGE
    // =====================================================

    return (

        <div className="tour-details-page">

            {/* =================================================
                BACK BUTTON
            ================================================= */}

            <div className="tour-details-topbar">

                <button
                    className="tour-back-btn"
                    onClick={() =>
                        navigate("/explore-tours")
                    }
                >
                    ← Back to Explore Tours
                </button>

            </div>

            {/* =================================================
                HERO
            ================================================= */}

            <section className="tour-details-hero">

                {tour.image ? (

                    <img
                        src={tour.image}
                        alt={tour.title}
                        className="tour-details-hero-image"
                    />

                ) : (

                    <div className="tour-details-hero-placeholder">

                        <span>
                            ✈️
                        </span>

                        <p>
                            TravelMet Tour
                        </p>

                    </div>

                )}

                <div className="tour-details-hero-overlay"></div>

                <div className="tour-details-hero-content">

                    <span className="tour-details-destination">
                        📍 {tour.destination}
                    </span>

                    {tour.theme && (

                        <span className="tour-details-theme-badge">

                            {THEME_ICONS[tour.theme] ||
                                "🌍"}{" "}

                            {tour.theme}

                        </span>

                    )}

                    <h1>
                        {tour.title}
                    </h1>

                    <p>
                        Organized by{" "}
                        <strong>
                            {company.companyName ||
                                "Travel Company"}
                        </strong>
                    </p>

                </div>

                <span
                    className={
                        `tour-details-status ${
                            isExpired
                                ? "expired"
                                : tour.status
                        }`
                    }
                >
                    {isExpired
                        ? "Expired"
                        : tour.status === "cancelled"
                            ? "Cancelled"
                            : tour.status === "completed"
                                ? "Completed"
                                : "Active"}
                </span>

            </section>

            {/* =================================================
                MAIN CONTENT
            ================================================= */}

            <main className="tour-details-container">

                {/* =================================================
                    BOOKING SUCCESS MESSAGE
                ================================================= */}

                {bookingMessage && (

                    <div className="tour-booking-success-message">

                        ✅ {bookingMessage}

                    </div>

                )}

                {/* =================================================
                    BOOKING ERROR
                ================================================= */}

                {bookingError && (

                    <div className="tour-booking-error-message">

                        ⚠️ {bookingError}

                    </div>

                )}

                {/* =================================================
                    TOUR OVERVIEW
                ================================================= */}

                <section className="tour-overview-card">

                    <div className="tour-section-heading">

                        <span>
                            TOUR OVERVIEW
                        </span>

                        <h2>
                            {tour.title}
                        </h2>

                    </div>

                    <p className="tour-full-description">
                        {tour.description}
                    </p>

                    {/* =================================================
                        TOUR INFORMATION
                    ================================================= */}

                    <div className="tour-info-grid">

                        <div className="tour-info-card">

                            <span className="tour-info-icon">
                                📅
                            </span>

                            <div>

                                <small>
                                    START DATE
                                </small>

                                <strong>
                                    {formatDate(
                                        tour.startDate
                                    )}
                                </strong>

                            </div>

                        </div>

                        <div className="tour-info-card">

                            <span className="tour-info-icon">
                                🏁
                            </span>

                            <div>

                                <small>
                                    END DATE
                                </small>

                                <strong>
                                    {formatDate(
                                        tour.endDate
                                    )}
                                </strong>

                            </div>

                        </div>

                        <div className="tour-info-card">

                            <span className="tour-info-icon">
                                ⏱️
                            </span>

                            <div>

                                <small>
                                    DURATION
                                </small>

                                <strong>
                                    {tour.duration}{" "}
                                    {Number(tour.duration) === 1
                                        ? "Day"
                                        : "Days"}
                                </strong>

                            </div>

                        </div>

                        <div className="tour-info-card">

                            <span className="tour-info-icon">
                                👥
                            </span>

                            <div>

                                <small>
                                    MAX TRAVELERS
                                </small>

                                <strong>
                                    {maxTravelers}
                                </strong>

                            </div>

                        </div>

                    </div>

                </section>

                {/* =================================================
                    TWO COLUMN SECTION
                ================================================= */}

                <div className="tour-details-columns">

                    {/* =================================================
                        COMPANY DETAILS
                    ================================================= */}

                    <section className="tour-company-card">

                        <div className="tour-section-heading">

                            <span>
                                TOUR ORGANIZER
                            </span>

                            <h2>
                                Company Details
                            </h2>

                        </div>

                        <div className="tour-company-header">

                            <div className="tour-company-logo">

                                {company.logo ? (

                                    <img
                                        src={company.logo}
                                        alt={
                                            company.companyName
                                        }
                                    />

                                ) : (

                                    <span>
                                        🏢
                                    </span>

                                )}

                            </div>

                            <div>

                                <h3>
                                    {company.companyName ||
                                        "Travel Company"}
                                </h3>

                                <span className="company-verified">

                                    {company.verificationStatus ===
                                        "verified"
                                        ? "✓ Verified Company"
                                        : "Travel Company"}

                                </span>

                            </div>

                        </div>

                        <div className="company-detail-list">

                            <div className="company-detail-row">

                                <span>
                                    👤
                                </span>

                                <div>

                                    <small>
                                        OWNER
                                    </small>

                                    <strong>
                                        {company.ownerName ||
                                            "Not available"}
                                    </strong>

                                </div>

                            </div>

                            <div className="company-detail-row">

                                <span>
                                    ✉️
                                </span>

                                <div>

                                    <small>
                                        EMAIL
                                    </small>

                                    <strong>
                                        {company.email ||
                                            "Not available"}
                                    </strong>

                                </div>

                            </div>

                            <div className="company-detail-row">

                                <span>
                                    📞
                                </span>

                                <div>

                                    <small>
                                        PHONE
                                    </small>

                                    <strong>
                                        {company.phone ||
                                            "Not available"}
                                    </strong>

                                </div>

                            </div>

                            <div className="company-detail-row">

                                <span>
                                    📍
                                </span>

                                <div>

                                    <small>
                                        ADDRESS
                                    </small>

                                    <strong>
                                        {company.address ||
                                            "Not available"}
                                    </strong>

                                </div>

                            </div>

                        </div>

                        {company.website && (

                            <a
                                href={company.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="tour-company-website"
                            >
                                🌐 Visit Company Website ↗
                            </a>

                        )}

                    </section>

                    {/* =================================================
                        BOOKING CARD
                    ================================================= */}

                    <section className="tour-booking-card">

                        <span className="booking-label">
                            TOUR PRICE
                        </span>

                        <div className="tour-price">

                            ₹
                            {Number(
                                tour.price || 0
                            ).toLocaleString(
                                "en-IN"
                            )}

                        </div>

                        <p>
                            Per traveller
                        </p>

                        <div className="booking-divider"></div>

                        {/* =================================================
                            CAPACITY
                        ================================================= */}

                        <div className="tour-details-capacity">

                            <div className="capacity-header">

                                <span>
                                    👥 TOUR AVAILABILITY
                                </span>

                                <strong
                                    className={
                                        isFull
                                            ? "capacity-full"
                                            : "capacity-available"
                                    }
                                >
                                    {isFull
                                        ? "FULL"
                                        : `${remainingTravelers} seats left`}
                                </strong>

                            </div>

                            <div className="capacity-progress">

                                <div
                                    className="capacity-progress-bar"
                                    style={{
                                        width:
                                            `${bookingPercentage}%`
                                    }}
                                ></div>

                            </div>

                            <div className="capacity-count">

                                <span>
                                    {bookedTravelers} booked
                                </span>

                                <span>
                                    {maxTravelers} total
                                </span>

                            </div>

                        </div>

                        {/* =================================================
                            BOOKING DETAILS
                        ================================================= */}

                        <div className="booking-detail">

                            <span>
                                📅 Tour Dates
                            </span>

                            <strong>
                                {formatDate(
                                    tour.startDate
                                )}
                                {" → "}
                                {formatDate(
                                    tour.endDate
                                )}
                            </strong>

                        </div>

                        <div className="booking-detail">

                            <span>
                                👥 Group Size
                            </span>

                            <strong>
                                Up to{" "}
                                {maxTravelers}{" "}
                                travellers
                            </strong>

                        </div>

                        <div className="booking-detail">

                            <span>
                                ⏱️ Duration
                            </span>

                            <strong>
                                {tour.duration}{" "}
                                {Number(tour.duration) === 1
                                    ? "Day"
                                    : "Days"}
                            </strong>

                        </div>

                        {/* =================================================
                            BOOKING BUTTON
                        ================================================= */}

                        {isUnavailable ? (

                            <button
                                className="tour-book-disabled"
                                disabled
                            >
                                {isExpired
                                    ? "Tour Expired"
                                    : isCancelled
                                        ? "Tour Cancelled"
                                        : "Tour Completed"}
                            </button>

                        ) : isBooked ? (

                            <>

                                <button
                                    className="tour-booked-btn"
                                    disabled
                                >
                                    ✓ You Are Registered
                                </button>

                                <button
                                    className="tour-cancel-btn"
                                    onClick={
                                        handleCancelBooking
                                    }
                                    disabled={
                                        cancelLoading
                                    }
                                >

                                    {cancelLoading
                                        ? "Cancelling..."
                                        : "Cancel Booking"}

                                </button>

                            </>

                        ) : isFull ? (

                            <button
                                className="tour-book-disabled"
                                disabled
                            >
                                Tour Fully Booked
                            </button>

                        ) : (

                            <button
                                className="tour-book-btn"
                                onClick={
                                    openBookingModal
                                }
                                disabled={
                                    bookingLoading ||
                                    !bookingChecked
                                }
                            >

                                {bookingLoading
                                    ? "Registering..."
                                    : !bookingChecked
                                        ? "Checking..."
                                        : "Book This Tour"}

                            </button>

                        )}

                    </section>

                </div>

                {/* =================================================
                    COMPANY DESCRIPTION
                ================================================= */}

                {company.description && (

                    <section className="tour-company-description">

                        <div className="tour-section-heading">

                            <span>
                                ABOUT THE ORGANIZER
                            </span>

                            <h2>
                                About{" "}
                                {company.companyName}
                            </h2>

                        </div>

                        <p>
                            {company.description}
                        </p>

                    </section>

                )}

                {/* =================================================
                    FOOTER
                ================================================= */}

                <footer className="tour-details-footer">

                    <strong>
                        TRAVELMET
                    </strong>

                    <span>
                        Discover tours. Explore places.
                        Create memories.
                    </span>

                </footer>

            </main>

            {/* =================================================
                BOOKING MODAL
            ================================================= */}

            {showBookingModal && (

                <BookTourModal
                    tour={tour}
                    remainingTravelers={
                        remainingTravelers
                    }
                    loading={bookingLoading}
                    errorMessage={bookingError}
                    onConfirm={
                        handleConfirmBooking
                    }
                    onClose={() => {

                        if (!bookingLoading) {

                            setShowBookingModal(
                                false
                            );

                            setBookingError("");

                        }

                    }}
                />

            )}

        </div>

    );

}

export default TourDetails;