const Pengunjung = require('../models/pengunjung');
const User = require('../models/user');
const FormatResponse = require('../utils/formatResponse');

module.exports = {
    add: (req, res) => {
        let npm = req.body.npm;
        let waktuMasuk = req.body.waktuMasuk;

        User.find({
            npm: npm
        }).then(result => {
            if (Object.keys(result).length != 0) {
                let user = {
                    _id: result[0]._id,
                    nama: result[0].nama,
                    npm: result[0].npm,
                    email: result[0].email,
                    pwd: result[0].pwd,
                    urlFoto: result[0].urlFoto
                };
                Pengunjung.create({
                    dataUser: user,
                    waktuMasuk: waktuMasuk
                }).then(result => {
                    res.status(201).json(
                        FormatResponse(true, 201, result, 'Pengunjung berhasil ditambahkan', true)
                    );
                }).catch(err => {
                    res.status(200).json(
                        FormatResponse(false, 200, {}, `Error: ${err.message}`, true)
                    );
                });
            } else {
                res.status(200).json(
                    FormatResponse(true, 200, {}, 'User tidak ditemukan', true)
                );
            }
        }).catch(err => {
            res.status(500).json(
                FormatResponse(false, 500, {}, `Error: ${err.message}`, true)
            );
        });
    },
    getAll: (req, res) => {
        Pengunjung.find({}).then(result => {
            res.status(200).json(
                FormatResponse(true, 200, result, 'Mendapatkan semua data pengunjung sukses', true)
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

        Pengunjung.find({}).orFail().then(result => {
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
                    FormatResponse(true, 200, newData, 'Mendapatkan data pengunjung berhalaman berhasil', isLast)
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

        Pengunjung.find(query).orFail().then(result => {
            res.status(200).json(
                FormatResponse(true, 200, result, 'Mendapatkan data pengunjung berhasil', true)
            );
        }).catch(err => {
            res.status(200).json(
                FormatResponse(true, 200, {}, 'Pengunjung tidak ditemukan', true)
            );
        });
    },
    deletePengunjung: (req, res) => {
        let id = req.params.id;
        Pengunjung.deleteOne({
            _id: id
        }).orFail().then(result => {
            res.status(200).json(
                FormatResponse(true, 200, result, 'Pengunjung berhasil dihapus', true)
            );
        }).catch(err => {
            res.status(200).json(
                FormatResponse(true, 200, {}, 'Pengunjung tidak ditemukan', true)
            );
        });
    }
};