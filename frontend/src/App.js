import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";


import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import MobileBottomNav from "./components/MobileBottomNav";


import Home from "./Pages/Home";
import TripPlanner from "./Pages/TripPlanner";
import Contact from "./Pages/Contact";
import Register from "./Pages/Register";
import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
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


import AdminLogin from "./Pages/AdminLogin";
import AdminDashboard from "./Pages/AdminDashboard";
import AdminProtectedRoute from "./components/AdminProtectedRoute";


import CompanyProfile from "./Pages/CompanyProfile";
import CompanyProtectedRoute from "./components/CompanyProtectedRoute";


function App() {

    return (

        <BrowserRouter>

            <Navbar />

            <Routes>


                {/* ==========================================
                    PUBLIC ROUTES
                ========================================== */}

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


                {/* ==========================================
                    ADMIN
                ========================================== */}

                <Route
                    path="/admin/login"
                    element={<AdminLogin />}
                />


                <Route
                    path="/admin/dashboard"
                    element={
                        <AdminProtectedRoute>
                            <AdminDashboard />
                        </AdminProtectedRoute>
                    }
                />


                {/* ==========================================
                    COMPANY
                ========================================== */}

                <Route
                    path="/company/profile"
                    element={
                        <CompanyProtectedRoute>
                            <CompanyProfile />
                        </CompanyProtectedRoute>
                    }
                />


                {/* ==========================================
                    USER DASHBOARD
                ========================================== */}

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />


                {/* ==========================================
                    USER PROFILE
                ========================================== */}

                <Route
                    path="/profile"
                    element={<Profile />}
                />

                <Route
                    path="/profile/:id"
                    element={<PublicProfile />}
                />


                {/* ==========================================
                    POSTS
                ========================================== */}

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


                {/* ==========================================
                    BLOGS
                ========================================== */}

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


                {/* ==========================================
                    TRIPS
                ========================================== */}

                <Route
                    path="/trip-preview"
                    element={<TripPreview />}
                />

                <Route
                    path="/trip-details/:id"
                    element={<TripDetails />}
                />


                {/* ==========================================
                    PROFILE EDIT
                ========================================== */}

                <Route
                    path="/edit-profile"
                    element={<EditProfile />}
                />


                {/* ==========================================
                    NOTIFICATIONS
                ========================================== */}

                <Route
                    path="/notifications"
                    element={
                        <ProtectedRoute>
                            <Notifications />
                        </ProtectedRoute>
                    }
                />


                {/* ==========================================
                    SEARCH
                ========================================== */}

                <Route
                    path="/search"
                    element={
                        <ProtectedRoute>
                            <Search />
                        </ProtectedRoute>
                    }
                />


                {/* ==========================================
                    OTHER
                ========================================== */}

                <Route
                    path="/message-success"
                    element={<MessageSuccess />}
                />

                <Route
                    path="/user/:id"
                    element={<UserProfile />}
                />


                {/* ==========================================
                    PASSWORD
                ========================================== */}

                <Route
                    path="/forgot-password"
                    element={<ForgotPassword />}
                />

                <Route
                    path="/reset-password/:token"
                    element={<ResetPassword />}
                />

            </Routes>


            <Footer />

            <MobileBottomNav />

        </BrowserRouter>

    );

}


export default App;