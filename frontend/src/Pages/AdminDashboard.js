import { useEffect, useState } from "react";
import api from "../api/axios";
import "../Css/AdminDashboard.css";

function AdminDashboard() {

    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState("");
    const [error, setError] = useState("");

    const adminToken = localStorage.getItem("adminToken");


    // =====================================================
    // FETCH PENDING COMPANIES
    // =====================================================

    const fetchPendingCompanies = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await api.get(
                "/api/admin/companies/pending",
                {
                    headers: {
                        Authorization: `Bearer ${adminToken}`
                    }
                }
            );

            setCompanies(
                response.data.companies || []
            );

        } catch (error) {

            console.error(
                "FETCH COMPANIES ERROR:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Unable to load company applications"
            );

        } finally {

            setLoading(false);

        }

    };


    // =====================================================
    // LOAD COMPANIES
    // =====================================================

    useEffect(() => {

        if (!adminToken) {

            setError(
                "Admin authentication required. Please login again."
            );

            setLoading(false);

            return;
        }

        fetchPendingCompanies();

    }, [adminToken]);


    // =====================================================
    // APPROVE COMPANY
    // =====================================================

    const approveCompany = async (id) => {

        try {

            setActionLoading(id);
            setError("");

            await api.put(
                `/api/admin/companies/${id}/approve`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${adminToken}`
                    }
                }
            );

            alert(
                "Company verified successfully ✅"
            );

            await fetchPendingCompanies();

        } catch (error) {

            console.error(
                "APPROVE COMPANY ERROR:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Unable to verify company"
            );

        } finally {

            setActionLoading("");

        }

    };


    // =====================================================
    // REJECT COMPANY
    // =====================================================

    const rejectCompany = async (id) => {

        const reason = window.prompt(
            "Enter rejection reason:"
        );

        if (!reason || !reason.trim()) {

            return;

        }


        try {

            setActionLoading(id);
            setError("");

            await api.put(
                `/api/admin/companies/${id}/reject`,
                {
                    reason: reason.trim()
                },
                {
                    headers: {
                        Authorization: `Bearer ${adminToken}`
                    }
                }
            );

            alert(
                "Company rejected successfully"
            );

            await fetchPendingCompanies();

        } catch (error) {

            console.error(
                "REJECT COMPANY ERROR:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Unable to reject company"
            );

        } finally {

            setActionLoading("");

        }

    };


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <div className="admin-dashboard">


            {/* =================================================
                ADMIN HEADER
            ================================================= */}

            <header className="admin-hero">

                <div className="hero-content">

                    <div className="admin-eyebrow">

                        <span className="shield-icon">
                            ✦
                        </span>

                        TRAVELMET ADMINISTRATION

                    </div>


                    <h1>
                        Welcome back, Admin
                    </h1>


                    <p>
                        Review applications, verify travel
                        companies, and maintain a trusted
                        TravelMet community.
                    </p>

                </div>


                <div className="admin-profile">

                    <div className="admin-profile-icon">
                        🛡️
                    </div>


                    <div>

                        <strong>
                            TravelMet Admin
                        </strong>

                        <span>
                            Administrator
                        </span>

                    </div>

                </div>

            </header>



            {/* =================================================
                STATISTICS
            ================================================= */}

            <section className="admin-stats">


                {/* PENDING COMPANIES */}

                <div className="stat-card">

                    <div className="stat-icon company-icon">
                        🏢
                    </div>


                    <div className="stat-content">

                        <span>
                            Pending Companies
                        </span>

                        <strong>
                            {companies.length}
                        </strong>

                        <small>
                            Applications awaiting review
                        </small>

                    </div>

                </div>



                {/* REVIEW QUEUE */}

                <div className="stat-card">

                    <div className="stat-icon pending-icon">
                        ◷
                    </div>


                    <div className="stat-content">

                        <span>
                            Review Queue
                        </span>

                        <strong>
                            {companies.length}
                        </strong>

                        <small>
                            Requires your attention
                        </small>

                    </div>

                </div>



                {/* SYSTEM STATUS */}

                <div className="stat-card">

                    <div className="stat-icon secure-icon">
                        ✓
                    </div>


                    <div className="stat-content">

                        <span>
                            Verification Status
                        </span>

                        <strong>
                            Active
                        </strong>

                        <small>
                            System operating normally
                        </small>

                    </div>

                </div>

            </section>



            {/* =================================================
                COMPANY VERIFICATION SECTION
            ================================================= */}

            <section className="company-section">


                {/* SECTION HEADER */}

                <div className="section-heading">

                    <div>

                        <div className="section-eyebrow">
                            VERIFICATION CENTER
                        </div>


                        <h2>
                            Company Applications
                        </h2>


                        <p>
                            Carefully review submitted company
                            information before verification.
                        </p>

                    </div>


                    <div className="queue-badge">

                        <span className="queue-dot"></span>

                        {companies.length} Pending

                    </div>

                </div>



                {/* =================================================
                    ERROR
                ================================================= */}

                {error && (

                    <div className="admin-error">

                        <span>
                            ⚠
                        </span>


                        <div>

                            <strong>
                                Something went wrong
                            </strong>

                            <p>
                                {error}
                            </p>

                        </div>

                    </div>

                )}



                {/* =================================================
                    LOADING
                ================================================= */}

                {loading ? (

                    <div className="admin-loading">

                        <div className="premium-loader"></div>


                        <h3>
                            Loading applications
                        </h3>


                        <p>
                            Please wait while we fetch the latest
                            verification requests.
                        </p>

                    </div>

                ) : companies.length === 0 ? (


                    /* =================================================
                       EMPTY STATE
                    ================================================= */

                    <div className="empty-state">

                        <div className="empty-circle">
                            ✓
                        </div>


                        <span className="empty-label">
                            ALL CLEAR
                        </span>


                        <h3>
                            No pending applications
                        </h3>


                        <p>
                            Great work! There are currently no
                            travel companies waiting for verification.
                        </p>


                        <button
                            type="button"
                            className="refresh-btn"
                            onClick={fetchPendingCompanies}
                        >
                            ↻ Refresh
                        </button>

                    </div>

                ) : (


                    /* =================================================
                       COMPANY GRID
                    ================================================= */

                    <div className="company-grid">

                        {companies.map((company) => (

                            <article
                                className="company-card"
                                key={company._id}
                            >


                                {/* =================================================
                                    COMPANY CARD HEADER
                                ================================================= */}

                                <div className="company-card-header">


                                    <div className="company-logo">

                                        {company.logo ? (

                                            <img
                                                src={company.logo}
                                                alt={`${company.companyName} logo`}
                                            />

                                        ) : (

                                            <span>
                                                🏢
                                            </span>

                                        )}

                                    </div>


                                    <div className="company-title-area">


                                        <span className="status-badge">

                                            <span></span>

                                            Pending Review

                                        </span>


                                        <h3>
                                            {company.companyName}
                                        </h3>


                                        <p>
                                            Application ID:{" "}
                                            {company._id
                                                ? company._id.slice(-8)
                                                : "N/A"}
                                        </p>

                                    </div>

                                </div>



                                {/* =================================================
                                    COMPANY DETAILS
                                ================================================= */}

                                <div className="company-details">


                                    {/* OWNER */}

                                    <div className="detail-row">

                                        <span className="detail-icon">
                                            👤
                                        </span>


                                        <div>

                                            <small>
                                                OWNER
                                            </small>

                                            <strong>
                                                {company.ownerName || "Not provided"}
                                            </strong>

                                        </div>

                                    </div>



                                    {/* EMAIL */}

                                    <div className="detail-row">

                                        <span className="detail-icon">
                                            ✉
                                        </span>


                                        <div>

                                            <small>
                                                EMAIL
                                            </small>

                                            <strong>
                                                {company.email || "Not provided"}
                                            </strong>

                                        </div>

                                    </div>



                                    {/* PHONE */}

                                    <div className="detail-row">

                                        <span className="detail-icon">
                                            ☎
                                        </span>


                                        <div>

                                            <small>
                                                PHONE
                                            </small>

                                            <strong>
                                                {company.phone || "Not provided"}
                                            </strong>

                                        </div>

                                    </div>



                                    {/* LOCATION */}

                                    <div className="detail-row">

                                        <span className="detail-icon">
                                            ◉
                                        </span>


                                        <div>

                                            <small>
                                                LOCATION
                                            </small>

                                            <strong>
                                                {company.address || "Not provided"}
                                            </strong>

                                        </div>

                                    </div>

                                </div>



                                {/* =================================================
                                    DESCRIPTION
                                ================================================= */}

                                {company.description && (

                                    <div className="company-description">

                                        <span>
                                            ABOUT COMPANY
                                        </span>


                                        <p>
                                            {company.description}
                                        </p>

                                    </div>

                                )}



                                {/* =================================================
                                    CERTIFICATE
                                ================================================= */}

                                <div className="document-box">


                                    <div className="document-left">

                                        <div className="document-icon">
                                            PDF
                                        </div>


                                        <div>

                                            <strong>
                                                Verification Certificate
                                            </strong>


                                            <small>
                                                Official document submitted
                                                by company
                                            </small>

                                        </div>

                                    </div>


                                    {company.certificate && (

                                        <a
                                            href={company.certificate}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="view-document"
                                        >
                                            View Document ↗
                                        </a>

                                    )}

                                </div>



                                {/* =================================================
                                    WEBSITE
                                ================================================= */}

                                {company.website && (

                                    <a
                                        href={company.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="company-website"
                                    >

                                        <span>
                                            ↗
                                        </span>

                                        Visit company website

                                    </a>

                                )}



                                {/* =================================================
                                    ACTION BUTTONS
                                ================================================= */}

                                <div className="company-actions">


                                    {/* REJECT */}

                                    <button
                                        type="button"
                                        className="reject-btn"
                                        onClick={() =>
                                            rejectCompany(company._id)
                                        }
                                        disabled={
                                            actionLoading === company._id
                                        }
                                    >

                                        {actionLoading === company._id
                                            ? "Processing..."
                                            : "Reject Application"
                                        }

                                    </button>



                                    {/* APPROVE */}

                                    <button
                                        type="button"
                                        className="approve-btn"
                                        onClick={() =>
                                            approveCompany(company._id)
                                        }
                                        disabled={
                                            actionLoading === company._id
                                        }
                                    >

                                        {actionLoading === company._id
                                            ? "Processing..."
                                            : "✓ Verify Company"
                                        }

                                    </button>

                                </div>

                            </article>

                        ))}

                    </div>

                )}

            </section>

        </div>

    );

}

export default AdminDashboard;
