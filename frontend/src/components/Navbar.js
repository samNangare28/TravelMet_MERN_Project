import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import "../Css/Navbar.css";
import "../Css/Blog.css";

import NotificationBell from "./NotificationBell";
import ProfileSearch from "./ProfileSearch";

function Navbar() {

    const location = useLocation();
    const navigate = useNavigate();

    const [scrolled, setScrolled] = useState(false);
    const [showCreateChoice, setShowCreateChoice] = useState(false);

    // =====================================================
    // AUTH DATA
    // =====================================================

    const token =
        localStorage.getItem("token");

    const companyToken =
        localStorage.getItem("companyToken");

    const user = JSON.parse(
        localStorage.getItem("user") || "{}"
    );

    const company = JSON.parse(
        localStorage.getItem("company") || "{}"
    );

    const isCompanyLoggedIn =
        !!companyToken;

    const isUserLoggedIn =
        !!token && !isCompanyLoggedIn;


    // =====================================================
    // SCROLL
    // =====================================================

    useEffect(() => {

        const handleScroll = () => {

            setScrolled(
                window.scrollY > 50
            );

        };

        window.addEventListener(
            "scroll",
            handleScroll
        );

        return () => {

            window.removeEventListener(
                "scroll",
                handleScroll
            );

        };

    }, []);


    // =====================================================
    // USER LOGOUT
    // =====================================================

    const logoutUser = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");

    };


    // =====================================================
    // COMPANY LOGOUT
    // =====================================================

    const logoutCompany = () => {

        localStorage.removeItem(
            "companyToken"
        );

        localStorage.removeItem(
            "company"
        );

        navigate("/login");

    };


    // =====================================================
    // ACTIVE LINK
    // =====================================================

    const isActive = (path) => {

        if (path === "/") {

            return location.pathname === "/";

        }

        return location.pathname.startsWith(path);

    };


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <>

            {/* =================================================
                MAIN NAVBAR
            ================================================= */}

            <nav
                className={
                    scrolled
                        ? "navbar active"
                        : "navbar"
                }
            >

                {/* =================================================
                    LOGO
                ================================================= */}

                <div className="logo">

                    <Link
                        to="/"
                        className="logo-link"
                    >
                        ✈ TravelMet
                    </Link>

                </div>


                {/* =================================================
                    NAVIGATION LINKS
                ================================================= */}

                <ul className="nav-links">

                    {/* HOME */}

                    <li>

                        <Link
                            to="/"
                            className={
                                isActive("/")
                                    ? "active-link"
                                    : ""
                            }
                        >
                            Home
                        </Link>

                    </li>


                    {/* AI PLANNER */}

                    <li>

                        <Link
                            to="/trip-planner"
                            className={
                                isActive("/trip-planner")
                                    ? "active-link"
                                    : ""
                            }
                        >
                            AI Planner
                        </Link>

                    </li>


                    {/* COMMUNITY */}

                    <li>

                        <Link
                            to="/community"
                            className={
                                isActive("/community")
                                    ? "active-link"
                                    : ""
                            }
                        >
                            Community
                        </Link>

                    </li>


                    {/* BLOG */}

                    <li>

                        <Link
                            to="/blogs"
                            className={
                                isActive("/blogs")
                                    ? "active-link"
                                    : ""
                            }
                        >
                            Blog
                        </Link>

                    </li>


                    {/* CONTACT */}

                    <li>

                        <Link
                            to="/contact"
                            className={
                                isActive("/contact")
                                    ? "active-link"
                                    : ""
                            }
                        >
                            Contact
                        </Link>

                    </li>


                    {/* =================================================
                        EXPLORE TOURS
                    ================================================= */}

                    <li>

                        <Link
                            to="/explore-tours"
                            className={
                                isActive("/explore-tours")
                                    ? "active-link"
                                    : ""
                            }
                        >
                            Explore Tours
                        </Link>

                    </li>

                </ul>


                {/* =================================================
                    RIGHT SIDE
                ================================================= */}

                <div className="nav-right">


                    {/* =================================================
                        COMPANY LOGGED IN
                    ================================================= */}

                    {isCompanyLoggedIn ? (

                        <>

                            {/* COMPANY DASHBOARD */}

                            <Link
                                to="/company/dashboard"
                                className={
                                    isActive(
                                        "/company/dashboard"
                                    )
                                        ? "company-nav-link active"
                                        : "company-nav-link"
                                }
                            >
                                Dashboard
                            </Link>


                            {/* ADD TOUR */}

                            <Link
                                to="/company/add-tour"
                                className="create-btn"
                            >
                                + Add Tour
                            </Link>


                            {/* MY TOURS */}

                            <Link
                                to="/company/dashboard"
                                className={
                                    isActive(
                                        "/company/dashboard"
                                    )
                                        ? "company-nav-link"
                                        : "company-nav-link"
                                }
                            >
                                My Tours
                            </Link>


                            {/* COMPANY PROFILE */}

                            <Link
                                to="/company/profile"
                                className="profile-box company-profile-box"
                            >

                                <div className="company-nav-avatar">
                                    {company.logo ? (

                                        <img
                                            src={company.logo}
                                            alt={
                                                company.companyName ||
                                                "Company"
                                            }
                                            className="company-nav-logo"
                                        />

                                    ) : (

                                        <span>
                                            🏢
                                        </span>

                                    )}
                                </div>


                                <div>

                                    <h4>
                                        {company.companyName ||
                                            "Company"}
                                    </h4>

                                    <span>
                                        Travel Company
                                    </span>

                                </div>

                            </Link>


                            {/* COMPANY LOGOUT */}

                            <button
                                className="logout-btn"
                                onClick={logoutCompany}
                            >
                                Logout
                            </button>

                        </>

                    ) : isUserLoggedIn ? (

                        /* =================================================
                            NORMAL USER LOGGED IN
                        ================================================= */

                        <>

                            <ProfileSearch />


                            {/* CREATE */}

                            <button
                                type="button"
                                className="create-btn"
                                onClick={() =>
                                    setShowCreateChoice(true)
                                }
                            >
                                + Create
                            </button>


                            {/* NOTIFICATIONS */}

                            <NotificationBell />


                            {/* USER PROFILE */}

                            <Link
                                to="/profile"
                                className="profile-box"
                            >

                                <img
                                    src={
                                        user.profileImage
                                            ? user.profileImage
                                            : "https://i.pravatar.cc/100"
                                    }
                                    alt="Profile"
                                    className="profile-img"
                                />


                                <div>

                                    <h4>
                                        {user.firstName ||
                                            "User"}
                                    </h4>

                                    <span>
                                        Community
                                    </span>

                                </div>

                            </Link>


                            {/* USER LOGOUT */}

                            <button
                                className="logout-btn"
                                onClick={logoutUser}
                            >
                                Logout
                            </button>

                        </>

                    ) : (

                        /* =================================================
                            LOGGED OUT
                        ================================================= */

                        <>

                            <Link
                                to="/login"
                                className="login-btn"
                            >
                                Login
                            </Link>


                            <Link
                                to="/register"
                                className="register-btn"
                            >
                                Register
                            </Link>

                        </>

                    )}

                </div>

            </nav>


            {/* =================================================
                CREATE CHOICE MODAL
                USER ONLY
            ================================================= */}

            {showCreateChoice && isUserLoggedIn && (

                <div
                    className="create-choice-overlay"
                    onClick={() =>
                        setShowCreateChoice(false)
                    }
                >

                    <div
                        className="create-choice-modal"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        <h3>
                            What would you like to create?
                        </h3>


                        <p>
                            Share a quick travel moment, or
                            write a full story for the
                            TravelMet magazine.
                        </p>


                        <div className="create-choice-options">


                            {/* CREATE POST */}

                            <button
                                type="button"
                                className="create-choice-option"
                                onClick={() => {

                                    setShowCreateChoice(
                                        false
                                    );

                                    navigate(
                                        "/create-post"
                                    );

                                }}
                            >

                                <span className="create-choice-icon">
                                    📷
                                </span>


                                <span className="create-choice-text">

                                    <strong>
                                        Create Post
                                    </strong>

                                    <span className="create-choice-sub">
                                        Share a photo &amp;
                                        quick update to the
                                        community feed
                                    </span>

                                </span>

                            </button>


                            {/* CREATE BLOG */}

                            <button
                                type="button"
                                className="create-choice-option"
                                onClick={() => {

                                    setShowCreateChoice(
                                        false
                                    );

                                    navigate(
                                        "/create-blog"
                                    );

                                }}
                            >

                                <span className="create-choice-icon">
                                    📝
                                </span>


                                <span className="create-choice-text">

                                    <strong>
                                        Create Blog
                                    </strong>

                                    <span className="create-choice-sub">
                                        Publish a full travel
                                        story to the TravelMet
                                        magazine
                                    </span>

                                </span>

                            </button>

                        </div>


                        {/* CANCEL */}

                        <button
                            type="button"
                            className="create-choice-close"
                            onClick={() =>
                                setShowCreateChoice(false)
                            }
                        >
                            Cancel
                        </button>

                    </div>

                </div>

            )}

        </>

    );

}

export default Navbar;