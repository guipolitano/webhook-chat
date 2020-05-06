const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    message: String,
    user: String
    }, {
        timestamps: true
});

module.exports = mongoose.model('Message', messageSchema);