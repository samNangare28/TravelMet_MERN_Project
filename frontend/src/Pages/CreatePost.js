import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../Css/CreatePost.css";

function CreatePost() {

    const navigate = useNavigate();

    const [post, setPost] = useState({

        title: "",
        description: "",
        image: "",
        location: "",
        country: "",
        category: "Other"

    });


    const handleChange = (e) => {

        setPost({

            ...post,
            [e.target.name]: e.target.value

        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const user = JSON.parse(localStorage.getItem("user"));

            const response = await api.post(

                "/api/posts",

                {

                    ...post,

                    user: user.id

                }

            );

            alert(response.data.message);

            setPost({

                title: "",
                description: "",
                image: "",
                location: "",
                country: "",
                category: "Other"

            });

        }

        catch (error) {

    console.log("Full Error :", error);

    console.log("Response :", error.response);

    console.log("Data :", error.response?.data);

    alert(error.response?.data?.message || "Something went wrong");

}

    };

    return (

        <div className="create-post-page">

            <h1>Create Travel Post</h1>

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

                <button>

                    Create Post

                </button>

            </form>

        </div>

    );

}

export default CreatePost;