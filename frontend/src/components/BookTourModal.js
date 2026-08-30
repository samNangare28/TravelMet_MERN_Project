import { useEffect, useState } from "react";

import "../Css/BookTourModal.css";

// =====================================================
// BOOK TOUR MODAL
// =====================================================
//
// Collects traveler contact details and number of
// travelers before submitting a tour booking.
//
// Parent component handles:
// - API request
// - loading state
// - booking success
// - backend errors
//
// This component handles:
// - Form fields
// - Validation
// - Seat selection
// - Escape / overlay close
//
// =====================================================

function BookTourModal({
    tour,
    remainingTravelers,
    defaultName,
    defaultEmail,
    loading,
    errorMessage,
    onConfirm,
    onClose
}) {

    // =====================================================
    // FORM STATE
    // =====================================================

    const [formData, setFormData] = useState({
        contactName: defaultName || "",
        contactEmail: defaultEmail || "",
        contactPhone: "",
        numberOfTravelers: 1,
        specialRequests: ""
    });

    const [formError, setFormError] = useState("");


    // =====================================================
    // UPDATE DEFAULT USER DETAILS
    // =====================================================
    //
    // Useful if defaultName/defaultEmail are loaded
    // asynchronously by the parent.
    //
    // =====================================================

    useEffect(() => {

        setFormData((previous) => ({
            ...previous,

            contactName:
                defaultName || previous.contactName,

            contactEmail:
                defaultEmail || previous.contactEmail
        }));

    }, [defaultName, defaultEmail]);


    // =====================================================
    // CLOSE MODAL WITH ESCAPE
    // =====================================================

    useEffect(() => {

        const handleKeyDown = (event) => {

            if (
                event.key === "Escape" &&
                !loading
            ) {

                onClose();

            }

        };


        window.addEventListener(
            "keydown",
            handleKeyDown
        );


        return () => {

            window.removeEventListener(
                "keydown",
                handleKeyDown
            );

        };

    }, [onClose, loading]);


    // =====================================================
    // PREVENT BACKGROUND SCROLL
    // =====================================================

    useEffect(() => {

        const previousOverflow =
            document.body.style.overflow;

        document.body.style.overflow = "hidden";


        return () => {

            document.body.style.overflow =
                previousOverflow;

        };

    }, []);


    // =====================================================
    // AVAILABLE SEATS
    // =====================================================

    const availableSeats =
        Number.isFinite(Number(remainingTravelers))
            ? Math.max(
                Number(remainingTravelers),
                0
            )
            : 0;


    // Maximum selectable travelers:
    // - Cannot exceed available seats
    // - Cannot exceed 10 people per booking
    //
    const maxSelectable =
        Math.min(
            availableSeats,
            10
        );


    const travelerOptions =
        maxSelectable > 0
            ? Array.from(
                {
                    length:
                        maxSelectable
                },
                (_, index) =>
                    index + 1
            )
            : [];


    // =====================================================
    // HANDLE INPUT CHANGE
    // =====================================================

    const handleChange = (event) => {

        const {
            name,
            value
        } = event.target;


        if (
            name === "numberOfTravelers"
        ) {

            const travelers =
                Number(value);


            // Never allow more than
            // currently available seats.

            const safeTravelers =
                Math.max(
                    1,
                    Math.min(
                        travelers,
                        maxSelectable || 1
                    )
                );


            setFormData(
                (previous) => ({
                    ...previous,

                    numberOfTravelers:
                        safeTravelers
                })
            );


            return;

        }


        setFormData(
            (previous) => ({
                ...previous,

                [name]: value
            })
        );

    };


    // =====================================================
    // VALIDATE FORM
    // =====================================================

    const validateForm = () => {

        const name =
            formData.contactName.trim();

        const email =
            formData.contactEmail
                .trim()
                .toLowerCase();

        const phone =
            formData.contactPhone.trim();

        const travelers =
            Number(
                formData.numberOfTravelers
            );


        // -------------------------------------------------
        // NAME
        // -------------------------------------------------

        if (!name) {

            return "Please enter your full name.";

        }


        if (name.length < 2) {

            return "Please enter a valid full name.";

        }


        // -------------------------------------------------
        // EMAIL
        // -------------------------------------------------

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        if (
            !emailPattern.test(email)
        ) {

            return "Please enter a valid email address.";

        }


        // -------------------------------------------------
        // PHONE
        // -------------------------------------------------

        const phoneDigits =
            phone.replace(
                /\D/g,
                ""
            );


        if (
            phoneDigits.length < 7
        ) {

            return "Please enter a valid phone number.";

        }


        if (
            phoneDigits.length > 15
        ) {

            return "Please enter a valid phone number.";

        }


        // -------------------------------------------------
        // TRAVELERS
        // -------------------------------------------------

        if (
            !Number.isInteger(
                travelers
            ) ||
            travelers < 1
        ) {

            return "Number of travelers must be at least 1.";

        }


        if (
            travelers >
            availableSeats
        ) {

            return availableSeats === 0
                ? "This tour is fully booked."
                : `Only ${availableSeats} seat${availableSeats === 1 ? "" : "s"} remaining.`;

        }


        if (
            travelers > 10
        ) {

            return "You can book a maximum of 10 travelers at a time.";

        }


        // -------------------------------------------------
        // SPECIAL REQUEST
        // -------------------------------------------------

        if (
            formData.specialRequests.length >
            500
        ) {

            return "Special requests cannot exceed 500 characters.";

        }


        return "";

    };


    // =====================================================
    // SUBMIT FORM
    // =====================================================

    const handleSubmit = (event) => {

        event.preventDefault();


        if (loading) {

            return;

        }


        setFormError("");


        const validationError =
            validateForm();


        if (validationError) {

            setFormError(
                validationError
            );

            return;

        }


        // -------------------------------------------------
        // FINAL DATA SENT TO PARENT
        // -------------------------------------------------

        onConfirm({

            contactName:
                formData.contactName
                    .trim(),

            contactEmail:
                formData.contactEmail
                    .trim()
                    .toLowerCase(),

            contactPhone:
                formData.contactPhone
                    .trim(),

            numberOfTravelers:
                Number(
                    formData.numberOfTravelers
                ),

            specialRequests:
                formData.specialRequests
                    .trim()

        });

    };


    // =====================================================
    // OVERLAY CLICK
    // =====================================================

    const handleOverlayClick = () => {

        if (!loading) {

            onClose();

        }

    };


    // =====================================================
    // IF NO SEATS AVAILABLE
    // =====================================================

    if (
        availableSeats <= 0
    ) {

        return (

            <div
                className="book-tour-overlay"
                onClick={handleOverlayClick}
            >

                <div
                    className="book-tour-modal"
                    onClick={(event) =>
                        event.stopPropagation()
                    }
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="book-tour-title"
                >

                    <button
                        type="button"
                        className="book-tour-close-btn"
                        onClick={onClose}
                        aria-label="Close booking form"
                    >
                        ✕
                    </button>


                    <div className="book-tour-header">

                        <span className="book-tour-header-badge">
                            🎟️ Tour Availability
                        </span>

                        <h2 id="book-tour-title">
                            {tour?.title ||
                                "Book this tour"}
                        </h2>

                        <p className="book-tour-header-sub">

                            {tour?.destination}

                        </p>

                    </div>


                    <div
                        className="book-tour-error"
                        style={{
                            margin:
                                "20px"
                        }}
                    >
                        ⚠️ This tour is currently fully booked.
                    </div>


                    <div className="book-tour-actions">

                        <button
                            type="button"
                            className="book-tour-cancel-btn"
                            onClick={onClose}
                        >
                            Close
                        </button>

                    </div>

                </div>

            </div>

        );

    }


    // =====================================================
    // MAIN MODAL
    // =====================================================

    return (

        <div
            className="book-tour-overlay"
            onClick={handleOverlayClick}
        >

            <div
                className="book-tour-modal"
                onClick={(event) =>
                    event.stopPropagation()
                }
                role="dialog"
                aria-modal="true"
                aria-labelledby="book-tour-title"
            >


                {/* =================================================
                    CLOSE BUTTON
                ================================================= */}

                <button
                    type="button"
                    className="book-tour-close-btn"
                    onClick={onClose}
                    disabled={loading}
                    aria-label="Close booking form"
                >
                    ✕
                </button>


                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="book-tour-header">

                    <span className="book-tour-header-badge">
                        🎟️ Reserve your spot
                    </span>

                    <h2 id="book-tour-title">

                        {tour?.title ||
                            "Book this tour"}

                    </h2>

                    <p className="book-tour-header-sub">

                        {tour?.destination}

                        {tour?.destination &&
                            " • "}

                        {availableSeats} seat
                        {availableSeats === 1
                            ? ""
                            : "s"} left

                    </p>

                </div>


                {/* =================================================
                    FORM
                ================================================= */}

                <form
                    className="book-tour-form"
                    onSubmit={handleSubmit}
                    noValidate
                >


                    {/* =================================================
                        FULL NAME
                    ================================================= */}

                    <div className="book-tour-field">

                        <label htmlFor="contactName">
                            Full Name *
                        </label>

                        <input
                            id="contactName"
                            type="text"
                            name="contactName"
                            value={
                                formData.contactName
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="e.g. Rohan Deshmukh"
                            maxLength={100}
                            disabled={loading}
                            autoComplete="name"
                        />

                    </div>


                    {/* =================================================
                        EMAIL + PHONE
                    ================================================= */}

                    <div className="book-tour-field-row">


                        {/* EMAIL */}

                        <div className="book-tour-field">

                            <label htmlFor="contactEmail">
                                Email *
                            </label>

                            <input
                                id="contactEmail"
                                type="email"
                                name="contactEmail"
                                value={
                                    formData.contactEmail
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="you@example.com"
                                maxLength={150}
                                disabled={loading}
                                autoComplete="email"
                            />

                        </div>


                        {/* PHONE */}

                        <div className="book-tour-field">

                            <label htmlFor="contactPhone">
                                Phone Number *
                            </label>

                            <input
                                id="contactPhone"
                                type="tel"
                                name="contactPhone"
                                value={
                                    formData.contactPhone
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="+91 98765 43210"
                                maxLength={20}
                                disabled={loading}
                                autoComplete="tel"
                            />

                        </div>

                    </div>


                    {/* =================================================
                        NUMBER OF TRAVELERS
                    ================================================= */}

                    <div className="book-tour-field">

                        <label htmlFor="numberOfTravelers">
                            Number of Travelers *
                        </label>

                        <select
                            id="numberOfTravelers"
                            name="numberOfTravelers"
                            value={
                                formData.numberOfTravelers
                            }
                            onChange={
                                handleChange
                            }
                            disabled={loading}
                        >

                            {travelerOptions.map(
                                (count) => (

                                    <option
                                        key={count}
                                        value={count}
                                    >

                                        {count}{" "}

                                        {count === 1
                                            ? "Person"
                                            : "People"}

                                    </option>

                                )
                            )}

                        </select>


                        <small>

                            {availableSeats} seat
                            {availableSeats === 1
                                ? ""
                                : "s"} remaining
                            on this tour.

                        </small>

                    </div>


                    {/* =================================================
                        SPECIAL REQUESTS
                    ================================================= */}

                    <div className="book-tour-field">

                        <label htmlFor="specialRequests">
                            Special Requests (optional)
                        </label>

                        <textarea
                            id="specialRequests"
                            name="specialRequests"
                            value={
                                formData.specialRequests
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="Dietary needs, accessibility, room preference..."
                            rows={3}
                            maxLength={500}
                            disabled={loading}
                        />

                        <small>

                            {formData.specialRequests.length}
                            /500 characters

                        </small>

                    </div>


                    {/* =================================================
                        ERROR
                    ================================================= */}

                    {(formError ||
                        errorMessage) && (

                        <div
                            className="book-tour-error"
                            role="alert"
                        >

                            ⚠️{" "}

                            {formError ||
                                errorMessage}

                        </div>

                    )}


                    {/* =================================================
                        ACTION BUTTONS
                    ================================================= */}

                    <div className="book-tour-actions">


                        <button
                            type="button"
                            className="book-tour-cancel-btn"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            className="book-tour-submit-btn"
                            disabled={
                                loading ||
                                availableSeats <= 0
                            }
                        >

                            {loading
                                ? "Booking..."
                                : "Confirm Booking"}

                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

}

export default BookTourModal;
