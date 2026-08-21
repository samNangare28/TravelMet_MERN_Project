const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {

        firstName: {
            type: String,
            required: true,
            trim: true
        },

        lastName: {
            type: String,
            required: true,
            trim: true
        },

        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true
        },

        password: {
            type: String,
            required: true
        },

        profileImage: {
            type: String,
            default: ""
        },

        coverImage: {
            type: String,
            default: ""
        },

        bio: {
            type: String,
            default: "",
            maxlength: 200
        },

        location: {
            type: String,
            default: ""
        },

        privacy: {
            type: String,
            enum: ["public", "private"],
            default: "public"
        },

        savedPlaces: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Destination"
            }
        ],

        trips: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Trip"
            }
        ],

        followers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],

        following: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],

        followRequests: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],

        sentFollowRequests: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ]

    },

    {
        timestamps: true
    }
);


module.exports =
    mongoose.model("User", userSchema);