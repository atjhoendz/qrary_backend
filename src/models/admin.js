const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AdminSchema = new Schema({
    nama: {
        type: String,
        required: true
    },
    nip: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    pwd: {
        type: String,
        required: true
    },
    jabatan: {
        type: String
    },
    jk: {
        type: String,
        required: true
    },
    tanggalLahir: {
        type: Date
    },
    alamat: {
        type: String
    },
    role: {
        type: String,
        required: true
    },
    urlFoto: {
        type: String
    }
});

const Admin = mongoose.model("Admin", AdminSchema, "Admin");
module.exports = Admin;