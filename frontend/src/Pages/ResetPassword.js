import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import "../Css/Login.css";

function ResetPassword() {

    const { token } = useParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (password.length < 6) {
            alert("Password must be at least 6 characters");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        try {

            setLoading(true);

            const response = await api.put(
                `/api/auth/reset-password/${token}`,
                { password }
            );

            alert(response.data.message || "Password reset successful");

            navigate("/login");

        }

        catch (error) {

            console.error("Reset Password Error:", error);

            alert(
                error.response?.data?.message ||
                "Reset link is invalid or has expired"
            );

        }

        finally {

            setLoading(false);

        }

    };

    return (

        <div className="login-page">

            <h1>Reset Password</h1>

            <form className="login-form" onSubmit={handleSubmit}>

                <p className="login-subtext">
                    Choose a new password for your account.
                </p>

                <input
                    type="password"
                    placeholder="New Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                />

                <input
                    type="password"
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={loading}
                />

                <button type="submit" disabled={loading}>
                    {loading ? "Resetting..." : "Reset Password"}
                </button>

                <Link to="/login">Back to Login</Link>

            </form>

        </div>

    );

}

export default ResetPassword;