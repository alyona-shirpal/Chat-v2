const express = require('express');
const app = express();
const http = require("http");
const cors = require('cors');
const {Server} = require('socket.io');

app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],

    }
});

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("join_room", (data) => {
        // socket.emit("send_message", {text: `${data.username} welcome to ${data.room}`});
        // socket.broadcast.to(data.username).emit("send_message",{text: `${data.username} has joined!`});
        socket.join(data);
        console.log("user with id and room name", socket.id, data)
    });

    socket.on("send_message", (data) => {
        socket.to(data.room).emit("receive_message", data)

    })


    socket.on("disconnect", () => {
        console.log("user disconnected", socket.id)
    });
});


server.listen(4000, () => {
    console.log('Server running')
})
