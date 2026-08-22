import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import "../Css/CreatePost.css";

function EditPost() {

    const [imageFile, setImageFile] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setPost({ ...post, image: URL.createObjectURL(file) });
        }
    };

    const navigate = useNavigate();
    const { id } = useParams();

    const [post, setPost] = useState({

        title: "",
        description: "",
        image: "",
        location: "",
        country: "",
        category: "Other"

    });

    useEffect(() => {

        fetchPost();

    }, []);

    const fetchPost = async () => {

        try {

            const response = await api.get(

                `/api/posts/${id}`

            );

            setPost({

                title: response.data.post.title,
                description: response.data.post.description,
                image: response.data.post.image,
                location: response.data.post.location,
                country: response.data.post.country,
                category: response.data.post.category

            });

        }

        catch (error) {

            console.log(error);

        }

    };

    const handleChange = (e) => {

        setPost({

            ...post,
            [e.target.name]: e.target.value

        });

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
            if (imageFile) data.append("image", imageFile);

            const response = await api.put(
                `/api/posts/${id}`,
                data,
                { headers: { "Content-Type": "multipart/form-data" } }
            );
            alert(response.data.message);

            navigate(`/post/${id}`);

        }

        catch (error) {

            console.log(error);

            alert(error.response?.data?.message || "Something went wrong");

        }

    };

    return (

        <div className="create-post-page">

            <h1>Edit Travel Post</h1>

            <form
                className="create-post-form"
                onSubmit={handleSubmit}
            >

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

                {post.image && (
                <img
                    src={post.image}
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

                <select
                    name="category"
                    value={post.category}
                    onChange={handleChange}
                >

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

                <button>

                    Update Post

                </button>

            </form>

        </div>

    );

}

export default EditPost;