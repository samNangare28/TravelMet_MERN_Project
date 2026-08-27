import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../Css/AddTour.css";

function AddTour() {

    const navigate = useNavigate();

    const companyToken =
        localStorage.getItem("companyToken");

    const [formData, setFormData] = useState({
        title: "",
        destination: "",
        description: "",
        price: "",
        startDate: "",
        endDate: "",
        duration: "",
        maxTravelers: "",
        image: ""
    });

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");



    // =====================================================
    // HANDLE INPUT
    // =====================================================

    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));

    };



    // =====================================================
    // SUBMIT TOUR
    // =====================================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");


        // =================================================
        // LOGIN CHECK
        // =================================================

        if (!companyToken) {

            navigate("/login");

            return;

        }


        // =================================================
        // VALIDATION
        // =================================================

        if (
            !formData.title.trim() ||
            !formData.destination.trim() ||
            !formData.description.trim() ||
            !formData.price ||
            !formData.startDate ||
            !formData.endDate ||
            !formData.duration ||
            !formData.maxTravelers
        ) {

            setError(
                "Please fill all required fields."
            );

            return;

        }


        // =================================================
        // DATE VALIDATION
        // =================================================

        const start =
            new Date(formData.startDate);

        const end =
            new Date(formData.endDate);

        const today =
            new Date();

        today.setHours(
            0,
            0,
            0,
            0
        );


        if (end < start) {

            setError(
                "End date cannot be before start date."
            );

            return;

        }


        if (end < today) {

            setError(
                "Tour end date cannot be in the past."
            );

            return;

        }


        // =================================================
        // SUBMIT
        // =================================================

        try {

            setLoading(true);


            const response =
                await api.post(

                    "/api/tours",

                    {
                        title:
                            formData.title.trim(),

                        destination:
                            formData.destination.trim(),

                        description:
                            formData.description.trim(),

                        price:
                            Number(formData.price),

                        startDate:
                            formData.startDate,

                        endDate:
                            formData.endDate,

                        duration:
                            Number(formData.duration),

                        maxTravelers:
                            Number(formData.maxTravelers),

                        image:
                            formData.image.trim()
                    },

                    {
                        headers: {
                            Authorization:
                                `Bearer ${companyToken}`
                        }
                    }

                );


            // =================================================
            // SUCCESS
            // =================================================

            if (response.data.success) {

                alert(
                    "Tour added successfully ✅"
                );

                navigate(
                    "/company/dashboard"
                );

            }

        }

        catch (error) {

            console.error(
                "ADD TOUR ERROR:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Unable to add tour."
            );

        }

        finally {

            setLoading(false);

        }

    };



    // =====================================================
    // UI
    // =====================================================

    return (

        <div className="add-tour-page">


            {/* =================================================
                HEADER
            ================================================= */}

            <div className="add-tour-header">

                <button
                    type="button"
                    className="add-tour-back-btn"
                    onClick={() =>
                        navigate(
                            "/company/dashboard"
                        )
                    }
                >
                    ← Back to Dashboard
                </button>


                <span className="add-tour-eyebrow">
                    TRAVELMET • COMPANY
                </span>

                <h1>
                    Add New Tour
                </h1>

                <p>
                    Create a new travel experience
                    for TravelMet travellers.
                </p>

            </div>



            {/* =================================================
                FORM CARD
            ================================================= */}

            <form
                className="add-tour-form"
                onSubmit={handleSubmit}
            >


                {/* =================================================
                    ERROR
                ================================================= */}

                {error && (

                    <div className="add-tour-error">

                        ⚠️ {error}

                    </div>

                )}



                {/* =================================================
                    BASIC INFORMATION
                ================================================= */}

                <section className="add-tour-form-section">

                    <div className="add-tour-section-heading">

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


                    <div className="add-tour-field-grid">


                        {/* TITLE */}

                        <div className="add-tour-field full">

                            <label>
                                Tour Title *
                            </label>

                            <input
                                type="text"
                                name="title"
                                value={
                                    formData.title
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="e.g. Mahabaleshwar Weekend Escape"
                                maxLength="150"
                                disabled={loading}
                            />

                        </div>


                        {/* DESTINATION */}

                        <div className="add-tour-field">

                            <label>
                                Destination *
                            </label>

                            <input
                                type="text"
                                name="destination"
                                value={
                                    formData.destination
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="e.g. Mahabaleshwar, Maharashtra"
                                maxLength="150"
                                disabled={loading}
                            />

                        </div>


                        {/* IMAGE */}

                        <div className="add-tour-field">

                            <label>
                                Tour Image URL
                            </label>

                            <input
                                type="url"
                                name="image"
                                value={
                                    formData.image
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="https://..."
                                disabled={loading}
                            />

                        </div>


                        {/* DESCRIPTION */}

                        <div className="add-tour-field full">

                            <label>
                                Description *
                            </label>

                            <textarea
                                name="description"
                                value={
                                    formData.description
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Describe the tour, highlights and experience..."
                                maxLength="2000"
                                rows="5"
                                disabled={loading}
                            />

                            <small className="add-tour-character-count">
                                {formData.description.length}
                                / 2000
                            </small>

                        </div>

                    </div>

                </section>



                {/* =================================================
                    PRICE
                ================================================= */}

                <section className="add-tour-form-section">

                    <div className="add-tour-section-heading">

                        <span>
                            02
                        </span>

                        <div>

                            <small>
                                PRICING
                            </small>

                            <h2>
                                Tour Price
                            </h2>

                        </div>

                    </div>


                    <div className="add-tour-field-grid">


                        <div className="add-tour-field">

                            <label>
                                Price per Traveller *
                            </label>

                            <div className="input-with-prefix">

                                <span>
                                    ₹
                                </span>

                                <input
                                    type="number"
                                    name="price"
                                    value={
                                        formData.price
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="5999"
                                    min="0"
                                    disabled={loading}
                                />

                            </div>

                        </div>


                        <div className="add-tour-field">

                            <label>
                                Maximum Travellers *
                            </label>

                            <input
                                type="number"
                                name="maxTravelers"
                                value={
                                    formData.maxTravelers
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="20"
                                min="1"
                                disabled={loading}
                            />

                        </div>

                    </div>

                </section>



                {/* =================================================
                    DATES
                ================================================= */}

                <section className="add-tour-form-section">

                    <div className="add-tour-section-heading">

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


                    <div className="add-tour-field-grid">


                        {/* START */}

                        <div className="add-tour-field">

                            <label>
                                Start Date *
                            </label>

                            <input
                                type="date"
                                name="startDate"
                                value={
                                    formData.startDate
                                }
                                onChange={
                                    handleChange
                                }
                                min={
                                    new Date()
                                        .toISOString()
                                        .split("T")[0]
                                }
                                disabled={loading}
                            />

                        </div>


                        {/* END */}

                        <div className="add-tour-field">

                            <label>
                                End Date *
                            </label>

                            <input
                                type="date"
                                name="endDate"
                                value={
                                    formData.endDate
                                }
                                onChange={
                                    handleChange
                                }
                                min={
                                    formData.startDate ||
                                    new Date()
                                        .toISOString()
                                        .split("T")[0]
                                }
                                disabled={loading}
                            />

                        </div>


                        {/* DURATION */}

                        <div className="add-tour-field">

                            <label>
                                Duration *
                            </label>

                            <div className="input-with-suffix">

                                <input
                                    type="number"
                                    name="duration"
                                    value={
                                        formData.duration
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="3"
                                    min="1"
                                    disabled={loading}
                                />

                                <span>
                                    Days
                                </span>

                            </div>

                        </div>

                    </div>

                </section>



                {/* =================================================
                    ACTIONS
                ================================================= */}

                <div className="add-tour-form-actions">

                    <button
                        type="button"
                        className="add-tour-cancel-btn"
                        onClick={() =>
                            navigate(
                                "/company/dashboard"
                            )
                        }
                        disabled={loading}
                    >
                        Cancel
                    </button>


                    <button
                        type="submit"
                        className="add-tour-submit-btn"
                        disabled={loading}
                    >

                        {loading
                            ? "Publishing Tour..."
                            : "Publish Tour →"
                        }

                    </button>

                </div>


            </form>

        </div>

    );

}

export default AddTour;