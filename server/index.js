const express = require('express');
const app = express();
const http = require('http').Server(app);
const path = require('path');
const io = require('socket.io')(http);

const uri = "mongodb+srv://usuario:abcd123456@chat-c5q2j.gcp.mongodb.net/test?retryWrites=true&w=majority";
const port = 5000;

const Message = require('./message');
const mongoose = require('mongoose');

mongoose.connect(uri, {
    useUnifiedTopology: true,
    useNewUrlParser: true
});

app.use(express.static(path.join(__dirname, '..', 'client', 'build')));

io.on('connection', (socket) => {
    Message.find().sort({createdAt: -1}).limit(10).exec((err, messages) => {
        if(err) return console.error(err);
        socket.emit('init', messages);
    });

    socket.on('message', (msg) => {
        const message = new Message({
            message: msg.message, 
            user: msg.user
        });

        message.save((err) => {
            if(err) return console.error(err)
        });

        socket.broadcast.emit('push', msg);
    })
})

http.listen(port, () => {
  console.log("listening on *:" + port);
});