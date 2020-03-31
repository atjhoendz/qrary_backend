const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const FormatResponse = require('../utils/formatResponse');
const round = 10;

const setUrlFoto = (npm) => {
    let prefixUrl = "https://media.unpad.ac.id/photo/mahasiswa/";
    let prodi = npm.substring(0, 6);
    let angkatan = `20${npm.substring(6, 8)}`;
    return `${prefixUrl + prodi}/${angkatan}/${npm}.JPG`;
};

module.exports = {
    register: (req, res) => {
        let pwd = req.body.pwd;
        let confirmPwd = req.body.confirmPwd;

        if (pwd !== confirmPwd) {
            res.status(200).json(
                FormatResponse(true, 200, '', 'Konfirmasi kata sandi tidak sama', true)
            );
        } else {
            User.findOne({
                $or: [
                    { 'email': req.body.email }, { 'npm': req.body.npm }
                ]
            }).then(hasil => {
                if (hasil == null) {
                    bcrypt.hash(req.body.pwd, round).then(hashed => {
                        User.create({
                            nama: req.body.nama,
                            npm: req.body.npm,
                            email: req.body.email,
                            pwd: hashed,
                            role: req.body.role,
                            urlFoto: setUrlFoto(req.body.npm)
                        }).then(user => {
                            res.status(200).json(
                                FormatResponse(true, 200, user, 'Pendaftaran berhasil', true)
                            );
                        }).catch(err => {
                            res.status(200).json(
                                FormatResponse(false, 200, {}, `Pendaftaran tidak berhasil, ${err.message}`, true)
                            );
                        });
                    }).catch(err => {
                        res.status(500).json(
                            FormatResponse(false, 500, {}, `Hashing pwd gagal, ${err.message}`, true)
                        );
                    });
                } else {
                    res.status(200).json(
                        FormatResponse(true, 200, {}, 'Pendaftaran tidak berhasil, data sudah tersedia', true)
                    );
                }
            }).catch(err => {
                res.status(500).json(
                    FormatResponse(false, 500, {}, err.message, false)
                );
            });
        }
    },
    login: (req, res) => {
        User.findOne({
            npm: req.body.npm
        }).orFail().then(user => {
            const isValid = bcrypt.compareSync(req.body.pwd, user.pwd);
            if (isValid) {
                data = {
                    nama: user.nama,
                    npm: user.npm,
                    email: user.email,
                    urlFoto: user.urlFoto,
                    role: user.role,
                    loggedin: true
                };
                const token = jwt.sign(data, process.env.SECRET_KEY);
                if (token) {
                    res.status(200).json(
                        FormatResponse(true, 200, token, 'Anda berhasil masuk', true)
                    );
                }
            } else {
                res.status(200).json(
                    FormatResponse(true, 200, '', 'Anda tidak berhasil masuk, kata sandi salah', true)
                );
            }
        }).catch(err => {
            res.status(200).json(
                FormatResponse(true, 200, '', 'Anda tidak berhasil masuk, NPM belum terdaftar', true)
            );
        });
    }
};