const HistoryPeminjaman = require('../models/historyPeminjaman');
const sendResponse = require('../utils/formatResponse');

module.exports = {
    getAll: (req, res) => {
        HistoryPeminjaman.aggregate([{
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
                    return sendResponse(res, true, 200, result, 'Mendapatkan semua data History Peminjaman sukses', true);
                } else {
                    return sendResponse(res, true, 200, result, 'Data History Peminjaman kosong', true);
                }
            }
        });
    },
    getPaginate: (req, res) => {
        let page = req.params.page;
        let limit = req.params.limit;

        HistoryPeminjaman.find({}).orFail().then(result => {
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

        HistoryPeminjaman.aggregate([{
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
                    sendResponse(res, true, 200, dataPeminjaman, 'Mendapatkan data history peminjaman berhasil', true);
                } else {
                    sendResponse(res, true, 200, [], 'Data history peminjaman tidak ditemukan', true);
                }
            }
        });
    }
};