const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PeminjamanSchema = new Schema({
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
    isDikembalikan: {
        type: Boolean,
        default: false
    }
});

const Peminjaman = mongoose.model("Peminjaman", PeminjamanSchema, "Peminjaman");
module.exports = Peminjaman;