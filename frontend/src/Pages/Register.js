import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../Css/Register.css";

function Register() {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const [user, setUser] = useState({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        password: ""
    });

    const handleChange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            !user.firstName.trim() ||
            !user.lastName.trim() ||
            !user.username.trim() ||
            !user.email.trim() ||
            !user.password.trim()
        ) {
            alert("Please fill all fields");
            return;
        }

        if (user.password.length < 6) {
            alert("Password must be at least 6 characters");
            return;
        }

        try {
            setLoading(true);

            console.log("REGISTER REQUEST:", user);

            const response = await api.post(
                "/api/auth/register",
                {
                    firstName: user.firstName.trim(),
                    lastName: user.lastName.trim(),
                    username: user.username.trim(),
                    email: user.email.trim().toLowerCase(),
                    password: user.password
                },
                {
                    timeout: 15000
                }
            );

            console.log("REGISTER RESPONSE:", response.data);

            alert(
                response.data.message ||
                "Registration Successful"
            );

            setUser({
                firstName: "",
                lastName: "",
                username: "",
                email: "",
                password: ""
            });

            navigate("/login");

        } catch (error) {
            console.error("REGISTER ERROR:", error);

            if (error.code === "ECONNABORTED") {
                alert(
                    "Server is taking too long to respond. Please check your backend."
                );
            }

            else if (error.response) {
                alert(
                    error.response.data?.message ||
                    "Registration failed"
                );
            }

            else if (error.request) {
                alert(
                    "Unable to connect to server. Please check your backend URL."
                );
            }

            else {
                alert("Something went wrong. Please try again.");
            }

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-page">

            <h1>
                Create Your TravelMet Account
            </h1>

            <form
                className="register-form"
                onSubmit={handleSubmit}
            >

                <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={user.firstName}
                    onChange={handleChange}
                    disabled={loading}
                />

                <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={user.lastName}
                    onChange={handleChange}
                    disabled={loading}
                />

                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={user.username}
                    onChange={handleChange}
                    disabled={loading}
                />

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={user.email}
                    onChange={handleChange}
                    disabled={loading}
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={user.password}
                    onChange={handleChange}
                    disabled={loading}
                />

                <button
                    type="submit"
                    disabled={loading}
                >
                    {loading
                        ? "Creating Account..."
                        : "Register"
                    }
                </button>

            </form>

        </div>
    );
}

export default Register;