import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../api/axios";

import "../Css/Blog.css";

const CATEGORIES = [
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

function CreateBlog() {

    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const [blog, setBlog] = useState({

        title: "",
        coverImage: "",
        destination: "",
        shortDescription: "",
        content: "",
        travelTips: "",
        category: "Other",
        tags: ""

    });

    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e) => {

        setBlog({
            ...blog,
            [e.target.name]: e.target.value
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        setSubmitting(true);

        try {

            const response = await api.post("/api/blogs", blog);

            await Swal.fire({
                icon: "success",
                title: "Blog Published!",
                text: response.data.message,
                timer: 1600,
                showConfirmButton: false
            });

            navigate(`/blogs/${response.data.blog._id}`);

        }

        catch (error) {

            console.log("Create Blog Error:", error);

            Swal.fire({
                icon: "error",
                title: "Something went wrong",
                text:
                    error.response?.data?.message ||
                    "Please check your details and try again."
            });

        }

        finally {

            setSubmitting(false);

        }

    };

    return (

        <div className="create-blog-page">

            <div className="create-blog-shell">

                <div className="create-blog-header">

                    <h1>✍️ Write a Travel Blog</h1>

                    <p>
                        Share an in‑depth story, guide or diary from
                        your travels with the TravelMet community.
                    </p>

                </div>

                <form className="create-blog-form" onSubmit={handleSubmit}>

                    <div className="blog-author-card">

                        <img
                            src={
                                user.profileImage ||
                                "https://i.pravatar.cc/100"
                            }
                            alt="author"
                        />

                        <div>

                            <strong>
                                {user.firstName} {user.lastName}
                            </strong>

                            <span>Author · @{user.username}</span>

                        </div>

                    </div>

                    <div className="blog-form-group">

                        <label>Blog Title</label>

                        <input
                            type="text"
                            name="title"
                            placeholder="e.g. 10 Days Chasing Waterfalls in Bali"
                            value={blog.title}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    <div className="blog-form-group">

                        <label>Cover Image URL</label>

                        <input
                            type="text"
                            name="coverImage"
                            placeholder="https://..."
                            value={blog.coverImage}
                            onChange={handleChange}
                        />

                        {blog.coverImage && (

                            <img
                                className="blog-cover-preview"
                                src={blog.coverImage}
                                alt="cover preview"
                            />

                        )}

                    </div>

                    <div className="blog-form-row">

                        <div className="blog-form-group">

                            <label>Destination / Location</label>

                            <input
                                type="text"
                                name="destination"
                                placeholder="e.g. Bali, Indonesia"
                                value={blog.destination}
                                onChange={handleChange}
                                required
                            />

                        </div>

                        <div className="blog-form-group">

                            <label>Category</label>

                            <select
                                name="category"
                                value={blog.category}
                                onChange={handleChange}
                            >

                                {CATEGORIES.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}

                            </select>

                        </div>

                    </div>

                    <div className="blog-form-group">

                        <label>Short Description</label>

                        <textarea
                            name="shortDescription"
                            rows={2}
                            maxLength={300}
                            placeholder="A one or two sentence summary shown on the blog card"
                            value={blog.shortDescription}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    <div className="blog-form-group">

                        <label>Full Blog Content</label>

                        <textarea
                            name="content"
                            rows={12}
                            placeholder="Tell the full story... (Markdown supported — headings, **bold**, lists, quotes)"
                            value={blog.content}
                            onChange={handleChange}
                            required
                        />

                        <span className="blog-form-hint">
                            Supports Markdown — use ## for headings, **bold**, and blank lines between paragraphs.
                        </span>

                    </div>

                    <div className="blog-form-group">

                        <label>Travel Tips</label>

                        <textarea
                            name="travelTips"
                            rows={4}
                            placeholder="Practical tips for travellers — best time to visit, budget, what to pack..."
                            value={blog.travelTips}
                            onChange={handleChange}
                        />

                    </div>

                    <div className="blog-form-group">

                        <label>Tags</label>

                        <input
                            type="text"
                            name="tags"
                            placeholder="e.g. waterfalls, budget, backpacking (comma separated)"
                            value={blog.tags}
                            onChange={handleChange}
                        />

                    </div>

                    <button
                        type="submit"
                        className="create-blog-submit"
                        disabled={submitting}
                    >
                        {submitting ? "Publishing..." : "🚀 Publish Blog"}
                    </button>

                </form>

            </div>

        </div>

    );

}

export default CreateBlog;
