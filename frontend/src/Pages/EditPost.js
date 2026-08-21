import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import "../Css/CreatePost.css";

function EditPost() {

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

                console.log("Fetch Post Error:", error);

            }

        };

        fetchPost();

    }, [id]);

    const handleChange = (e) => {

        setPost({

            ...post,
            [e.target.name]: e.target.value

        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const response = await api.put(

                `/api/posts/${id}`,

                post

            );

            alert(response.data.message);

            navigate(`/post/${id}`);

        }

        catch (error) {

            console.log(error);

            alert(
                error.response?.data?.message ||
                "Something went wrong"
            );

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

                <input
                    type="text"
                    name="image"
                    placeholder="Image URL"
                    value={post.image}
                    onChange={handleChange}
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

                <button type="submit">
                    Update Post
                </button>

            </form>

        </div>

    );

}

export default EditPost;