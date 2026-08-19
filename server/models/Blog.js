const mongoose = require("mongoose");

// =====================================================
// BLOG SCHEMA
// A long-form travel magazine style article, separate
// from the short "Post" model used by the community feed.
// =====================================================

const blogSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 150
        },

        coverImage: {
            type: String,
            default: ""
        },

        destination: {
            type: String,
            required: true,
            trim: true
        },

        shortDescription: {
            type: String,
            required: true,
            trim: true,
            maxlength: 300
        },

        content: {
            type: String,
            required: true
        },

        travelTips: {
            type: String,
            default: ""
        },

        category: {
            type: String,
            enum: [
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
            ],
            default: "Other"
        },

        tags: [
            {
                type: String,
                trim: true
            }
        ],

        // Author fields are denormalised at write time so a
        // blog still shows a byline even if the profile fields
        // change later, while `user` remains the source of
        // truth for ownership / edit / delete checks.
        authorName: {
            type: String,
            default: ""
        },

        readTime: {
            type: Number,
            default: 3
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
        ],

        views: {
            type: Number,
            default: 0
        },

        published: {
            type: Boolean,
            default: true
        }
    },

    {
        timestamps: true
    }
);

// Helpful for the listing page's search + filter UI.
blogSchema.index({ title: "text", destination: "text", tags: "text" });

module.exports = mongoose.model("Blog", blogSchema);
