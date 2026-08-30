import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../Css/CompanyDashboard.css";

function CompanyDashboard() {

    const navigate = useNavigate();

    // =====================================================
    // COMPANY DATA
    // =====================================================

    const storedCompany = JSON.parse(
        localStorage.getItem("company") || "{}"
    );

    const companyToken =
        localStorage.getItem("companyToken");


    // =====================================================
    // STATES
    // =====================================================

    const [company, setCompany] =
        useState(storedCompany);

    const [tours, setTours] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [deleteLoading, setDeleteLoading] =
        useState("");

    const [error, setError] =
        useState("");

    // =====================================================
    // BOOKING STATES
    // =====================================================

    const [bookingData, setBookingData] =
        useState({});

    const [bookingLoading, setBookingLoading] =
        useState("");

    const [expandedTour, setExpandedTour] =
        useState("");


    // =====================================================
    // FETCH COMPANY TOURS
    // =====================================================

    const fetchTours = useCallback(async () => {

        try {

            setLoading(true);
            setError("");

            const response = await api.get(
                "/api/tours/company/my-tours",
                {
                    headers: {
                        Authorization:
                            `Bearer ${companyToken}`
                    }
                }
            );

            setTours(
                response.data.tours || []
            );

        } catch (error) {

            console.error(
                "FETCH COMPANY TOURS ERROR:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Unable to load your tours."
            );

        } finally {

            setLoading(false);

        }

    }, [companyToken]);


    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {

        if (!companyToken) {

            navigate(
                "/login",
                { replace: true }
            );

            return;

        }

        fetchTours();

    }, [
        companyToken,
        fetchTours,
        navigate
    ]);


    // =====================================================
    // FETCH BOOKINGS FOR TOUR
    // =====================================================

    const fetchTourBookings = async (tourId) => {

        try {

            setBookingLoading(tourId);

            const response = await api.get(
                `/api/tours/${tourId}/bookings`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${companyToken}`
                    }
                }
            );

            if (response.data.success) {

                setBookingData(
                    (current) => ({
                        ...current,
                        [tourId]: response.data
                    })
                );

            }

        } catch (error) {

            console.error(
                "FETCH TOUR BOOKINGS ERROR:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Unable to fetch tour bookings."
            );

        } finally {

            setBookingLoading("");

        }

    };


    // =====================================================
    // TOGGLE BOOKINGS
    // =====================================================

    const handleViewBookings = async (tourId) => {

        // Close if already open

        if (expandedTour === tourId) {

            setExpandedTour("");

            return;

        }

        setExpandedTour(tourId);

        // Fetch fresh booking data

        await fetchTourBookings(tourId);

    };


    // =====================================================
    // REMOVE EXPIRED TOURS FROM DISPLAY
    // =====================================================

    const today = new Date();

    today.setHours(
        0,
        0,
        0,
        0
    );


    const visibleTours = tours.filter(
        (tour) => {

            if (!tour.endDate) {
                return false;
            }

            const endDate =
                new Date(tour.endDate);

            return endDate >= today;

        }
    );


    // =====================================================
    // TOUR STATISTICS
    // =====================================================

    const activeTours =
        visibleTours.filter(
            (tour) =>
                tour.status === "active"
        );


    const upcomingTours =
        visibleTours.filter(
            (tour) => {

                if (!tour.startDate) {
                    return false;
                }

                return (
                    new Date(tour.startDate) >
                    today
                );

            }
        );


    const completedTours =
        tours.filter(
            (tour) =>
                tour.status === "completed"
        );


    // =====================================================
    // TOTAL BOOKINGS
    // =====================================================

    const totalBookings =
        Object.values(bookingData).reduce(
            (total, data) =>
                total + Number(data?.count || 0),
            0
        );


    // =====================================================
    // DELETE TOUR
    // =====================================================

    const handleDeleteTour = async (tourId) => {

        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this tour?"
            );


        if (!confirmDelete) {
            return;
        }


        try {

            setDeleteLoading(tourId);


            await api.delete(
                `/api/tours/${tourId}`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${companyToken}`
                    }
                }
            );


            setTours(
                (currentTours) =>
                    currentTours.filter(
                        (tour) =>
                            tour._id !== tourId
                    )
            );


            // Remove booking data also

            setBookingData(
                (current) => {

                    const updated = {
                        ...current
                    };

                    delete updated[tourId];

                    return updated;

                }
            );


            if (expandedTour === tourId) {

                setExpandedTour("");

            }


        } catch (error) {

            console.error(
                "DELETE TOUR ERROR:",
                error
            );


            alert(
                error.response?.data?.message ||
                "Unable to delete tour."
            );

        } finally {

            setDeleteLoading("");

        }

    };


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
    // LOGOUT
    // =====================================================

    const handleLogout = () => {

        localStorage.removeItem(
            "companyToken"
        );

        localStorage.removeItem(
            "company"
        );

        navigate(
            "/login",
            { replace: true }
        );

    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div className="company-dashboard-loading">

                <div className="company-dashboard-loader"></div>

                <h3>
                    Loading Company Dashboard
                </h3>

                <p>
                    Preparing your travel management space...
                </p>

            </div>

        );

    }


    // =====================================================
    // DASHBOARD
    // =====================================================

    return (

        <div className="company-dashboard">


            {/* =================================================
                HERO HEADER
            ================================================= */}

            <section className="company-dashboard-hero">

                <div className="company-dashboard-hero-content">

                    <span className="company-dashboard-eyebrow">
                        TRAVELMET BUSINESS
                    </span>

                    <h1>
                        Welcome,{" "}
                        {company.companyName ||
                            "Travel Company"}
                    </h1>

                    <p>
                        Manage your tours, publish new
                        experiences and reach travellers
                        through TravelMet.
                    </p>

                </div>


                <div className="company-dashboard-hero-actions">

                    <button
                        className="dashboard-profile-btn"
                        onClick={() =>
                            navigate(
                                "/company/profile"
                            )
                        }
                    >
                        View Profile
                    </button>


                    <button
                        className="dashboard-logout-btn"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                </div>

            </section>


            {/* =================================================
                VERIFICATION STATUS
            ================================================= */}

            <div className="company-dashboard-status">

                <div className="dashboard-status-icon">

                    {company.verificationStatus ===
                        "verified"
                        ? "✓"
                        : "⏳"}

                </div>

                <div>

                    <span>
                        COMPANY STATUS
                    </span>

                    <strong>

                        {company.verificationStatus ===
                            "verified"
                            ? "Verified Company"
                            : "Verification Pending"}

                    </strong>

                </div>

            </div>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

                <div className="company-dashboard-error">

                    ⚠️ {error}

                    <button
                        onClick={fetchTours}
                    >
                        Retry
                    </button>

                </div>

            )}


            {/* =================================================
                STATISTICS
            ================================================= */}

            <section className="company-dashboard-stats">

                <div className="dashboard-stat-card">

                    <div className="dashboard-stat-icon">
                        ✈️
                    </div>

                    <div>

                        <span>
                            Total Tours
                        </span>

                        <strong>
                            {visibleTours.length}
                        </strong>

                        <small>
                            Published experiences
                        </small>

                    </div>

                </div>


                <div className="dashboard-stat-card active">

                    <div className="dashboard-stat-icon">
                        ✓
                    </div>

                    <div>

                        <span>
                            Active Tours
                        </span>

                        <strong>
                            {activeTours.length}
                        </strong>

                        <small>
                            Currently available
                        </small>

                    </div>

                </div>


                <div className="dashboard-stat-card upcoming">

                    <div className="dashboard-stat-icon">
                        📅
                    </div>

                    <div>

                        <span>
                            Upcoming
                        </span>

                        <strong>
                            {upcomingTours.length}
                        </strong>

                        <small>
                            Future departures
                        </small>

                    </div>

                </div>


                <div className="dashboard-stat-card completed">

                    <div className="dashboard-stat-icon">
                        ✓
                    </div>

                    <div>

                        <span>
                            Completed
                        </span>

                        <strong>
                            {completedTours.length}
                        </strong>

                        <small>
                            Past tour records
                        </small>

                    </div>

                </div>


                {/* =================================================
                    TOTAL BOOKINGS
                ================================================= */}

                <div className="dashboard-stat-card bookings">

                    <div className="dashboard-stat-icon">
                        👥
                    </div>

                    <div>

                        <span>
                            Bookings
                        </span>

                        <strong>
                            {totalBookings}
                        </strong>

                        <small>
                            Loaded tour registrations
                        </small>

                    </div>

                </div>

            </section>


            {/* =================================================
                TOUR MANAGEMENT HEADER
            ================================================= */}

            <section className="company-tour-section">

                <div className="company-tour-section-header">

                    <div>

                        <span className="section-eyebrow">
                            TOUR MANAGEMENT
                        </span>

                        <h2>
                            My Tours
                        </h2>

                        <p>
                            Create and manage your travel
                            experiences.
                        </p>

                    </div>


                    <button
                        className="add-tour-btn"
                        onClick={() =>
                            navigate(
                                "/company/add-tour"
                            )
                        }
                    >

                        <span>
                            +
                        </span>

                        Add New Tour

                    </button>

                </div>


                {/* =================================================
                    EMPTY STATE
                ================================================= */}

                {visibleTours.length === 0 ? (

                    <div className="company-tour-empty">

                        <div className="empty-tour-icon">
                            ✈️
                        </div>

                        <h3>
                            No tours yet
                        </h3>

                        <p>
                            Start showcasing your travel
                            experiences by creating your
                            first tour.
                        </p>

                        <button
                            className="empty-add-tour-btn"
                            onClick={() =>
                                navigate(
                                    "/company/add-tour"
                                )
                            }
                        >
                            + Create Your First Tour
                        </button>

                    </div>

                ) : (

                    /* =================================================
                       TOUR GRID
                    ================================================= */

                    <div className="company-tour-grid">

                        {visibleTours.map(
                            (tour) => {

                                const currentBooking =
                                    bookingData[tour._id];

                                const bookedTravelers =
                                    currentBooking?.count || 0;

                                const maxTravelers =
                                    currentBooking?.maxTravelers ||
                                    tour.maxTravelers ||
                                    0;

                                const remainingTravelers =
                                    currentBooking
                                        ? currentBooking.remainingTravelers
                                        : maxTravelers;

                                const isFull =
                                    currentBooking
                                        ? currentBooking.tourCapacity?.isFull ||
                                          remainingTravelers === 0
                                        : false;


                                return (

                                    <article
                                        className="company-tour-card"
                                        key={tour._id}
                                    >

                                        {/* =========================
                                            IMAGE
                                        ========================= */}

                                        <div className="company-tour-image-wrapper">

                                            {tour.image ? (

                                                <img
                                                    src={tour.image}
                                                    alt={tour.title}
                                                    className="company-tour-image"
                                                />

                                            ) : (

                                                <div className="company-tour-image-placeholder">

                                                    <span>
                                                        ✈️
                                                    </span>

                                                    <small>
                                                        TravelMet Tour
                                                    </small>

                                                </div>

                                            )}


                                            <span
                                                className={
                                                    `tour-status-badge ${
                                                        tour.status ||
                                                        "active"
                                                    }`
                                                }
                                            >

                                                {tour.status ===
                                                    "cancelled"
                                                    ? "Cancelled"
                                                    : tour.status ===
                                                        "completed"
                                                        ? "Completed"
                                                        : "Active"}

                                            </span>

                                        </div>


                                        {/* =========================
                                            CONTENT
                                        ========================= */}

                                        <div className="company-tour-content">

                                            <span className="tour-destination">
                                                📍 {tour.destination}
                                            </span>


                                            <h3>
                                                {tour.title}
                                            </h3>


                                            <p className="tour-description">

                                                {tour.description?.length >
                                                    120
                                                    ? `${tour.description.substring(
                                                        0,
                                                        120
                                                    )}...`
                                                    : tour.description}

                                            </p>


                                            {/* =========================
                                                DATE
                                            ========================= */}

                                            <div className="tour-info-row">

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


                                            {/* =========================
                                                TOUR META
                                            ========================= */}

                                            <div className="tour-meta-row">

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
                                                    Travelers
                                                </span>

                                            </div>


                                            {/* =========================
                                                BOOKING CAPACITY
                                            ========================= */}

                                            <div className="tour-booking-capacity">

                                                <div className="tour-booking-capacity-header">

                                                    <span>
                                                        TOUR BOOKINGS
                                                    </span>

                                                    {currentBooking && (

                                                        <strong
                                                            className={
                                                                isFull
                                                                    ? "booking-full"
                                                                    : "booking-available"
                                                            }
                                                        >
                                                            {isFull
                                                                ? "FULL"
                                                                : `${remainingTravelers} seats left`}
                                                        </strong>

                                                    )}

                                                </div>


                                                <div className="tour-booking-progress">

                                                    <div
                                                        className="tour-booking-progress-bar"
                                                        style={{
                                                            width:
                                                                `${Math.min(
                                                                    (
                                                                        bookedTravelers /
                                                                        Math.max(
                                                                            maxTravelers,
                                                                            1
                                                                        )
                                                                    ) *
                                                                    100,
                                                                    100
                                                                )}%`
                                                        }}
                                                    ></div>

                                                </div>


                                                <div className="tour-booking-count">

                                                    <span>
                                                        {bookedTravelers} booked
                                                    </span>

                                                    <span>
                                                        {maxTravelers} max
                                                    </span>

                                                </div>

                                            </div>


                                            {/* =========================
                                                PRICE
                                            ========================= */}

                                            <div className="tour-price-row">

                                                <div>

                                                    <small>
                                                        Starting from
                                                    </small>

                                                    <strong>
                                                        ₹
                                                        {Number(
                                                            tour.price || 0
                                                        ).toLocaleString(
                                                            "en-IN"
                                                        )}
                                                    </strong>

                                                </div>

                                            </div>


                                            {/* =========================
                                                ACTIONS
                                            ========================= */}

                                            <div className="company-tour-actions">

                                                <button
                                                    className="tour-view-btn"
                                                    onClick={() =>
                                                        navigate(
                                                            `/tour/${tour._id}`
                                                        )
                                                    }
                                                >
                                                    View Tour
                                                </button>


                                                <button
                                                    className="tour-edit-btn"
                                                    onClick={() =>
                                                        navigate(
                                                            `/company/edit-tour/${tour._id}`
                                                        )
                                                    }
                                                >
                                                    Edit
                                                </button>


                                                <button
                                                    className="tour-delete-btn"
                                                    onClick={() =>
                                                        handleDeleteTour(
                                                            tour._id
                                                        )
                                                    }
                                                    disabled={
                                                        deleteLoading ===
                                                        tour._id
                                                    }
                                                >

                                                    {deleteLoading ===
                                                        tour._id
                                                        ? "..."
                                                        : "Delete"}

                                                </button>

                                            </div>


                                            {/* =========================
                                                BOOKINGS BUTTON
                                            ========================= */}

                                            <button
                                                className="tour-bookings-toggle-btn"
                                                onClick={() =>
                                                    handleViewBookings(
                                                        tour._id
                                                    )
                                                }
                                                disabled={
                                                    bookingLoading ===
                                                    tour._id
                                                }
                                            >

                                                {bookingLoading ===
                                                    tour._id
                                                    ? "Loading Bookings..."
                                                    : expandedTour ===
                                                        tour._id
                                                        ? "▲ Hide Bookings"
                                                        : "👥 View Bookings"}

                                            </button>


                                            {/* =========================
                                                BOOKINGS PANEL
                                            ========================= */}

                                            {expandedTour ===
                                                tour._id && (

                                                <div className="tour-bookings-panel">

                                                    {currentBooking ? (

                                                        <>

                                                            <div className="tour-bookings-summary">

                                                                <div>

                                                                    <span>
                                                                        SEATS BOOKED
                                                                    </span>

                                                                    <strong>
                                                                        {
                                                                            currentBooking.bookedTravelers ??
                                                                            currentBooking.count
                                                                        }
                                                                    </strong>

                                                                </div>


                                                                <div>

                                                                    <span>
                                                                        BOOKINGS
                                                                    </span>

                                                                    <strong>
                                                                        {
                                                                            currentBooking.count
                                                                        }
                                                                    </strong>

                                                                </div>


                                                                <div>

                                                                    <span>
                                                                        REMAINING
                                                                    </span>

                                                                    <strong>
                                                                        {
                                                                            currentBooking.remainingTravelers
                                                                        }
                                                                    </strong>

                                                                </div>


                                                                <div>

                                                                    <span>
                                                                        CAPACITY
                                                                    </span>

                                                                    <strong>
                                                                        {
                                                                            currentBooking.maxTravelers
                                                                        }
                                                                    </strong>

                                                                </div>

                                                            </div>


                                                            {currentBooking.bookings?.length ===
                                                                0 ? (

                                                                <div className="no-tour-bookings">

                                                                    <span>
                                                                        👥
                                                                    </span>

                                                                    <p>
                                                                        No travelers have registered for this tour yet.
                                                                    </p>

                                                                </div>

                                                            ) : (

                                                                <div className="tour-bookings-list">

                                                                    <h4>
                                                                        Registered Travelers
                                                                    </h4>


                                                                    {currentBooking.bookings.map(
                                                                        (booking) => {

                                                                            const user =
                                                                                booking.user ||
                                                                                {};

                                                                            const fullName =
                                                                                `${user.firstName || ""} ${user.lastName || ""}`
                                                                                    .trim();


                                                                            return (

                                                                                <div
                                                                                    className="tour-booking-user"
                                                                                    key={
                                                                                        booking._id
                                                                                    }
                                                                                >

                                                                                    <div className="tour-booking-user-avatar">

                                                                                        {user.profileImage ? (

                                                                                            <img
                                                                                                src={
                                                                                                    user.profileImage
                                                                                                }
                                                                                                alt={
                                                                                                    booking.contactName ||
                                                                                                    fullName ||
                                                                                                    user.username ||
                                                                                                    "Traveler"
                                                                                                }
                                                                                            />

                                                                                        ) : (

                                                                                            <span>
                                                                                                👤
                                                                                            </span>

                                                                                        )}

                                                                                    </div>


                                                                                    <div className="tour-booking-user-info">

                                                                                        <strong>
                                                                                            {
                                                                                                booking.contactName ||
                                                                                                fullName ||
                                                                                                user.username ||
                                                                                                "Traveler"
                                                                                            }
                                                                                        </strong>

                                                                                        <span>
                                                                                            📧{" "}
                                                                                            {
                                                                                                booking.contactEmail ||
                                                                                                user.email ||
                                                                                                "Email not available"
                                                                                            }
                                                                                        </span>

                                                                                        {booking.contactPhone && (
                                                                                            <span>
                                                                                                📞{" "}
                                                                                                {
                                                                                                    booking.contactPhone
                                                                                                }
                                                                                            </span>
                                                                                        )}

                                                                                        {user.username && (
                                                                                            <small>
                                                                                                Account: @
                                                                                                {
                                                                                                    user.username
                                                                                                }
                                                                                            </small>
                                                                                        )}

                                                                                        {booking.specialRequests && (
                                                                                            <small className="tour-booking-special-requests">
                                                                                                📝{" "}
                                                                                                {
                                                                                                    booking.specialRequests
                                                                                                }
                                                                                            </small>
                                                                                        )}

                                                                                    </div>


                                                                                    <div className="tour-booking-meta">

                                                                                        <span className="tour-booking-travelers-badge">
                                                                                            {
                                                                                                booking.numberOfTravelers || 1
                                                                                            }{" "}
                                                                                            {(booking.numberOfTravelers || 1) === 1
                                                                                                ? "traveler"
                                                                                                : "travelers"}
                                                                                        </span>

                                                                                        <span className="tour-booking-confirmed">
                                                                                            Confirmed
                                                                                        </span>

                                                                                    </div>

                                                                                </div>

                                                                            );

                                                                        }
                                                                    )}

                                                                </div>

                                                            )}

                                                        </>

                                                    ) : (

                                                        <div className="no-tour-bookings">

                                                            <div className="tour-booking-small-loader"></div>

                                                            <p>
                                                                Loading booking information...
                                                            </p>

                                                        </div>

                                                    )}

                                                </div>

                                            )}

                                        </div>

                                    </article>

                                );

                            }
                        )}

                    </div>

                )}

            </section>


            {/* =================================================
                QUICK ACTIONS
            ================================================= */}

            <section className="company-quick-actions">

                <div>

                    <span className="section-eyebrow">
                        QUICK ACTIONS
                    </span>

                    <h2>
                        Manage your TravelMet presence
                    </h2>

                </div>


                <div className="quick-action-grid">

                    <button
                        onClick={() =>
                            navigate(
                                "/company/add-tour"
                            )
                        }
                    >

                        <span>
                            ＋
                        </span>

                        <div>

                            <strong>
                                Add New Tour
                            </strong>

                            <small>
                                Publish a new travel experience
                            </small>

                        </div>

                    </button>


                    <button
                        onClick={() =>
                            navigate(
                                "/company/profile"
                            )
                        }
                    >

                        <span>
                            🏢
                        </span>

                        <div>

                            <strong>
                                Company Profile
                            </strong>

                            <small>
                                View and manage company details
                            </small>

                        </div>

                    </button>


                    <button
                        onClick={() =>
                            navigate(
                                "/explore-tours"
                            )
                        }
                    >

                        <span>
                            🌍
                        </span>

                        <div>

                            <strong>
                                Explore Tours
                            </strong>

                            <small>
                                See the public tour marketplace
                            </small>

                        </div>

                    </button>

                </div>

            </section>


            {/* =================================================
                FOOTER NOTE
            ================================================= */}

            <div className="company-dashboard-footer">

                <span>
                    TRAVELMET BUSINESS
                </span>

                <p>
                    Helping travel companies connect
                    with explorers.
                </p>

            </div>

        </div>

    );

}

export default CompanyDashboard;