import { BrowserRouter, Routes, Route } from "react-router-dom";

// =====================================================
// COMPONENTS
// =====================================================

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import MobileBottomNav from "./components/MobileBottomNav";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import CompanyProtectedRoute from "./components/CompanyProtectedRoute";

// =====================================================
// USER PAGES
// =====================================================

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


// =====================================================
// BLOG PAGES
// =====================================================

import Blogs from "./Pages/Blogs";
import BlogDetails from "./Pages/BlogDetails";
import CreateBlog from "./Pages/CreateBlog";
import EditBlog from "./Pages/EditBlog";


// =====================================================
// AUTH PAGES
// =====================================================

import ForgotPassword from "./Pages/ForgotPassword";
import ResetPassword from "./Pages/ResetPassword";


// =====================================================
// ADMIN PAGES
// =====================================================

import AdminLogin from "./Pages/AdminLogin";
import AdminDashboard from "./Pages/AdminDashboard";


// =====================================================
// COMPANY PAGES
// =====================================================

import CompanyProfile from "./Pages/CompanyProfile";
import CompanyDashboard from "./Pages/CompanyDashboard";
import AddTour from "./Pages/AddTour";


// =====================================================
// TOUR PAGES
// =====================================================

import ExploreTours from "./Pages/ExploreTours";
import TourDetailsPage from "./Pages/TourDetails";


// =====================================================
// APP
// =====================================================

function App() {

    return (

        <BrowserRouter>

            {/* =================================================
                NAVBAR
            ================================================= */}

            <Navbar />


            {/* =================================================
                ROUTES
            ================================================= */}

            <Routes>


                {/* =================================================
                    PUBLIC USER ROUTES
                ================================================= */}

                <Route
                    path="/"
                    element={<Home />}
                />

                <Route
                    path="/community"
                    element={<Community />}
                />

                <Route
                    path="/trip-planner"
                    element={<TripPlanner />}
                />

                <Route
                    path="/contact"
                    element={<Contact />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />


                {/* =================================================
                    USER DASHBOARD
                ================================================= */}

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />


                {/* =================================================
                    USER PROFILE
                ================================================= */}

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


                {/* =================================================
                    POSTS
                ================================================= */}

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


                {/* =================================================
                    TRIPS
                ================================================= */}

                <Route
                    path="/trip-preview"
                    element={<TripPreview />}
                />

                <Route
                    path="/trip-details/:id"
                    element={<TripDetails />}
                />


                {/* =================================================
                    NOTIFICATIONS
                ================================================= */}

                <Route
                    path="/notifications"
                    element={
                        <ProtectedRoute>
                            <Notifications />
                        </ProtectedRoute>
                    }
                />


                {/* =================================================
                    SEARCH
                ================================================= */}

                <Route
                    path="/search"
                    element={
                        <ProtectedRoute>
                            <Search />
                        </ProtectedRoute>
                    }
                />


                {/* =================================================
                    BLOGS
                ================================================= */}

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


                {/* =================================================
                    MESSAGE
                ================================================= */}

                <Route
                    path="/message-success"
                    element={<MessageSuccess />}
                />


                {/* =================================================
                    PASSWORD
                ================================================= */}

                <Route
                    path="/forgot-password"
                    element={<ForgotPassword />}
                />

                <Route
                    path="/reset-password/:token"
                    element={<ResetPassword />}
                />


                {/* =================================================
                    ADMIN LOGIN
                ================================================= */}

                <Route
                    path="/admin/login"
                    element={<AdminLogin />}
                />


                {/* =================================================
                    ADMIN DASHBOARD
                ================================================= */}

                <Route
                    path="/admin/dashboard"
                    element={
                        <AdminProtectedRoute>
                            <AdminDashboard />
                        </AdminProtectedRoute>
                    }
                />


                {/* =================================================
                    COMPANY PROFILE
                ================================================= */}

                <Route
                    path="/company/profile"
                    element={
                        <CompanyProtectedRoute>
                            <CompanyProfile />
                        </CompanyProtectedRoute>
                    }
                />


                {/* =================================================
                    COMPANY DASHBOARD
                ================================================= */}

                <Route
                    path="/company/dashboard"
                    element={
                        <CompanyProtectedRoute>
                            <CompanyDashboard />
                        </CompanyProtectedRoute>
                    }
                />


                {/* =================================================
                    ADD TOUR
                ================================================= */}

                <Route
                    path="/company/add-tour"
                    element={
                        <CompanyProtectedRoute>
                            <AddTour />
                        </CompanyProtectedRoute>
                    }
                />


                {/* =================================================
                    EXPLORE TOURS
                    PUBLIC USER PAGE
                ================================================= */}

                <Route
                    path="/explore-tours"
                    element={<ExploreTours />}
                />


                {/* =================================================
                    TOUR DETAILS
                ================================================= */}

                <Route
                    path="/tour/:id"
                    element={<TourDetailsPage />}
                />

            </Routes>


            {/* =================================================
                FOOTER
            ================================================= */}

            <Footer />


            {/* =================================================
                MOBILE NAV
            ================================================= */}

            <MobileBottomNav />

        </BrowserRouter>

    );

}

export default App;