const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HistoryPeminjamanSchema = new Schema({
    idUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    isbnBuku: {
        type: Array,
        required: true
    },
    tanggalMeminjam: {
        type: Date,
        required: true
    },
    tanggalKembali: {
        type: Date,
        required: true
    },
    isDikembalikan: Boolean
});

const HistoryPeminjaman = mongoose.model("HistoryPeminjaman", HistoryPeminjamanSchema, "HistoryPeminjaman");
module.exports = HistoryPeminjaman;