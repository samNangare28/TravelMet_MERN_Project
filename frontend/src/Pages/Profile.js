import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

import "../Css/Profile.css";


function Profile() {

    const { id } = useParams();
    const navigate = useNavigate();


    // LOGGED-IN USER
    const localUser = JSON.parse(
        localStorage.getItem("user") || "{}"
    );


    // 
    // PROFILE ID
    // 

    const profileId = id || localUser.id || localUser._id;

    const isOwner =
        profileId === localUser.id;


    // 
    // STATES
    // 

    const [user, setUser] = useState({});

    const [posts, setPosts] = useState([]);

    const [trips, setTrips] = useState([]);

    const [loading, setLoading] = useState(true);

    const [showUsers, setShowUsers] = useState(false);

    const [userListType, setUserListType] = useState("");

    const [isPrivate, setIsPrivate] = useState(false);

    const [isFollowing, setIsFollowing] = useState(false);

    const [requestSent, setRequestSent] = useState(false);


    // 
    // FETCH PROFILE
    // 

    useEffect(() => {

        if (!profileId) {

            setLoading(false);

            return;

        }

        fetchProfile();

    }, [profileId]);


    const fetchProfile = async () => {

        try {

            setLoading(true);


            // =================================================
            // GET USER PROFILE
            // =================================================

            const response = await api.get(

                `/api/users/${profileId}?viewerId=${localUser.id}`

            );


            const profileUser =
                response.data.user;


            // =================================================
            // SET USER DATA
            // =================================================

            setUser(profileUser);


            setPosts(
                response.data.posts || []
            );


            // =================================================
            // PRIVACY
            // =================================================

            setIsPrivate(
                response.data.private || false
            );


            // =================================================
            // FOLLOW STATUS
            // Backend directly sends following
            // =================================================

            setIsFollowing(
                response.data.following || false
            );


            // =================================================
            // REQUEST STATUS
            // Backend directly sends requested
            // =================================================

            setRequestSent(
                response.data.requested || false
            );


            // =================================================
            // FETCH TRIPS
            // =================================================

            if (isOwner) {

                // Owner can see own trips

                const tripResponse =
                    await api.get(

                        `/api/trips/user/${localUser.id}`

                    );


                setTrips(
                    tripResponse.data.trips || []
                );

            }

            else if (!response.data.private) {

                // Public profile trips

                const tripResponse =
                    await api.get(

                        `/api/trips/user/${profileId}`

                    );


                setTrips(
                    tripResponse.data.trips || []
                );

            }

            else {

                // Private profile

                setTrips([]);

            }


        }

        catch (error) {

            console.log(
                "Profile Error:",
                error
            );


            // If backend returns 404

            if (
                error.response?.status === 404
            ) {

                alert(
                    "User not found"
                );

                navigate("/community");

            }

        }

        finally {

            setLoading(false);

        }

    };


    // 
    // FOLLOW / REQUEST / UNFOLLOW
    // 

    const handleFollow = async () => {

        try {

            // =================================================
            // LOGIN CHECK
            // =================================================

            if (!localUser.id) {

                alert(
                    "Please login first"
                );

                navigate("/login");

                return;

            }


            // =================================================
            // UNFOLLOW
            // =================================================

            if (isFollowing) {

                await api.post(

                    "/api/users/unfollow",

                    {

                        userId:
                            localUser.id,

                        targetUserId:
                            profileId

                    }

                );


                setIsFollowing(false);

                setRequestSent(false);


                fetchProfile();


                return;

            }


            // =================================================
            // REQUEST ALREADY SENT
            // =================================================

            if (requestSent) {

                alert(
                    "Follow request already sent."
                );

                return;

            }


            // =================================================
            // FOLLOW / SEND REQUEST
            // =================================================

            const response =
                await api.post(

                    "/api/users/follow",

                    {

                        userId:
                            localUser.id,

                        targetUserId:
                            profileId

                    }

                );


            // =================================================
            // PRIVATE ACCOUNT
            // =================================================

            if (
                response.data.requested
            ) {

                setRequestSent(true);

                setIsFollowing(false);


                alert(
                    "Follow request sent."
                );

            }


            // =================================================
            // PUBLIC ACCOUNT
            // =================================================

            else if (
                response.data.following
            ) {

                setIsFollowing(true);

                setRequestSent(false);

            }


            // Refresh profile

            fetchProfile();

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


    // 
    // DELETE TRIP
    // 

    const deleteTrip = async (tripId) => {

        const confirmDelete =
            window.confirm(
                "Delete this trip?"
            );


        if (!confirmDelete)
            return;


        try {

            await api.delete(

                `/api/trips/${tripId}`

            );


            setTrips(

                trips.filter(

                    trip =>
                        trip._id !== tripId

                )

            );


        }

        catch (error) {

            console.log(error);


            alert(
                "Unable to delete trip."
            );

        }

    };


    // 
    // OPEN FOLLOWERS / FOLLOWING
    // 

    const openUserList = (type) => {

        setUserListType(type);

        setShowUsers(true);

    };


    // 
    // LOADING
    // 

    if (loading) {

        return (

            <div className="profile-loading">

                Loading...

            </div>

        );

    }


    // 
    // PROFILE PAGE
    // 

    return (

        <div className="profile-page">


            {/* =================================================
                COVER
            ================================================= */}

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


            {/* =================================================
                PROFILE HEADER
            ================================================= */}

            <div className="profile-header">


                {/* PROFILE IMAGE */}

                <img

                    className="profile-image"

                    src={
                        user.profileImage ||

                        "https://i.pravatar.cc/200"
                    }

                    alt="profile"

                />


                {/* NAME */}

                <h1>

                    {user.firstName}{" "}

                    {user.lastName}

                </h1>


                {/* USERNAME */}

                <h3>

                    @{user.username}

                </h3>

                {/* COMMUNITY BADGE */}

                <span className="community-badge">

                    🌐 TravelMet Community

                </span>


                {/* BIO */}

                <p className="bio">

                    {user.bio ||

                        "🌍 Travel Enthusiast"}

                </p>


                {/* LOCATION */}

                <p className="location">

                    📍{" "}

                    {user.location ||

                        "Location not added"}

                </p>


                {/* =================================================
                    BUTTONS
                ================================================= */}

                <div className="profile-buttons">


                    {/* OWNER */}

                    {isOwner ? (

                        <button

                            className="edit-btn"

                            onClick={() =>
                                navigate(
                                    "/edit-profile"
                                )
                            }

                        >

                            Edit Profile

                        </button>

                    ) : (

                        /* OTHER USER */

                        <button

                            className={

                                isFollowing

                                    ? "edit-btn following-btn"

                                    : requestSent

                                        ? "edit-btn request-btn"

                                        : "edit-btn"

                            }

                            onClick={
                                handleFollow
                            }

                        >

                            {isFollowing

                                ? "Following"

                                : requestSent

                                    ? "Request Sent"

                                    : "Follow"

                            }

                        </button>

                    )}


                    {/* SHARE PROFILE */}

                    <button

                        className="share-btn"

                        onClick={() => {

                            navigator.clipboard.writeText(

                                window.location.href

                            );

                            alert(
                                "Profile link copied!"
                            );

                        }}

                    >

                        Share Profile

                    </button>


                </div>

            </div>


            {/* =================================================
                PRIVATE PROFILE MESSAGE
            ================================================= */}

            {isPrivate && !isOwner && (

                <div className="private-profile-message">


                    <h2>

                        🔒 This Account is Private

                    </h2>


                    <p>

                        Follow this user to see
                        their posts and trips.

                    </p>


                </div>

            )}


            {/* =================================================
                STATS
            ================================================= */}

            <div className="stats-section">


                {/* POSTS */}

                <div className="stat-card">

                    <h2>

                        {isPrivate && !isOwner

                            ? 0

                            : posts.length

                        }

                    </h2>

                    <p>

                        Posts

                    </p>

                </div>


                {/* TRIPS */}

                <div className="stat-card">

                    <h2>

                        {isPrivate && !isOwner

                            ? 0

                            : trips.length

                        }

                    </h2>

                    <p>

                        Trips

                    </p>

                </div>


                {/* FOLLOWERS */}

                <div

                    className="stat-card"

                    style={{
                        cursor: "pointer"
                    }}

                    onClick={() =>
                        openUserList(
                            "followers"
                        )
                    }

                >

                    <h2>

                        {user.followers?.length || 0}

                    </h2>

                    <p>

                        Followers

                    </p>

                </div>


                {/* FOLLOWING */}

                <div

                    className="stat-card"

                    style={{
                        cursor: "pointer"
                    }}

                    onClick={() =>
                        openUserList(
                            "following"
                        )
                    }

                >

                    <h2>

                        {user.following?.length || 0}

                    </h2>

                    <p>

                        Following

                    </p>

                </div>


            </div>


            {/* =================================================
                ABOUT
            ================================================= */}

            <div className="about-card">


                <h2>

                    About

                </h2>


                <div className="about-item">

                    <strong>

                        Email :

                    </strong>

                    <span>

                        {user.email}

                    </span>

                </div>


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

                        {user.location ||
                            "Not Added"}

                    </span>

                </div>


                <div className="about-item">

                    <strong>

                        Bio :

                    </strong>

                    <span>

                        {user.bio ||
                            "Travel Enthusiast 🌍"}

                    </span>

                </div>


            </div>


            {/* =================================================
                SAVED TRIPS
            ================================================= */}

            {(!isPrivate || isOwner) && (

                <div className="posts-section">


                    <h2>

                        ✈{" "}

                        {isOwner
                            ? "My Saved Trips"
                            : `${user.firstName}'s Saved Trips`
                        }

                    </h2>


                    {trips.length > 0 ? (

                        <div className="saved-trip-grid">


                            {trips.map(trip => (

                                <div

                                    className="saved-trip-card"

                                    key={trip._id}

                                >


                                    <h3>

                                        📍{" "}

                                        {trip.destination}

                                    </h3>


                                    <p>

                                        📅{" "}

                                        {new Date(
                                            trip.startDate
                                        ).toLocaleDateString()}

                                        {" - "}

                                        {new Date(
                                            trip.endDate
                                        ).toLocaleDateString()}

                                    </p>


                                    <p>

                                        👥{" "}

                                        {trip.travelers}

                                        {" "}Travelers

                                    </p>


                                    <p>

                                        💰 ₹
                                        {trip.budget}

                                    </p>


                                    <p>

                                        🚗{" "}

                                        {trip.transport}

                                    </p>


                                    <p>

                                        🏨{" "}

                                        {trip.hotelType}

                                    </p>


                                    <p>

                                        ❤️{" "}

                                        {trip.tripType}

                                    </p>


                                    <div className="trip-buttons">


                                        {/* VIEW */}

                                        <button

                                            className="view-trip-btn"

                                            onClick={() =>

                                                navigate(

                                                    `/trip-details/${trip._id}`

                                                )

                                            }

                                        >

                                            👁 View

                                        </button>


                                        {/* DELETE ONLY OWNER */}

                                        {isOwner && (

                                            <button

                                                className="delete-trip-btn"

                                                onClick={() =>
                                                    deleteTrip(
                                                        trip._id
                                                    )
                                                }

                                            >

                                                🗑 Delete

                                            </button>

                                        )}


                                    </div>


                                </div>

                            ))}


                        </div>

                    ) : (

                        <div className="empty-posts">


                            <h3>

                                🌍 No Trips Yet

                            </h3>


                            <p>

                                {isOwner

                                    ? "Generate your first AI Trip."

                                    : "This user has no trips yet."

                                }

                            </p>


                        </div>

                    )}


                </div>

            )}


            {/* =================================================
                POSTS
            ================================================= */}

            {(!isPrivate || isOwner) && (

                <div className="posts-section">


                    <h2>

                        📸{" "}

                        {isOwner

                            ? "My Travel Posts"

                            : `${user.firstName}'s Travel Posts`

                        }

                    </h2>


                    {posts.length > 0 ? (

                        <div className="post-grid">


                            {posts.map(post => (

                                <div

                                    className="post-card"

                                    key={post._id}

                                >


                                    {/* IMAGE */}

                                    <img

                                        src={

                                            post.image?.url ||

                                            post.image ||

                                            "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=600"

                                        }

                                        alt={post.title}

                                    />


                                    {/* TITLE */}

                                    <h4>

                                        {post.title}

                                    </h4>


                                    {/* LOCATION */}

                                    <p>

                                        📍{" "}

                                        {post.location}

                                        {post.country

                                            ? `, ${post.country}`

                                            : ""

                                        }

                                    </p>


                                    {/* DETAILS */}

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

                                {isOwner

                                    ? "Start sharing your travel memories."

                                    : "This user has no travel posts yet."

                                }

                            </p>


                        </div>

                    )}


                </div>

            )}


            {/* =================================================
                FOLLOWERS / FOLLOWING MODAL
            ================================================= */}

            {showUsers && (

                <div

                    className="user-modal-overlay"

                    onClick={() =>
                        setShowUsers(false)
                    }

                >


                    <div

                        className="user-modal"

                        onClick={e =>
                            e.stopPropagation()
                        }

                    >


                        {/* MODAL HEADER */}

                        <div className="user-modal-header">


                            <h2>

                                {userListType ===
                                    "followers"

                                    ? "Followers"

                                    : "Following"

                                }

                            </h2>


                            <button

                                className="close-modal-btn"

                                onClick={() =>
                                    setShowUsers(
                                        false
                                    )
                                }

                            >

                                ✕

                            </button>


                        </div>


                        {/* USER LIST */}

                        <div className="user-list">


                            {(

                                userListType ===
                                    "followers"

                                    ? user.followers

                                    : user.following

                            )?.length > 0 ? (


                                (

                                    userListType ===
                                        "followers"

                                        ? user.followers

                                        : user.following

                                ).map(person => (


                                    <div

                                        className="user-list-item"

                                        key={
                                            person._id
                                        }

                                    >


                                        {/* PROFILE IMAGE */}

                                        <img

                                            src={

                                                person.profileImage ||

                                                "https://i.pravatar.cc/100"

                                            }

                                            alt={
                                                person.username
                                            }

                                        />


                                        {/* USER INFO */}

                                        <div className="user-list-info">


                                            <h4>

                                                {person.firstName}{" "}

                                                {person.lastName}

                                            </h4>


                                            <p>

                                                @
                                                {person.username}

                                            </p>


                                        </div>


                                        {/* VIEW PROFILE */}

                                        <button

                                            className="view-profile-btn"

                                            onClick={() => {

                                                setShowUsers(
                                                    false
                                                );

                                                navigate(

                                                    `/profile/${person._id}`

                                                );

                                            }}

                                        >

                                            View

                                        </button>


                                    </div>

                                ))

                            ) : (


                                <div className="no-users">


                                    <p>

                                        {userListType ===
                                            "followers"

                                            ? "No followers yet."

                                            : "Not following anyone yet."

                                        }

                                    </p>


                                </div>

                            )}


                        </div>


                    </div>

                </div>

            )}


        </div>

    );

}


export default Profile;
