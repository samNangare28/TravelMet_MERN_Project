import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../Css/Register.css";

function Register() {

    const navigate = useNavigate();

    const [accountType, setAccountType] = useState("user");
    const [loading, setLoading] = useState(false);

    // ===============================
    // USER DATA
    // ===============================

    const [user, setUser] = useState({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        password: ""
    });


    // ===============================
    // COMPANY DATA
    // ===============================

    const [company, setCompany] = useState({
        companyName: "",
        ownerName: "",
        email: "",
        phone: "",
        password: "",
        address: "",
        description: "",
        website: "",
        certificate: ""
    });


    // ===============================
    // USER CHANGE
    // ===============================

    const handleUserChange = (e) => {

        setUser({
            ...user,
            [e.target.name]: e.target.value
        });

    };


    // ===============================
    // COMPANY CHANGE
    // ===============================

    const handleCompanyChange = (e) => {

        setCompany({
            ...company,
            [e.target.name]: e.target.value
        });

    };


    // ===============================
    // USER REGISTER
    // ===============================

    const registerUser = async () => {

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

            alert(
                "Password must be at least 6 characters"
            );

            return;

        }


        try {

            setLoading(true);

            const response = await api.post(
                "/api/auth/register",
                {
                    firstName:
                        user.firstName.trim(),

                    lastName:
                        user.lastName.trim(),

                    username:
                        user.username.trim(),

                    email:
                        user.email.trim().toLowerCase(),

                    password:
                        user.password
                },
                {
                    timeout: 15000
                }
            );


            console.log(
                "USER REGISTER RESPONSE:",
                response.data
            );


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

        }

        catch (error) {

            console.error(
                "USER REGISTER ERROR:",
                error
            );


            handleRegisterError(error);

        }

        finally {

            setLoading(false);

        }

    };


    // ===============================
    // COMPANY REGISTER
    // ===============================

    const registerCompany = async () => {

        if (
            !company.companyName.trim() ||
            !company.ownerName.trim() ||
            !company.email.trim() ||
            !company.phone.trim() ||
            !company.password.trim() ||
            !company.address.trim() ||
            !company.certificate.trim()
        ) {

            alert(
                "Please fill all required company fields"
            );

            return;

        }


        if (company.password.length < 6) {

            alert(
                "Password must be at least 6 characters"
            );

            return;

        }


        try {

            setLoading(true);


            const response = await api.post(
                "/api/company-auth/register",
                {

                    companyName:
                        company.companyName.trim(),

                    ownerName:
                        company.ownerName.trim(),

                    email:
                        company.email.trim().toLowerCase(),

                    phone:
                        company.phone.trim(),

                    password:
                        company.password,

                    address:
                        company.address.trim(),

                    description:
                        company.description.trim(),

                    website:
                        company.website.trim(),

                    certificate:
                        company.certificate.trim()

                },
                {
                    timeout: 15000
                }
            );


            console.log(
                "COMPANY REGISTER RESPONSE:",
                response.data
            );


            alert(
                response.data.message ||
                "Company registration submitted successfully."
            );


            setCompany({
                companyName: "",
                ownerName: "",
                email: "",
                phone: "",
                password: "",
                address: "",
                description: "",
                website: "",
                certificate: ""
            });


            navigate("/login");

        }

        catch (error) {

            console.error(
                "COMPANY REGISTER ERROR:",
                error
            );


            handleRegisterError(error);

        }

        finally {

            setLoading(false);

        }

    };


    // ===============================
    // ERROR HANDLER
    // ===============================

    const handleRegisterError = (error) => {

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

            alert(
                "Something went wrong. Please try again."
            );

        }

    };


    // ===============================
    // FORM SUBMIT
    // ===============================

    const handleSubmit = (e) => {

        e.preventDefault();

        if (accountType === "user") {

            registerUser();

        }

        else {

            registerCompany();

        }

    };


    // ===============================
    // RENDER
    // ===============================

    return (

        <div className="register-page">

            <h1>
                Join TravelMet
            </h1>


            {/* ===============================
                ACCOUNT TYPE
            =============================== */}

            <div className="account-type-section">

                <p className="account-type-title">
                    How do you want to join TravelMet?
                </p>


                <div className="account-type-options">

                    <button
                        type="button"
                        className={
                            accountType === "user"
                                ? "account-type-card active"
                                : "account-type-card"
                        }
                        onClick={() =>
                            setAccountType("user")
                        }
                        disabled={loading}
                    >

                        <span className="account-type-icon">
                            👤
                        </span>

                        <span>
                            Traveler
                        </span>

                    </button>


                    <button
                        type="button"
                        className={
                            accountType === "company"
                                ? "account-type-card active"
                                : "account-type-card"
                        }
                        onClick={() =>
                            setAccountType("company")
                        }
                        disabled={loading}
                    >

                        <span className="account-type-icon">
                            🏢
                        </span>

                        <span>
                            Travel Company
                        </span>

                    </button>

                </div>

            </div>


            {/* ===============================
                FORM
            =============================== */}

            <form
                className="register-form"
                onSubmit={handleSubmit}
            >

                {/* ===============================
                    USER FORM
                =============================== */}

                {accountType === "user" && (

                    <>

                        <input
                            type="text"
                            name="firstName"
                            placeholder="First Name"
                            value={user.firstName}
                            onChange={handleUserChange}
                            disabled={loading}
                        />


                        <input
                            type="text"
                            name="lastName"
                            placeholder="Last Name"
                            value={user.lastName}
                            onChange={handleUserChange}
                            disabled={loading}
                        />


                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            value={user.username}
                            onChange={handleUserChange}
                            disabled={loading}
                        />


                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={user.email}
                            onChange={handleUserChange}
                            disabled={loading}
                        />


                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={user.password}
                            onChange={handleUserChange}
                            disabled={loading}
                        />

                    </>

                )}


                {/* ===============================
                    COMPANY FORM
                =============================== */}

                {accountType === "company" && (

                    <>

                        <input
                            type="text"
                            name="companyName"
                            placeholder="Company Name *"
                            value={company.companyName}
                            onChange={handleCompanyChange}
                            disabled={loading}
                        />


                        <input
                            type="text"
                            name="ownerName"
                            placeholder="Owner / Authorized Person *"
                            value={company.ownerName}
                            onChange={handleCompanyChange}
                            disabled={loading}
                        />


                        <input
                            type="email"
                            name="email"
                            placeholder="Business Email *"
                            value={company.email}
                            onChange={handleCompanyChange}
                            disabled={loading}
                        />


                        <input
                            type="tel"
                            name="phone"
                            placeholder="Business Phone *"
                            value={company.phone}
                            onChange={handleCompanyChange}
                            disabled={loading}
                        />


                        <input
                            type="password"
                            name="password"
                            placeholder="Password *"
                            value={company.password}
                            onChange={handleCompanyChange}
                            disabled={loading}
                        />


                        <input
                            type="text"
                            name="address"
                            placeholder="Company Address *"
                            value={company.address}
                            onChange={handleCompanyChange}
                            disabled={loading}
                        />


                        <textarea
                            name="description"
                            placeholder="About your company"
                            value={company.description}
                            onChange={handleCompanyChange}
                            disabled={loading}
                        />


                        <input
                            type="url"
                            name="website"
                            placeholder="Company Website (Optional)"
                            value={company.website}
                            onChange={handleCompanyChange}
                            disabled={loading}
                        />


                        <input
                            type="url"
                            name="certificate"
                            placeholder="Certificate / Licence Document URL *"
                            value={company.certificate}
                            onChange={handleCompanyChange}
                            disabled={loading}
                        />

                        <small className="certificate-note">
                            Your certificate will be reviewed by
                            TravelMet admin before verification.
                        </small>

                    </>

                )}


                {/* ===============================
                    SUBMIT
                =============================== */}

                <button
                    type="submit"
                    disabled={loading}
                >

                    {loading

                        ? "Submitting..."

                        : accountType === "user"

                            ? "Create Traveler Account"

                            : "Submit Company Application"

                    }

                </button>


                <button
                    type="button"
                    className="login-link-button"
                    onClick={() =>
                        navigate("/login")
                    }
                    disabled={loading}
                >

                    Already have an account? Login

                </button>

            </form>

        </div>

    );

}

export default Register;