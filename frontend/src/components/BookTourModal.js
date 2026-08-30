import { useEffect, useState } from "react";
import "../Css/BookTourModal.css";

// =====================================================
// BOOK TOUR MODAL
// =====================================================
//
// Collects the traveler's contact details and party size
// before a booking is submitted. Parent owns the actual
// API call (onConfirm) and any loading/error state tied
// to the network request; this component only owns the
// form fields and their client-side validation.
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

    const [formData, setFormData] = useState({
        contactName: defaultName || "",
        contactEmail: defaultEmail || "",
        contactPhone: "",
        numberOfTravelers: 1,
        specialRequests: ""
    });

    const [formError, setFormError] = useState("");

    // Close on Escape for a more native modal feel.
    useEffect(() => {

        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () =>
            window.removeEventListener("keydown", handleKeyDown);

    }, [onClose]);

    const maxSelectable =
        Math.max(1, Math.min(remainingTravelers || 1, 10));

    const travelerOptions =
        Array.from(
            { length: maxSelectable },
            (_, i) => i + 1
        );

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]:
                name === "numberOfTravelers"
                    ? Number(value)
                    : value
        }));

    };

    const handleSubmit = (e) => {

        e.preventDefault();
        setFormError("");

        if (!formData.contactName.trim()) {
            setFormError("Please enter your full name.");
            return;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(formData.contactEmail.trim())) {
            setFormError("Please enter a valid email address.");
            return;
        }

        if (formData.contactPhone.trim().length < 7) {
            setFormError("Please enter a valid phone number.");
            return;
        }

        onConfirm({
            contactName: formData.contactName.trim(),
            contactEmail: formData.contactEmail.trim(),
            contactPhone: formData.contactPhone.trim(),
            numberOfTravelers: formData.numberOfTravelers,
            specialRequests: formData.specialRequests.trim()
        });

    };

    return (
        <div
            className="book-tour-overlay"
            onClick={onClose}
        >

            <div
                className="book-tour-modal"
                onClick={(e) => e.stopPropagation()}
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
                        🎟️ Reserve your spot
                    </span>
                    <h2 id="book-tour-title">
                        {tour?.title || "Book this tour"}
                    </h2>
                    <p className="book-tour-header-sub">
                        {tour?.destination}
                        {tour?.destination && " • "}
                        {remainingTravelers} seat
                        {remainingTravelers === 1 ? "" : "s"} left
                    </p>
                </div>

                <form
                    className="book-tour-form"
                    onSubmit={handleSubmit}
                >

                    <div className="book-tour-field">
                        <label htmlFor="contactName">
                            Full Name *
                        </label>
                        <input
                            id="contactName"
                            type="text"
                            name="contactName"
                            value={formData.contactName}
                            onChange={handleChange}
                            placeholder="e.g. Rohan Deshmukh"
                            maxLength="100"
                            disabled={loading}
                        />
                    </div>

                    <div className="book-tour-field-row">

                        <div className="book-tour-field">
                            <label htmlFor="contactEmail">
                                Email *
                            </label>
                            <input
                                id="contactEmail"
                                type="email"
                                name="contactEmail"
                                value={formData.contactEmail}
                                onChange={handleChange}
                                placeholder="you@example.com"
                                maxLength="150"
                                disabled={loading}
                            />
                        </div>

                        <div className="book-tour-field">
                            <label htmlFor="contactPhone">
                                Phone Number *
                            </label>
                            <input
                                id="contactPhone"
                                type="tel"
                                name="contactPhone"
                                value={formData.contactPhone}
                                onChange={handleChange}
                                placeholder="+91 98765 43210"
                                maxLength="20"
                                disabled={loading}
                            />
                        </div>

                    </div>

                    <div className="book-tour-field">
                        <label htmlFor="numberOfTravelers">
                            Number of Travelers *
                        </label>
                        <select
                            id="numberOfTravelers"
                            name="numberOfTravelers"
                            value={formData.numberOfTravelers}
                            onChange={handleChange}
                            disabled={loading}
                        >
                            {travelerOptions.map((count) => (
                                <option key={count} value={count}>
                                    {count} {count === 1 ? "Person" : "People"}
                                </option>
                            ))}
                        </select>
                        <small>
                            Only {remainingTravelers} seat
                            {remainingTravelers === 1 ? "" : "s"} remaining on this tour.
                        </small>
                    </div>

                    <div className="book-tour-field">
                        <label htmlFor="specialRequests">
                            Special Requests (optional)
                        </label>
                        <textarea
                            id="specialRequests"
                            name="specialRequests"
                            value={formData.specialRequests}
                            onChange={handleChange}
                            placeholder="Dietary needs, accessibility, room preference..."
                            rows="3"
                            maxLength="500"
                            disabled={loading}
                        />
                    </div>

                    {(formError || errorMessage) && (
                        <div className="book-tour-error">
                            ⚠️ {formError || errorMessage}
                        </div>
                    )}

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
                            disabled={loading}
                        >
                            {loading ? "Booking..." : "Confirm Booking"}
                        </button>
                    </div>

                </form>

            </div>

        </div>
    );
}

export default BookTourModal;
