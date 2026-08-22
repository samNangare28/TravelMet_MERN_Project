import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";

import "../Css/Community.css";

function Community() {

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    const navigate = useNavigate();


    // ================= FETCH POSTS =================

    useEffect(() => {

        fetchPosts(1);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const fetchPosts = async (pageNum) => {

        try {

            const user = JSON.parse(
                localStorage.getItem("user") || "{}"
            );

            const response = await api.get(
                `/api/posts?viewerId=${user.id || ""}&page=${pageNum}&limit=9`
            );

            if (pageNum === 1) {
                setPosts(response.data.posts);
            } else {
                setPosts((prev) => [...prev, ...response.data.posts]);
            }

            setHasMore(pageNum < response.data.totalPages);
            setPage(pageNum);

        }

        catch (error) {

            console.log("Fetch Posts Error:", error);

        }

        finally {

            setLoading(false);
            setLoadingMore(false);

        }

    };


    const handleLoadMore = () => {

        setLoadingMore(true);
        fetchPosts(page + 1);

    };


    // ================= LIKE POST =================

    const handleLike = async (postId) => {

        try {

            const user = JSON.parse(
                localStorage.getItem("user")
            );

            if (!user) {

                alert("Please login first.");

                return;

            }


            const response = await api.put(

                `/api/posts/${postId}/like`,

                {
                    userId: user.id
                }

            );


            setPosts(

                posts.map((post) =>

                    post._id === postId

                        ? {

                            ...post,

                            likes: response.data.likes

                        }

                        : post

                )

            );

        }

        catch (error) {

            console.log("Like Error:", error);

        }

    };


    // ================= VIEW USER PROFILE =================

    const viewUserProfile = (userId) => {

        if (!userId) {

            console.log("User ID not available");

            return;

        }

        navigate(`/user/${userId}`);

    };


    return (

        <>

            {/* ================= COMMUNITY HEADER ================= */}

            <section className="community-header">

                <h1>
                    🌍 Explore the TravelMet Feed
                </h1>

                <p>

                    Find your next travel buddy, discover hidden
                    places and explore memories shared by
                    passionate travellers. Looking for longer
                    reads? Check out the{" "}
                    <Link
                        to="/blogs"
                        style={{ color: "#FDBA74", fontWeight: 700, textDecoration: "underline" }}
                    >
                        TravelMet Blog
                    </Link>.

                </p>

            </section>



            {/* ================= COMMUNITY POSTS ================= */}

            <section className="community-posts">

                {

                    loading

                        ?

                        (

                            <h2 className="loading">

                                Loading Posts...

                            </h2>

                        )

                        :

                        (

                            <div className="posts-grid">

                                {

                                    posts.length > 0

                                        ?

                                        (

                                            posts.map((post) => (

                                                <div
                                                    className="post-card"
                                                    key={post._id}
                                                >


                                                    {/* POST IMAGE */}

                                                    <div className="post-image-wrapper">

                                                        <img

                                                            src={
                                                                post.image?.url ||
                                                                post.image
                                                            }

                                                            alt={post.title}

                                                        />

                                                    </div>



                                                    {/* POST INFORMATION */}

                                                    <div className="post-info">


                                                        <h3>

                                                            {post.title}

                                                        </h3>


                                                        <h5>

                                                            📍 {post.location},{" "}
                                                            {post.country}

                                                        </h5>



                                                        {/* USER NAME */}

                                                        <p

                                                            className="post-user"

                                                            onClick={() =>
                                                                viewUserProfile(
                                                                    post.user?._id
                                                                )
                                                            }

                                                        >

                                                            👤{" "}

                                                            {post.user?.firstName}{" "}

                                                            {post.user?.lastName}

                                                        </p>



                                                        {/* ACTIONS */}

                                                        <div className="post-actions">


                                                            {/* LIKE */}

                                                            <button

                                                                className="like-btn"

                                                                onClick={() =>
                                                                    handleLike(
                                                                        post._id
                                                                    )
                                                                }

                                                            >

                                                                ❤️

                                                                <span>

                                                                    {
                                                                        post.likes?.length ||
                                                                        0
                                                                    }

                                                                </span>

                                                            </button>



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


                                                    </div>


                                                </div>

                                            ))

                                        )

                                        :

                                        (

                                            <div className="empty-posts">

                                                <h3>
                                                    🌍 No Posts Yet
                                                </h3>

                                                <p>
                                                    Be the first to share
                                                    your travel experience.
                                                </p>

                                            </div>

                                        )

                                }

                            </div>

                        )

                }

                {/* ================= LOAD MORE ================= */}

                {hasMore && !loading && posts.length > 0 && (

                    <button
                        className="load-more-btn"
                        onClick={handleLoadMore}
                        disabled={loadingMore}
                        style={{
                            margin: "30px auto 0",
                            display: "block",
                            padding: "12px 28px",
                            border: "1px solid #d0d5dd",
                            borderRadius: 10,
                            background: "#ffffff",
                            color: "#101828",
                            fontWeight: 600,
                            fontSize: 13,
                            cursor: "pointer"
                        }}
                    >
                        {loadingMore ? "Loading..." : "Load More"}
                    </button>

                )}

            </section>



            {/* ================= ENDING ================= */}

            <section className="community-ending">

                <h2>

                    ❤️ Every journey begins with a single step.

                </h2>

                <p>

                    ✨ Travel isn't just about places,
                    it's about memories, friendships and
                    unforgettable moments.

                    <br />

                    Thank you for being a part of the
                    TravelMet Community ❤️

                </p>

            </section>

        </>

    );

}

export default Community;