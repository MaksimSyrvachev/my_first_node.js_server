const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema ({
    username: {
        type: String,
        required: true
    },
    roles: {
        User: {
            type: Number,
            default: 2001
        },
        Editor: Number,
        Admin: Number
    },
    password: {
        type: String,
        required: true
    },
    refreshToken: String//when user is created he doesnt have a refresh token, bun when he is authonticated he get this
});

module.exports = mongoose.model('User', userSchema)//shold be named the same as file but mongoose will set tyhe name 'User' to lowercase and plural so it eill look for 'users' collection in MongoDB