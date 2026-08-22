import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import "../Css/EditProfile.css";

function EditProfile() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        bio: "",
        location: "",
        profileImage: "",
        coverImage: "",
        privacy: "public"
    });

    const [profileImageFile, setProfileImageFile] = useState(null);
    const [coverImageFile, setCoverImageFile] = useState(null);

    useEffect(() => {

        const fetchUser = async () => {

            try {

                const localUser = JSON.parse(
                    localStorage.getItem("user") || "{}"
                );

                if (!localUser.id) {
                    return;
                }

                const response = await api.get(
                    `/api/users/${localUser.id}`
                );

                const user = response.data.user;

                setFormData({
                    bio: user.bio || "",
                    location: user.location || "",
                    profileImage: user.profileImage || "",
                    coverImage: user.coverImage || "",
                    privacy: user.privacy || "public"
                });

            } catch (error) {

                console.log("Fetch User Error:", error);

            }

        };

        fetchUser();

    }, []);

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };

    const handleImageChange = (e) => {

        const file = e.target.files[0];

        if (!file) return;

        const previewUrl = URL.createObjectURL(file);

        if (e.target.name === "profileImage") {

            setProfileImageFile(file);
            setFormData({ ...formData, profileImage: previewUrl });

        } else {

            setCoverImageFile(file);
            setFormData({ ...formData, coverImage: previewUrl });

        }

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const localUser = JSON.parse(
                localStorage.getItem("user") || "{}"
            );

            const data = new FormData();

            data.append("bio", formData.bio);
            data.append("location", formData.location);
            data.append("privacy", formData.privacy);

            if (profileImageFile) {
                data.append("profileImage", profileImageFile);
            }

            if (coverImageFile) {
                data.append("coverImage", coverImageFile);
            }

            const response = await api.put(
                `/api/users/${localUser.id}`,
                data,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            const updatedUser = response.data.user;

            localStorage.setItem(
                "user",
                JSON.stringify({
                    ...localUser,
                    ...updatedUser
                })
            );

            alert("Profile Updated Successfully");

            navigate("/profile");

        } catch (error) {

            console.log("Update Profile Error:", error);

            alert(
                error.response?.data?.message ||
                "Unable to update profile"
            );

        }

    };

    return (

        <div className="edit-profile-page">

            <h1>Edit Profile</h1>

            <form onSubmit={handleSubmit}>

                <div className="form-group">

                    <label>Profile Image</label>

                    {formData.profileImage && (
                        <img
                            src={formData.profileImage}
                            alt="profile preview"
                            style={{
                                width: 100,
                                height: 100,
                                borderRadius: "50%",
                                objectFit: "cover",
                                display: "block",
                                marginBottom: 8
                            }}
                        />
                    )}

                    <input
                        type="file"
                        name="profileImage"
                        accept="image/*"
                        onChange={handleImageChange}
                    />

                </div>

                <div className="form-group">

                    <label>Cover Image</label>

                    {formData.coverImage && (
                        <img
                            src={formData.coverImage}
                            alt="cover preview"
                            style={{
                                width: "100%",
                                maxHeight: 150,
                                objectFit: "cover",
                                display: "block",
                                marginBottom: 8
                            }}
                        />
                    )}

                    <input
                        type="file"
                        name="coverImage"
                        accept="image/*"
                        onChange={handleImageChange}
                    />

                </div>

                <input
                    type="text"
                    name="location"
                    placeholder="Location"
                    value={formData.location}
                    onChange={handleChange}
                />

                <textarea
                    name="bio"
                    placeholder="Write something about yourself..."
                    value={formData.bio}
                    onChange={handleChange}
                />

                <div className="form-group">

                    <label>Profile Privacy</label>

                    <select
                        name="privacy"
                        value={formData.privacy}
                        onChange={handleChange}
                    >
                        <option value="public">🌍 Public</option>
                        <option value="private">🔒 Private</option>
                    </select>

                    <small>
                        Public profiles can be viewed by everyone.
                        Private profiles show posts and trips only
                        to approved followers.
                    </small>

                </div>

                <button type="submit">Save Changes</button>

            </form>

        </div>

    );
}

export default EditProfile;