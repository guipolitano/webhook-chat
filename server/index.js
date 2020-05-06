const express = require('express');
const app = express();
const http = require('http').Server(app);
const path = require('path');
const io = require('socket.io')(http);

const uri = "mongodb+srv://usuario:abcd123456@chat-c5q2j.gcp.mongodb.net/test?retryWrites=true&w=majority";
const port = 5000;

const Message = require('./message');
const mongoose = require('mongoose');

//Realiza a conexão com o banco
mongoose.connect(uri, {
    useUnifiedTopology: true,
    useNewUrlParser: true
});

app.use(express.static(path.join(__dirname, '..', 'client', 'build')));

//Conecta com o Socket
io.on('connection', (socket) => {
    //Filtra o retorno das Mensagens
    Message.find().sort({createdAt: -1}).limit(10).exec((err, messages) => {
        if(err) return console.error(err);
        socket.emit('init', messages);
    });

    //Sempre que chega uma mensagem, instancia uma nova Message
    socket.on('message', (msg) => {
        const message = new Message({
            message: msg.message, 
            user: msg.user
        });

        //Salva a mensagem no banco
        message.save((err) => {
            if(err) return console.error(err)
        });

        //Envia a mensagem devolta
        socket.broadcast.emit('push', msg);
    })
})

http.listen(port, () => {
  console.log("Backend rodando na porta:" + port);
});