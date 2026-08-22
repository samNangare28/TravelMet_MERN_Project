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
        destination: "",
        shortDescription: "",
        content: "",
        travelTips: "",
        category: "Other",
        tags: ""

    });

    const [coverImageFile, setCoverImageFile] = useState(null);
    const [coverImagePreview, setCoverImagePreview] = useState("");

    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e) => {

        setBlog({
            ...blog,
            [e.target.name]: e.target.value
        });

    };

    const handleCoverImageChange = (e) => {

        const file = e.target.files[0];

        if (file) {
            setCoverImageFile(file);
            setCoverImagePreview(URL.createObjectURL(file));
        }

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        setSubmitting(true);

        try {

            const data = new FormData();

            data.append("title", blog.title);
            data.append("destination", blog.destination);
            data.append("shortDescription", blog.shortDescription);
            data.append("content", blog.content);
            data.append("travelTips", blog.travelTips);
            data.append("category", blog.category);
            data.append("tags", blog.tags);

            if (coverImageFile) {
                data.append("coverImage", coverImageFile);
            }

            const response = await api.post(
                "/api/blogs",
                data,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

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

                        <label>Cover Image</label>

                        {coverImagePreview && (

                            <img
                                className="blog-cover-preview"
                                src={coverImagePreview}
                                alt="cover preview"
                            />

                        )}

                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleCoverImageChange}
                        />

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