import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import Swal from "sweetalert2";

import "../Css/PostDetails.css";


function PostDetails() {


    const { id } = useParams();

    const navigate = useNavigate();


    const [post, setPost] = useState(null);

    const [comment, setComment] = useState("");


    const loggedUser = JSON.parse(

        localStorage.getItem("user") || "{}"

    );



    useEffect(() => {

        fetchPost();

    }, []);

    // ================= FETCH POST =================
    const fetchPost = async () => {
        try {
            const response = await api.get(
                `/api/posts/${id}`
            );

            setPost(response.data.post);
        }
        catch(error){
            console.log(error);
        }

    };

    // ================= LIKE =================

    const handleLike = async () => {
        try {
            const response = await api.put(
                `/api/posts/${post._id}/like`,
                {
                    userId: loggedUser.id
                }
            );
            setPost({
                ...post,
                likes: response.data.likes
            });
        }
        catch(error){
            console.log(error);
        }
    };
    // ================= ADD COMMENT =================
    const handleComment = async () => {
        if(!comment.trim()) return;
        try{
            const response = await api.post(
                `/api/posts/${post._id}/comment`,
                {
                    userId: loggedUser.id,
                    comment
                }
            );
            setPost({
                ...post,
                comments: response.data.comments
            });
            setComment("");
            Swal.fire({
                toast:true,
                position:"top-end",
                icon:"success",
                title:"Comment added!",
                showConfirmButton:false,
                timer:1500
            });
        }
        catch(error){
            console.log(error);
        }
    };
    // ================= DELETE =================
    const deletePost = async () => {
        const result = await Swal.fire({
            title:"Delete this post?",
            text:"You won't be able to recover it!",
            icon:"warning",
            showCancelButton:true,
            confirmButtonColor:"#e63946",
            cancelButtonColor:"#3085d6",
            confirmButtonText:"Yes, Delete"
        });
        if(!result.isConfirmed) return;
        try{
            const response = await api.delete(
                `/api/posts/${post._id}`
            );
            await Swal.fire({
                icon:"success",
                title:"Deleted!",
                text:response.data.message,
                timer:1500,
                showConfirmButton:false
            });
            navigate("/");
        }
        catch(error){
            Swal.fire({
                icon:"error",
                title:"Oops...",
                text:
                error.response?.data?.message ||
                "Something went wrong"
            });
        }
    };
    const isOwner = 
        loggedUser.id === post?.user?._id;
    if(!post){
        return(
            <h2
            style={{
                textAlign:"center",
                marginTop:"50px"
            }}
            >
                Loading...
            </h2>
        );
    }
    return(
        <div className="post-details">
            <div className="top-section">
                <div className="image-section">
                    <img
                    src={
                        post.image
                        ?
                        post.image
                        :
                        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200"
                    }
                    alt={post.title}
                    className="post-image"
                    />
                </div>
                <div className="post-info">
                    <span className="category-badge">
                        {post.category}
                    </span>
                    <h1>
                        {post.title}
                    </h1>
                    <p className="post-description">
                        {post.description}
                    </p>
                    <h3>
                        📍 {post.location}, {post.country}
                    </h3>
                    <div className="post-stats">
                        <button
                        className="like-btn"
                        onClick={handleLike}
                        >
                        {
                        post.likes.includes(loggedUser.id)
                        ?
                        "❤️"
                        :
                        "🤍"
                        }
                        {" "}
                        {post.likes.length}
                        </button>
                        <span className="comment-count">
                            💬 {post.comments.length}
                        </span>
                    </div>
                    <hr />
                    <div className="author">
                        <img
                        src={
                            post.user.profileImage
                            ?
                            post.user.profileImage
                            :
                            "https://i.pravatar.cc/150"
                        }

                        alt="profile"
                        />
                        <div>
                            <h3>
                            {post.user.firstName} {post.user.lastName}
                            </h3>
                            <p>
                            @{post.user.username}
                            </p>
                        </div>
                    </div>
{
    isOwner && (
        <div className="owner-actions">

    <button
        className="edit-btn"
        onClick={() => navigate(`/edit-post/${post._id}`)}
    >
        ✏ Edit Post
    </button>

    <button
        className="delete-btn"
        onClick={deletePost}
    >
        🗑 Delete Post
    </button>

</div>
    )
}
        </div>
            </div>
            {/* ================= COMMENTS SECTION ================= */}
            <div className="comments-section">

    <h2>💬 Comments</h2>

    <div className="comment-form">
        <input
            type="text"
            placeholder="Write a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
        />

        <button onClick={handleComment}>
            Post
        </button>
    </div>

    {post.comments.length > 0 ? (
        post.comments.map((item, index) => (
            <div className="comment-item" key={index}>

                <img
                    src={
                        item.user?.profileImage ||
                        "https://i.pravatar.cc/150"
                    }
                    alt="user"
                />

                <div className="comment-content">

                    <h4>
                        {item.user?.firstName
                            ? `${item.user.firstName} ${item.user.lastName}`
                            : "User"}
                    </h4>

                    <p>
                        {item.comment}
                    </p>

                    <small>
                        {new Date(item.createdAt).toLocaleDateString()}
                    </small>

                </div>

            </div>
        ))
    ) : (
        <p className="no-comment">
            No comments yet. Be the first to comment!
        </p>
    )}

</div>
                </div>
    );
}

export default PostDetails;                    