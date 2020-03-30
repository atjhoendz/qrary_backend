const Buku = require('../models/buku');
const FormatResponse = require('../utils/formatResponse');

module.exports = {
    add: (req, res) => {

    },
    getAll: (req, res) => {
        Buku.find({}).then(result => {
            res.status(200).json(
                FormatResponse(true, 200, result, 'Mendapatkan semua buku sukses', true)
            );
        }).catch(err => {
            res.status(500).json(
                FormatResponse(false, 500, "", err.message, true)
            );
        });
    }
};