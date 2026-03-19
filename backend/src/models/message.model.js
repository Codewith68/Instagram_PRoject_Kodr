import mongoose from "mongoose";

const messageMediaSchema = new mongoose.Schema(
    {
        url: {
            type: String,
            required: true,
            trim: true,
        },
        mediaType: {
            type: String,
            enum: ["image", "video", "audio", "file"],
            default: "image",
        },
    },
    { _id: false }
);

const messageSchema = new mongoose.Schema(
    {
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        receiver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        content: {
            type: String,
            trim: true,
            default: "",
        },
        media: {
            type: [messageMediaSchema],
            default: [],
        },
    },
    {
        timestamps: true,
    }
);

const MessageModel = mongoose.model("Message", messageSchema);

export default MessageModel;
