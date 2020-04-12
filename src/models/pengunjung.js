const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PengunjungSchema = new Schema({
    idUser: {
        type: String,
        required: true
    },
    waktuMasuk: {
        type: Date,
        required: true
    }
});

const Pengunjung = mongoose.model("Pengunjung", PengunjungSchema, "Pengunjung");
module.exports = Pengunjung;