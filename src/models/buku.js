const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BukuSchema = new Schema({
    bahasa: String,
    isbn: {
        type: String,
        required: true
    },
    jmlHal: Number,
    judul: {
        type: String,
        required: true
    },
    deskripsi: String,
    penerbit: String,
    penulis: String,
    kategori: Array,
    penerjemah: String,
    tanggalTerbit: String,
    urlFoto: String
});

const Buku = mongoose.model("Buku", BukuSchema, "Buku");
module.exports = Buku;