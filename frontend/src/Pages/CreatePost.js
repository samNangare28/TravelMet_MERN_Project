import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../Css/CreatePost.css";

function CreatePost() {

    const navigate = useNavigate();

    const [post, setPost] = useState({
        title: "",
        description: "",
        location: "",
        country: "",
        category: "Other"
    });

    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState("");

    const handleChange = (e) => {

        setPost({
            ...post,
            [e.target.name]: e.target.value
        });

    };

    const handleImageChange = (e) => {

        const file = e.target.files[0];

        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const data = new FormData();

            data.append("title", post.title);
            data.append("description", post.description);
            data.append("location", post.location);
            data.append("country", post.country);
            data.append("category", post.category);

            if (imageFile) {
                data.append("image", imageFile);
            }

            const response = await api.post(
                "/api/posts",
                data,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            alert(response.data.message);

            setPost({
                title: "",
                description: "",
                location: "",
                country: "",
                category: "Other"
            });

            setImageFile(null);
            setImagePreview("");

        } catch (error) {

            console.log("Full Error :", error);
            alert(error.response?.data?.message || "Something went wrong");

        }

    };

    return (

        <div className="create-post-page">

            <h1>Create Travel Post</h1>

            <form className="create-post-form" onSubmit={handleSubmit}>

                <input
                    type="text"
                    name="title"
                    placeholder="Title"
                    value={post.title}
                    onChange={handleChange}
                    required
                />

                <textarea
                    name="description"
                    placeholder="Description"
                    value={post.description}
                    onChange={handleChange}
                    required
                />

                {imagePreview && (
                    <img
                        src={imagePreview}
                        alt="preview"
                        style={{ width: "100%", maxHeight: 200, objectFit: "cover" }}
                    />
                )}

                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                />

                <input
                    type="text"
                    name="location"
                    placeholder="Location"
                    value={post.location}
                    onChange={handleChange}
                    required
                />

                <input
                    type="text"
                    name="country"
                    placeholder="Country"
                    value={post.country}
                    onChange={handleChange}
                    required
                />

                <select name="category" value={post.category} onChange={handleChange}>
                    <option>Beach</option>
                    <option>Mountains</option>
                    <option>Adventure</option>
                    <option>Nature</option>
                    <option>City</option>
                    <option>Camping</option>
                    <option>Road Trip</option>
                    <option>Historical</option>
                    <option>Food</option>
                    <option>Other</option>
                </select>

                <button>Create Post</button>

            </form>

        </div>

    );

}

export default CreatePost;