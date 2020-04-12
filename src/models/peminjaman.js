const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PeminjamanSchema = new Schema({
    idUser: {
        type: String,
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
    }
});

const Peminjaman = mongoose.model("Peminjaman", PeminjamanSchema, "Peminjaman");
module.exports = Peminjaman;