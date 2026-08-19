import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../Css/Profile.css";

function PublicProfile() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [user, setUser] = useState({});
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFollowing, setIsFollowing] = useState(false);

    useEffect(() => {
        fetchUserProfile();
    }, [id]);

    const fetchUserProfile = async () => {

        try {

            setLoading(true);

            const response = await api.get(
                `/api/users/${id}`
            );

            const profileUser = response.data.user;

            setUser(profileUser);
            setPosts(response.data.posts || []);

            // Check current logged-in user
            const localUser = JSON.parse(
                localStorage.getItem("user") || "{}"
            );

            if (localUser.id && profileUser.followers) {

                const following = profileUser.followers.some(
                    (follower) =>
                        follower._id === localUser.id ||
                        follower === localUser.id
                );

                setIsFollowing(following);
            }

        } catch (error) {

            console.log("Public Profile Error:", error);

        } finally {

            setLoading(false);

        }

    };

    const handleFollow = async () => {

        try {

            const localUser = JSON.parse(
                localStorage.getItem("user") || "{}"
            );

            if (!localUser.id) {

                alert("Please login first.");

                navigate("/login");

                return;
            }

            if (localUser.id === id) {

                alert("You cannot follow yourself.");

                return;
            }

            if (isFollowing) {

                await api.post(
                    "/api/users/unfollow",
                    {
                        userId: localUser.id,
                        targetUserId: id
                    }
                );

                setIsFollowing(false);

                setUser((prev) => ({
                    ...prev,
                    followers: prev.followers.filter(
                        (follower) =>
                            follower._id !== localUser.id &&
                            follower !== localUser.id
                    )
                }));

            } else {

                await api.post(
                    "/api/users/follow",
                    {
                        userId: localUser.id,
                        targetUserId: id
                    }
                );

                setIsFollowing(true);

                const currentUser = JSON.parse(
                    localStorage.getItem("user") || "{}"
                );

                setUser((prev) => ({
                    ...prev,
                    followers: [
                        ...(prev.followers || []),
                        {
                            _id: currentUser.id,
                            firstName: currentUser.firstName,
                            lastName: currentUser.lastName,
                            username: currentUser.username,
                            profileImage: currentUser.profileImage
                        }
                    ]
                }));

            }

        } catch (error) {

            console.log("Follow Error:", error);

            alert(
                error.response?.data?.message ||
                "Unable to update follow status."
            );

        }

    };

    if (loading) {

        return (
            <div className="profile-loading">
                Loading Profile...
            </div>
        );

    }

    if (!user._id) {

        return (
            <div className="profile-loading">
                User Not Found
            </div>
        );

    }

    return (

        <div className="profile-page">

            {/* COVER */}

            <div className="cover-section">

                <img
                    className="cover-image"
                    src={
                        user.coverImage ||
                        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1600"
                    }
                    alt="cover"
                />

            </div>


            {/* PROFILE HEADER */}

            <div className="profile-header">

                <img
                    className="profile-image"
                    src={
                        user.profileImage ||
                        "https://i.pravatar.cc/200"
                    }
                    alt="profile"
                />

                <h1>
                    {user.firstName} {user.lastName}
                </h1>

                <h3>
                    @{user.username}
                </h3>

                <p className="bio">
                    {user.bio || "🌍 Travel Enthusiast"}
                </p>

                <p className="location">
                    📍 {user.location || "Location not added"}
                </p>


                {/* FOLLOW BUTTON */}

                <div className="profile-buttons">

                    <button
                        className={
                            isFollowing
                                ? "share-btn"
                                : "edit-btn"
                        }
                        onClick={handleFollow}
                    >
                        {isFollowing
                            ? "Following"
                            : "Follow"}
                    </button>

                    <button
                        className="share-btn"
                        onClick={() => navigate("/community")}
                    >
                        ← Community
                    </button>

                </div>

            </div>


            {/* STATS */}

            <div className="stats-section">

                <div className="stat-card">

                    <h2>
                        {posts.length}
                    </h2>

                    <p>
                        Posts
                    </p>

                </div>


                <div className="stat-card">

                    <h2>
                        {user.trips?.length || 0}
                    </h2>

                    <p>
                        Trips
                    </p>

                </div>


                <div className="stat-card">

                    <h2>
                        {user.followers?.length || 0}
                    </h2>

                    <p>
                        Followers
                    </p>

                </div>


                <div className="stat-card">

                    <h2>
                        {user.following?.length || 0}
                    </h2>

                    <p>
                        Following
                    </p>

                </div>

            </div>


            {/* ABOUT */}

            <div className="about-card">

                <h2>
                    About
                </h2>

                <div className="about-item">

                    <strong>
                        Username :
                    </strong>

                    <span>
                        @{user.username}
                    </span>

                </div>

                <div className="about-item">

                    <strong>
                        Location :
                    </strong>

                    <span>
                        {user.location || "Not Added"}
                    </span>

                </div>

                <div className="about-item">

                    <strong>
                        Bio :
                    </strong>

                    <span>
                        {user.bio || "Travel Enthusiast 🌍"}
                    </span>

                </div>

            </div>


            {/* POSTS */}

            <div className="posts-section">

                <h2>
                    📸 {user.firstName}'s Travel Posts
                </h2>

                {posts.length > 0 ? (

                    <div className="post-grid">

                        {posts.map((post) => (

                            <div
                                className="post-card"
                                key={post._id}
                            >

                                <img
                                    src={
                                        post.image?.url ||
                                        post.image ||
                                        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=600"
                                    }
                                    alt={post.title}
                                />

                                <h4>
                                    {post.title}
                                </h4>

                                <p>
                                    📍 {post.location},{" "}
                                    {post.country}
                                </p>

                                <button
                                    className="details-btn"
                                    onClick={() =>
                                        navigate(
                                            `/post/${post._id}`
                                        )
                                    }
                                >
                                    See Details →
                                </button>

                            </div>

                        ))}

                    </div>

                ) : (

                    <div className="empty-posts">

                        <h3>
                            📸 No Travel Posts Yet
                        </h3>

                        <p>
                            This user hasn't shared any travel posts yet.
                        </p>

                    </div>

                )}

            </div>

        </div>

    );

}

export default PublicProfile;
