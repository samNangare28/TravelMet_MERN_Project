import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import Swal from "sweetalert2";
import api from "../api/axios";

import "../Css/Blog.css";

function BlogDetails() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [comment, setComment] = useState("");

    const loggedUser = JSON.parse(
        localStorage.getItem("user") || "{}"
    );

    useEffect(() => {

        fetchBlog();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const fetchBlog = async () => {

        try {

            setLoading(true);

            const response = await api.get(`/api/blogs/${id}`);

            setBlog(response.data.blog);

        }

        catch (error) {

            console.log("Fetch Blog Error:", error);

        }

        finally {

            setLoading(false);

        }

    };

    const isLiked =
        blog?.likes?.some(
            (like) => (like._id || like) === loggedUser.id
        ) || false;

    const isOwner =
        blog?.user?._id === loggedUser.id;

    const handleLike = async () => {

        if (!localStorage.getItem("token")) {

            navigate("/login");
            return;

        }

        try {

            const response = await api.put(`/api/blogs/${blog._id}/like`);

            setBlog({
                ...blog,
                likes: response.data.likes
            });

        }

        catch (error) {

            console.log("Like Error:", error);

        }

    };

    const handleComment = async (e) => {

        e.preventDefault();

        if (!comment.trim()) return;

        if (!localStorage.getItem("token")) {

            navigate("/login");
            return;

        }

        try {

            const response = await api.post(
                `/api/blogs/${blog._id}/comment`,
                { comment }
            );

            setBlog({
                ...blog,
                comments: response.data.comments
            });

            setComment("");

            Swal.fire({
                toast: true,
                position: "top-end",
                icon: "success",
                title: "Comment added!",
                showConfirmButton: false,
                timer: 1500
            });

        }

        catch (error) {

            console.log("Comment Error:", error);

        }

    };

    const handleDelete = async () => {

        const result = await Swal.fire({
            title: "Delete this blog?",
            text: "You won't be able to recover it!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#e63946",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, Delete"
        });

        if (!result.isConfirmed) return;

        try {

            const response = await api.delete(`/api/blogs/${blog._id}`);

            await Swal.fire({
                icon: "success",
                title: "Deleted!",
                text: response.data.message,
                timer: 1500,
                showConfirmButton: false
            });

            navigate("/blogs");

        }

        catch (error) {

            console.log("Delete Error:", error);

        }

    };

    if (loading) {

        return (
            <div className="blog-loading" style={{ padding: "160px 0" }}>
                Loading story...
            </div>
        );

    }

    if (!blog) {

        return (
            <div className="blog-empty" style={{ padding: "160px 20px" }}>
                <h3>Blog not found</h3>
                <p>This story may have been removed.</p>
            </div>
        );

    }

    return (

        <div className="blog-details-page">

            {/* ================= HERO ================= */}

            <section
                className="blog-details-hero"
                style={{
                    backgroundImage: `url(${
                        blog.coverImage ||
                        "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200"
                    })`
                }}
            >

                <div className="blog-details-hero-content">

                    <span className="blog-card-category">
                        {blog.category}
                    </span>

                    <h1>{blog.title}</h1>

                    <div className="blog-details-meta">

                        <div className="blog-details-author">

                            <img
                                src={
                                    blog.user?.profileImage ||
                                    "https://i.pravatar.cc/100"
                                }
                                alt={blog.authorName}
                            />

                            <div>

                                <strong>
                                    {blog.authorName ||
                                        blog.user?.firstName}
                                </strong>

                                <span>
                                    {new Date(blog.createdAt).toLocaleDateString(
                                        undefined,
                                        { year: "numeric", month: "long", day: "numeric" }
                                    )}
                                </span>

                            </div>

                        </div>

                        <div className="blog-details-stats">

                            <span>📍 {blog.destination}</span>

                            <span>⏱ {blog.readTime} min read</span>

                            <span>👁 {blog.views} views</span>

                        </div>

                    </div>

                </div>

            </section>


            {/* ================= BODY ================= */}

            <section className="blog-details-body">

                <div className="blog-details-card">

                    <p className="blog-details-lead">
                        {blog.shortDescription}
                    </p>

                    <div className="blog-details-content">

                        <ReactMarkdown>
                            {blog.content}
                        </ReactMarkdown>

                    </div>

                    {blog.travelTips && (

                        <div className="blog-tips-box">

                            <h4>💡 Travel Tips</h4>

                            <p>{blog.travelTips}</p>

                        </div>

                    )}

                    {blog.tags?.length > 0 && (

                        <div className="blog-tags-row">

                            {blog.tags.map((tag) => (

                                <span key={tag} className="blog-tag-pill">
                                    #{tag}
                                </span>

                            ))}

                        </div>

                    )}

                    <div className="blog-details-actions">

                        <button
                            className={
                                isLiked
                                    ? "blog-like-btn liked"
                                    : "blog-like-btn"
                            }
                            onClick={handleLike}
                        >
                            {isLiked ? "❤️" : "🤍"} {blog.likes?.length || 0} Likes
                        </button>

                        {isOwner && (

                            <div className="blog-owner-actions">

                                <button
                                    className="blog-edit-action"
                                    onClick={() =>
                                        navigate(`/edit-blog/${blog._id}`)
                                    }
                                >
                                    Edit
                                </button>

                                <button
                                    className="blog-delete-action"
                                    onClick={handleDelete}
                                >
                                    Delete
                                </button>

                            </div>

                        )}

                    </div>

                </div>

            </section>


            {/* ================= COMMENTS ================= */}

            <section className="blog-comments">

                <h3>
                    💬 Comments ({blog.comments?.length || 0})
                </h3>

                <form className="blog-comment-form" onSubmit={handleComment}>

                    <input
                        type="text"
                        placeholder="Share your thoughts..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />

                    <button type="submit">Post</button>

                </form>

                {blog.comments?.length > 0 ? (

                    blog.comments.slice().reverse().map((c) => (

                        <div className="blog-comment-item" key={c._id}>

                            <img
                                src={
                                    c.user?.profileImage ||
                                    "https://i.pravatar.cc/100"
                                }
                                alt={c.user?.firstName}
                            />

                            <div>

                                <strong>
                                    {c.user?.firstName} {c.user?.lastName}
                                </strong>

                                <p>{c.comment}</p>

                            </div>

                        </div>

                    ))

                ) : (

                    <p className="blog-comment-empty">
                        No comments yet. Be the first to share your thoughts.
                    </p>

                )}

            </section>

            <p style={{ textAlign: "center", marginBottom: "60px" }}>

                <Link to="/blogs" style={{ color: "#EA580C", fontWeight: 600, textDecoration: "none" }}>
                    ← Back to all stories
                </Link>

            </p>

        </div>

    );

}

export default BlogDetails;
