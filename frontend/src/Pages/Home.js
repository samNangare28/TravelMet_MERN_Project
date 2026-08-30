import { Link } from "react-router-dom";
import "../Css/Home.css";

function Home() {
    return (
        <main className="home">

            {/* ================= HERO ================= */}
            <section className="hero">

                <div className="hero-overlay"></div>

                <div className="hero-content">

                    <div className="hero-badge">
                        <span>✦</span>
                        AI Powered Travel Platform
                    </div>

                    <h1>
                        Travel More.
                        <br />
                        <span>Experience More.</span>
                    </h1>

                    <p>
                        Plan smarter with AI, discover inspiring destinations,
                        connect with fellow travellers and find unforgettable
                        travel experiences — all in one place.
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

                    <div className="hero-trust">
                        <span>✦</span>
                        Plan your next adventure with TravelMet
                    </div>

                </div>

            </section>


            {/* ================= STATS ================= */}
            <section className="stats">

                <div className="stat-box">
                    <div className="stat-icon">✈</div>
                    <div>
                        <h2>500+</h2>
                        <p>Trips Planned</p>
                    </div>
                </div>

                <div className="stat-box">
                    <div className="stat-icon">◎</div>
                    <div>
                        <h2>150+</h2>
                        <p>Destinations</p>
                    </div>
                </div>

                <div className="stat-box">
                    <div className="stat-icon">♡</div>
                    <div>
                        <h2>1000+</h2>
                        <p>Travellers</p>
                    </div>
                </div>

                <div className="stat-box">
                    <div className="stat-icon">✦</div>
                    <div>
                        <h2>24×7</h2>
                        <p>AI Assistance</p>
                    </div>
                </div>

            </section>


            {/* ================= INTRO ================= */}
            <section className="intro-section">

                <div className="intro-heading">

                    <span className="section-label">
                        THE TRAVELMET EXPERIENCE
                    </span>

                    <h2>
                        Everything you need
                        <br />
                        <span>for a better journey.</span>
                    </h2>

                </div>

                <p className="intro-description">
                    TravelMet brings trip planning, travel inspiration,
                    community experiences and organized tours together
                    to make your journey simpler and more memorable.
                </p>

            </section>


            {/* ================= AI PLANNER ================= */}
            <section className="ai-section">

                <div className="ai-content">

                    <span className="section-label light">
                        ✦ AI TRIP PLANNER
                    </span>

                    <h2>
                        Your journey,
                        <br />
                        <span>planned by AI.</span>
                    </h2>

                    <p>
                        Tell TravelMet where you want to go, your budget,
                        travel dates and preferences. Our AI creates a
                        personalized day-by-day travel plan for you.
                    </p>

                    <Link to="/trip-planner">
                        <button className="primary-btn light-btn">
                            Create My Itinerary
                            <span>→</span>
                        </button>
                    </Link>

                </div>

                <div className="ai-visual">

                    <div className="ai-orbit orbit-one"></div>
                    <div className="ai-orbit orbit-two"></div>

                    <div className="ai-center-card">

                        <div className="ai-card-top">
                            <span className="ai-spark">✦</span>
                            <span>TravelMet AI</span>
                            <span className="ai-status"></span>
                        </div>

                        <div className="ai-card-line large"></div>
                        <div className="ai-card-line"></div>
                        <div className="ai-card-line short"></div>

                        <div className="ai-mini-grid">
                            <div>
                                <span>📍</span>
                                Destination
                            </div>

                            <div>
                                <span>📅</span>
                                Duration
                            </div>

                            <div>
                                <span>₹</span>
                                Budget
                            </div>

                            <div>
                                <span>♡</span>
                                Travel Style
                            </div>
                        </div>

                    </div>

                </div>

            </section>


            {/* ================= TRAVEL COMPANY ================= */}
            <section className="company-section">

                <div className="company-visual">

                    <div className="company-main-card">

                        <div className="company-card-header">
                            <div className="company-logo">
                                W
                            </div>

                            <div>
                                <strong>Travel Company</strong>
                                <span>Verified Partner</span>
                            </div>

                            <span className="verified">✓</span>
                        </div>

                        <div className="company-card-content">
                            <span>GROUP EXPERIENCE</span>

                            <h3>
                                Discover India
                                <br />
                                Together
                            </h3>

                            <div className="company-meta">
                                <span>📍 Multiple Destinations</span>
                                <span>👥 Group Tours</span>
                            </div>
                        </div>

                    </div>

                </div>

                <div className="company-content">

                    <span className="section-label">
                        FOR TRAVEL COMPANIES
                    </span>

                    <h2>
                        Turn your tours
                        <br />
                        into <span>experiences.</span>
                    </h2>

                    <p>
                        Travel companies can create and publish their
                        tours on TravelMet, reach new travellers and
                        build memorable group experiences.
                    </p>

                    <div className="company-points">

                        <div>
                            <span>01</span>
                            <p>Create & publish tours</p>
                        </div>

                        <div>
                            <span>02</span>
                            <p>Reach interested travellers</p>
                        </div>

                        <div>
                            <span>03</span>
                            <p>Manage your tour participants</p>
                        </div>

                    </div>

                    <Link to="/explore-tours">
                        <button className="outline-btn">
                            Explore Organized Tours
                            <span>→</span>
                        </button>
                    </Link>

                </div>

            </section>


            {/* ================= COMMUNITY ================= */}
            <section className="community-section">

                <div className="community-heading">

                    <span className="section-label">
                        TRAVEL COMMUNITY
                    </span>

                    <h2>
                        Travel stories
                        <br />
                        worth <span>sharing.</span>
                    </h2>

                    <p>
                        Discover experiences from fellow travellers,
                        share your own journeys and get inspired for
                        your next adventure.
                    </p>

                    <Link to="/community">
                        <button className="primary-btn dark-btn">
                            Explore Community
                            <span>→</span>
                        </button>
                    </Link>

                </div>

                <div className="community-cards">

                    <div className="story-card story-large">

                        <div className="story-image image-one"></div>

                        <div className="story-content">
                            <span>ADVENTURE</span>
                            <h3>
                                Stories from the road
                            </h3>
                            <p>
                                Real journeys. Real experiences.
                            </p>
                        </div>

                    </div>

                    <div className="story-card">

                        <div className="story-image image-two"></div>

                        <div className="story-content">
                            <span>NATURE</span>
                            <h3>
                                Find your next escape
                            </h3>
                        </div>

                    </div>

                    <div className="story-card">

                        <div className="story-image image-three"></div>

                        <div className="story-content">
                            <span>DISCOVER</span>
                            <h3>
                                See the world differently
                            </h3>
                        </div>

                    </div>

                </div>

            </section>


            {/* ================= BLOG ================= */}
            <section className="blog-cta">

                <div>
                    <span className="section-label">
                        TRAVEL STORIES
                    </span>

                    <h2>
                        Read. Discover.
                        <br />
                        <span>Get inspired.</span>
                    </h2>

                    <p>
                        Explore travel blogs, destination guides and
                        useful tips shared by the TravelMet community.
                    </p>
                </div>

                <Link to="/blogs">
                    <button className="outline-btn">
                        Explore Blogs
                        <span>→</span>
                    </button>
                </Link>

            </section>


            {/* ================= FINAL CTA ================= */}
            <section className="cta">

                <div className="cta-decoration"></div>

                <span className="section-label light">
                    YOUR NEXT ADVENTURE AWAITS
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

            </section>

        </main>
    );
}

export default Home;