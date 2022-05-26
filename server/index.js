const express = require('express');
const mongoose = require('mongoose');
const app = express();
const http = require("http");
const cors = require('cors');
const { Server } = require('socket.io');

// const { messagesRouter } = require('./routes');
const Message = require('./models/Message')
const Room = require("./models/Room");

mongoose.connect('mongodb://chat-v2-mongo:27017/db').then(()=>{
    console.log('mongoose connected successfully')
})

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({extended: true}));

// app.use('/messages', messagesRouter);


const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],

    }
});

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);
    Room.find().then(result => {
        socket.emit('output-rooms', result)
    });


    socket.on("join_room", (data) => {
        console.log(data)
        const room = new Room({ roomName: data.room });
        room.save().then(() => {
            socket.emit('room-created',data)
        });

        socket.join(data.room);
        socket.emit('receive_message', { author: 'admin', message: `${data.username}, welcome to room ${data.room}.`});
        socket.broadcast.to(data.room).emit('receive_message', { author: 'admin', message: `${data.username} has joined!` });

    });


    socket.on("send_message", (data) => {
        const msgToStore = {
            author: data.author,
            roomName: data.roomName,
            message: data.message
        }
        const msg = new Message(msgToStore);
        console.log(msg)

        msg.save().then(() => {
            socket.to(data.roomName).emit('receive_message', data);
        })

    });


    socket.on('get-messages-history', room => {
        Message.find({ roomName: room }).then(result => {
            // list of massages we have
            socket.emit('output-messages', result)
        })
    });


        socket.on('typing', (data) => {
            console.log(data)
        socket.broadcast.to(data.room).emit('typing', { message: `${data.username} is typing`
            });
    });


    socket.on("disconnect", () => {
        console.log("user disconnected", socket.id)
    });

});


server.listen(4000, () => {
    console.log('Server running')
})
