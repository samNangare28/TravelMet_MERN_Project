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

    const token = localStorage.getItem("token");

    const user = JSON.parse(
        localStorage.getItem("user") || "{}"
    );

    // ================= SCROLL =================

    useEffect(() => {

        const handleScroll = () => {

            setScrolled(window.scrollY > 50);

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

    // ================= LOGOUT =================

    const logout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        // Direct login page
        navigate("/login");

    };

    return (

        <>

        <nav
            className={
                scrolled
                    ? "navbar active"
                    : "navbar"
            }
        >

            {/* ================= LOGO ================= */}

            <div className="logo">

                <Link
                    to="/"
                    className="logo-link"
                >
                    ✈ TravelMet
                </Link>

            </div>


            {/* ================= NAV LINKS ================= */}

            <ul className="nav-links">

                <li>

                    <Link
                        to="/"
                        className={
                            location.pathname === "/"
                                ? "active-link"
                                : ""
                        }
                    >
                        Home
                    </Link>

                </li>

                <li>

                    <Link
                        to="/trip-planner"
                        className={
                            location.pathname ===
                            "/trip-planner"
                                ? "active-link"
                                : ""
                        }
                    >
                        AI Planner
                    </Link>

                </li>

                <li>

                    <Link
                        to="/community"
                        className={
                            location.pathname ===
                            "/community"
                                ? "active-link"
                                : ""
                        }
                    >
                        Community
                    </Link>

                </li>

                <li>

                    <Link
                        to="/blogs"
                        className={
                            location.pathname.startsWith(
                                "/blogs"
                            )
                                ? "active-link"
                                : ""
                        }
                    >
                        Blog
                    </Link>

                </li>

                <li>

                    <Link
                        to="/contact"
                        className={
                            location.pathname ===
                            "/contact"
                                ? "active-link"
                                : ""
                        }
                    >
                        Contact
                    </Link>

                </li>

            </ul>


            {/* ================= RIGHT SECTION ================= */}

            <div className="nav-right">

                {token ? (

                    /* ================= LOGGED IN ================= */

                    <>

                        <ProfileSearch />

                        <button
                            type="button"
                            className="create-btn"
                            onClick={() =>
                                setShowCreateChoice(true)
                            }
                        >
                            + Create
                        </button>

                        <NotificationBell />


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
                                    {user.firstName}
                                </h4>

                                <span>
                                    Community
                                </span>

                            </div>

                        </Link>


                        <button
                            className="logout-btn"
                            onClick={logout}
                        >
                            Logout
                        </button>

                    </>

                ) : (

                    /* ================= LOGGED OUT ================= */

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


        {/* ================= CREATE CHOICE MODAL ================= */}

        {showCreateChoice && (

            <div
                className="create-choice-overlay"
                onClick={() => setShowCreateChoice(false)}
            >

                <div
                    className="create-choice-modal"
                    onClick={(e) => e.stopPropagation()}
                >

                    <h3>What would you like to create?</h3>

                    <p>
                        Share a quick travel moment, or write a
                        full story for the TravelMet magazine.
                    </p>

                    <div className="create-choice-options">

                        <button
                            type="button"
                            className="create-choice-option"
                            onClick={() => {

                                setShowCreateChoice(false);
                                navigate("/create-post");

                            }}
                        >

                            <span className="create-choice-icon">
                                📷
                            </span>

                            <span className="create-choice-text">
                                <strong>Create Post</strong>
                                <span className="create-choice-sub">
                                    Share a photo &amp; quick update
                                    to the community feed
                                </span>
                            </span>

                        </button>

                        <button
                            type="button"
                            className="create-choice-option"
                            onClick={() => {

                                setShowCreateChoice(false);
                                navigate("/create-blog");

                            }}
                        >

                            <span className="create-choice-icon">
                                📝
                            </span>

                            <span className="create-choice-text">
                                <strong>Create Blog</strong>
                                <span className="create-choice-sub">
                                    Publish a full travel story to
                                    the TravelMet magazine
                                </span>
                            </span>

                        </button>

                    </div>

                    <button
                        type="button"
                        className="create-choice-close"
                        onClick={() => setShowCreateChoice(false)}
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
