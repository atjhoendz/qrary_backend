const Peminjaman = require('../models/peminjaman');
const TempPeminjaman = require('../models/tempPeminjaman');
const User = require('../models/user');
const Buku = require('../models/peminjaman');
const FormatResponse = require('../utils/formatResponse');

module.exports = {
    saveFromTemp: (req, res) => {
        let idTemp = req.body.idTempPinjam;
        let tglMeminjam = req.body.tglMeminjam;
        let tglKembali = req.body.tglKembali;

        TempPeminjaman.findById(idTemp).then(resultFind => {
            if (resultFind) {
                let data = {
                    idUser: resultFind.idUser,
                    isbnBuku: resultFind.isbnBuku,
                    tanggalMeminjam: tglMeminjam,
                    tanggalKembali: tglKembali
                }

                Peminjaman.create(data).then(resultCreate => {
                    TempPeminjaman.findByIdAndDelete(idTemp).then(resultDelete => {
                        if (resultDelete) {
                            res.status(200).json(
                                FormatResponse(true, 200, resultCreate, 'Peminjaman berhasil', true)
                            );
                        } else {
                            res.status(200).json(
                                FormatResponse(true, 200, {}, 'Data temp tidak ditemukan', true)
                            );
                        }
                    }).catch(err => {
                        res.status(500).json(
                            FormatResponse(false, 500, '', `Error: ${err.message}`, true)
                        );
                    });
                }).catch(err => {
                    res.status(500).json(
                        FormatResponse(false, 500, '', `Error: ${err.message}`, true)
                    );
                });
            } else {
                res.status(200).json(
                    FormatResponse(true, 200, {}, 'Data temp tidak ditemukan', true)
                );
            }
        }).catch(err => {
            res.status(500).json(
                FormatResponse(false, 500, '', `Error: ${err.message}`, true)
            );
        });
    },
    getAll: (req, res) => {
        Peminjaman.find({}).then(result => {
            res.status(200).json(
                FormatResponse(true, 200, result, 'Mendapatkan semua data Peminjaman sukses', true)
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

        Peminjaman.find({}).orFail().then(result => {
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
                    FormatResponse(true, 200, newData, 'Mendapatkan data Peminjaman berhalaman berhasil', isLast)
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

        Peminjaman.find(query).orFail().then(result => {
            res.status(200).json(
                FormatResponse(true, 200, result, 'Mendapatkan data Peminjaman berhasil', true)
            );
        }).catch(err => {
            res.status(200).json(
                FormatResponse(true, 200, {}, 'Peminjaman tidak ditemukan', true)
            );
        });
    },
};