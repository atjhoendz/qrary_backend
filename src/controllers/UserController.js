const User = require('../models/user');
const bcrypt = require('bcryptjs');
const sendResponse = require('../utils/formatResponse');
const axios = require('axios');
const round = 10;

const randString = (len) => {
    let alpha = 'abcdefghijklmnopqrstuvwxyz';
    let num = '0123456789';
    let str = '';
    let front = len - 4;
    let back = len - front;
    for (let i = front; i > 0; i--) {
        str += alpha[Math.floor(Math.random() * alpha.length)];
    }
    for (let i = back; i > 0; i--) {
        str += num[Math.floor(Math.random() * num.length)];
    }
    return str;
};

const genKeyforURI = () => {
    let today = new Date().toLocaleString('id', { timeZone: 'Asia/Jakarta' });
    let hari = new Date(today).getDate();
    let bulan = new Date(today).getMonth();
    let jam = new Date(today).getHours();

    let key = `${hari}${bulan}${jam}`;

    let hashed = bcrypt.hashSync(key, round);
    return hashed;
}

const checkKeyforURL = (hashedKey) => {
    let today = new Date().toLocaleString('id', { timeZone: 'Asia/Jakarta' });
    let hari = new Date(today).getDate();
    let bulan = new Date(today).getMonth();
    let jam = new Date(today).getHours();

    let key = `${hari}${bulan}${jam}`;

    let isValid = bcrypt.compareSync(key, hashedKey);

    return isValid;
}

const sendMailService = async (message) => {
    const url = 'https://qrary-mail-service.herokuapp.com/api/v1/email'

    const response = await axios.post(
        url,
        {
            "message": message
        },
        {
            headers: {
                "Content-Type": "application/json"
            }
        }
    );

    return response.data.success;
}

module.exports = {
    getAll: (req, res) => {
        User.find({}).then(result => {
            sendResponse(res, true, 200, result, 'Mendapatkan data semua user berhasil', true);
        }).catch(err => {
            sendResponse(res, false, 500, {}, err.message, true);
        });
    },
    getPaginate: (req, res) => {
        let page = Number(req.query.page) || 1;
        let limit = Number(req.query.limit) || 5;

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
        let key = req.query.key;
        let value = req.query.value;
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
        let npm = req.params.npm;
        let oldPwd = req.body.oldPwd;
        let confirmNewPwd = req.body.confirmNewPwd;
        let newPwd = req.body.newPwd;

        if (newPwd !== confirmNewPwd) {
            return sendResponse(res, true, 200, {}, 'Konfirmasi kata sandi tidak sama', true);
        } else {
            User.findOne({
                npm: npm
            }).orFail().then(result => {
                let compare = bcrypt.compareSync(oldPwd, result.pwd);
                if (compare) {
                    bcrypt.hash(newPwd, round).then(hashed => {
                        User.findOneAndUpdate({ npm: npm }, {
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
    resetPassword: (req, res) => {
        let email = req.query.e;
        let hashedKey = req.query.q;

        if (typeof(email) == 'undefined' || typeof(hashedKey) == 'undefined')
            return sendResponse(res, true, 404, {}, 'Route not found', true);

        if (checkKeyforURL(hashedKey)) {
            User.findOne({
                email: email
            }).then(resultFind => {
                if (resultFind) {
                    if (resultFind.isResetPwdLinkActive == true) {
                        let newPwd = randString(9);
                        bcrypt.hash(newPwd, round).then(hashed => {
                            User.findOneAndUpdate({
                                email: email
                            }, {
                                $set: {
                                    pwd: hashed
                                }
                            }).then(resultUpdate => {
                                let message = {
                                    from: 'qrary@himatif.org',
                                    to: email,
                                    subject: 'Reset Password Qrary',
                                    html: `<p>Password berhasil direset dengan informasi sebagai berikut:</p>
                                <br>
                                <p><b>Email:</b> ${email}</p>
                                <p><b>Password Baru:</b> ${newPwd}</p>
                                <br>
                                <p>Silahkan login ke aplikasi Qrary kemudian lakukan ubah password. Terima kasih.</p>`
                                }
                                if (sendMailService(message)) {
                                    User.findOneAndUpdate({
                                        email: email
                                    }, {
                                        $set: {
                                            isResetPwdLinkActive: false
                                        }
                                    }).then(updateLink => {
                                        if (updateLink) {
                                            return res.send('<p>Password berhasil direset. Silahkan cek email anda</p>');
                                        }
                                    }).catch(err => {
                                        sendResponse(res, false, 500, {}, `Error: ${err.message}`, true);
                                    });
                                } else {
                                    return res.send('<p>Email tidak berhasil dikirim</p>');
                                }
                            }).catch(err => {
                                sendResponse(res, false, 500, {}, `Error: ${err.message}`, true);
                            });
                        }).catch(err => {
                            sendResponse(res, false, 500, {}, `Error: ${err.message}`, true);
                        });
                    } else {
                        return res.send('<p>Url tidak valid. Silahkan periksa kembali</p>');
                    }
                } else {
                    sendResponse(res, true, 200, {}, 'Email tidak ditemukan', true);
                }
            }).catch(err => {
                sendResponse(res, false, 500, {}, `Error: ${err.message}`, true);
            });
        } else {
            return res.send('<p>Url tidak valid. Silahkan periksa kembali</p>');
        }
    },
    sendMailResetPWD: (req, res) => {
        let email = req.body.email;

        let urlReset = `${process.env.BASE_URL}api/v1/user/password/reset?e=${email}&q=${genKeyforURI()}`;

        User.findOne({
            email: email
        }).then(result => {
            if (result) {
                let message = {
                    from: 'qrary@himatif.org',
                    to: email,
                    subject: 'Reset Password Qrary',
                    html: `<p>Silahkan tekan tombol <b>Reset Password</b> dibawah ini untuk mendapatkan password baru.</p>
                    <a href="${urlReset}" style="text-decoration: none;
                    background-color: #3399ff;
                    color: white;
                    padding: 10px;
                    border-radius: 10px;
                    font-weight: bold;
                    margin: 10px;
                    ">RESET PASSWORD</a>`
                }

                const isMailSuccess = sendMailService(message);
                console.log(isMailSuccess);
                if (isMailSuccess) {
                    User.findOneAndUpdate({
                        email: email
                    }, {
                        $set: {
                            isResetPwdLinkActive: true
                        }
                    }).then(updateLink => {
                        if (updateLink) {
                            let emailResponse = {
                                email: email
                            }
                            sendResponse(res, true, 200, emailResponse, 'Email berhasil dikirim', true);
                        }
                    }).catch(err => {
                        sendResponse(res, false, 500, {}, `Error: ${err.message}`, true);
                    });
                } else {
                    sendResponse(res, true, 200, {}, 'tidak berhasil', true);
                }
            } else {
                sendResponse(res, true, 200, {}, 'Email tidak ditemukan', true);
            }
        }).catch(err => {
            sendResponse(res, false, 500, {}, `Error: ${err.message}`, true);
        });
    }
};