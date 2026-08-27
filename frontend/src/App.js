import { BrowserRouter, Routes, Route } from "react-router-dom";

// ===============================
// COMMON COMPONENTS
// ===============================

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import MobileBottomNav from "./components/MobileBottomNav";

// ===============================
// USER PAGES
// ===============================

import Home from "./Pages/Home";
import TripPlanner from "./Pages/TripPlanner";
import Contact from "./Pages/Contact";
import Register from "./Pages/Register";
import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";
import Profile from "./Pages/Profile";
import CreatePost from "./Pages/CreatePost";
import EditProfile from "./Pages/EditProfile";
import PostDetails from "./Pages/PostDetails";
import EditPost from "./Pages/EditPost";
import TripPreview from "./Pages/TripPreview";
import TripDetails from "./Pages/TripDetails";
import Community from "./Pages/Community";
import MessageSuccess from "./Pages/MessageSuccess";
import UserProfile from "./Pages/UserProfile";
import PublicProfile from "./Pages/PublicProfile";
import Notifications from "./Pages/Notifications";
import Search from "./Pages/Search";
import Blogs from "./Pages/Blogs";
import BlogDetails from "./Pages/BlogDetails";
import CreateBlog from "./Pages/CreateBlog";
import EditBlog from "./Pages/EditBlog";
import ForgotPassword from "./Pages/ForgotPassword";
import ResetPassword from "./Pages/ResetPassword";
import CompanyLogin from "./Pages/CompanyLogin";

// ===============================
// USER PROTECTED ROUTE
// ===============================

import ProtectedRoute from "./components/ProtectedRoute";

// ===============================
// ADMIN
// ===============================

import AdminLogin from "./Pages/AdminLogin";
import AdminDashboard from "./Pages/AdminDashboard";
import AdminProtectedRoute from "./components/AdminProtectedRoute";


function App() {

    return (

        <BrowserRouter>

            {/* =====================================
                MAIN WEBSITE NAVBAR
            ===================================== */}

            <Navbar />


            <Routes>

                {/* =====================================
                    HOME
                ===================================== */}

                <Route
                    path="/"
                    element={<Home />}
                />


                {/* =====================================
                    COMMUNITY
                ===================================== */}

                <Route
                    path="/community"
                    element={<Community />}
                />


                {/* =====================================
                    TRIP PLANNER
                ===================================== */}

                <Route
                    path="/trip-planner"
                    element={<TripPlanner />}
                />


                {/* =====================================
                    CONTACT
                ===================================== */}

                <Route
                    path="/contact"
                    element={<Contact />}
                />


                {/* =====================================
                    USER AUTH
                ===================================== */}

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />


                {/* =====================================
                    ADMIN LOGIN
                ===================================== */}

                <Route
                    path="/admin/login"
                    element={<AdminLogin />}
                />


                {/* =====================================
                    ADMIN DASHBOARD
                ===================================== */}

                <Route
                    path="/admin/dashboard"
                    element={
                        <AdminProtectedRoute>
                            <AdminDashboard />
                        </AdminProtectedRoute>
                    }
                />


                {/* =====================================
                    USER DASHBOARD
                ===================================== */}

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/company/login"
                    element={<CompanyLogin />}
                />

                {/* =====================================
                    USER PROFILE
                ===================================== */}

                <Route
                    path="/profile"
                    element={<Profile />}
                />

                <Route
                    path="/profile/:id"
                    element={<PublicProfile />}
                />

                <Route
                    path="/user/:id"
                    element={<UserProfile />}
                />

                <Route
                    path="/edit-profile"
                    element={<EditProfile />}
                />


                {/* =====================================
                    POSTS
                ===================================== */}

                <Route
                    path="/create-post"
                    element={<CreatePost />}
                />

                <Route
                    path="/post/:id"
                    element={<PostDetails />}
                />

                <Route
                    path="/edit-post/:id"
                    element={<EditPost />}
                />


                {/* =====================================
                    BLOGS
                ===================================== */}

                <Route
                    path="/blogs"
                    element={<Blogs />}
                />

                <Route
                    path="/blogs/:id"
                    element={<BlogDetails />}
                />

                <Route
                    path="/create-blog"
                    element={
                        <ProtectedRoute>
                            <CreateBlog />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/edit-blog/:id"
                    element={
                        <ProtectedRoute>
                            <EditBlog />
                        </ProtectedRoute>
                    }
                />


                {/* =====================================
                    TRIPS
                ===================================== */}

                <Route
                    path="/trip-preview"
                    element={<TripPreview />}
                />

                <Route
                    path="/trip-details/:id"
                    element={<TripDetails />}
                />


                {/* =====================================
                    NOTIFICATIONS
                ===================================== */}

                <Route
                    path="/notifications"
                    element={
                        <ProtectedRoute>
                            <Notifications />
                        </ProtectedRoute>
                    }
                />


                {/* =====================================
                    SEARCH
                ===================================== */}

                <Route
                    path="/search"
                    element={
                        <ProtectedRoute>
                            <Search />
                        </ProtectedRoute>
                    }
                />


                {/* =====================================
                    MESSAGE SUCCESS
                ===================================== */}

                <Route
                    path="/message-success"
                    element={<MessageSuccess />}
                />


                {/* =====================================
                    PASSWORD RESET
                ===================================== */}

                <Route
                    path="/forgot-password"
                    element={<ForgotPassword />}
                />

                <Route
                    path="/reset-password/:token"
                    element={<ResetPassword />}
                />

            </Routes>


            {/* =====================================
                COMMON FOOTER
            ===================================== */}

            <Footer />


            {/* =====================================
                MOBILE NAVIGATION
            ===================================== */}

            <MobileBottomNav />

        </BrowserRouter>
    );
}


export default App;