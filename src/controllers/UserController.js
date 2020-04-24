const User = require('../models/user');
const bcrypt = require('bcryptjs');
const sendResponse = require('../utils/formatResponse');
const setUrlFoto = require('../utils/setUrlFoto');
const genInfoFromNPm = require('../utils/genInfoFromNPM');
const round = 10;

module.exports = {
    getAll: (req, res) => {
        User.find({}).then(result => {
            sendResponse(res, true, 200, result, 'Mendapatkan data semua user berhasil', true);
        }).catch(err => {
            sendResponse(res, false, 500, {}, err.message, true);
        });
    },
    getPaginate: (req, res) => {
        let page = req.params.page;
        let limit = req.params.limit;

        User.find({}).orFail().then(result => {
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
                sendResponse(res, true, 200, newData, 'Mendapatkan data user berhalaman berhasil', isLast);
            } else {
                sendResponse(res, true, 200, {}, 'Data tidak ditemukan', true);
            }

        }).catch(err => {
            sendResponse(res, false, 500, {}, err.message, true);
        });
    },
    find: (req, res) => {
        let key = req.params.key;
        let value = req.params.value;
        let query = {};
        query[key] = new RegExp(value, 'i');

        User.find(query).orFail().then(result => {
            sendResponse(res, true, 200, result, 'Mendapatkan data user berhasil', true);
        }).catch(err => {
            sendResponse(res, true, 200, {}, 'User tidak ditemukan', true);
        });
    },
    deleteUser: (req, res) => {
        let id = req.params.id;
        User.deleteOne({
            _id: id
        }).orFail().then(result => {
            sendResponse(res, true, 200, result, 'User berhasil dihapus', true);
        }).catch(err => {
            sendResponse(res, true, 200, {}, 'User tidak ditemukan', true);
        });
    },
    update: (req, res) => {
        let id = req.params.id;
        User.findByIdAndUpdate(id, {
            nama: req.body.nama
        }).orFail().then(result => {
            sendResponse(res, true, 200, result, 'User berhasil diperbarui', true);
        }).catch(err => {
            sendResponse(res, true, 200, {}, 'User tidak ditemukan', true);
        });
    },
    updatePassword: (req, res) => {
        let id = req.params.id;
        let oldPwd = req.body.oldPwd;
        let confirmOldPwd = req.body.confirmOldPwd;
        let newPwd = req.body.newPwd;

        if (oldPwd !== confirmOldPwd) {
            sendResponse(res, true, 200, {}, 'Konfirmasi kata sandi tidak sama', true);
        } else {
            User.findById(id).orFail().then(result => {
                let compare = bcrypt.compareSync(oldPwd, result.pwd);
                if (compare) {
                    bcrypt.hash(newPwd, round).then(hashed => {
                        User.findByIdAndUpdate(id, {
                            pwd: hashed
                        }).orFail().then(result => {
                            sendResponse(res, true, 200, result, 'Kata sandi berhasil diperbarui', true);
                        }).catch(err => {
                            sendResponse(res, true, 200, {}, 'User tidak ditemukan', true);
                        });
                    });
                } else {
                    sendResponse(res, true, 200, {}, 'Kata sandi lama salah', true);
                }
            }).catch(err => {
                sendResponse(res, true, 200, {}, 'User tidak ditemukan', true);
            });
        }
    },
    setModePinjam: (req, res) => {
        let npm = req.body.npm;
        let modePinjam = req.body.modepinjam;

        User.findOneAndUpdate({
            npm: npm
        }, {
            $set: {
                isModePinjam: modePinjam
            }
        }).then(result => {
            if (result) {
                sendResponse(res, true, 200, result, 'Set mode pinjam berhasil', true);
            } else {
                sendResponse(res, true, 200, {}, 'NPM tidak ditemukan, Set mode pinjam gagal', true);
            }
        }).catch(err => {
            sendResponse(res, false, 500, {}, err.message, true);
        });
    },

};