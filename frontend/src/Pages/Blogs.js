import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

import "../Css/Blog.css";

const CATEGORIES = [
    "All",
    "Adventure",
    "Beach",
    "Mountains",
    "City",
    "Culture",
    "Food",
    "Budget Travel",
    "Luxury",
    "Solo Travel",
    "Family",
    "Road Trip",
    "Other"
];

function Blogs() {

    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");

    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    useEffect(() => {

        fetchBlogs(1);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [category]);

    const fetchBlogs = async (pageNum) => {

        try {

            if (pageNum === 1) {
                setLoading(true);
            }

            const params = new URLSearchParams();

            if (category && category !== "All") {
                params.set("category", category);
            }

            if (search.trim()) {
                params.set("search", search.trim());
            }

            params.set("page", pageNum);
            params.set("limit", 9);

            const response = await api.get(
                `/api/blogs?${params.toString()}`
            );

            if (pageNum === 1) {
                setBlogs(response.data.blogs || []);
            } else {
                setBlogs((prev) => [...prev, ...(response.data.blogs || [])]);
            }

            setHasMore(pageNum < response.data.totalPages);
            setPage(pageNum);

        }

        catch (error) {

            console.log("Fetch Blogs Error:", error);

        }

        finally {

            setLoading(false);
            setLoadingMore(false);

        }

    };

    const handleLoadMore = () => {

        setLoadingMore(true);
        fetchBlogs(page + 1);

    };

    const handleSearchSubmit = (e) => {

        e.preventDefault();
        fetchBlogs(1);

    };

    const goToCreateBlog = () => {

        if (!token) {

            navigate("/login");
            return;

        }

        navigate("/create-blog");

    };

    const featured = blogs[0];
    const rest = blogs.length > 1 ? blogs.slice(1) : [];
    const listToShow = blogs.length > 0 ? rest : [];

    return (

        <div className="blog-page">

            {/* ================= HERO ================= */}

            <section className="blog-hero">

                <span className="blog-hero-eyebrow">
                    ✈ TravelMet Magazine
                </span>

                <h1>
                    Stories, Guides &amp; Inspiration
                    for your next journey
                </h1>

                <p>
                    Real experiences from real travellers — in‑depth
                    guides, hidden gems and practical tips written
                    by the TravelMet community.
                </p>

                <div className="blog-hero-actions">

                    <button
                        className="blog-write-btn"
                        onClick={goToCreateBlog}
                    >
                        ✍️ Write a Blog
                    </button>

                </div>

            </section>


            {/* ================= TOOLBAR ================= */}

            <div className="blog-toolbar">

                <div className="blog-toolbar-inner">

                    <form onSubmit={handleSearchSubmit} style={{ flex: "1 1 240px" }}>

                        <input
                            type="text"
                            className="blog-search-input"
                            placeholder="Search destinations, titles, tags..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />

                    </form>

                    <div className="blog-category-chips">

                        {CATEGORIES.map((cat) => (

                            <button
                                key={cat}
                                type="button"
                                className={
                                    category === cat
                                        ? "blog-chip active"
                                        : "blog-chip"
                                }
                                onClick={() => setCategory(cat)}
                            >
                                {cat}
                            </button>

                        ))}

                    </div>

                </div>

            </div>


            {/* ================= FEATURED ================= */}

            {!loading && featured && (

                <section className="blog-featured">

                    <Link
                        to={`/blogs/${featured._id}`}
                        className="blog-featured-card"
                    >

                        <div
                            className="blog-featured-image"
                            style={{
                                backgroundImage: `url(${
                                    featured.coverImage ||
                                    "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200"
                                })`
                            }}
                        />

                        <div className="blog-featured-body">

                            <span className="blog-featured-tag">
                                Featured · {featured.category}
                            </span>

                            <h2>{featured.title}</h2>

                            <p>{featured.shortDescription}</p>

                            <div className="blog-featured-meta">

                                <img
                                    src={
                                        featured.user?.profileImage ||
                                        "https://i.pravatar.cc/100"
                                    }
                                    alt={featured.authorName}
                                />

                                <strong>
                                    {featured.authorName ||
                                        featured.user?.firstName}
                                </strong>

                                <span className="blog-featured-dot" />

                                <span>📍 {featured.destination}</span>

                                <span className="blog-featured-dot" />

                                <span>{featured.readTime} min read</span>

                            </div>

                        </div>

                    </Link>

                </section>

            )}


            {/* ================= GRID ================= */}

            <section className="blog-listing">

                <div className="blog-listing-heading">

                    <h2>Latest Stories</h2>

                    <span>{blogs.length} article{blogs.length === 1 ? "" : "s"}</span>

                </div>

                <div className="blogs-grid">

                    {loading ? (

                        <div className="blog-loading">
                            Loading stories...
                        </div>

                    ) : blogs.length === 0 ? (

                        <div className="blog-empty">

                            <h3>📝 No blogs yet</h3>

                            <p>
                                Be the first to publish a travel
                                story for the community.
                            </p>

                        </div>

                    ) : listToShow.length > 0 ? (

                        listToShow.map((blog) => (

                            <BlogCard key={blog._id} blog={blog} />

                        ))

                    ) : null}

                </div>

                {/* ================= LOAD MORE ================= */}

                {hasMore && !loading && blogs.length > 0 && (

                    <button
                        className="blog-load-more-btn"
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

        </div>

    );

}

function BlogCard({ blog }) {

    return (

        <Link to={`/blogs/${blog._id}`} className="blog-card">

            <div className="blog-card-image-wrap">

                <img
                    src={
                        blog.coverImage ||
                        "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800"
                    }
                    alt={blog.title}
                />

                <span className="blog-card-category">
                    {blog.category}
                </span>

            </div>

            <div className="blog-card-body">

                <p className="blog-card-destination">
                    📍 {blog.destination}
                </p>

                <h3>{blog.title}</h3>

                <p>{blog.shortDescription}</p>

                <div className="blog-card-footer">

                    <div className="blog-card-author">

                        <img
                            src={
                                blog.user?.profileImage ||
                                "https://i.pravatar.cc/100"
                            }
                            alt={blog.authorName}
                        />

                        {blog.authorName || blog.user?.firstName}

                    </div>

                    <div className="blog-card-stats">

                        <span>❤️ {blog.likes?.length || 0}</span>

                        <span>{blog.readTime} min</span>

                    </div>

                </div>

            </div>

        </Link>

    );

}

export default Blogs;