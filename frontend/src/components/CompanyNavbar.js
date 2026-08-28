import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../Css/CompanyNavbar.css";

function CompanyNavbar() {

    const location = useLocation();
    const navigate = useNavigate();

    const [menuOpen, setMenuOpen] = useState(false);

    const company = JSON.parse(
        localStorage.getItem("company") || "{}"
    );

    const companyToken =
        localStorage.getItem("companyToken");


    // =====================================================
    // LOGOUT
    // =====================================================

    const handleLogout = () => {

        localStorage.removeItem("companyToken");
        localStorage.removeItem("company");

        setMenuOpen(false);

        navigate("/login", {
            replace: true
        });

    };


    // =====================================================
    // ACTIVE LINK
    // =====================================================

    const isActive = (path) => {

        return (
            location.pathname === path ||
            location.pathname.startsWith(`${path}/`)
        );

    };


    // =====================================================
    // PROTECTION
    // =====================================================

    if (!companyToken) {
        return null;
    }


    return (

        <nav className="company-navbar">

            {/* =================================================
                BRAND
            ================================================= */}

            <Link
                to="/company/dashboard"
                className="company-navbar-brand"
                onClick={() => setMenuOpen(false)}
            >

                <div className="company-navbar-logo">

                    {company.logo ? (

                        <img
                            src={company.logo}
                            alt={
                                company.companyName ||
                                "Company"
                            }
                        />

                    ) : (

                        <span>
                            🏢
                        </span>

                    )}

                </div>


                <div className="company-navbar-brand-text">

                    <strong>
                        {company.companyName ||
                            "Travel Company"}
                    </strong>

                    <small>
                        TravelMet Business
                    </small>

                </div>

            </Link>


            {/* =================================================
                MOBILE MENU BUTTON
            ================================================= */}

            <button
                className="company-mobile-menu-btn"
                onClick={() =>
                    setMenuOpen(!menuOpen)
                }
                aria-label="Toggle company menu"
            >

                <span></span>
                <span></span>
                <span></span>

            </button>


            {/* =================================================
                NAVIGATION
            ================================================= */}

            <div
                className={
                    menuOpen
                        ? "company-navbar-menu open"
                        : "company-navbar-menu"
                }
            >

                {/* ================= DASHBOARD ================= */}

                <Link
                    to="/company/dashboard"
                    className={
                        isActive("/company/dashboard")
                            ? "company-nav-link active"
                            : "company-nav-link"
                    }
                    onClick={() =>
                        setMenuOpen(false)
                    }
                >

                    <span className="company-nav-icon">
                        📊
                    </span>

                    Dashboard

                </Link>


                {/* ================= MY TOURS ================= */}

                <Link
                    to="/company/dashboard"
                    className={
                        location.pathname ===
                        "/company/dashboard"
                            ? "company-nav-link active"
                            : "company-nav-link"
                    }
                    onClick={() =>
                        setMenuOpen(false)
                    }
                >

                    <span className="company-nav-icon">
                        ✈️
                    </span>

                    My Tours

                </Link>


                {/* ================= ADD TOUR ================= */}

                <Link
                    to="/company/add-tour"
                    className={
                        isActive("/company/add-tour")
                            ? "company-nav-link active"
                            : "company-nav-link"
                    }
                    onClick={() =>
                        setMenuOpen(false)
                    }
                >

                    <span className="company-nav-icon">
                        ➕
                    </span>

                    Add Tour

                </Link>


                {/* ================= EXPLORE ================= */}

                <Link
                    to="/explore-tours"
                    className={
                        isActive("/explore-tours")
                            ? "company-nav-link active"
                            : "company-nav-link"
                    }
                    onClick={() =>
                        setMenuOpen(false)
                    }
                >

                    <span className="company-nav-icon">
                        🌍
                    </span>

                    Explore Tours

                </Link>


                {/* ================= PROFILE ================= */}

                <Link
                    to="/company/profile"
                    className={
                        isActive("/company/profile")
                            ? "company-nav-link active"
                            : "company-nav-link"
                    }
                    onClick={() =>
                        setMenuOpen(false)
                    }
                >

                    <span className="company-nav-icon">
                        🏢
                    </span>

                    Company Profile

                </Link>


                {/* =================================================
                    DIVIDER
                ================================================= */}

                <div className="company-navbar-divider"></div>


                {/* =================================================
                    LOGOUT
                ================================================= */}

                <button
                    className="company-navbar-logout"
                    onClick={handleLogout}
                >

                    <span>
                        🚪
                    </span>

                    Logout

                </button>

            </div>

        </nav>

    );

}

export default CompanyNavbar;
