const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const speakeasy = require('speakeasy');
const FormatResponse = require('../utils/formatResponse');
const round = 10;

const setUrlFoto = (npm) => {
    let prefixUrl = "https://media.unpad.ac.id/photo/mahasiswa/";
    let prodi = npm.substring(0, 6);
    let angkatan = `20${npm.substring(6, 8)}`;
    return `${prefixUrl + prodi}/${angkatan}/${npm}.JPG`;
};

const generateOTP = () => {
    let secret = process.env.SECRET_OTP;
    let token = speakeasy.totp({
        secret: secret,
        encoding: 'base32',
        step: 230
    });
    return token;
};

const sendEmailOTP = (email, res) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: "keylogresut@gmail.com",
            pass: "sayangkamu69"
        }
    });

    let code = generateOTP();

    let message = {
        from: 'admin@qrary.app',
        to: email,
        subject: 'Qrary Verification Code',
        text: `Verification Code : ${code}`
    }

    // Send Email

    transporter.sendMail(message).then(info => {
        if (res == null) {
            console.log('Kode OTP berhasil dikirim');
        } else {
            res.status(200).json(
                FormatResponse(true, 200, info, 'Kode OTP berhasil dikirim', true)
            );
        }
    }).catch(err => {
        if (res == null) {
            console.log(`Sendmail error: ${err.message}`);
        } else {
            res.status(500).json(
                FormatResponse(false, 500, {}, err.message, true)
            );
        }
    });
}

module.exports = {
    register: (req, res) => {
        let pwd = req.body.pwd;
        let confirmPwd = req.body.confirmPwd;

        if (pwd !== confirmPwd) {
            res.status(200).json(
                FormatResponse(true, 200, {}, 'Konfirmasi kata sandi tidak sama', true)
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
                            isConfirmed: false,
                            urlFoto: setUrlFoto(req.body.npm)
                        }).then(user => {
                            sendEmailOTP(req.body.email, null);
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

                if (user.isConfirmed) {
                    data = {
                        nama: user.nama,
                        npm: user.npm,
                        email: user.email,
                        urlFoto: user.urlFoto,
                        role: user.role
                    };
                    const token = jwt.sign(data, process.env.SECRET_KEY);
                    if (token) {
                        res.status(200).json(
                            FormatResponse(true, 200, token, 'Anda berhasil masuk', true)
                        );
                    }
                } else {
                    res.status(200).json(
                        FormatResponse(true, 200, '', 'Akun belum diaktifasi silahkan aktifasi terlebih dahulu', true)
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
    },
    sendOTP: (req, res) => {
        let emailto = req.body.email;
        sendEmailOTP(emailto, res);
    },
    verifyOTP: (req, res) => {
        let otp = req.body.otp;
        let email = req.body.email;

        let verify = speakeasy.totp.verify({
            secret: process.env.SECRET_OTP,
            encoding: 'base32',
            token: otp,
            step: 230
        });

        if (verify) {
            User.updateOne({ email: email }, {
                isConfirmed: true
            }).then(result => {
                if (result.n > 0) {
                    if (result.nModified > 0) {
                        res.status(200).json(
                            FormatResponse(true, 200, result, 'Akun berhasil diaktifasi', true)
                        );
                    } else {
                        res.status(200).json(
                            FormatResponse(true, 200, {}, 'Akun sudah aktif tidak perlu diaktifasi kembali', true)
                        );
                    }
                } else {
                    res.status(200).json(
                        FormatResponse(false, 200, {}, `Akun tidak ditemukan`, true)
                    );
                }
            }).catch(err => {
                res.status(500).json(
                    FormatResponse(false, 500, {}, `Err: ${err.message}`, true)
                );
            })

        } else {
            res.status(200).json(
                FormatResponse(false, 200, '', 'Kode OTP Salah!', true)
            );
        }
    }
};