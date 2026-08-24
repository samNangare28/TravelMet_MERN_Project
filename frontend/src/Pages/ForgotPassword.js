import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import "../Css/Login.css";

function ForgotPassword() {

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!email.trim()) {
            alert("Please enter your email");
            return;
        }

        try {

            setLoading(true);

            await api.post("/api/auth/forgot-password", {
                email: email.trim().toLowerCase()
            });

            setSent(true);

        }

        catch (error) {

            console.error("Forgot Password Error:", error);

            alert(
                error.response?.data?.message ||
                "Something went wrong. Please try again."
            );

        }

        finally {

            setLoading(false);

        }

    };

    return (

        <div className="login-page">

            <h1>Forgot Password</h1>

            {sent ? (

                <div className="login-form">

                    <span className="login-success-icon">📬</span>

                    <p className="login-success-text">
                        If an account exists for<br />
                        <strong>{email}</strong><br />
                        a password reset link has been sent.
                        Please check your inbox (and spam folder).
                    </p>

                    <Link to="/login">Back to Login</Link>

                </div>

            ) : (

                <form className="login-form" onSubmit={handleSubmit}>

                    <p className="login-subtext">
                        Enter your account email and we'll send you a
                        link to reset your password.
                    </p>

                    <input
                        type="email"
                        placeholder="Enter Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
                    />

                    <button type="submit" disabled={loading}>
                        {loading ? "Sending..." : "Send Reset Link"}
                    </button>

                    <Link to="/login">Back to Login</Link>

                </form>

            )}

        </div>

    );

}

export default ForgotPassword;