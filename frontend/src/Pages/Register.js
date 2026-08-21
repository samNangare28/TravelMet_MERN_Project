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

    // Handle input changes
    const handleChange = (e) => {

        setUser({
            ...user,
            [e.target.name]: e.target.value
        });

    };

    // Handle registration
    const handleSubmit = async (e) => {

        e.preventDefault();

        console.log("🔥 REGISTER BUTTON CLICKED");

        // Check empty fields
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

        try {

            setLoading(true);

            console.log("📤 Sending registration request...");
            console.log("Email:", user.email);

            const response = await api.post(
                "/api/auth/register",
                user
            );

            console.log(
                "✅ Registration successful:",
                response.data
            );

            alert(
                response.data.message ||
                "Registration Successful"
            );

            // Clear form
            setUser({
                firstName: "",
                lastName: "",
                username: "",
                email: "",
                password: ""
            });

            // Go to login page
            navigate("/login");

        }

        catch (error) {

            console.log("❌ Registration Error:", error);

            console.log(
                "❌ Response:",
                error.response
            );

            console.log(
                "❌ Response Data:",
                error.response?.data
            );

            if (error.response) {

                alert(
                    error.response.data?.message ||
                    "Registration failed"
                );

            }

            else if (error.request) {

                alert(
                    "Unable to connect to server. Please try again."
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

        <div className="register-page">

            <h1>
                Create Your TravelMet Account
            </h1>

            <form
                className="register-form"
                onSubmit={handleSubmit}
            >

                {/* First Name */}

                <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={user.firstName}
                    onChange={handleChange}
                    required
                    disabled={loading}
                />

                {/* Last Name */}

                <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={user.lastName}
                    onChange={handleChange}
                    required
                    disabled={loading}
                />

                {/* Username */}

                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={user.username}
                    onChange={handleChange}
                    required
                    disabled={loading}
                />

                {/* Email */}

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={user.email}
                    onChange={handleChange}
                    required
                    disabled={loading}
                />

                {/* Password */}

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={user.password}
                    onChange={handleChange}
                    required
                    disabled={loading}
                />

                {/* Register Button */}

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