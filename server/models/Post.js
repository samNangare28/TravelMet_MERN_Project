const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        title: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true,
            trim: true
        },
        image: {
            type: String,
            default: ""
        },
        location: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        },

        category: {
            type: String,
            enum: [
                "Beach",
                "Mountains",
                "Adventure",
                "Nature",
                "City",
                "Camping",
                "Road Trip",
                "Historical",
                "Food",
                "Other"
            ],
            default: "Other"
        },

        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],

        comments: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User"
                },

                comment: {
                    type: String,
                    required: true
                },

                createdAt: {
                    type: Date,
                    default: Date.now
                }
            }

        ]

    },

    {

        timestamps: true

    }

);

module.exports = mongoose.model("Post", postSchema);