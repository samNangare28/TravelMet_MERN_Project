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
        destination: "",
        shortDescription: "",
        content: "",
        travelTips: "",
        category: "Other",
        tags: ""

    });

    const [coverImageFile, setCoverImageFile] = useState(null);
    const [coverImagePreview, setCoverImagePreview] = useState("");

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
                destination: data.destination,
                shortDescription: data.shortDescription,
                content: data.content,
                travelTips: data.travelTips,
                category: data.category,
                tags: (data.tags || []).join(", ")

            });

            setCoverImagePreview(data.coverImage || "");

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

            const response = await api.put(
                `/api/blogs/${id}`,
                data,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

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