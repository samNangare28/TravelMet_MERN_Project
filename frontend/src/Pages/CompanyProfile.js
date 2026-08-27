import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../Css/CompanyProfile.css";

function CompanyProfile() {

    const navigate = useNavigate();

    const [company, setCompany] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const companyToken =
        localStorage.getItem("companyToken");

    useEffect(() => {

        const fetchCompanyProfile = async () => {

            try {

                if (!companyToken) {

                    navigate("/login");

                    return;
                }

                /*
                 * Company login response मध्ये company data
                 * localStorage मध्ये save केलेलं असेल.
                 */

                const storedCompany =
                    JSON.parse(
                        localStorage.getItem("company") || "null"
                    );

                if (storedCompany) {

                    setCompany(storedCompany);

                }

                /*
                 * जर तुझ्याकडे backend मध्ये company profile
                 * GET API असेल तर इथे API call करू शकतेस.
                 *
                 * Example:
                 *
                 * const response = await api.get(
                 *     "/api/company/profile",
                 *     {
                 *         headers: {
                 *             Authorization:
                 *                 `Bearer ${companyToken}`
                 *         }
                 *     }
                 * );
                 *
                 * setCompany(response.data.company);
                 */

            }

            catch (error) {

                console.error(
                    "COMPANY PROFILE ERROR:",
                    error
                );

                setError(
                    "Unable to load company profile"
                );

            }

            finally {

                setLoading(false);

            }

        };

        fetchCompanyProfile();

    }, [companyToken, navigate]);


    const handleLogout = () => {

        localStorage.removeItem("companyToken");
        localStorage.removeItem("company");

        navigate("/login");

    };


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


    if (error) {

        return (

            <div className="company-profile-error">

                <h2>
                    Something went wrong
                </h2>

                <p>
                    {error}
                </p>

                <button
                    onClick={() => navigate("/login")}
                >
                    Back to Login
                </button>

            </div>

        );

    }


    if (!company) {

        return (

            <div className="company-profile-error">

                <h2>
                    Company profile not found
                </h2>

                <button
                    onClick={() => navigate("/login")}
                >
                    Login Again
                </button>

            </div>

        );

    }


    return (

        <div className="company-profile-page">

            {/* ==========================================
                COVER
            ========================================== */}

            <section className="company-cover">

                <img
                    src={
                        company.coverImage ||
                        "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1600"
                    }
                    alt="Company Cover"
                />

                <div className="company-cover-overlay"></div>

            </section>


            {/* ==========================================
                MAIN PROFILE
            ========================================== */}

            <main className="company-profile-container">

                {/* ======================================
                    PROFILE HEADER
                ====================================== */}

                <section className="company-profile-header">

                    <div className="company-logo-wrapper">

                        {company.logo ? (

                            <img
                                src={company.logo}
                                alt={company.companyName}
                                className="company-profile-logo"
                            />

                        ) : (

                            <div className="company-logo-placeholder">
                                🏢
                            </div>

                        )}

                    </div>


                    <div className="company-title-area">

                        <div className="company-name-row">

                            <h1>
                                {company.companyName}
                            </h1>


                            {company.verificationStatus ===
                                "verified" && (

                                <span className="verified-badge">
                                    ✓ Verified
                                </span>

                            )}


                            {company.verificationStatus ===
                                "pending" && (

                                <span className="pending-badge">
                                    ⏳ Pending
                                </span>

                            )}


                            {company.verificationStatus ===
                                "rejected" && (

                                <span className="rejected-badge">
                                    ✕ Rejected
                                </span>

                            )}

                        </div>


                        <p className="company-owner">

                            Managed by{" "}

                            <strong>
                                {company.ownerName}
                            </strong>

                        </p>


                        <p className="company-location">

                            📍 {company.address}

                        </p>

                    </div>


                    <div className="company-header-actions">

                        <button
                            className="company-dashboard-btn"
                            onClick={() =>
                                navigate(
                                    "/company/dashboard"
                                )
                            }
                        >
                            Dashboard
                        </button>


                        <button
                            className="company-logout-btn"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>

                    </div>

                </section>


                {/* ======================================
                    CONTENT GRID
                ====================================== */}

                <section className="company-content-grid">


                    {/* ==================================
                        LEFT
                    ================================== */}

                    <div className="company-main-content">


                        {/* ABOUT */}

                        <div className="company-card">

                            <div className="company-card-heading">

                                <span className="heading-icon">
                                    🏢
                                </span>

                                <div>

                                    <span className="small-heading">
                                        COMPANY
                                    </span>

                                    <h2>
                                        About Us
                                    </h2>

                                </div>

                            </div>


                            <p className="company-description">

                                {company.description ||
                                    "This company has not added a description yet."}

                            </p>

                        </div>


                        {/* CONTACT */}

                        <div className="company-card">

                            <div className="company-card-heading">

                                <span className="heading-icon">
                                    📞
                                </span>

                                <div>

                                    <span className="small-heading">
                                        INFORMATION
                                    </span>

                                    <h2>
                                        Contact Details
                                    </h2>

                                </div>

                            </div>


                            <div className="company-contact-grid">


                                <div className="contact-item">

                                    <span>
                                        ✉️
                                    </span>

                                    <div>

                                        <small>
                                            Email
                                        </small>

                                        <strong>
                                            {company.email}
                                        </strong>

                                    </div>

                                </div>


                                <div className="contact-item">

                                    <span>
                                        📱
                                    </span>

                                    <div>

                                        <small>
                                            Phone
                                        </small>

                                        <strong>
                                            {company.phone ||
                                                "Not provided"}
                                        </strong>

                                    </div>

                                </div>


                                <div className="contact-item">

                                    <span>
                                        📍
                                    </span>

                                    <div>

                                        <small>
                                            Address
                                        </small>

                                        <strong>
                                            {company.address ||
                                                "Not provided"}
                                        </strong>

                                    </div>

                                </div>


                                <div className="contact-item">

                                    <span>
                                        🌐
                                    </span>

                                    <div>

                                        <small>
                                            Website
                                        </small>

                                        {company.website ? (

                                            <a
                                                href={
                                                    company.website
                                                }
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                Visit Website
                                            </a>

                                        ) : (

                                            <strong>
                                                Not provided
                                            </strong>

                                        )}

                                    </div>

                                </div>

                            </div>

                        </div>


                        {/* CERTIFICATE */}

                        <div className="company-card certificate-card">

                            <div className="company-card-heading">

                                <span className="heading-icon">
                                    📄
                                </span>

                                <div>

                                    <span className="small-heading">
                                        VERIFICATION
                                    </span>

                                    <h2>
                                        Company Certificate
                                    </h2>

                                </div>

                            </div>


                            <div className="certificate-content">

                                <div className="certificate-info">

                                    <div className="certificate-file-icon">
                                        PDF
                                    </div>

                                    <div>

                                        <strong>
                                            Verification Certificate
                                        </strong>

                                        <p>
                                            Official document submitted
                                            for company verification.
                                        </p>

                                    </div>

                                </div>


                                {company.certificate ? (

                                    <a
                                        href={
                                            company.certificate
                                        }
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="certificate-btn"
                                    >
                                        View Certificate
                                    </a>

                                ) : (

                                    <span className="no-certificate">
                                        No certificate
                                    </span>

                                )}

                            </div>

                        </div>

                    </div>


                    {/* ==================================
                        RIGHT SIDEBAR
                    ================================== */}

                    <aside className="company-sidebar">


                        {/* STATUS */}

                        <div className="status-card">

                            <span className="small-heading">
                                ACCOUNT STATUS
                            </span>


                            <div className="status-icon">

                                {company.verificationStatus ===
                                    "verified"
                                    ? "✓"
                                    : company.verificationStatus ===
                                        "pending"
                                        ? "⏳"
                                        : "✕"}

                            </div>


                            <h3>

                                {company.verificationStatus ===
                                    "verified"
                                    ? "Verified Company"
                                    : company.verificationStatus ===
                                        "pending"
                                        ? "Verification Pending"
                                        : "Verification Rejected"}

                            </h3>


                            <p>

                                {company.verificationStatus ===
                                    "verified"
                                    ? "Your company has been successfully verified by TravelMet."
                                    : company.verificationStatus ===
                                        "pending"
                                        ? "Your application is currently under review by the TravelMet administration team."
                                        : "Your company verification was rejected. Please review the submitted information."}

                            </p>

                        </div>


                        {/* COMPANY DETAILS */}

                        <div className="company-sidebar-card">

                            <span className="small-heading">
                                COMPANY DETAILS
                            </span>


                            <div className="sidebar-detail">

                                <span>
                                    Company ID
                                </span>

                                <strong>
                                    {company.id ||
                                        company._id ||
                                        "N/A"}
                                </strong>

                            </div>


                            <div className="sidebar-detail">

                                <span>
                                    Owner
                                </span>

                                <strong>
                                    {company.ownerName}
                                </strong>

                            </div>


                            <div className="sidebar-detail">

                                <span>
                                    Status
                                </span>

                                <strong className={
                                    `status-text ${company.verificationStatus}`
                                }>

                                    {company.verificationStatus}

                                </strong>

                            </div>

                        </div>


                        {/* QUICK ACTIONS */}

                        <div className="company-sidebar-card">

                            <span className="small-heading">
                                QUICK ACTIONS
                            </span>


                            <button
                                className="quick-action"
                                onClick={() =>
                                    navigate(
                                        "/company/dashboard"
                                    )
                                }
                            >
                                <span>📊</span>
                                Company Dashboard
                                <span>→</span>
                            </button>


                            <button
                                className="quick-action"
                                onClick={() =>
                                    navigate("/community")
                                }
                            >
                                <span>🌍</span>
                                TravelMet Community
                                <span>→</span>
                            </button>

                        </div>

                    </aside>

                </section>

            </main>

        </div>

    );

}

export default CompanyProfile;