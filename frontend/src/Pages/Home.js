import { Link } from "react-router-dom";
import "../Css/Home.css";

function Home() {
    return (

        <div className="home">

            {/* ================= HERO ================= */}

            <section className="hero">

                <div className="hero-overlay"></div>

                <div className="hero-content">

                    <span className="hero-badge">

                        ✈ AI Powered Travel Platform

                    </span>

                    <h1>

                        Explore The World <br />

                        <span>

                            With TravelMet

                        </span>

                    </h1>

                    <p>

                        Plan smarter, travel better and discover amazing
                        destinations with AI powered trip planning.

                    </p>

 

                    <div className="hero-buttons">

                        <Link to="/trip-planner">

                            <button className="primary-btn">

                                Plan My Trip

                            </button>

                        </Link>

                        <Link to="/community">

                            <button className="secondary-btn">

                                Explore Community

                            </button>

                        </Link>

                    </div>

                </div>

                

            </section>
{/* ================= STATS ================= */}

            <section className="stats">

                <div className="stat-box">

                    <h2>500+</h2>

                    <p>Trips Planned</p>

                </div>

                <div className="stat-box">

                    <h2>150+</h2>

                    <p>Destinations</p>

                </div>

                <div className="stat-box">

                    <h2>1000+</h2>

                    <p>Happy Travellers</p>

                </div>

                <div className="stat-box">

                    <h2>24×7</h2>

                    <p>AI Support</p>

                </div>

            </section>


           
            {/* ================= AI SECTION ================= */}

            <section className="ai-section">

                <div className="ai-left">

                    <span className="section-tag">

                        🤖 AI POWERED

                    </span>

                    <h2>

                        Let AI Plan <br /> Your Perfect Trip

                    </h2>

                    <p>

                        Tell TravelMet your destination, budget and travel
                        duration. Our AI creates a personalized itinerary
                        within seconds.

                    </p>

                    <Link to="/trip-planner">

                        <button className="primary-btn">

                            Try AI Planner →

                        </button>

                    </Link>

                </div>

                <div className="ai-right">

                    <div className="ai-card">

                        <h3>

                            ✈ Goa Trip

                        </h3>

                        <ul>

                            <li>🏖 Baga Beach</li>

                            <li>⛪ Basilica of Bom Jesus</li>

                            <li>🌅 Sunset Cruise</li>

                            <li>🍤 Seafood Dinner</li>

                        </ul>

                    </div>

                </div>

            </section>

            
            {/* ================= WHY US ================= */}

            <section className="features">

                <h2>

                    Why Choose TravelMet?

                </h2>

                <div className="feature-grid">

                    <div className="feature-card">

                        <span>🤖</span>

                        <h3>AI Planning</h3>

                        <p>

                            Personalized itinerary in seconds.

                        </p>

                    </div>

                    <div className="feature-card">

                        <span>🌍</span>

                        <h3>Explore Places</h3>

                        <p>

                            Discover amazing destinations.

                        </p>

                    </div>

                    <div className="feature-card">

                        <span>💾</span>

                        <h3>Save Trips</h3>

                        <p>

                            Keep your favourite trips forever.

                        </p>

                    </div>

                    <div className="feature-card">

                        <span>👥</span>

                        <h3>Community</h3>

                        <p>

                            Share memories with travellers.

                        </p>

                    </div>

                </div>

            </section>

            {/* ================= CTA ================= */}

            <section className="cta">

                <h2>

                    Ready For Your Next Adventure?

                </h2>

                <p>

                    Join thousands of travellers planning smarter with
                    TravelMet.

                </p>

                <div className="cta-buttons">

                    <Link to="/trip-planner">

                        <button className="primary-btn">

                            Start Planning

                        </button>

                    </Link>

                    <Link to="/community">

                        <button className="secondary-btn">

                            Visit Community

                        </button>

                    </Link>

                </div>

            </section>

        </div>

    );

}

export default Home;            