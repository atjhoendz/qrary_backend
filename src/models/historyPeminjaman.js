const mongoose = require('mongoose');
const User = require('user');
const Buku = require('buku');
const Schema = mongoose.Schema;

const HistoryPeminjamanSchema = new Schema({
    dataUser: User,
    dataBuku: Buku,
    tanggalMeminjam: {
        type: Date,
        required: true
    },
    tanggalKembali: {
        type: Date,
        required: true
    }
});

const HistoryPeminjaman = mongoose.model("HistoryPeminjaman", HistoryPeminjamanSchema, "HistoryPeminjaman");
module.exports = HistoryPeminjaman;
