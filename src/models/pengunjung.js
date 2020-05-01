const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PengunjungSchema = new Schema({
    idUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    waktuMasuk: {
        type: Date,
        required: true
    },
    isExpired: {
        type: Boolean,
        default: false
    }
});

const Pengunjung = mongoose.model("Pengunjung", PengunjungSchema, "Pengunjung");
module.exports = Pengunjung;