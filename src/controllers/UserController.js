const User = require('../models/user');
const bcrypt = require('bcryptjs');
const FormatResponse = require('../utils/formatResponse');
const round = 10;

const setUrlFoto = (npm) => {
    let prefixUrl = "https://media.unpad.ac.id/photo/mahasiswa/";
    let prodi = npm.substring(0, 6);
    let angkatan = `20${npm.substring(6, 8)}`;
    return `${prefixUrl + prodi}/${angkatan}/${npm}.JPG`;
};

module.exports = {
    getAll: (req, res) => {
        User.find({}).then(result => {
            res.status(200).json(
                FormatResponse(true, 200, result, 'Mendapatkan data semua user berhasil', true)
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
                res.status(200).json(
                    FormatResponse(true, 200, newData, 'Mendapatkan data user berhalaman berhasil', isLast)
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

        User.find(query).orFail().then(result => {
            res.status(200).json(
                FormatResponse(true, 200, result, 'Mendapatkan data user berhasil', true)
            );
        }).catch(err => {
            res.status(404).json(
                FormatResponse(false, 404, {}, 'User tidak ditemukan', true)
            );
        });
    },
    deleteUser: (req, res) => {
        let id = req.params.id;
        User.deleteOne({
            _id: id
        }).orFail().then(result => {
            res.status(200).json(
                FormatResponse(true, 200, result, 'User berhasil dihapus', true)
            );
        }).catch(err => {
            res.status(404).json(
                FormatResponse(false, 404, {}, 'User tidak ditemukan', true)
            );
        });
    },
    update: (req, res) => {
        let id = req.params.id;
        User.findByIdAndUpdate(id, {
            nama: req.body.nama,
            npm: req.body.npm,
            urlFoto: setUrlFoto(req.body.npm)
        }).orFail().then(result => {
            res.status(200).json(
                FormatResponse(true, 200, result, 'User berhasil diperbarui', true)
            );
        }).catch(err => {
            res.status(404).json(
                FormatResponse(false, 404, {}, 'User tidak ditemukan', true)
            );
        });
    },
    updatePassword: (req, res) => {
        let id = req.params.id;
        let oldPwd = req.body.oldPwd;
        let confirmOldPwd = req.body.confirmOldPwd;
        let newPwd = req.body.newPwd;

        if (oldPwd !== confirmOldPwd) {
            res.status(404).json(
                FormatResponse(false, 404, {}, 'Konfirmasi kata sandi tidak sama', true)
            );
        } else {
            User.findById(id).orFail().then(result => {
                let compare = bcrypt.compareSync(oldPwd, result.pwd);
                if (compare) {
                    bcrypt.hash(newPwd, round).then(hashed => {
                        User.findByIdAndUpdate(id, {
                            pwd: hashed
                        }).orFail().then(result => {
                            res.status(200).json(
                                FormatResponse(true, 200, result, 'Kata sandi berhasil diperbarui', true)
                            );
                        }).catch(err => {
                            res.status(404).json(
                                FormatResponse(false, 404, {}, 'User tidak ditemukan', true)
                            );
                        });
                    });
                } else {
                    res.status(404).json(
                        FormatResponse(false, 404, {}, 'Kata sandi lama salah', true)
                    );
                }
            }).catch(err => {
                res.status(404).json(
                    FormatResponse(false, 404, {}, 'User tidak ditemukan', true)
                );
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
                res.status(200).json(
                    FormatResponse(true, 200, result, 'Set mode pinjam berhasil', true)
                );
            } else {
                res.status(200).json(
                    FormatResponse(true, 200, {}, 'NPM tidak ditemukan, Set mode pinjam gagal', true)
                );
            }
        }).catch(err => {
            res.status(500).json(
                FormatResponse(false, 500, '', `Error: ${err.message}`, true)
            );
        });
    }
};