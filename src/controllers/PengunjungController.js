const Pengunjung = require('../models/pengunjung');
const User = require('../models/user');
const sendResponse = require('../utils/formatResponse');

module.exports = {
    add: (req, res) => {
        let npm = req.body.npm;
        let waktuMasuk = req.body.waktuMasuk;

        User.findOne({
            npm: npm
        }).then(result => {
            if (result) {
                Pengunjung.updateMany({
                    $and: [{
                        idUser: result._id,
                        waktuMasuk: {
                            $ne: waktuMasuk
                        }
                    }]
                }, {
                    $set: {
                        isExpired: true
                    }
                }).then(resultFind => {
                    Pengunjung.create({
                        idUser: result._id,
                        waktuMasuk: waktuMasuk
                    }).then(resultCreate => {
                        let data = {
                            _id: resultCreate._id,
                            user: result,
                            waktuMasuk: resultCreate.waktuMasuk
                        }
                        sendResponse(res, true, 201, data, 'Pengunjung berhasil ditambahkan', true);
                    }).catch(err => {
                        sendResponse(res, false, 200, {}, `Error: ${err.message}`, true);
                    });
                }).catch(err => {
                    sendResponse(res, false, 500, {}, `Error: ${err.message}`, true);
                });
            } else {
                sendResponse(res, true, 200, {}, 'User tidak ditemukan', true);
            }
        }).catch(err => {
            sendResponse(res, false, 200, {}, `Error: ${err.message}`, true);
        });
    },
    getAll: (req, res) => {
        Pengunjung.aggregate([{
                $lookup: {
                    from: 'User',
                    localField: 'idUser',
                    foreignField: '_id',
                    as: 'user',
                }
            },
            { $unwind: '$user' },
            {
                $project: {
                    waktuMasuk: 1,
                    isExpired: 1,
                    user: '$user'
                }
            }
        ]).exec((err, result) => {
            if (err) {
                sendResponse(res, true, 200, {}, `Error: ${err}`, true);
            } else {
                sendResponse(res, true, 200, result, true);
            }
        });
    },
    getPaginate: (req, res) => {
        let page = req.params.page;
        let limit = req.params.limit;

        Pengunjung.aggregate([{
                $lookup: {
                    from: 'User',
                    localField: 'idUser',
                    foreignField: '_id',
                    as: 'user',
                }
            },
            { $unwind: '$user' },
            {
                $project: {
                    waktuMasuk: 1,
                    isExpired: 1,
                    user: '$user'
                }
            }
        ]).exec((err, result) => {
            if (err) {
                sendResponse(res, true, 200, {}, `Error: ${err}`, true);
            } else {
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
                    sendResponse(res, true, 200, newData, 'Mendapatkan data pengunjung berhalaman berhasil', isLast);
                } else {
                    sendResponse(res, true, 200, {}, 'Data tidak ditemukan', true);
                }
            }
        });
    },
    find: (req, res) => {
        let key = req.query.key;
        let value = req.query.value;
        let query = {};
        query[key] = new RegExp(value, 'i');

        Pengunjung.aggregate([{
                $lookup: {
                    from: 'User',
                    localField: 'idUser',
                    foreignField: '_id',
                    as: 'user',
                }
            },
            { $unwind: '$user' },
            {
                $project: {
                    waktuMasuk: 1,
                    isExpired: 1,
                    user: '$user'
                }
            }
        ]).exec((err, results) => {
            if (err) {
                sendResponse(res, false, 500, '', `Error: ${err}`, true);
            } else {

                let dataUser = results.filter(result => {
                    if (key == "_id") {
                        return result._id == value;
                    } else {
                        if (result.user[key])
                            return result.user[key].match(query[key]);
                    }
                });

                if (dataUser.length > 0) {
                    sendResponse(res, true, 200, dataUser, 'Mendapatkan data pengunjung berhasil', true);
                } else {
                    sendResponse(res, true, 200, {}, 'Pengunjung tidak ditemukan', true);
                }
            }
        });
    },
    deletePengunjung: (req, res) => {
        let id = req.params.id;
        Pengunjung.deleteOne({
            _id: id
        }).orFail().then(result => {
            sendResponse(res, true, 200, result, 'Pengunjung berhasil dihapus', true);
        }).catch(err => {
            sendResponse(res, true, 200, {}, 'Pengunjung tidak ditemukan', true);
        });
    }
};