const mongoose = require('mongoose');

//Cria o esquema do banco de dados
const messageSchema = new mongoose.Schema({
    message: String,
    user: String
    }, {
    timestamps: true
});

module.exports = mongoose.model('Message', messageSchema);