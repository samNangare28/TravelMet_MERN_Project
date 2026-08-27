import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../Css/CompanyLogin.css";

function CompanyLogin() {

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
                "/api/company-auth/login",
                {
                    email: email.trim().toLowerCase(),
                    password
                },
                {
                    timeout: 15000
                }
            );

            console.log(
                "COMPANY LOGIN RESPONSE:",
                response.data
            );

            // ==============================
            // SAVE COMPANY TOKEN
            // ==============================

            localStorage.setItem(
                "companyToken",
                response.data.token
            );

            // ==============================
            // SAVE COMPANY DATA
            // ==============================

            localStorage.setItem(
                "company",
                JSON.stringify(response.data.company)
            );

            alert(
                response.data.message ||
                "Company login successful"
            );

            navigate("/company/profile");

        } catch (error) {

            console.error(
                "COMPANY LOGIN ERROR:",
                error
            );

            if (error.code === "ECONNABORTED") {

                alert(
                    "Server is taking too long to respond."
                );

            } else if (error.response) {

                alert(
                    error.response.data?.message ||
                    "Company login failed"
                );

            } else if (error.request) {

                alert(
                    "Unable to connect to server."
                );

            } else {

                alert(
                    "Something went wrong. Please try again."
                );

            }

        } finally {

            setLoading(false);

        }
    };


    return (

        <div className="company-login-page">

            <div className="company-login-card">

                <div className="company-login-header">

                    <div className="company-icon">
                        🏢
                    </div>

                    <span className="company-label">
                        TRAVEL PARTNER
                    </span>

                    <h1>
                        Company Login
                    </h1>

                    <p>
                        Login to manage your TravelMet
                        company profile.
                    </p>

                </div>


                <form
                    className="company-login-form"
                    onSubmit={handleLogin}
                >

                    <div className="form-group">

                        <label>
                            Company Email
                        </label>

                        <input
                            type="email"
                            placeholder="Enter company email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            disabled={loading}
                        />

                    </div>


                    <div className="form-group">

                        <label>
                            Password
                        </label>

                        <input
                            type="password"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            disabled={loading}
                        />

                    </div>


                    <button
                        type="submit"
                        className="company-login-btn"
                        disabled={loading}
                    >

                        {loading
                            ? "Logging In..."
                            : "Login as Company"
                        }

                    </button>


                    <div className="company-login-footer">

                        <span>
                            New travel company?
                        </span>

                        <Link to="/company/register">
                            Register Your Company
                        </Link>

                    </div>

                    <Link
                        to="/login"
                        className="user-login-link"
                    >
                        ← Login as TravelMet User
                    </Link>

                </form>

            </div>

        </div>

    );
}

export default CompanyLogin;
