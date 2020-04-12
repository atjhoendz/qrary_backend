const HistoryPeminjaman = require('../models/historyPeminjaman');
const { sendResponse } = require('../utils/formatResponse');

module.exports = {
    getAll: (req, res) => {
        HistoryPeminjaman.find({}).then(result => {
            sendResponse(res, true, 200, result, 'Mendapatkan semua data history peminjaman berhasil', true);
        }).catch(err => {
            sendResponse(res, false, 500, '', `Error: ${err.message}`, true);
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
        let key = req.params.key;
        let value = req.params.value;
        let query = {};
        query[key] = new RegExp(value, 'i');

        HistoryPeminjaman.find(query).orFail().then(result => {
            sendResponse(res, true, 200, result, 'Mendapatkan data Peminjaman berhasil', true);
        }).catch(err => {
            sendResponse(res, false, 500, '', `Error: ${err.message}`, true);
        });
    }
};