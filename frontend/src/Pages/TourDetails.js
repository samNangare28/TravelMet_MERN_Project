import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
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

    const [bookingLoading, setBookingLoading] =
        useState(false);

    const [cancelLoading, setCancelLoading] =
        useState(false);

    const [bookingChecked, setBookingChecked] =
        useState(false);

    const [isBooked, setIsBooked] =
        useState(false);

    const [booking, setBooking] =
        useState(null);

    const [bookingMessage, setBookingMessage] =
        useState("");

    const [bookingError, setBookingError] =
        useState("");


    // =====================================================
    // CAPACITY STATES
    // =====================================================

    const [tourCapacity, setTourCapacity] =
        useState({

            maxTravelers: 0,

            bookedTravelers: 0,

            remainingTravelers: 0,

            isFull: false

        });


    // =====================================================
    // FETCH TOUR DETAILS
    // =====================================================

    useEffect(() => {

        const fetchTour = async () => {

            try {

                setLoading(true);

                setError("");

                const response = await api.get(
                    `/api/tours/${id}`
                );

                if (response.data.success) {

                    setTour(
                        response.data.tour
                    );

                } else {

                    setError(
                        "Unable to load tour details."
                    );

                }

            } catch (error) {

                console.error(
                    "TOUR DETAILS ERROR:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Unable to load tour details."
                );

            } finally {

                setLoading(false);

            }

        };


        if (id) {

            fetchTour();

        }

    }, [id]);


    // =====================================================
    // FETCH TOUR CAPACITY
    // =====================================================

    useEffect(() => {

        const fetchCapacity = async () => {

            try {

                const response = await api.get(
                    `/api/tours/${id}/booking-count`
                );


                if (response.data.success) {

                    setTourCapacity(
                        response.data.tourCapacity
                    );

                }

            } catch (error) {

                console.error(
                    "TOUR CAPACITY ERROR:",
                    error
                );

            }

        };


        if (id) {

            fetchCapacity();

        }

    }, [id, isBooked]);


    // =====================================================
    // CHECK MY BOOKING
    // =====================================================

    useEffect(() => {

        const checkMyBooking = async () => {

            const token =
                localStorage.getItem("token");


            // User not logged in

            if (!token) {

                setBookingChecked(true);

                return;

            }


            try {

                const response =
                    await api.get(
                        `/api/tours/${id}/my-booking`,
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

                }

            } catch (error) {

                console.error(
                    "CHECK TOUR BOOKING ERROR:",
                    error
                );

            } finally {

                setBookingChecked(true);

            }

        };


        if (id) {

            checkMyBooking();

        }

    }, [id]);


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

                month: "long",

                year: "numeric"

            }
        );

    };


    // =====================================================
    // BOOK TOUR
    // =====================================================

    const handleBookTour = async () => {

        const token =
            localStorage.getItem("token");


        // =================================================
        // LOGIN CHECK
        // =================================================

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


        // =================================================
        // PREVENT DOUBLE CLICK
        // =================================================

        if (bookingLoading) {

            return;

        }


        setBookingLoading(true);

        setBookingMessage("");

        setBookingError("");


        try {

            const response =
                await api.post(

                    `/api/tours/${id}/book`,

                    {},

                    {

                        headers: {

                            Authorization:
                                `Bearer ${token}`

                        }

                    }

                );


            if (response.data.success) {

                setIsBooked(true);

                setBooking(
                    response.data.booking
                );


                if (
                    response.data.tourCapacity
                ) {

                    setTourCapacity(
                        response.data.tourCapacity
                    );

                }


                setBookingMessage(
                    response.data.message ||
                    "Tour registered successfully 🎉"
                );

            }

        } catch (error) {

            console.error(
                "BOOK TOUR ERROR:",
                error
            );


            setBookingError(
                error.response?.data?.message ||
                "Unable to register for this tour."
            );

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

                    `/api/tours/${id}/book`,

                    {

                        headers: {

                            Authorization:
                                `Bearer ${token}`

                        }

                    }

                );


            if (response.data.success) {

                setIsBooked(false);

                setBooking(null);


                if (
                    response.data.tourCapacity
                ) {

                    setTourCapacity(
                        response.data.tourCapacity
                    );

                }


                setBookingMessage(
                    response.data.message ||
                    "Tour booking cancelled successfully."
                );

            }

        } catch (error) {

            console.error(
                "CANCEL BOOKING ERROR:",
                error
            );


            setBookingError(
                error.response?.data?.message ||
                "Unable to cancel tour booking."
            );

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
        tourCapacity.maxTravelers ||
        tour.maxTravelers ||
        0;


    const bookedTravelers =
        tourCapacity.bookedTravelers || 0;


    const remainingTravelers =
        tourCapacity.remainingTravelers ??
        Math.max(
            maxTravelers -
            bookedTravelers,
            0
        );


    const isFull =
        tourCapacity.isFull ||
        remainingTravelers <= 0;


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
                HERO IMAGE
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
                    BOOKING MESSAGE
                ================================================= */}

                {bookingMessage && (

                    <div
                        className="tour-booking-success-message"
                    >
                        ✅ {bookingMessage}
                    </div>

                )}


                {bookingError && (

                    <div
                        className="tour-booking-error-message"
                    >
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
                                    {tour.duration === 1
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
                                    {tour.maxTravelers}
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
                        PRICE / BOOKING CARD
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
                            TOUR CAPACITY
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
                                {tour.maxTravelers}{" "}
                                travellers
                            </strong>

                        </div>


                        <div className="booking-detail">

                            <span>
                                ⏱️ Duration
                            </span>

                            <strong>
                                {tour.duration}{" "}
                                {tour.duration === 1
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
                                    handleBookTour
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

        </div>

    );

}

export default TourDetails;
