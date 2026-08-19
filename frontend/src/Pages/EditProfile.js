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

                console.log(
                    "Fetch User Error:",
                    error
                );

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

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const localUser = JSON.parse(
                localStorage.getItem("user") || "{}"
            );

            await api.put(
                `/api/users/${localUser.id}`,
                formData
            );

            // Update localStorage also
            const oldUser = JSON.parse(
                localStorage.getItem("user") || "{}"
            );

            localStorage.setItem(
                "user",
                JSON.stringify({
                    ...oldUser,
                    ...formData
                })
            );

            alert(
                "Profile Updated Successfully"
            );

            navigate("/profile");

        } catch (error) {

            console.log(
                "Update Profile Error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Unable to update profile"
            );

        }

    };

    return (

        <div className="edit-profile-page">

            <h1>
                Edit Profile
            </h1>

            <form onSubmit={handleSubmit}>

                <input
                    type="text"
                    name="profileImage"
                    placeholder="Profile Image URL"
                    value={formData.profileImage}
                    onChange={handleChange}
                />

                <input
                    type="text"
                    name="coverImage"
                    placeholder="Cover Image URL"
                    value={formData.coverImage}
                    onChange={handleChange}
                />

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

                {/* ================= PRIVACY ================= */}

                <div className="form-group">

                    <label>
                        Profile Privacy
                    </label>

                    <select
                        name="privacy"
                        value={formData.privacy}
                        onChange={handleChange}
                    >

                        <option value="public">
                            🌍 Public
                        </option>

                        <option value="private">
                            🔒 Private
                        </option>

                    </select>

                    <small>
                        Public profiles can be viewed by everyone.
                        Private profiles show posts and trips only
                        to approved followers.
                    </small>

                </div>

                <button type="submit">
                    Save Changes
                </button>

            </form>

        </div>

    );
}

export default EditProfile;