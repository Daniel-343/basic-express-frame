const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const gameDataSchema = new Schema({
    score: { 
        type: Number,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = model('GameData', gameDataSchema);
