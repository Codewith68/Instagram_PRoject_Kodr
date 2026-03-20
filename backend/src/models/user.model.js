import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
            select:false
        },
        bio: {
            type: String,
            default: "",
            trim: true,
        },
        profilePic: {
            type: String,
            default: "",
            trim: true,
        },
        fullname: {
            type: String,
            default: "",
            trim: true,
        },
        private: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
