const mongoose = require('mongoose');
const User = require('user');
const Buku = require('buku');
const Schema = mongoose.Schema;

const PeminjamanSchema = new Schema({
    dataUser: User,
    dataBuku: Buku,
    isMetodeOnline: {
        type: Boolean,
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
