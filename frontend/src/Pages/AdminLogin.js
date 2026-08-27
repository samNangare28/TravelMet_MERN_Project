import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../Css/AdminLogin.css";

function AdminLogin() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {

        e.preventDefault();

        if (!email.trim() || !password.trim()) {
            alert("Please enter email and password");
            return;
        }

        try {

            setLoading(true);

            const response = await api.post(
                "/api/admin/login",
                {
                    email: email.trim().toLowerCase(),
                    password
                },
                {
                    timeout: 15000
                }
            );

            console.log(
                "ADMIN LOGIN RESPONSE:",
                response.data
            );

            if (!response.data.success) {

                alert(
                    response.data.message ||
                    "Admin login failed"
                );

                return;
            }

            // =====================================
            // SAVE ADMIN TOKEN
            // =====================================

            localStorage.setItem(
                "adminToken",
                response.data.token
            );

            // =====================================
            // SAVE ADMIN DATA
            // =====================================

            localStorage.setItem(
                "admin",
                JSON.stringify(response.data.admin)
            );

            alert(
                response.data.message ||
                "Admin login successful"
            );

            navigate("/admin/dashboard");

        }

        catch (error) {

            console.error(
                "ADMIN LOGIN ERROR:",
                error
            );

            if (error.code === "ECONNABORTED") {

                alert(
                    "Server is taking too long to respond."
                );

            }

            else if (error.response) {

                alert(
                    error.response.data?.message ||
                    "Invalid admin credentials"
                );

            }

            else if (error.request) {

                alert(
                    "Unable to connect to server."
                );

            }

            else {

                alert(
                    "Something went wrong. Please try again."
                );

            }

        }

        finally {

            setLoading(false);

        }

    };

    return (

        <div className="admin-login-page">

            <div className="admin-login-card">

                <div className="admin-login-icon">
                    🛡️
                </div>

                <h1>
                    TravelMet Admin
                </h1>

                <p className="admin-login-subtitle">
                    Secure administration portal
                </p>

                <form
                    className="admin-login-form"
                    onSubmit={handleLogin}
                >

                    <div className="admin-input-group">

                        <label>
                            Admin Email
                        </label>

                        <input
                            type="email"
                            placeholder="Enter admin email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            disabled={loading}
                        />

                    </div>

                    <div className="admin-input-group">

                        <label>
                            Password
                        </label>

                        <input
                            type="password"
                            placeholder="Enter admin password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            disabled={loading}
                        />

                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                    >

                        {loading
                            ? "Signing In..."
                            : "Admin Login"
                        }

                    </button>

                </form>

                <p className="admin-security-text">
                    🔒 Authorized TravelMet administrators only
                </p>

            </div>

        </div>

    );

}

export default AdminLogin;