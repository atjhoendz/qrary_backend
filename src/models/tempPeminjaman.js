const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TempPeminjamanSchema = new Schema({
    idUser: String,
    isbnBuku: Array,
    tanggalMeminjam: Date,
    tanggalKembali: Date
});

const TempPeminjaman = mongoose.model("TempPeminjaman", TempPeminjamanSchema, "TempPeminjaman");
module.exports = TempPeminjaman;