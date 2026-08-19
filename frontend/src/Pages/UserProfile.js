import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

import "../Css/UserProfile.css";

function UserProfile() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [user, setUser] = useState({});
    const [posts, setPosts] = useState([]);

    const [loading, setLoading] = useState(true);

    const [isFollowing, setIsFollowing] = useState(false);


    // ================= FETCH USER PROFILE =================

    useEffect(() => {

        fetchUserProfile();

    }, [id]);


    const fetchUserProfile = async () => {

        try {

            const response = await api.get(
                `/api/users/${id}`
            );

            const profileUser = response.data.user;

            setUser(profileUser);

            setPosts(response.data.posts || []);


            // ================= CHECK FOLLOWING =================

            const localUser = JSON.parse(
                localStorage.getItem("user") || "{}"
            );


            if (localUser?.id && profileUser?.followers) {

                const alreadyFollowing =
                    profileUser.followers.some(
                        (followerId) =>
                            followerId.toString() ===
                            localUser.id.toString()
                    );

                setIsFollowing(alreadyFollowing);

            }

        }

        catch (error) {

            console.log(
                "User Profile Error:",
                error
            );

        }

        finally {

            setLoading(false);

        }

    };


    // ================= FOLLOW USER =================

    const handleFollow = async () => {

        try {

            const localUser = JSON.parse(
                localStorage.getItem("user") || "{}"
            );


            if (!localUser?.id) {

                alert("Please login first.");

                navigate("/login");

                return;

            }


            if (
                localUser.id.toString() ===
                id.toString()
            ) {

                alert("You cannot follow yourself.");

                return;

            }


            await api.post(
                "/api/users/follow",
                {
                    userId: localUser.id,
                    targetUserId: id
                }
            );


            setIsFollowing(true);


            // Update followers count immediately

            setUser((prevUser) => ({

                ...prevUser,

                followers: [
                    ...(prevUser.followers || []),
                    localUser.id
                ]

            }));

        }

        catch (error) {

            console.log(
                "Follow Error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Unable to follow user"
            );

        }

    };


    // ================= UNFOLLOW USER =================

    const handleUnfollow = async () => {

        try {

            const localUser = JSON.parse(
                localStorage.getItem("user") || "{}"
            );


            if (!localUser?.id) {

                alert("Please login first.");

                return;

            }


            await api.post(
                "/api/users/unfollow",
                {
                    userId: localUser.id,
                    targetUserId: id
                }
            );


            setIsFollowing(false);


            // Remove follower immediately

            setUser((prevUser) => ({

                ...prevUser,

                followers:
                    (prevUser.followers || []).filter(
                        (followerId) =>
                            followerId.toString() !==
                            localUser.id.toString()
                    )

            }));

        }

        catch (error) {

            console.log(
                "Unfollow Error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Unable to unfollow user"
            );

        }

    };


    // ================= LOADING =================

    if (loading) {

        return (

            <div className="user-profile-loading">

                Loading Profile...

            </div>

        );

    }


    // ================= USER NOT FOUND =================

    if (!user?._id) {

        return (

            <div className="user-profile-loading">

                <h2>
                    User Not Found
                </h2>

                <button
                    onClick={() => navigate("/community")}
                >
                    ← Back to Community
                </button>

            </div>

        );

    }


    // ================= PAGE =================

    return (

        <div className="user-profile-page">


            {/* ================= COVER ================= */}

            <div className="user-cover-section">

                <img
                    src={
                        user.coverImage ||
                        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1600"
                    }
                    alt="Cover"
                    className="user-cover-image"
                />

            </div>



            {/* ================= PROFILE HEADER ================= */}

            <div className="user-profile-header">


                <img
                    src={
                        user.profileImage ||
                        "https://i.pravatar.cc/200"
                    }
                    alt="Profile"
                    className="user-profile-image"
                />


                <h1>

                    {user.firstName}{" "}
                    {user.lastName}

                </h1>


                <h3>

                    @{user.username}

                </h3>


                <p className="user-bio">

                    {user.bio ||
                        "🌍 Travel Enthusiast"}

                </p>


                <p className="user-location">

                    📍{" "}
                    {user.location ||
                        "Location not added"}

                </p>


                {/* ================= FOLLOW BUTTON ================= */}

                <div className="user-profile-actions">

                    {

                        isFollowing

                            ?

                            (

                                <button
                                    className="following-btn"
                                    onClick={handleUnfollow}
                                >
                                    ✓ Following
                                </button>

                            )

                            :

                            (

                                <button
                                    className="follow-btn"
                                    onClick={handleFollow}
                                >
                                    + Follow
                                </button>

                            )

                    }

                </div>

            </div>



            {/* ================= STATS ================= */}

            <div className="user-stats-section">


                <div className="user-stat-card">

                    <h2>
                        {posts.length}
                    </h2>

                    <p>
                        Posts
                    </p>

                </div>


                <div className="user-stat-card">

                    <h2>
                        {user.trips?.length || 0}
                    </h2>

                    <p>
                        Trips
                    </p>

                </div>


                <div className="user-stat-card">

                    <h2>
                        {user.followers?.length || 0}
                    </h2>

                    <p>
                        Followers
                    </p>

                </div>


                <div className="user-stat-card">

                    <h2>
                        {user.following?.length || 0}
                    </h2>

                    <p>
                        Following
                    </p>

                </div>

            </div>



            {/* ================= POSTS ================= */}

            <div className="user-posts-section">


                <h2>
                    📸 {user.firstName}'s Travel Posts
                </h2>


                {

                    posts.length > 0

                        ?

                        (

                            <div className="user-post-grid">

                                {

                                    posts.map((post) => (

                                        <div
                                            className="user-post-card"
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


                                            <div className="user-post-info">

                                                <h3>
                                                    {post.title}
                                                </h3>


                                                <p>
                                                    📍{" "}
                                                    {post.location},{" "}
                                                    {post.country}
                                                </p>


                                                <button
                                                    onClick={() =>
                                                        navigate(
                                                            `/post/${post._id}`
                                                        )
                                                    }
                                                >
                                                    See Details →
                                                </button>

                                            </div>


                                        </div>

                                    ))

                                }

                            </div>

                        )

                        :

                        (

                            <div className="no-user-posts">

                                <h3>
                                    📸 No Travel Posts Yet
                                </h3>

                                <p>
                                    This traveller hasn't
                                    shared any posts yet.
                                </p>

                            </div>

                        )

                }

            </div>



            {/* ================= BACK ================= */}

            <button
                className="back-community-btn"
                onClick={() =>
                    navigate("/community")
                }
            >
                ← Back to Community
            </button>


        </div>

    );

}

export default UserProfile;
