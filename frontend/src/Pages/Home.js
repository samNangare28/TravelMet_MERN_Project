import { Link } from "react-router-dom";
import "../Css/Home.css";

function Home() {

    // Replace these demo tours with your real API data later.
    const featuredTours = [
        {
            id: 1,
            image:
                "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=900&q=85",
            title: "Goa Escape",
            company: "Kesari Travels",
            location: "Goa, India",
            duration: "10 Days",
            price: "₹25,000",
            joined: 18,
            total: 30
        },
        {
            id: 2,
            image:
                "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=900&q=85",
            title: "Manali Adventure",
            company: "Mountain Trails",
            location: "Manali, India",
            duration: "7 Days",
            price: "₹18,500",
            joined: 12,
            total: 20
        },
        {
            id: 3,
            image:
                "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=900&q=85",
            title: "Royal Rajasthan",
            company: "India Explore",
            location: "Rajasthan, India",
            duration: "8 Days",
            price: "₹22,000",
            joined: 25,
            total: 30
        }
    ];

    return (
        <div className="home">

            {/* =================================================
                HERO
            ================================================= */}

            <section className="hero">

                <div className="hero-overlay"></div>

                <div className="hero-content">

                    <div className="hero-badge">
                        <span className="badge-dot"></span>
                        AI POWERED TRAVEL PLATFORM
                    </div>

                    <h1>
                        Your Journey.
                        <br />
                        <span>Intelligently Planned.</span>
                    </h1>

                    <p>
                        Plan a personalized trip with AI or discover
                        professionally organized tours from trusted travel
                        companies — all in one place.
                    </p>

                    <div className="hero-buttons">

                        <Link to="/trip-planner">
                            <button className="primary-btn">
                                Plan My Trip
                                <span>→</span>
                            </button>
                        </Link>

                        <Link to="/tours">
                            <button className="secondary-btn">
                                Explore Tours
                            </button>
                        </Link>

                    </div>

                    <div className="hero-mini-info">

                        <div>
                            <strong>AI</strong>
                            <span>Smart Planning</span>
                        </div>

                        <div>
                            <strong>✈</strong>
                            <span>Organized Tours</span>
                        </div>

                        <div>
                            <strong>◎</strong>
                            <span>Travel Community</span>
                        </div>

                    </div>

                </div>

            </section>


            {/* =================================================
                STATS
            ================================================= */}

            <section className="stats">

                <div className="stat-box">
                    <span className="stat-icon">✦</span>
                    <div>
                        <h2>500+</h2>
                        <p>Trips Planned</p>
                    </div>
                </div>

                <div className="stat-box">
                    <span className="stat-icon">◉</span>
                    <div>
                        <h2>150+</h2>
                        <p>Destinations</p>
                    </div>
                </div>

                <div className="stat-box">
                    <span className="stat-icon">♧</span>
                    <div>
                        <h2>1000+</h2>
                        <p>Travellers</p>
                    </div>
                </div>

                <div className="stat-box">
                    <span className="stat-icon">24/7</span>
                    <div>
                        <h2>AI</h2>
                        <p>Travel Assistance</p>
                    </div>
                </div>

            </section>


            {/* =================================================
                TWO WAYS TO TRAVEL
            ================================================= */}

            <section className="travel-options">

                <div className="section-heading">

                    <span className="eyebrow">
                        HOW TRAVELMET WORKS
                    </span>

                    <h2>
                        Travel your way.
                    </h2>

                    <p>
                        Whether you want a trip designed around you or prefer
                        joining an organized group, TravelMet gives you both.
                    </p>

                </div>


                <div className="option-grid">

                    {/* AI OPTION */}

                    <div className="option-card ai-option">

                        <div className="option-number">
                            01
                        </div>

                        <div className="option-icon">
                            ✦
                        </div>

                        <span className="option-tag">
                            FOR INDEPENDENT TRAVELLERS
                        </span>

                        <h3>
                            Build your perfect trip with AI
                        </h3>

                        <p>
                            Tell us your destination, budget, dates and travel
                            style. TravelMet creates a personalized itinerary
                            for you in seconds.
                        </p>

                        <Link to="/trip-planner">
                            Plan with AI
                            <span>→</span>
                        </Link>

                    </div>


                    {/* COMPANY OPTION */}

                    <div className="option-card company-option">

                        <div className="option-number">
                            02
                        </div>

                        <div className="option-icon">
                            ✈
                        </div>

                        <span className="option-tag">
                            ORGANIZED GROUP TOURS
                        </span>

                        <h3>
                            Join a trip organized by experts
                        </h3>

                        <p>
                            Discover tours created by travel companies. Check
                            the itinerary, price and available seats, then join
                            the journey you love.
                        </p>

                        <Link to="/tours">
                            Explore Tours
                            <span>→</span>
                        </Link>

                    </div>

                </div>

            </section>


            {/* =================================================
                AI SECTION
            ================================================= */}

            <section className="ai-section">

                <div className="ai-content">

                    <span className="section-tag">
                        ✦ AI TRIP PLANNER
                    </span>

                    <h2>
                        Your destination.
                        <br />
                        <span>Our intelligence.</span>
                    </h2>

                    <p>
                        No endless searching. No complicated planning.
                        Simply tell TravelMet what kind of journey you want
                        and let AI build your personalized travel experience.
                    </p>

                    <div className="ai-points">

                        <div>
                            <span>✓</span>
                            Personalized itinerary
                        </div>

                        <div>
                            <span>✓</span>
                            Budget-aware planning
                        </div>

                        <div>
                            <span>✓</span>
                            Day-by-day experiences
                        </div>

                    </div>

                    <Link to="/trip-planner">
                        <button className="gold-btn">
                            Try AI Planner
                            <span>→</span>
                        </button>
                    </Link>

                </div>


                <div className="ai-preview">

                    <div className="preview-top">
                        <div>
                            <small>YOUR AI ITINERARY</small>
                            <h3>Goa · 5 Days</h3>
                        </div>

                        <span className="ai-status">
                            AI READY
                        </span>
                    </div>

                    <div className="preview-days">

                        <div className="preview-day active">
                            <span>DAY 01</span>
                            <strong>North Goa Discovery</strong>
                            <small>Beaches · Food · Sunset</small>
                        </div>

                        <div className="preview-day">
                            <span>DAY 02</span>
                            <strong>Heritage & Culture</strong>
                            <small>Churches · Fort · Local Market</small>
                        </div>

                        <div className="preview-day">
                            <span>DAY 03</span>
                            <strong>Adventure Day</strong>
                            <small>Water Sports · Cruise</small>
                        </div>

                    </div>

                    <div className="preview-footer">
                        <span>Estimated budget</span>
                        <strong>₹15,000</strong>
                    </div>

                </div>

            </section>


            {/* =================================================
                COMPANY TOURS
            ================================================= */}

            <section className="tours-section">

                <div className="section-heading tour-heading">

                    <div>

                        <span className="eyebrow">
                            EXPLORE ORGANIZED TOURS
                        </span>

                        <h2>
                            Your next adventure is already waiting.
                        </h2>

                        <p>
                            Discover group tours created by travel companies
                            and find the journey that feels right for you.
                        </p>

                    </div>

                    <Link to="/tours" className="view-all">
                        View all tours →
                    </Link>

                </div>


                <div className="tour-grid">

                    {featuredTours.map((tour) => {

                        const remaining =
                            tour.total - tour.joined;

                        return (

                            <div
                                className="tour-card"
                                key={tour.id}
                            >

                                <div className="tour-image">

                                    <img
                                        src={tour.image}
                                        alt={tour.title}
                                    />

                                    <span className="tour-badge">
                                        GROUP TOUR
                                    </span>

                                </div>


                                <div className="tour-body">

                                    <div className="tour-location">
                                        <span>⌖</span>
                                        {tour.location}
                                    </div>

                                    <h3>
                                        {tour.title}
                                    </h3>

                                    <p className="tour-company">
                                        By {tour.company}
                                    </p>

                                    <div className="tour-meta">

                                        <span>
                                            ◷ {tour.duration}
                                        </span>

                                        <span>
                                            👥 {remaining} seats left
                                        </span>

                                    </div>


                                    <div className="tour-bottom">

                                        <div>
                                            <small>
                                                Starting from
                                            </small>

                                            <strong>
                                                {tour.price}
                                            </strong>

                                            <span>
                                                / traveller
                                            </span>
                                        </div>

                                        <Link to={`/tour/${tour.id}`}>
                                            View Tour →
                                        </Link>

                                    </div>

                                </div>

                            </div>

                        );

                    })}

                </div>

            </section>


            {/* =================================================
                COMPANY CTA
            ================================================= */}

            <section className="company-cta">

                <div className="company-cta-content">

                    <span className="section-tag">
                        FOR TRAVEL COMPANIES
                    </span>

                    <h2>
                        Have a journey
                        <br />
                        <span>worth sharing?</span>
                    </h2>

                    <p>
                        Register your travel company on TravelMet, publish
                        your tours and connect with travellers looking for
                        their next adventure.
                    </p>

                    <Link to="/company-register">
                        <button className="gold-btn">
                            Become a Travel Partner
                            <span>→</span>
                        </button>
                    </Link>

                </div>


                <div className="company-steps">

                    <div>
                        <span>01</span>
                        <h4>Register</h4>
                        <p>Create your travel company profile.</p>
                    </div>

                    <div>
                        <span>02</span>
                        <h4>Publish</h4>
                        <p>Add your tours and available seats.</p>
                    </div>

                    <div>
                        <span>03</span>
                        <h4>Connect</h4>
                        <p>Welcome travellers to your journey.</p>
                    </div>

                </div>

            </section>


            {/* =================================================
                FEATURES
            ================================================= */}

            <section className="features">

                <div className="section-heading">

                    <span className="eyebrow">
                        WHY TRAVELMET
                    </span>

                    <h2>
                        Everything you need to travel better.
                    </h2>

                </div>


                <div className="feature-grid">

                    <div className="feature-card">
                        <span>✦</span>
                        <h3>AI Planning</h3>
                        <p>
                            Get personalized day-by-day travel plans in
                            seconds.
                        </p>
                    </div>

                    <div className="feature-card">
                        <span>✈</span>
                        <h3>Organized Tours</h3>
                        <p>
                            Join trips created by professional travel
                            companies.
                        </p>
                    </div>

                    <div className="feature-card">
                        <span>♡</span>
                        <h3>Save Your Trips</h3>
                        <p>
                            Keep your favourite journeys and experiences
                            organized.
                        </p>
                    </div>

                    <div className="feature-card">
                        <span>◎</span>
                        <h3>Travel Community</h3>
                        <p>
                            Connect with travellers and share your
                            experiences.
                        </p>
                    </div>

                </div>

            </section>


            {/* =================================================
                FINAL CTA
            ================================================= */}

            <section className="cta">

                <div className="cta-inner">

                    <span className="eyebrow light">
                        YOUR NEXT CHAPTER STARTS HERE
                    </span>

                    <h2>
                        Where will
                        <br />
                        you go next?
                    </h2>

                    <p>
                        Let TravelMet help you turn your travel idea into
                        an unforgettable journey.
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

        </div>
    );
}

export default Home;