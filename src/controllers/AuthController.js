const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const speakeasy = require('speakeasy');
const sendResponse = require('../utils/formatResponse');
const setUrlFoto = require('../utils/setUrlFoto');
const genInfoFromNPM = require('../utils/genInfoFromNPM');
const round = 10;

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
        host: process.env.EMAIL_SMTP,
        port: process.env.EMAIL_PORT,
        secure: true,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    let code = generateOTP();

    let message = {
        from: 'qrary@himatif.org',
        to: email,
        subject: 'Qrary Verification Code',
        text: `Verification Code : ${code}`
    }

    // Send Email

    transporter.sendMail(message).then(info => {
        if (res == null) {
            console.log('Kode OTP berhasil dikirim');
        } else {
            sendResponse(res, true, 200, info, 'Kode OTP berhasil dikirim', true);
        }
    }).catch(err => {
        if (res == null) {
            console.log(`Sendmail error: ${err.message}`);
        } else {
            sendResponse(res, false, 500, {}, `Error: ${err.message}`, true);
        }
    });
}

module.exports = {
    register: (req, res) => {
        let pwd = req.body.pwd;
        let confirmPwd = req.body.confirmPwd;

        if (pwd !== confirmPwd) {
            sendResponse(res, true, 200, {}, 'Konfirmasi kata sandi tidak sama', true);
        } else {
            User.findOne({
                $or: [
                    { 'email': req.body.email }, { 'npm': req.body.npm }
                ]
            }).then(hasil => {
                if (hasil == null) {
                    bcrypt.hash(req.body.pwd, round).then(hashed => {

                        let datanpm = genInfoFromNPM(req.body.npm);

                        User.create({
                            nama: req.body.nama,
                            npm: req.body.npm,
                            email: req.body.email,
                            pwd: hashed,
                            programStudi: datanpm.prodi,
                            fakultas: datanpm.fakultas,
                            angkatan: datanpm.angkatan,
                            role: "user",
                            isConfirmed: false,
                            urlFoto: setUrlFoto(req.body.npm, 'mahasiswa')
                        }).then(user => {
                            sendResponse(res, true, 200, user, 'Pendaftaran berhasil', true);
                        }).catch(err => {
                            sendResponse(res, false, 200, {}, `Pendaftaran tidak berhasil, ${err.message}`, true);
                        });
                    }).catch(err => {
                        sendResponse(res, false, 500, {}, `Hashing pwd gagal, ${err.message}`, true);
                    });
                } else {
                    sendResponse(res, true, 200, {}, 'Pendaftaran tidak berhasil, data sudah tersedia', true);
                }
            }).catch(err => {
                sendResponse(res, false, 500, {}, `Error: ${err.message}`, true);
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
                        let respData = {
                            token: token,
                            role: user.role
                        }
                        sendResponse(res, true, 200, respData, 'Anda berhasil masuk', true);
                    }
                } else {
                    sendResponse(res, true, 200, {}, `Akun dengan email ${user.email} belum diaktifasi silahkan aktifasi terlebih dahulu`, true);
                }
            } else {
                sendResponse(res, true, 200, {}, 'Anda tidak berhasil masuk, kata sandi salah', true);
            }
        }).catch(err => {
            sendResponse(res, true, 200, {}, 'Anda tidak berhasil masuk, NPM belum terdaftar', true);
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
                        sendResponse(res, true, 200, result, 'Akun berhasil diaktivasi', true);
                    } else {
                        sendResponse(res, true, 200, {}, 'Akun sudah aktif tidak perlu diaktivasi kembali', true);
                    }
                } else {
                    sendResponse(res, false, 200, {}, `Akun tidak ditemukan`, true);
                }
            }).catch(err => {
                sendResponse(res, false, 500, {}, `Error: ${err.message}`, true);
            });

        } else {
            sendResponse(res, false, 200, {}, 'Kode OTP Salah!', true);
        }
    }
};