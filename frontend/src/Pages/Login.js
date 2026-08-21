import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../Css/Login.css";

function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async (e) => {

        e.preventDefault();

        if (!email.trim() || !password.trim()) {
            alert("Please fill all fields");
            return;
        }

        try {

            setLoading(true);

            const response = await api.post(
                "/api/auth/login",
                {
                    email: email.trim().toLowerCase(),
                    password
                },
                {
                    timeout: 15000
                }
            );

            console.log("LOGIN RESPONSE:", response.data);

            // ================= TOKEN =================

            localStorage.setItem(
                "token",
                response.data.token
            );

            // ================= USER =================

            const loggedInUser = response.data.user;

            const userData = {
                ...loggedInUser,
                id: loggedInUser.id || loggedInUser._id
            };

            localStorage.setItem(
                "user",
                JSON.stringify(userData)
            );

            console.log("SAVED USER:", userData);

            alert(
                response.data.message ||
                "Login Successful"
            );

            navigate("/profile");

        } catch (error) {

            console.error("LOGIN ERROR:", error);

            if (error.code === "ECONNABORTED") {

                alert(
                    "Server is taking too long to respond."
                );

            }

            else if (error.response) {

                alert(
                    error.response.data?.message ||
                    "Login failed"
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

        } finally {

            setLoading(false);

        }
    };

    return (

        <div className="login-page">

            <h1>
                Login To TravelMet
            </h1>

            <form
                className="login-form"
                onSubmit={handleLogin}
            >

                <input
                    type="email"
                    placeholder="Enter Email"
                    value={email}
                    onChange={(e) =>
                        setEmail(e.target.value)
                    }
                    disabled={loading}
                />

                <input
                    type="password"
                    placeholder="Enter Password"
                    value={password}
                    onChange={(e) =>
                        setPassword(e.target.value)
                    }
                    disabled={loading}
                />

                <button
                    type="submit"
                    disabled={loading}
                >

                    {loading
                        ? "Logging In..."
                        : "Login"
                    }

                </button>

                <Link to="/register">
                    New User? Register
                </Link>

            </form>

        </div>
    );
}

export default Login;