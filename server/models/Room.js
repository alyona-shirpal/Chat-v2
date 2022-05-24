const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    roomName: {
        type: String,
        required: true
    }
}, { timestamps: true })
const Room = mongoose.model('room', roomSchema);
module.exports = Room;