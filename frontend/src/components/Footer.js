import { Link } from "react-router-dom";
import "../Css/Footer.css";

function Footer() {

    return (

        <footer className="footer">

            <div className="footer-container">

                {/* Left */}

                <div className="footer-about">

                    <h2>✈ TravelMet</h2>

                    <p>

                        Travel smarter with AI. Discover beautiful destinations,
                        plan your dream trips and create unforgettable memories.

                    </p>

                </div>

                {/* Quick Links */}

                <div className="footer-links">

                    <h3>Quick Links</h3>

                    <Link to="/">Home</Link>

                    <Link to="/trip-planner">AI Planner</Link>

                    <Link to="/blogs">Blog</Link>

                    <Link to="/community">Community</Link>

                    <Link to="/contact">Contact</Link>

                </div>

                {/* Contact */}

                <div className="footer-contact">

                    <h3>Contact</h3>

                    <p>📧 travelmet@gmail.com</p>

                    <p>📱 +91 9876543210</p>

                    <p>📍 Pune, Maharashtra</p>

                </div>

            </div>

            <div className="footer-bottom">

                © 2026 TravelMet | Made with ❤️ by Samruddhi Nangare

            </div>

        </footer>

    );

}

export default Footer;