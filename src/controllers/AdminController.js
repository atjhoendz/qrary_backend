const Admin = require('../models/admin');
const bcrypt = require('bcryptjs');
const sendResponse = require('../utils/formatResponse');
const setUrlFoto = require('../utils/setUrlFoto');
const round = 10;

const genUsername = (nip) => {
    let tanggalLahir = nip.substr(0, 8);
    return tanggalLahir + Math.floor(1000 + Math.random() * 9000);
};

module.exports = {
    addAdmin: (req, res) => {
        Admin.find({
            nip: req.body.nip
        }).then(hasilCari => {
            if (Object.keys(hasilCari).length > 0) {
                sendResponse(res, true, 200, {}, 'NIP sudah terdaftar', true);
            } else {
                let username = genUsername(req.body.nip);

                bcrypt.hash(req.body.pwd, round).then(hashed => {
                    Admin.create({
                        username: username,
                        nama: req.body.nama,
                        nip: req.body.nip,
                        email: req.body.email,
                        pwd: hashed,
                        jabatan: req.body.jabatan,
                        jk: req.body.jk,
                        tanggalLahir: req.body.tanggalLahir,
                        alamat: req.body.alamat,
                        urlFoto: setUrlFoto(req.body.nip, 'pegawai')
                    }).then(hasil => {
                        sendResponse(res, true, 201, hasil, 'Admin berhasil ditambahkan', true);
                    }).catch(err => {
                        sendResponse(res, false, 500, '', `Error: ${err}`, true);
                    });
                }).catch(err => {
                    sendResponse(res, false, 500, '', `Error2: ${err}`, true);
                });
            }
        }).catch(err => {
            sendResponse(res, false, 500, {}, `Error: ${err.message}`, true);
        });
    },
    getAll: (req, res) => {
        Admin.find({}).then(result => {
            sendResponse(res, true, 200, result, 'Mendapatkan semua data admin berhasil', true);
        }).catch(err => {
            sendResponse(res, false, 500, {}, `Error: ${err.message}`, true);
        })
    },
    find: (req, res) => {
        let key = req.query.key;
        let value = req.query.value;
        let query = {};
        query[key] = new RegExp(value, 'i');

        Admin.find(query).orFail().then(result => {
            sendResponse(res, true, 200, result, 'Mendapatkan data admin berhasil', true);
        }).catch(err => {
            sendResponse(res, true, 200, {}, 'Admin tidak ditemukan', true);
        });
    },
    getPaginate: (req, res) => {
        let page = req.params.page;
        let limit = req.params.limit;

        Admin.find({}).orFail().then(result => {
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
                sendResponse(res, true, 200, newData, 'Mendapatkan data admin berhalaman berhasil', isLast);
            } else {
                sendResponse(res, true, 200, {}, 'Data tidak ditemukan', true);
            }

        }).catch(err => {
            sendResponse(res, false, 500, {}, err.message, true);
        });
    },
    deleteAdmin: (req, res) => {
        let id = req.params.id;
        Admin.deleteOne({
            _id: id
        }).orFail().then(result => {
            sendResponse(res, true, 200, result, 'Admin berhasil dihapus', true);
        }).catch(err => {
            sendResponse(res, true, 200, {}, 'Admin tidak ditemukan', true);
        });
    },
    update: (req, res) => {
        let id = req.params.id;
        let username = genUsername(req.body.nip);

        Admin.findByIdAndUpdate(id, {
            username: username,
            nama: req.body.nama,
            nip: req.body.nip,
            email: req.body.email,
            jabatan: req.body.jabatan,
            jk: req.body.jk,
            tanggalLahir: req.body.tanggalLahir,
            alamat: req.body.alamat,
            urlFoto: setUrlFoto(req.body.nip, 'pegawai')
        }).orFail().then(result => {
            sendResponse(res, true, 200, result, 'Admin berhasil diperbarui', true);
        }).catch(err => {
            sendResponse(res, true, 200, {}, 'Admin tidak ditemukan', true);
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
            Admin.findById(id).orFail().then(result => {
                let compare = bcrypt.compareSync(oldPwd, result.pwd);
                if (compare) {
                    bcrypt.hash(newPwd, round).then(hashed => {
                        Admin.findByIdAndUpdate(id, {
                            pwd: hashed
                        }).orFail().then(result => {
                            sendResponse(res, true, 200, result, 'Kata sandi berhasil diperbarui', true);
                        }).catch(err => {
                            sendResponse(res, true, 200, {}, 'Admin tidak ditemukan', true);
                        });
                    });
                } else {
                    sendResponse(res, true, 200, {}, 'Kata sandi lama salah', true);
                }
            }).catch(err => {
                sendResponse(res, true, 200, {}, 'Admin tidak ditemukan', true);
            });
        }
    },
    updateRole: (req, res) => {
        let id = req.body.id;
        let newRole = req.body.role;
        let allowedRole = ['admin', 'superadmin'];

        if (allowedRole.includes(newRole)) {
            Admin.findByIdAndUpdate(id, {
                role: newRole
            }).then(result => {
                sendResponse(res, true, 200, result, `Role berhasil diperbarui menjadi ${newRole}`, true);
            }).catch(err => {
                sendResponse(res, false, 500, {}, `Error: ${err.message}`, true);
            })
        } else {
            sendResponse(res, true, 200, {}, 'Role invalid. Allowed Role is ["admin", "superadmin"]');
        }
    }
};