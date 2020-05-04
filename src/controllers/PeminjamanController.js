const Peminjaman = require('../models/peminjaman');
const TempPeminjaman = require('../models/tempPeminjaman');
const HistoryPeminjaman = require('../models/historyPeminjaman');
const sendResponse = require('../utils/formatResponse');

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
                    status: resultFind.status,
                    tanggalMeminjam: tglMeminjam,
                    tanggalKembali: tglKembali
                }

                Peminjaman.create(data).then(resultCreate => {
                    TempPeminjaman.findByIdAndDelete(idTemp).then(resultDelete => {
                        if (resultDelete) {
                            sendResponse(res, true, 200, resultCreate, 'Peminjaman berhasil', true);
                        } else {
                            sendResponse(res, true, 200, {}, 'Data temp tidak ditemukan', true);
                        }
                    }).catch(err => {
                        sendResponse(res, false, 500, '', `Error: ${err.message}`, true);
                    });
                }).catch(err => {
                    sendResponse(res, false, 500, '', `Error: ${err.message}`, true);
                });
            } else {
                sendResponse(res, true, 200, {}, 'Data temp tidak ditemukan', true);
            }
        }).catch(err => {
            sendResponse(res, false, 500, '', `Error: ${err.message}`, true);
        });
    },
    getAll: (req, res) => {
        Peminjaman.aggregate([{
            $lookup: {
                from: 'User',
                localField: 'idUser',
                foreignField: '_id',
                as: 'user'
            }
        }, {
            $unwind: '$user'
        }]).exec((err, result) => {
            if (err) {
                sendResponse(res, false, 500, '', `Error: ${err.message}`, true);
            } else {
                if (result.length > 0) {
                    return sendResponse(res, true, 200, result, 'Mendapatkan semua data Peminjaman sukses', true);
                } else {
                    return sendResponse(res, true, 200, result, 'Data Peminjaman kosong', true);
                }
            }
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
                sendResponse(res, true, 200, newData, 'Mendapatkan data Peminjaman berhalaman berhasil', isLast);
            } else {
                sendResponse(res, true, 200, {}, 'Data tidak ditemukan', true);
            }

        }).catch(err => {
            sendResponse(res, false, 500, '', `Error: ${err.message}`, true);
        });
    },
    find: (req, res) => {
        let key = req.query.key;
        let value = req.query.value;
        let query = {};
        query[key] = new RegExp(value, 'i');

        Peminjaman.aggregate([{
                $lookup: {
                    from: 'Buku',
                    localField: 'isbnBuku',
                    foreignField: 'isbn',
                    as: 'buku',
                }
            },
            {
                $lookup: {
                    from: 'User',
                    localField: 'idUser',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $unwind: '$user'
            },
            {
                $project: {
                    _id: 1,
                    tanggalMeminjam: 1,
                    tanggalKembali: 1,
                    isDikembalikan: 1,
                    user: '$user',
                    buku: '$buku'
                }
            }
        ]).exec((err, results) => {
            if (err) {
                sendResponse(res, false, 500, '', `Error: ${err}`, true);
            } else {
                if (typeof(key) == 'undefined' || typeof(value) == 'undefined')
                    return sendResponse(res, true, 404, {}, 'Route not found...', true);

                let dataPeminjaman = results.filter(result => {
                    if (key == "_id") {
                        return result._id == value;
                    } else {
                        if (result.user[key])
                            return result.user[key].match(query[key]);
                    }
                });

                if (dataPeminjaman.length > 0) {
                    sendResponse(res, true, 200, dataPeminjaman, 'Mendapatkan data peminjaman berhasil', true);
                } else {
                    sendResponse(res, true, 200, [], 'Data peminjaman tidak ditemukan', true);
                }
            }
        });
    },
    pengembalian: (req, res) => {
        let idPeminjaman = req.body.idPeminjaman;

        Peminjaman.findByIdAndDelete(idPeminjaman).then(dataPinjam => {
            if (dataPinjam) {
                HistoryPeminjaman.create({
                    idUser: dataPinjam.idUser,
                    isbnBuku: dataPinjam.isbnBuku,
                    tanggalMeminjam: dataPinjam.tanggalMeminjam,
                    tanggalKembali: dataPinjam.tanggalKembali,
                    isDikembalikan: true
                }).then(hasilAddHistory => {
                    if (hasilAddHistory) {
                        sendResponse(res, true, 200, hasilAddHistory, 'Buku berhasil dikembalikan', true);
                    }
                }).catch(err => {
                    sendResponse(res, false, 500, '', `Error: ${err}`, true);
                });
            } else {
                sendResponse(res, true, 200, {}, 'Data peminjaman tidak ditemukan', true);
            }
        }).catch(err => {
            sendResponse(res, false, 500, '', `Error: ${err}`, true);
        })
    }
};