const mongoose = require("mongoose");

const travelCompanySchema = new mongoose.Schema(
    {

        // COMPANY BASIC DETAILS

        companyName: {
            type: String,
            required: true,
            trim: true
        },

        ownerName: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true
        },

        phone: {
            type: String,
            required: true,
            trim: true
        },

        password: {
            type: String,
            required: true
        },


        // COMPANY PROFILE

        description: {
            type: String,
            default: "",
            maxlength: 500
        },

        address: {
            type: String,
            required: true,
            trim: true
        },

        website: {
            type: String,
            default: ""
        },

        logo: {
            type: String,
            default: ""
        },

        coverImage: {
            type: String,
            default: ""
        },


        // VERIFICATION DOCUMENT

        certificate: {
            type: String,
            required: true
        },


        // COMPANY VERIFICATION

        verificationStatus: {
            type: String,
            enum: [
                "pending",
                "verified",
                "rejected"
            ],
            default: "pending"
        },

        rejectionReason: {
            type: String,
            default: ""
        },

        verifiedAt: {
            type: Date,
            default: null
        },

        verifiedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Admin",
            default: null
        }

    },

    {
        timestamps: true
    }
);


module.exports =
    mongoose.model(
        "TravelCompany",
        travelCompanySchema
    );