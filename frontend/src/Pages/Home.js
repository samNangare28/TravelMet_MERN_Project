import { Link } from "react-router-dom";
import "../Css/Home.css";

function Home() {
    return (
        <main className="home">

            {/* =====================================================
                HERO
            ===================================================== */}
            <section className="hero">

                <div className="hero-inner">

                    {/* LEFT CONTENT */}
                    <div className="hero-content">

                        <div className="hero-badge">
                            <span>✦</span>
                            AI POWERED TRAVEL PLATFORM
                        </div>

                        <h1>
                            Your journey.
                            <br />
                            <span>Your way.</span>
                        </h1>

                        <p>
                            Plan unforgettable trips with AI, discover
                            inspiring places, connect with travellers and
                            explore experiences from trusted travel companies.
                        </p>

                        <div className="hero-buttons">

                            <Link to="/trip-planner">
                                <button className="primary-btn">
                                    Plan My Trip
                                    <span>→</span>
                                </button>
                            </Link>

                            <Link to="/explore-tours">
                                <button className="secondary-btn">
                                    Explore Tours
                                </button>
                            </Link>

                        </div>

                        <div className="hero-note">
                            <span>✦</span>
                            Smart planning. Real experiences. Better travel.
                        </div>

                    </div>


                    {/* RIGHT VISUAL */}
                    <div className="hero-visual">

                        <div className="hero-image-card">

                            <img
                                src="https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=85"
                                alt="Beautiful travel destination"
                            />

                            <div className="image-gradient"></div>

                            <div className="image-caption">

                                <div>
                                    <span>DISCOVER</span>
                                    <h3>Beautiful places await.</h3>
                                </div>

                                <div className="caption-icon">
                                    →
                                </div>

                            </div>

                        </div>


                        {/* FLOATING CARD */}
                        <div className="hero-floating-card">

                            <div className="floating-icon">
                                ✦
                            </div>

                            <div>
                                <strong>AI Trip Planner</strong>
                                <span>Personalized for you</span>
                            </div>

                            <div className="floating-check">
                                ✓
                            </div>

                        </div>

                    </div>

                </div>

            </section>


            {/* =====================================================
                STATS
            ===================================================== */}
            <section className="stats">

                <div className="stat-item">

                    <div className="stat-icon">
                        ✈
                    </div>

                    <div>
                        <strong>500+</strong>
                        <span>Trips Planned</span>
                    </div>

                </div>


                <div className="stat-item">

                    <div className="stat-icon">
                        ◎
                    </div>

                    <div>
                        <strong>150+</strong>
                        <span>Destinations</span>
                    </div>

                </div>


                <div className="stat-item">

                    <div className="stat-icon">
                        ♡
                    </div>

                    <div>
                        <strong>1000+</strong>
                        <span>Travellers</span>
                    </div>

                </div>


                <div className="stat-item">

                    <div className="stat-icon">
                        ✦
                    </div>

                    <div>
                        <strong>24×7</strong>
                        <span>AI Assistance</span>
                    </div>

                </div>

            </section>


            {/* =====================================================
                INTRO
            ===================================================== */}
            <section className="intro-section">

                <div className="section-heading">

                    <span className="section-label">
                        WHY TRAVELMET
                    </span>

                    <h2>
                        Everything you need
                        <br />
                        <span>for your next journey.</span>
                    </h2>

                </div>

                <div className="intro-text">

                    <p>
                        TravelMet brings intelligent trip planning,
                        travel inspiration, community experiences and
                        organized tours together in one simple platform.
                    </p>

                    <Link to="/trip-planner" className="text-link">
                        Discover TravelMet
                        <span>→</span>
                    </Link>

                </div>

            </section>


            {/* =====================================================
                FEATURE CARDS
            ===================================================== */}
            <section className="feature-section">

                <div className="feature-grid">

                    {/* AI */}
                    <article className="feature-card feature-main">

                        <div className="feature-top">

                            <div className="feature-icon orange">
                                ✦
                            </div>

                            <span>01</span>

                        </div>

                        <h3>
                            Plan with AI
                        </h3>

                        <p>
                            Get a personalized itinerary based on your
                            destination, budget, dates and travel style.
                        </p>

                        <Link to="/trip-planner" className="feature-link">
                            Try AI Planner
                            <span>→</span>
                        </Link>

                    </article>


                    {/* COMMUNITY */}
                    <article className="feature-card">

                        <div className="feature-top">

                            <div className="feature-icon gold">
                                ♡
                            </div>

                            <span>02</span>

                        </div>

                        <h3>
                            Travel Community
                        </h3>

                        <p>
                            Share your journeys, discover travel stories
                            and connect with people who love travelling.
                        </p>

                        <Link to="/community" className="feature-link">
                            Explore Community
                            <span>→</span>
                        </Link>

                    </article>


                    {/* BLOG */}
                    <article className="feature-card">

                        <div className="feature-top">

                            <div className="feature-icon blue">
                                ◌
                            </div>

                            <span>03</span>

                        </div>

                        <h3>
                            Travel Stories
                        </h3>

                        <p>
                            Find destination guides, travel tips and
                            experiences shared by fellow travellers.
                        </p>

                        <Link to="/blogs" className="feature-link">
                            Read Blogs
                            <span>→</span>
                        </Link>

                    </article>

                </div>

            </section>


            {/* =====================================================
                AI SECTION
            ===================================================== */}
            <section className="ai-section">

                <div className="ai-content">

                    <span className="section-label light">
                        ✦ SMART TRAVEL PLANNING
                    </span>

                    <h2>
                        Stop planning.
                        <br />
                        <span>Start travelling.</span>
                    </h2>

                    <p>
                        Give TravelMet a few details about your trip and
                        let AI create a day-by-day itinerary designed
                        around you.
                    </p>

                    <div className="ai-points">

                        <div>
                            <span>✓</span>
                            Personalized itinerary
                        </div>

                        <div>
                            <span>✓</span>
                            Budget-friendly planning
                        </div>

                        <div>
                            <span>✓</span>
                            Day-by-day recommendations
                        </div>

                    </div>

                    <Link to="/trip-planner">
                        <button className="primary-btn light-button">
                            Create My Trip
                            <span>→</span>
                        </button>
                    </Link>

                </div>


                <div className="ai-preview">

                    <div className="ai-window">

                        <div className="ai-window-header">

                            <div className="window-dots">
                                <i></i>
                                <i></i>
                                <i></i>
                            </div>

                            <span>TravelMet AI</span>

                            <div className="ai-live">
                                <b></b>
                                Ready
                            </div>

                        </div>


                        <div className="ai-window-body">

                            <div className="ai-welcome">
                                <span>✦</span>
                                <div>
                                    <strong>Let's plan your journey</strong>
                                    <p>
                                        Tell us about your perfect trip.
                                    </p>
                                </div>
                            </div>


                            <div className="ai-input-row">

                                <div>
                                    <small>DESTINATION</small>
                                    <strong>Where do you want to go?</strong>
                                </div>

                                <span>→</span>

                            </div>


                            <div className="ai-input-grid">

                                <div>
                                    <small>DATES</small>
                                    <strong>Choose dates</strong>
                                </div>

                                <div>
                                    <small>BUDGET</small>
                                    <strong>Your preference</strong>
                                </div>

                            </div>


                            <div className="ai-generate">
                                Generate itinerary
                                <span>✦</span>
                            </div>

                        </div>

                    </div>

                </div>

            </section>


            {/* =====================================================
                TRAVEL COMPANY
            ===================================================== */}
            <section className="company-section">

                <div className="company-visual">

                    <div className="company-card">

                        <div className="company-header">

                            <div className="company-avatar">
                                T
                            </div>

                            <div>
                                <strong>Travel Partner</strong>
                                <span>Verified Company</span>
                            </div>

                            <div className="verified">
                                ✓
                            </div>

                        </div>


                        <div className="company-divider"></div>


                        <div className="company-body">

                            <span className="company-small-title">
                                ORGANIZED EXPERIENCES
                            </span>

                            <h3>
                                Discover India
                                <br />
                                with people.
                            </h3>

                            <p>
                                Group tours created by travel companies
                                for unforgettable experiences.
                            </p>

                        </div>


                        <div className="company-footer">

                            <span>👥 Group Tours</span>
                            <span>📍 Multiple Places</span>

                        </div>

                    </div>

                </div>


                <div className="company-content">

                    <span className="section-label">
                        FOR TRAVEL COMPANIES
                    </span>

                    <h2>
                        Bring your tours
                        <br />
                        to <span>TravelMet.</span>
                    </h2>

                    <p>
                        Travel companies can register on TravelMet,
                        create their tour packages and connect with
                        travellers looking for their next adventure.
                    </p>


                    <div className="company-list">

                        <div>
                            <b>01</b>
                            <span>Create and publish your tours</span>
                        </div>

                        <div>
                            <b>02</b>
                            <span>Reach interested travellers</span>
                        </div>

                        <div>
                            <b>03</b>
                            <span>Build memorable group experiences</span>
                        </div>

                    </div>


                    <Link to="/explore-tours">
                        <button className="outline-btn">
                            Explore Tours
                            <span>→</span>
                        </button>
                    </Link>

                </div>

            </section>


            {/* =====================================================
                COMMUNITY
            ===================================================== */}
            <section className="community-section">

                <div className="community-content">

                    <span className="section-label">
                        TRAVEL COMMUNITY
                    </span>

                    <h2>
                        Real journeys.
                        <br />
                        <span>Real stories.</span>
                    </h2>

                    <p>
                        Get inspired by the experiences of other travellers
                        and share the moments that made your journey special.
                    </p>

                    <Link to="/community">
                        <button className="dark-btn">
                            Visit Community
                            <span>→</span>
                        </button>
                    </Link>

                </div>


                <div className="community-visual">

                    <div className="community-image image-a"></div>

                    <div className="community-small-image image-b"></div>

                    <div className="community-note">
                        <span>✦</span>
                        <div>
                            <strong>Share your journey</strong>
                            <small>Inspire another traveller</small>
                        </div>
                    </div>

                </div>

            </section>


            {/* =====================================================
                BLOG
            ===================================================== */}
            <section className="blog-section">

                <div>

                    <span className="section-label">
                        TRAVEL BLOGS
                    </span>

                    <h2>
                        Go somewhere.
                        <br />
                        <span>Read about it first.</span>
                    </h2>

                </div>

                <div className="blog-right">

                    <p>
                        Discover destination guides, useful travel tips
                        and experiences from the TravelMet community.
                    </p>

                    <Link to="/blogs" className="text-link">
                        Explore Travel Blogs
                        <span>→</span>
                    </Link>

                </div>

            </section>


            {/* =====================================================
                FINAL CTA
            ===================================================== */}
            <section className="final-cta">

                <div className="cta-inner">

                    <span className="section-label light">
                        YOUR NEXT ADVENTURE
                    </span>

                    <h2>
                        Where will you
                        <br />
                        <span>go next?</span>
                    </h2>

                    <p>
                        Start planning your next unforgettable journey
                        with TravelMet.
                    </p>

                    <div className="cta-buttons">

                        <Link to="/trip-planner">
                            <button className="primary-btn">
                                Start Planning
                                <span>→</span>
                            </button>
                        </Link>

                        <Link to="/community">
                            <button className="secondary-btn">
                                Join Community
                            </button>
                        </Link>

                    </div>

                </div>

            </section>

        </main>
    );
}

export default Home;
