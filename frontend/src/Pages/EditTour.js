import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import "../Css/EditTour.css";

function EditTour() {

    const navigate = useNavigate();
    const { id } = useParams();

    const companyToken =
        localStorage.getItem("companyToken");

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");

    const [formData, setFormData] = useState({
        title: "",
        destination: "",
        description: "",
        image: "",
        price: "",
        startDate: "",
        endDate: "",
        duration: "",
        maxTravelers: "",
        status: "active"
    });


    // =====================================================
    // AUTH CHECK
    // =====================================================

    useEffect(() => {

        if (!companyToken) {

            navigate(
                "/login",
                { replace: true }
            );

        }

    }, [companyToken, navigate]);


    // =====================================================
    // FETCH TOUR
    // =====================================================

    useEffect(() => {

        const fetchTour = async () => {

            try {

                setLoading(true);
                setError("");

                const response =
                    await api.get(
                        `/api/tours/${id}`
                    );

                const tour =
                    response.data.tour;

                if (!tour) {

                    setError(
                        "Tour not found."
                    );

                    return;

                }

                setFormData({

                    title:
                        tour.title || "",

                    destination:
                        tour.destination || "",

                    description:
                        tour.description || "",

                    image:
                        tour.image || "",

                    price:
                        tour.price ?? "",

                    startDate:
                        tour.startDate
                            ? new Date(
                                tour.startDate
                            )
                                .toISOString()
                                .split("T")[0]
                            : "",

                    endDate:
                        tour.endDate
                            ? new Date(
                                tour.endDate
                            )
                                .toISOString()
                                .split("T")[0]
                            : "",

                    duration:
                        tour.duration ?? "",

                    maxTravelers:
                        tour.maxTravelers ?? "",

                    status:
                        tour.status || "active"

                });

            }

            catch (error) {

                console.error(
                    "FETCH TOUR ERROR:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Unable to load tour."
                );

            }

            finally {

                setLoading(false);

            }

        };


        if (id) {
            fetchTour();
        }

    }, [id]);


    // =====================================================
    // INPUT CHANGE
    // =====================================================

    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;

        setFormData(
            (previous) => ({
                ...previous,
                [name]: value
            })
        );

        setError("");
        setSuccess("");

    };


    // =====================================================
    // SUBMIT
    // =====================================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");


        // =========================
        // BASIC VALIDATION
        // =========================

        if (
            !formData.title.trim() ||
            !formData.destination.trim() ||
            !formData.description.trim()
        ) {

            setError(
                "Please fill all required fields."
            );

            return;

        }


        if (
            !formData.price ||
            Number(formData.price) < 0
        ) {

            setError(
                "Please enter a valid price."
            );

            return;

        }


        if (
            !formData.startDate ||
            !formData.endDate
        ) {

            setError(
                "Please select tour dates."
            );

            return;

        }


        if (
            new Date(formData.endDate) <
            new Date(formData.startDate)
        ) {

            setError(
                "End date cannot be before start date."
            );

            return;

        }


        if (
            !formData.duration ||
            Number(formData.duration) < 1
        ) {

            setError(
                "Duration must be at least 1 day."
            );

            return;

        }


        if (
            !formData.maxTravelers ||
            Number(formData.maxTravelers) < 1
        ) {

            setError(
                "Maximum travelers must be at least 1."
            );

            return;

        }


        // =================================================
        // UPDATE TOUR
        // =================================================

        try {

            setSaving(true);

            const response =
                await api.put(
                    `/api/tours/${id}`,
                    {

                        title:
                            formData.title.trim(),

                        destination:
                            formData.destination.trim(),

                        description:
                            formData.description.trim(),

                        image:
                            formData.image.trim(),

                        price:
                            Number(formData.price),

                        startDate:
                            formData.startDate,

                        endDate:
                            formData.endDate,

                        duration:
                            Number(formData.duration),

                        maxTravelers:
                            Number(
                                formData.maxTravelers
                            ),

                        status:
                            formData.status

                    },
                    {
                        headers: {
                            Authorization:
                                `Bearer ${companyToken}`
                        }
                    }
                );


            setSuccess(
                response.data.message ||
                "Tour updated successfully ✅"
            );


            // Give user a moment to see success message
            setTimeout(() => {

                navigate(
                    "/company/dashboard"
                );

            }, 1000);

        }

        catch (error) {

            console.error(
                "UPDATE TOUR ERROR:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Unable to update tour."
            );

        }

        finally {

            setSaving(false);

        }

    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div className="edit-tour-loading">

                <div className="edit-tour-loader"></div>

                <h3>
                    Loading Tour
                </h3>

                <p>
                    Preparing tour details for editing...
                </p>

            </div>

        );

    }


    // =====================================================
    // ERROR WITHOUT TOUR
    // =====================================================

    if (error && !formData.title) {

        return (

            <div className="edit-tour-error-page">

                <div>
                    ⚠️
                </div>

                <h2>
                    Unable to Load Tour
                </h2>

                <p>
                    {error}
                </p>

                <button
                    onClick={() =>
                        navigate(
                            "/company/dashboard"
                        )
                    }
                >
                    Back to Dashboard
                </button>

            </div>

        );

    }


    // =====================================================
    // PAGE
    // =====================================================

    return (

        <div className="edit-tour-page">

            {/* =================================================
                HEADER
            ================================================= */}

            <section className="edit-tour-header">

                <div>

                    <span className="edit-tour-eyebrow">
                        TRAVELMET BUSINESS
                    </span>

                    <h1>
                        Edit Tour
                    </h1>

                    <p>
                        Update your tour details and
                        keep your travel experience
                        information accurate.
                    </p>

                </div>

                <button
                    className="back-dashboard-btn"
                    onClick={() =>
                        navigate(
                            "/company/dashboard"
                        )
                    }
                >
                    ← Dashboard
                </button>

            </section>


            {/* =================================================
                FORM
            ================================================= */}

            <main className="edit-tour-container">

                <form
                    className="edit-tour-form"
                    onSubmit={handleSubmit}
                >

                    {/* =================================================
                        BASIC INFORMATION
                    ================================================= */}

                    <section className="edit-tour-card">

                        <div className="edit-tour-card-heading">

                            <span>
                                01
                            </span>

                            <div>

                                <small>
                                    TOUR INFORMATION
                                </small>

                                <h2>
                                    Basic Details
                                </h2>

                            </div>

                        </div>


                        <div className="edit-tour-form-grid">

                            <div className="edit-tour-field full">

                                <label>
                                    Tour Title *
                                </label>

                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="e.g. Mahabaleshwar Weekend Escape"
                                    maxLength="150"
                                />

                            </div>


                            <div className="edit-tour-field">

                                <label>
                                    Destination *
                                </label>

                                <input
                                    type="text"
                                    name="destination"
                                    value={
                                        formData.destination
                                    }
                                    onChange={handleChange}
                                    placeholder="e.g. Mahabaleshwar, Maharashtra"
                                    maxLength="150"
                                />

                            </div>


                            <div className="edit-tour-field">

                                <label>
                                    Tour Image URL
                                </label>

                                <input
                                    type="url"
                                    name="image"
                                    value={formData.image}
                                    onChange={handleChange}
                                    placeholder="https://..."
                                />

                            </div>


                            <div className="edit-tour-field full">

                                <label>
                                    Description *
                                </label>

                                <textarea
                                    name="description"
                                    value={
                                        formData.description
                                    }
                                    onChange={handleChange}
                                    placeholder="Describe this travel experience..."
                                    rows="6"
                                    maxLength="2000"
                                />

                                <small className="character-count">
                                    {formData.description.length}
                                    /2000
                                </small>

                            </div>

                        </div>

                    </section>


                    {/* =================================================
                        PRICE & CAPACITY
                    ================================================= */}

                    <section className="edit-tour-card">

                        <div className="edit-tour-card-heading">

                            <span>
                                02
                            </span>

                            <div>

                                <small>
                                    PRICING & CAPACITY
                                </small>

                                <h2>
                                    Tour Planning
                                </h2>

                            </div>

                        </div>


                        <div className="edit-tour-form-grid">

                            <div className="edit-tour-field">

                                <label>
                                    Price per Traveler (₹) *
                                </label>

                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    min="0"
                                    placeholder="5999"
                                />

                            </div>


                            <div className="edit-tour-field">

                                <label>
                                    Maximum Travelers *
                                </label>

                                <input
                                    type="number"
                                    name="maxTravelers"
                                    value={
                                        formData.maxTravelers
                                    }
                                    onChange={handleChange}
                                    min="1"
                                    placeholder="20"
                                />

                            </div>


                            <div className="edit-tour-field">

                                <label>
                                    Duration (Days) *
                                </label>

                                <input
                                    type="number"
                                    name="duration"
                                    value={formData.duration}
                                    onChange={handleChange}
                                    min="1"
                                    placeholder="3"
                                />

                            </div>

                        </div>

                    </section>


                    {/* =================================================
                        DATES
                    ================================================= */}

                    <section className="edit-tour-card">

                        <div className="edit-tour-card-heading">

                            <span>
                                03
                            </span>

                            <div>

                                <small>
                                    SCHEDULE
                                </small>

                                <h2>
                                    Tour Dates
                                </h2>

                            </div>

                        </div>


                        <div className="edit-tour-form-grid">

                            <div className="edit-tour-field">

                                <label>
                                    Start Date *
                                </label>

                                <input
                                    type="date"
                                    name="startDate"
                                    value={
                                        formData.startDate
                                    }
                                    onChange={handleChange}
                                />

                            </div>


                            <div className="edit-tour-field">

                                <label>
                                    End Date *
                                </label>

                                <input
                                    type="date"
                                    name="endDate"
                                    value={
                                        formData.endDate
                                    }
                                    onChange={handleChange}
                                />

                            </div>

                        </div>

                    </section>


                    {/* =================================================
                        STATUS
                    ================================================= */}

                    <section className="edit-tour-card">

                        <div className="edit-tour-card-heading">

                            <span>
                                04
                            </span>

                            <div>

                                <small>
                                    TOUR STATUS
                                </small>

                                <h2>
                                    Availability
                                </h2>

                            </div>

                        </div>


                        <div className="edit-tour-status-options">

                            <label
                                className={
                                    formData.status === "active"
                                        ? "status-option selected"
                                        : "status-option"
                                }
                            >

                                <input
                                    type="radio"
                                    name="status"
                                    value="active"
                                    checked={
                                        formData.status ===
                                        "active"
                                    }
                                    onChange={handleChange}
                                />

                                <span className="status-icon">
                                    ✓
                                </span>

                                <div>

                                    <strong>
                                        Active
                                    </strong>

                                    <small>
                                        Tour is available
                                        for travellers
                                    </small>

                                </div>

                            </label>


                            <label
                                className={
                                    formData.status === "cancelled"
                                        ? "status-option selected"
                                        : "status-option"
                                }
                            >

                                <input
                                    type="radio"
                                    name="status"
                                    value="cancelled"
                                    checked={
                                        formData.status ===
                                        "cancelled"
                                    }
                                    onChange={handleChange}
                                />

                                <span className="status-icon">
                                    !
                                </span>

                                <div>

                                    <strong>
                                        Cancelled
                                    </strong>

                                    <small>
                                        Hide this tour as
                                        unavailable
                                    </small>

                                </div>

                            </label>


                            <label
                                className={
                                    formData.status === "completed"
                                        ? "status-option selected"
                                        : "status-option"
                                }
                            >

                                <input
                                    type="radio"
                                    name="status"
                                    value="completed"
                                    checked={
                                        formData.status ===
                                        "completed"
                                    }
                                    onChange={handleChange}
                                />

                                <span className="status-icon">
                                    ✓
                                </span>

                                <div>

                                    <strong>
                                        Completed
                                    </strong>

                                    <small>
                                        Tour has already
                                        finished
                                    </small>

                                </div>

                            </label>

                        </div>

                    </section>


                    {/* =================================================
                        MESSAGES
                    ================================================= */}

                    {error && (

                        <div className="edit-tour-error">
                            ⚠️ {error}
                        </div>

                    )}


                    {success && (

                        <div className="edit-tour-success">
                            ✓ {success}
                        </div>

                    )}


                    {/* =================================================
                        ACTIONS
                    ================================================= */}

                    <div className="edit-tour-actions">

                        <button
                            type="button"
                            className="edit-tour-cancel"
                            onClick={() =>
                                navigate(
                                    "/company/dashboard"
                                )
                            }
                            disabled={saving}
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            className="edit-tour-save"
                            disabled={saving}
                        >

                            {saving
                                ? "Saving Changes..."
                                : "Save Changes →"}

                        </button>

                    </div>

                </form>

            </main>

        </div>

    );

}

export default EditTour;