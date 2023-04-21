const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
    {
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
        },
        receiverId: {
            type: mongoose.Schema.Types.ObjectId,
        },
        text: {
            type: String,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Message", MessageSchema)