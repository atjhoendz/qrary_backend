const Buku = require('../models/buku');
const sendResponse = require('../utils/formatResponse');
const mongoose = require('mongoose');

const setKategori = (kategori) => {
    return kategori.split(',');
};

module.exports = {
    add: (req, res) => {
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
            tanggalTerbit: req.body.tanggalTerbit,
            status: req.body.status,
            urlFoto: req.body.urlFoto
        }).then(buku => {
            sendResponse(res, true, 201, buku, 'Buku berhasil ditambahkan', true);
        }).catch(err => {
            sendResponse(res, true, 200, {}, `Buku tidak berhasil ditambahkan, ${err.message}`, true);
        });
    },
    getAll: (req, res) => {
        Buku.find({}).then(result => {
            sendResponse(res, true, 200, result, 'Mendapatkan semua data buku sukses', true);
        }).catch(err => {
            sendResponse(res, false, 500, {}, `Error: ${err.message}`, true);
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
                sendResponse(res, true, 200, newData, 'Mendapatkan data buku berhalaman berhasil', isLast);
            } else {
                sendResponse(res, true, 200, {}, 'Data tidak ditemukan', true);
            }

        }).catch(err => {
            sendResponse(res, false, 500, {}, `Error: ${err.message}`, true);
        });
    },
    find: (req, res) => {
        let key = req.query.key;
        let value = req.query.value;
        let query = {};
        query[key] = new RegExp(value, 'i');

        if (key == "_id") {
            value = mongoose.Types.ObjectId(value);

            Buku.findById(value).then(result => {
                if (result) {
                    sendResponse(res, true, 200, result, 'Mendapatkan data buku berhasil', true);
                } else {
                    sendResponse(res, true, 200, [], 'Buku tidak ditemukan', true);
                }
            }).catch(err => {
                sendResponse(res, false, 500, '', `Error: ${err.message}`, true);
            });
        } else if (key == "default") {
            val = new RegExp(value, 'i');
            Buku.find({
                judul: val
            }).then(resultJudul => {
                if (resultJudul.length > 0) {
                    sendResponse(res, true, 200, resultJudul, 'Data buku berhasil didapatkan', true);
                } else {
                    Buku.find({
                        deskripsi: val
                    }).then(resultDesk => {
                        if (resultDesk.length > 0) {
                            sendResponse(res, true, 200, resultDesk, 'Data buku berhasil didapatkan', true);
                        } else {
                            Buku.find({
                                penulis: val
                            }).then(resultPenulis => {
                                if (resultPenulis.length > 0) {
                                    sendResponse(res, true, 200, resultPenulis, 'Data buku berhasil didapatkan', true);
                                } else {
                                    Buku.find({
                                        kategori: val
                                    }).then(resultKat => {
                                        if (resultKat.length > 0) {
                                            sendResponse(res, true, 200, resultKat, 'Data buku berhasil didapatkan', true);
                                        } else {
                                            sendResponse(res, true, 200, [], 'Data buku tidak ditemukan', true);
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            }).catch(err => {
                sendResponse(res, false, 500, '', `Error: ${err.message}`, true);
            });
        } else {
            Buku.find(query).then(result => {
                if (result.length > 0) {
                    sendResponse(res, true, 200, result, 'Mendapatkan data buku berhasil', true);
                } else {
                    sendResponse(res, true, 200, [], 'Buku tidak ditemukan', true);
                }
            }).catch(err => {
                sendResponse(res, false, 500, '', `Error: ${err.message}`, true);
            });
        }
    },
    deleteBuku: (req, res) => {
        let id = req.params.id;
        Buku.deleteOne({
            _id: id
        }).orFail().then(result => {
            sendResponse(res, true, 200, result, 'Buku berhasil dihapus', true);
        }).catch(err => {
            sendResponse(res, true, 200, {}, 'Buku tidak ditemukan', true);
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
            tanggalTerbit: req.body.tanggalTerbit,
            status: req.body.status,
            urlFoto: req.body.urlFoto
        }).then(result => {
            if (Object.keys(result).length > 0) {
                sendResponse(res, true, 200, result, 'Buku berhasil diperbarui', true);
            } else {
                sendResponse(res, true, 200, {}, 'Buku tidak ditemukan', true);
            }
        }).catch(err => {
            sendResponse(res, false, 500, {}, `Error: ${err.message}`, true);
        });
    },
    getRecentBook: (req, res) => {
        Buku.find().sort({ '_id': -1 }).limit(Number(req.params.limit)).then(result => {
            sendResponse(res, true, 200, result, 'Data buku terbaru berhasil didapatkan', true);
        }).catch(err => {
            sendResponse(res, false, 500, {}, `Error: ${err.message}`, true);
        })
    }
};