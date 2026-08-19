import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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

function EditBlog() {

    const navigate = useNavigate();
    const { id } = useParams();

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

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {

        fetchBlog();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const fetchBlog = async () => {

        try {

            const response = await api.get(`/api/blogs/${id}`);

            const data = response.data.blog;

            setBlog({

                title: data.title,
                coverImage: data.coverImage,
                destination: data.destination,
                shortDescription: data.shortDescription,
                content: data.content,
                travelTips: data.travelTips,
                category: data.category,
                tags: (data.tags || []).join(", ")

            });

        }

        catch (error) {

            console.log("Fetch Blog Error:", error);

        }

        finally {

            setLoading(false);

        }

    };

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

            const response = await api.put(`/api/blogs/${id}`, blog);

            await Swal.fire({
                icon: "success",
                title: "Blog Updated!",
                text: response.data.message,
                timer: 1500,
                showConfirmButton: false
            });

            navigate(`/blogs/${id}`);

        }

        catch (error) {

            console.log("Update Blog Error:", error);

            Swal.fire({
                icon: "error",
                title: "Something went wrong",
                text:
                    error.response?.data?.message ||
                    "Please try again."
            });

        }

        finally {

            setSubmitting(false);

        }

    };

    if (loading) {

        return (
            <div className="blog-loading" style={{ padding: "160px 0" }}>
                Loading blog...
            </div>
        );

    }

    return (

        <div className="create-blog-page">

            <div className="create-blog-shell">

                <div className="create-blog-header">

                    <h1>✏️ Edit Blog</h1>

                    <p>Update your story and republish it.</p>

                </div>

                <form className="create-blog-form" onSubmit={handleSubmit}>

                    <div className="blog-form-group">

                        <label>Blog Title</label>

                        <input
                            type="text"
                            name="title"
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
                            value={blog.content}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    <div className="blog-form-group">

                        <label>Travel Tips</label>

                        <textarea
                            name="travelTips"
                            rows={4}
                            value={blog.travelTips}
                            onChange={handleChange}
                        />

                    </div>

                    <div className="blog-form-group">

                        <label>Tags</label>

                        <input
                            type="text"
                            name="tags"
                            value={blog.tags}
                            onChange={handleChange}
                        />

                    </div>

                    <button
                        type="submit"
                        className="create-blog-submit"
                        disabled={submitting}
                    >
                        {submitting ? "Saving..." : "Save Changes"}
                    </button>

                </form>

            </div>

        </div>

    );

}

export default EditBlog;
