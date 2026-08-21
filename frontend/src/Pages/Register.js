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
            !user.firstName ||
            !user.lastName ||
            !user.username ||
            !user.email ||
            !user.password
        ) {

            alert("Please fill all fields");
            return;

        }

        try {

            setLoading(true);

            const response = await api.post(

                "/api/auth/register",

                user

            );

            alert(response.data.message);

            navigate("/login");

        }

        catch (error) {

            if (error.response) {

                alert(error.response.data.message);

            }

            else {

                alert("Server Error");

            }

        }

        finally {

            setLoading(false);

        }

    };

    return (

        <div className="register-page">

            <h1>Create Your TravelMet Account</h1>

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

                />

                <input

                    type="text"

                    name="lastName"

                    placeholder="Last Name"

                    value={user.lastName}

                    onChange={handleChange}

                />

                <input

                    type="text"

                    name="username"

                    placeholder="Username"

                    value={user.username}

                    onChange={handleChange}

                />

                <input

                    type="email"

                    name="email"

                    placeholder="Email"

                    value={user.email}

                    onChange={handleChange}

                />

                <input

                    type="password"

                    name="password"

                    placeholder="Password"

                    value={user.password}

                    onChange={handleChange}

                />

                <button type="submit">

                    {
                        loading
                            ? "Creating Account..."
                            : "Register"
                    }

                </button>

            </form>

        </div>

    );

}

export default Register;