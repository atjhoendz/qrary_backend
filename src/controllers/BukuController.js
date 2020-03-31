const Buku = require('../models/buku');
const FormatResponse = require('../utils/formatResponse');

const setKategori = (kategori) => {
    return kategori.split(',');
};

module.exports = {
    add: (req, res) => {
        Buku.find({
            isbn: req.body.isbn
        }).then(result => {
            console.log(result);
            if (Object.keys(result).length == 0) {
                Buku.create({
                    bahasa: req.body.bahasa,
                    isbn: req.body.isbn,
                    jmlHal: req.body.jmlHal,
                    judul: req.body.judul,
                    deskripsi: req.body.deskripsi,
                    penerbit: req.body.penerbit,
                    penulis: req.body.penulis,
                    kategori: setKategori(req.body.kategori),
                    penerjemah: req.body.penerjemah,
                    tanggalTerbit: req.body.tanggalTerbit
                }).then(buku => {
                    res.status(201).json(
                        FormatResponse(true, 201, buku, 'Buku berhasil ditambahkan', true)
                    );
                }).catch(err => {
                    res.status(200).json(
                        FormatResponse(true, 200, {}, `Buku tidak berhasil ditambahkan, ${err.message}`, true)
                    )
                });
            } else {
                res.status(200).json(
                    FormatResponse(true, 200, {}, 'Nomor ISBN sudah tersedia', true)
                );
            }
        }).catch(err => {
            res.status(500).json(
                FormatResponse(false, 500, {}, err.message, true)
            );
        });
    },
    getAll: (req, res) => {
        Buku.find({}).then(result => {
            res.status(200).json(
                FormatResponse(true, 200, result, 'Mendapatkan semua data buku sukses', true)
            );
        }).catch(err => {
            res.status(500).json(
                FormatResponse(false, 500, {}, err.message, true)
            );
        });
    },
    getPaginate: (req, res) => {
        let page = req.params.page;
        let limit = req.params.limit;

        Buku.find({}).orFail().then(result => {
            let total = Object.keys(result).length;
            let newData = [];
            let show;
            if (page == 1) {
                show = 0;
            } else {
                show = ((page - 1) * limit);
            }

            for (let i = 0; i < total; i++) {
                if (i >= show && i <= show + limit - 1) {
                    newData.push(result[i]);
                } else if (i > show + limit) {
                    break;
                }
            }

            let isLast;
            if (total <= page * limit && total > (page - 1) * limit) {
                isLast = true;
            } else {
                isLast = false;
            }

            if (Object.keys(newData).length > 0) {
                res.status(200).json(
                    FormatResponse(true, 200, newData, 'Mendapatkan data buku berhalaman berhasil', isLast)
                );
            } else {
                res.status(200).json(
                    FormatResponse(true, 200, {}, 'Data tidak ditemukan', true)
                );
            }

        }).catch(err => {
            res.status(500).json(
                FormatResponse(false, 500, {}, err.message, true)
            );
        });
    },
    find: (req, res) => {
        let key = req.params.key;
        let value = req.params.value;
        let query = {};
        query[key] = new RegExp(value, 'i');

        Buku.find(query).orFail().then(result => {
            res.status(200).json(
                FormatResponse(true, 200, result, 'Mendapatkan data buku berhasil', true)
            );
        }).catch(err => {
            res.status(404).json(
                FormatResponse(false, 404, {}, 'Buku tidak ditemukan', true)
            );
        });
    },
    deleteBuku: (req, res) => {
        let id = req.params.id;
        Buku.deleteOne({
            _id: id
        }).orFail().then(result => {
            res.status(200).json(
                FormatResponse(true, 200, result, 'Buku berhasil dihapus', true)
            );
        }).catch(err => {
            res.status(404).json(
                FormatResponse(false, 404, {}, 'Buku tidak ditemukan', true)
            );
        });
    },
    update: (req, res) => {
        let id = req.params.id;
        Buku.findByIdAndUpdate(id, {
            bahasa: req.body.bahasa,
            isbn: req.body.isbn,
            jmlHal: req.body.jmlHal,
            judul: req.body.judul,
            deskripsi: req.body.deskripsi,
            penerbit: req.body.penerbit,
            penulis: req.body.penulis,
            kategori: setKategori(req.body.kategori),
            penerjemah: req.body.penerjemah,
            tanggalTerbit: req.body.tanggalTerbit
        }).orFail().then(result => {
            if (Object.keys(result).length > 0) {
                res.status(200).json(
                    FormatResponse(true, 200, result, 'Buku berhasil diperbarui', true)
                );
            } else {
                res.status(404).json(
                    FormatResponse(false, 404, {}, 'Buku tidak ditemukan', true)
                );
            }
        }).catch(err => {
            res.status(404).json(
                FormatResponse(false, 404, {}, err.message, true)
            );
        });
    },
};