const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    author: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    roomName: {
        type: String,
        required: true
    },
}, { timestamps: true })
const Message = mongoose.model('message', messageSchema);
module.exports = Message;
