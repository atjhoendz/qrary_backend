const mongoose = require('mongoose');
const User = require('user');
const Schema = mongoose.Schema;

const PengunjungSchema = new Schema({
    dataUser: User,
    waktuMasuk: {
        type: Date,
        required: true
    }
});

const Pengunjung = mongoose.model("Pengunjung", PengunjungSchema, "Pengunjung");
module.exports = Pengunjung;
