import { useNavigate } from "react-router-dom";
import "../Css/Contact.css";

function Contact() {
  const navigate = useNavigate();

  return (

<div className="contact-page">

    <section className="contact-hero">

        <h1>

            📬 Contact TravelMet

        </h1>

        <p>

            Have questions, suggestions or travel ideas?
            We'd love to hear from you!

        </p>

    </section>

    <section className="contact-container">

        {/* Left Side */}

        <div className="contact-info">

            <h2>

                Get In Touch

            </h2>

            <div className="info-box">

                <h4>📍 Address</h4>

                <p>Pune, Maharashtra, India</p>

            </div>

            <div className="info-box">

                <h4>📧 Email</h4>

                <p>travelmet@gmail.com</p>

            </div>

            <div className="info-box">

                <h4>📞 Phone</h4>

                <p>+91 9876543210</p>

            </div>

            <div className="info-box">

                <h4>🕒 Working Hours</h4>

                <p>Mon - Sat : 9:00 AM - 7:00 PM</p>

            </div>

        </div>

        {/* Right Side */}

        <div className="contact-form">

            <h2>

                Send Us A Message

            </h2>

            <input
                type="text"
                placeholder="Your Name"
            />

            <input
                type="email"
                placeholder="Your Email"
            />

            <input
                type="text"
                placeholder="Subject"
            />

            <textarea
                rows="6"
                placeholder="Write your message..."
            ></textarea>

            <button onClick={() => navigate("/message-success")}>
              Send Message ✈️
            </button>

        </div>

    </section>

    <section className="contact-footer-text">

        <h2>

            🌎 Every great journey starts with a conversation.

        </h2>

        <p>

            Thank you for choosing TravelMet.
            We hope to make your next trip unforgettable.

        </p>

    </section>

</div>

);
}


export default Contact;