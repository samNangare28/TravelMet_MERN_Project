import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../Css/Contact.css";

function Contact() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const [sending, setSending] = useState(false);

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      alert("Please fill your name, email and message.");
      return;
    }

    setSending(true);

    try {

      await api.post("/api/contact", formData);

      navigate("/message-success");

    } catch (error) {

      console.log("Contact Form Error:", error);

      alert(
        error.response?.data?.message ||
        "Unable to send message. Please try again."
      );

    } finally {

      setSending(false);

    }

  };

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

            <form onSubmit={handleSubmit}>

                <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />

                <input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />

                <input
                    type="text"
                    name="subject"
                    placeholder="Subject"
                    value={formData.subject}
                    onChange={handleChange}
                />

                <textarea
                    name="message"
                    rows="6"
                    placeholder="Write your message..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                ></textarea>

                <button type="submit" disabled={sending}>
                  {sending ? "Sending..." : "Send Message ✈️"}
                </button>

            </form>

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