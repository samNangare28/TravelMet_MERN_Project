import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../Css/CompanyProfile.css";

function CompanyProfile() {

    const navigate = useNavigate();

    // ==========================================
    // LOCAL COMPANY DATA
    // ==========================================

    const storedCompany =
        JSON.parse(
            localStorage.getItem("company") || "{}"
        );

    const companyToken =
        localStorage.getItem("companyToken");


    // ==========================================
    // STATES
    // ==========================================

    const [company, setCompany] =
        useState(storedCompany);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    // ==========================================
    // FETCH COMPANY PROFILE
    // ==========================================

    useEffect(() => {

        const fetchCompanyProfile = async () => {

            try {

                setLoading(true);
                setError("");


                /*
                 * If you already have a company profile
                 * endpoint, this request will fetch the
                 * latest company information.
                 *
                 * Example:
                 * GET /api/company-auth/profile
                 */

                const response =
                    await api.get(
                        "/api/company-auth/profile",
                        {
                            headers: {
                                Authorization:
                                    `Bearer ${companyToken}`
                            }
                        }
                    );


                if (response.data.company) {

                    const updatedCompany =
                        response.data.company;


                    setCompany(
                        updatedCompany
                    );


                    localStorage.setItem(
                        "company",
                        JSON.stringify(
                            updatedCompany
                        )
                    );

                }

            }

            catch (error) {

                console.log(
                    "COMPANY PROFILE ERROR:",
                    error
                );


                /*
                 * If profile endpoint does not exist
                 * yet, don't destroy the saved login data.
                 *
                 * We can still display the company
                 * information received during login.
                 */

                if (
                    error.response?.status !== 404
                ) {

                    setError(
                        error.response?.data?.message ||
                        "Unable to load latest company details."
                    );

                }

            }

            finally {

                setLoading(false);

            }

        };


        if (!companyToken) {

            navigate(
                "/login",
                { replace: true }
            );

            return;

        }


        fetchCompanyProfile();

    }, [companyToken, navigate]);


    // ==========================================
    // LOGOUT
    // ==========================================

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


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (

            <div className="company-profile-loading">

                <div className="company-loader"></div>

                <p>
                    Loading company profile...
                </p>

            </div>

        );

    }


    // ==========================================
    // VERIFICATION STATUS
    // ==========================================

    const verificationStatus =
        company.verificationStatus ||
        "pending";


    const statusClass =
        verificationStatus.toLowerCase();


    const statusText =
        verificationStatus === "verified"
            ? "Verified"
            : verificationStatus === "rejected"
                ? "Rejected"
                : "Pending Verification";


    // ==========================================
    // PROFILE
    // ==========================================

    return (

        <div className="company-profile-page">


            {/* =====================================
                COVER
            ===================================== */}

            <section className="company-cover">

                <img
                    src={
                        company.coverImage ||
                        "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?w=1600"
                    }
                    alt="Company cover"
                    className="company-cover-image"
                />


                <div className="company-cover-overlay"></div>


                <div className="company-cover-content">

                    <span className="company-panel-label">
                        TRAVEL COMPANY
                    </span>

                    <h1>
                        {company.companyName ||
                            "Travel Company"}
                    </h1>

                    <p>
                        Professional travel services
                        on TravelMet
                    </p>

                </div>

            </section>


            {/* =====================================
                MAIN CONTENT
            ===================================== */}

            <main className="company-profile-container">


                {/* =================================
                    PROFILE HEADER
                ================================= */}

                <section className="company-profile-header">


                    <div className="company-logo-wrapper">

                        {company.logo ? (

                            <img
                                src={company.logo}
                                alt={
                                    company.companyName
                                }
                                className="company-logo-image"
                            />

                        ) : (

                            <div className="company-logo-placeholder">
                                🏢
                            </div>

                        )}

                    </div>


                    <div className="company-header-info">

                        <div className="company-title-row">

                            <div>

                                <h2>
                                    {company.companyName ||
                                        "Travel Company"}
                                </h2>

                                <p className="company-owner">

                                    Owned by{" "}

                                    <strong>
                                        {company.ownerName ||
                                            "Company Owner"}
                                    </strong>

                                </p>

                            </div>


                            <span
                                className={`verification-badge ${statusClass}`}
                            >

                                {verificationStatus ===
                                    "verified"
                                    ? "✓"
                                    : verificationStatus ===
                                        "rejected"
                                        ? "!"
                                        : "⏳"}

                                {" "}

                                {statusText}

                            </span>

                        </div>


                        <div className="company-header-actions">

                            <button
                                className="company-edit-btn"
                                onClick={() =>
                                    navigate(
                                        "/company/edit-profile"
                                    )
                                }
                            >
                                ✏️ Edit Profile
                            </button>


                            <button
                                className="company-logout-btn"
                                onClick={
                                    handleLogout
                                }
                            >
                                Logout
                            </button>

                        </div>

                    </div>

                </section>


                {/* =================================
                    ERROR
                ================================= */}

                {error && (

                    <div className="company-profile-warning">

                        ⚠️ {error}

                    </div>

                )}


                {/* =================================
                    VERIFICATION NOTICE
                ================================= */}

                <section
                    className={`verification-notice ${statusClass}`}
                >

                    <div className="verification-notice-icon">

                        {verificationStatus ===
                            "verified"
                            ? "✓"
                            : verificationStatus ===
                                "rejected"
                                ? "!"
                                : "⏳"}

                    </div>


                    <div>

                        <h3>
                            {verificationStatus ===
                                "verified"
                                ? "Company Verified"
                                : verificationStatus ===
                                    "rejected"
                                    ? "Verification Rejected"
                                    : "Verification Pending"}
                        </h3>


                        <p>

                            {verificationStatus ===
                                "verified"

                                ? "Your company has been verified by the TravelMet administration team."

                                : verificationStatus ===
                                    "rejected"

                                    ? (
                                        company.rejectionReason ||
                                        "Your company verification was rejected."
                                    )

                                    : "Your company application has been submitted and is waiting for verification by the TravelMet administration team."

                            }

                        </p>

                    </div>

                </section>


                {/* =================================
                    CONTENT GRID
                ================================= */}

                <div className="company-content-grid">


                    {/* =================================
                        ABOUT
                    ================================= */}

                    <section className="company-card about-company-card">

                        <div className="company-card-heading">

                            <div className="card-heading-icon">
                                🏢
                            </div>

                            <div>

                                <span>
                                    COMPANY
                                </span>

                                <h3>
                                    About Company
                                </h3>

                            </div>

                        </div>


                        <p className="company-description">

                            {company.description ||
                                "No company description has been added yet."}

                        </p>

                    </section>


                    {/* =================================
                        CONTACT DETAILS
                    ================================= */}

                    <section className="company-card">

                        <div className="company-card-heading">

                            <div className="card-heading-icon">
                                📞
                            </div>

                            <div>

                                <span>
                                    CONTACT
                                </span>

                                <h3>
                                    Contact Details
                                </h3>

                            </div>

                        </div>


                        <div className="company-details-list">


                            <div className="company-detail-item">

                                <span className="detail-icon">
                                    ✉️
                                </span>

                                <div>

                                    <small>
                                        Email
                                    </small>

                                    <p>
                                        {company.email ||
                                            "Not available"}
                                    </p>

                                </div>

                            </div>


                            <div className="company-detail-item">

                                <span className="detail-icon">
                                    📞
                                </span>

                                <div>

                                    <small>
                                        Phone
                                    </small>

                                    <p>
                                        {company.phone ||
                                            "Not available"}
                                    </p>

                                </div>

                            </div>


                            <div className="company-detail-item">

                                <span className="detail-icon">
                                    📍
                                </span>

                                <div>

                                    <small>
                                        Address
                                    </small>

                                    <p>
                                        {company.address ||
                                            "Not available"}
                                    </p>

                                </div>

                            </div>

                        </div>

                    </section>


                    {/* =================================
                        WEBSITE
                    ================================= */}

                    <section className="company-card">

                        <div className="company-card-heading">

                            <div className="card-heading-icon">
                                🌐
                            </div>

                            <div>

                                <span>
                                    ONLINE PRESENCE
                                </span>

                                <h3>
                                    Company Website
                                </h3>

                            </div>

                        </div>


                        {company.website ? (

                            <a
                                href={
                                    company.website
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="company-website-link"
                            >

                                <span>
                                    🌐
                                </span>

                                <div>

                                    <strong>
                                        Visit Website
                                    </strong>

                                    <small>
                                        {company.website}
                                    </small>

                                </div>

                                <span className="external-icon">
                                    ↗
                                </span>

                            </a>

                        ) : (

                            <div className="company-empty-detail">

                                No website added.

                            </div>

                        )}

                    </section>


                    {/* =================================
                        CERTIFICATE
                    ================================= */}

                    <section className="company-card">

                        <div className="company-card-heading">

                            <div className="card-heading-icon">
                                📄
                            </div>

                            <div>

                                <span>
                                    VERIFICATION
                                </span>

                                <h3>
                                    Certificate
                                </h3>

                            </div>

                        </div>


                        {company.certificate ? (

                            <a
                                href={
                                    company.certificate
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="certificate-link"
                            >

                                <div className="certificate-file-icon">
                                    📄
                                </div>

                                <div>

                                    <strong>
                                        Verification Certificate
                                    </strong>

                                    <small>
                                        View submitted document
                                    </small>

                                </div>

                                <span>
                                    ↗
                                </span>

                            </a>

                        ) : (

                            <div className="company-empty-detail">

                                No certificate uploaded.

                            </div>

                        )}

                    </section>

                </div>


                {/* =================================
                    COMPANY FOOTER
                ================================= */}

                <section className="company-profile-footer">

                    <div>

                        <span>
                            TRAVELMET
                        </span>

                        <p>
                            Your trusted travel community
                            and planning platform.
                        </p>

                    </div>


                    <div className="company-footer-status">

                        <span>
                            Account Status
                        </span>

                        <strong>
                            {statusText}
                        </strong>

                    </div>

                </section>

            </main>

        </div>

    );

}

export default CompanyProfile;
