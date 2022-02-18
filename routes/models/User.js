const { Schema, model } = require('mongoose');

const schema = new Schema({
    userName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    dateRegistration: { type: Date, default: Date.now() },
    dateLastLogin: { type: Date, default: null },
    isBlocked: { type: Boolean, default: false },
});

module.exports = model('User', schema);
