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
        required: true
    },
    pwd: {
        type: String,
        required: true,
    },
    urlFoto: String
});

const PengunjungSchema = new Schema({
    dataUser: UserSchema,
    waktuMasuk: {
        type: Date,
        required: true
    }
});

const Pengunjung = mongoose.model("Pengunjung", PengunjungSchema, "Pengunjung");
module.exports = Pengunjung;