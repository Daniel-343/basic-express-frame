const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const userSchema = new Schema({
    userName: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    security: {
        type: Number,
    },
    email: {
        type: String,
        required: true,
    },
    gameData: {
        type: mongoose.Types.ObjectId,
        ref: 'GameData',
      },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    sessionId: {
        type: String,
    },
});

module.exports = model('User', userSchema);
