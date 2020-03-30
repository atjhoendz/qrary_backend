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
                FormatResponse(true, 200, result, 'Get all user success', true)
            );
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
                FormatResponse(true, 200, result, 'Get user success', true)
            );
        }).catch(err => {
            res.status(404).json(
                FormatResponse(false, 404, {}, 'User not found', true)
            );
        });
    },
    deleteUser: (req, res) => {
        let id = req.params.id;
        User.deleteOne({
            _id: id
        }).orFail().then(result => {
            res.status(200).json(
                FormatResponse(true, 200, result, 'User deleted successfuly', true)
            );
        }).catch(err => {
            res.status(404).json(
                FormatResponse(false, 404, {}, 'User not found', true)
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
                FormatResponse(true, 200, result, 'User updated successfuly', true)
            );
        }).catch(err => {
            res.status(404).json(
                FormatResponse(false, 404, {}, 'User not found', true)
            );
        });
    },
    updateRole: (req, res) => {
        let id = req.params.id;
        User.findByIdAndUpdate(id, {
            role: req.body.role
        }).orFail().then(result => {
            res.status(200).json(
                FormatResponse(true, 200, result, 'User role updated successfuly', true)
            );
        }).catch(err => {
            res.status(404).json(
                FormatResponse(false, 404, {}, 'User not found', true)
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
    }
};