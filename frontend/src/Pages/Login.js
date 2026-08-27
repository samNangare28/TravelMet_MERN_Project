import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../Css/Login.css";

function Login() {

    const [loginType, setLoginType] = useState("user");

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


            // ==========================================
            // SELECT API BASED ON LOGIN TYPE
            // ==========================================

            const loginUrl =
                loginType === "company"
                    ? "/api/company-auth/login"
                    : "/api/auth/login";


            const response = await api.post(

                loginUrl,

                {
                    email: email.trim().toLowerCase(),
                    password
                },

                {
                    timeout: 15000
                }

            );


            console.log(
                "LOGIN RESPONSE:",
                response.data
            );


            // ==========================================
            // COMPANY LOGIN
            // ==========================================

            if (loginType === "company") {

                // Remove old user session
                localStorage.removeItem("token");
                localStorage.removeItem("user");


                // Save company token
                localStorage.setItem(
                    "companyToken",
                    response.data.token
                );


                // Save company data
                localStorage.setItem(
                    "company",
                    JSON.stringify(
                        response.data.company
                    )
                );


                console.log(
                    "SAVED COMPANY:",
                    response.data.company
                );


                alert(
                    response.data.message ||
                    "Company login successful"
                );


                navigate("/company/profile");

                return;

            }


            // ==========================================
            // USER LOGIN
            // ==========================================

            localStorage.removeItem("companyToken");
            localStorage.removeItem("company");


            localStorage.setItem(
                "token",
                response.data.token
            );


            const loggedInUser =
                response.data.user;


            const userData = {

                ...loggedInUser,

                id:
                    loggedInUser.id ||
                    loggedInUser._id

            };


            localStorage.setItem(
                "user",
                JSON.stringify(userData)
            );


            console.log(
                "SAVED USER:",
                userData
            );


            alert(
                response.data.message ||
                "Login Successful"
            );


            navigate("/profile");


        } catch (error) {

            console.error(
                "LOGIN ERROR:",
                error
            );


            if (
                error.code ===
                "ECONNABORTED"
            ) {

                alert(
                    "Server is taking too long to respond."
                );

            }

            else if (error.response) {

                alert(
                    error.response.data?.message ||
                    (
                        loginType === "company"
                            ? "Company login failed"
                            : "Login failed"
                    )
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


            {/* ==========================================
                LOGIN TYPE
            ========================================== */}

            <div className="login-type-selector">

                <button
                    type="button"
                    className={
                        loginType === "user"
                            ? "login-type-btn active"
                            : "login-type-btn"
                    }
                    onClick={() =>
                        setLoginType("user")
                    }
                    disabled={loading}
                >
                    👤 Traveler
                </button>


                <button
                    type="button"
                    className={
                        loginType === "company"
                            ? "login-type-btn active"
                            : "login-type-btn"
                    }
                    onClick={() =>
                        setLoginType("company")
                    }
                    disabled={loading}
                >
                    🏢 Travel Company
                </button>

            </div>


            <form
                className="login-form"
                onSubmit={handleLogin}
            >

                <input
                    type="email"
                    placeholder={
                        loginType === "company"
                            ? "Enter Company Email"
                            : "Enter Email"
                    }
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


                {/* ==========================================
                    FORGOT PASSWORD
                ========================================== */}

                {loginType === "user" && (

                    <div className="login-forgot-row">

                        <Link to="/forgot-password">
                            Forgot Password?
                        </Link>

                    </div>

                )}


                <button
                    type="submit"
                    disabled={loading}
                >

                    {loading

                        ? "Logging In..."

                        : loginType === "company"

                            ? "Login as Company"

                            : "Login"

                    }

                </button>


                {/* ==========================================
                    USER REGISTER
                ========================================== */}

                {loginType === "user" && (

                    <Link to="/register">
                        New User? Register
                    </Link>

                )}


                {/* ==========================================
                    COMPANY REGISTER
                ========================================== */}

                {loginType === "company" && (

                    <Link to="/company/register">
                        New Company? Register Your Company
                    </Link>

                )}

            </form>

        </div>

    );

}


export default Login;
