const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    nama: {
        type: String,
        required: true
    },
    npm: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        index: true,
        unique: true
    },
    pwd: {
        type: String,
        required: true,
    },
    programStudi: {
        type: String,
        required: true
    },
    fakultas: {
        type: String,
        required: true
    },
    angkatan: {
        type: String,
        required: true
    },
    role: String,
    urlFoto: String,
    isConfirmed: Boolean,
    isModePinjam: Boolean,
    isResetPwdLinkActive: Boolean
});

const User = mongoose.model("User", UserSchema, "User");
module.exports = User;