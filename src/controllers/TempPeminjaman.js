const TempPeminjaman = require('../models/tempPeminjaman');
const Pengunjung = require('../models/pengunjung');
const User = require('../models/user');
const Buku = require('../models/buku');
const sendResponse = require('../utils/formatResponse');
const mongoose = require('mongoose');

module.exports = {
    getAllTempPinjam: (req, res) => {
        TempPeminjaman.aggregate([{
                $lookup: {
                    from: 'Buku',
                    localField: 'isbnBuku',
                    foreignField: 'isbn',
                    as: 'buku'
                }
            },
            {
                $project: {
                    _id: 1,
                    idUser: 1,
                    buku: '$buku'
                }
            }
        ]).exec((err, result) => {
            if (err) {
                sendResponse(res, false, 500, '', `Error: ${err.message}`, true);
            } else {
                if (result.length > 0) {
                    sendResponse(res, true, 200, result, 'Mendapatkan Semua data temp peminjaman berhasil', true);
                } else {
                    sendResponse(res, true, 200, {}, 'Data temp peminjaman kosong', true);
                }
            }
        });
    },
    getPengunjungToTemp: (req, res) => {
        let npm = req.body.npm;

        User.findOne({
            npm: npm
        }).then(resultUser => {
            if (resultUser) {
                Pengunjung.findOne({
                    idUser: resultUser._id
                }).then(resultPengunjung => {
                    if (resultPengunjung) {

                        TempPeminjaman.findOne({
                            idUser: resultPengunjung.idUser
                        }).then(resultFindTemp => {
                            if (resultFindTemp) {
                                User.findOneAndUpdate({
                                    npm: npm
                                }, {
                                    $set: {
                                        isModePinjam: true
                                    }
                                }).then(resultUpdateUser => {
                                    let data = {
                                        _id: resultFindTemp._id,
                                        pengunjung: resultUpdateUser
                                    }

                                    if (resultUpdateUser) {
                                        sendResponse(res, true, 200, data, 'Data pengunjung berhasil didapatkan', true);
                                    } else {
                                        sendResponse(res, true, 200, {}, 'Data pengunjung tidak berhasil didapatkan', true);
                                    }
                                }).catch(err => {
                                    sendResponse(res, false, 500, '', `Error: ${err.message}`, true);
                                });
                            } else {
                                TempPeminjaman.create({
                                    idUser: resultPengunjung.idUser
                                }).then(resultTemp => {
                                    if (resultTemp) {
                                        User.findOneAndUpdate({
                                            npm: npm
                                        }, {
                                            $set: {
                                                isModePinjam: true
                                            }
                                        }).then(resultUpdateUser => {
                                            let data = {
                                                _id: resultTemp._id,
                                                pengunjung: resultUpdateUser
                                            }

                                            if (resultUpdateUser) {
                                                sendResponse(res, true, 200, data, 'Data pengunjung berhasil didapatkan', true);
                                            } else {
                                                sendResponse(res, true, 200, {}, 'Data pengunjung tidak berhasil didapatkan', true);
                                            }
                                        }).catch(err => {
                                            sendResponse(res, false, 500, '', `Error: ${err.message}`, true);
                                        });
                                    }
                                }).catch(err => {
                                    sendResponse(res, false, 500, '', `Error: ${err.message}`, true);
                                });
                            }
                        }).catch(err => {
                            sendResponse(res, false, 500, {}, `Error: ${err.message}`, true);
                        });
                    } else {
                        sendResponse(res, true, 200, {}, 'NPM belum terdaftar sebagai pengunjung', true);
                    }
                }).catch(err => {
                    sendResponse(res, false, 500, '', `Error: ${err.message}`, true);
                });
            } else {
                sendResponse(res, true, 200, '', 'Npm belum terdaftar sebagai user', true);
            }
        }).catch(err => {
            sendResponse(res, false, 500, '', `Error: ${err.message}`, true);
        })
    },
    getBukuToTemp: (req, res) => {
        let isbn = req.body.isbn;
        let idTempUser = req.body.idUserAtTemp;

        Buku.findOne({
            isbn: isbn
        }).then(resultBuku => {
            if (resultBuku) {

                TempPeminjaman.findOne({
                    idUser: idTempUser
                }).then(resultFindUser => {
                    if (resultFindUser) {
                        let getBuku = resultFindUser.isbnBuku;

                        if (getBuku) {
                            for (let i = 0; i < getBuku.length; i++) {
                                if (getBuku[i] == isbn) {
                                    return sendResponse(res, true, 200, {}, 'Buku sudah ditambahkan', true);
                                }
                            }
                        }

                        getBuku.push(isbn);

                        let newBuku = getBuku;

                        TempPeminjaman.findOneAndUpdate({
                            idUser: idTempUser
                        }, {
                            $set: {
                                isbnBuku: newBuku
                            }
                        }).then(resultUpdateTemp => {
                            if (resultUpdateTemp) {
                                sendResponse(res, true, 200, resultBuku, 'Buku berhasil ditambahkan', true);
                            } else {
                                sendResponse(res, true, 200, {}, 'User pada temp tidak ditemukan', true);
                            }
                        }).catch(err => {
                            sendResponse(res, false, 500, '', `Error: ${err.message}`, true);
                        })
                    } else {
                        sendResponse(res, true, 200, {}, 'User pada temp tidak ditemukan', true);
                    }
                }).catch(err => {
                    sendResponse(res, false, 500, '', `Error: ${err.message}`, true);
                });
            } else {
                sendResponse(res, true, 200, {}, 'Buku tidak ditemukan, silahkan daftarkan buku terlebih dahulu', true);
            }
        }).catch(err => {
            sendResponse(res, false, 500, '', `Error: ${err.message}`, true);
        });
    },
    deleteBukuAtTemp: (req, res) => {
        let isbn = req.body.isbn;
        let id = req.body.idTempPinjam;

        TempPeminjaman.findById(id).then(resultTemp => {
            if (resultTemp) {
                let listBuku = resultTemp.isbnBuku;
                let tersedia = false;
                let newBuku = [];

                if (listBuku) {
                    for (let i = 0; i < listBuku.length; i++) {
                        if (listBuku[i] == isbn) {
                            tersedia = true;
                        } else {
                            newBuku.push(listBuku[i]);
                        }
                    }
                } else {
                    sendResponse(res, true, 200, {}, 'List buku kosong tidak ada yang dihapus', true);
                }

                if (tersedia) {
                    TempPeminjaman.findByIdAndUpdate(id, {
                        $set: {
                            isbnBuku: newBuku
                        }
                    }).then(resultUpdate => {
                        if (resultUpdate) {
                            Buku.find({
                                isbn: isbn
                            }).then(resultBuku => {
                                sendResponse(res, true, 200, resultBuku, 'Buku berhasil dihapus', true);
                            }).catch(err => {
                                sendResponse(res, false, 500, {}, `Error: ${err.message}`, true);
                            })
                        } else {
                            sendResponse(res, true, 200, {}, 'Data temp pinjam tidak ditemukan', true);
                        }
                    }).catch(err => {
                        sendResponse(res, false, 500, '', `Error: ${err.message}`, true);
                    });
                } else {
                    sendResponse(res, true, 200, {}, 'Buku tidak ditemukan', true);
                }

            } else {
                sendResponse(res, true, 200, {}, 'Data temp pinjam tidak ditemukan', true);
            }
        }).catch(err => {
            sendResponse(res, false, 500, '', `Error: ${err.message}`, true);
        });
    },
    find: (req, res) => {

        let id = req.params.id;

        TempPeminjaman.aggregate([{
                $lookup: {
                    from: 'Buku',
                    localField: 'isbnBuku',
                    foreignField: 'isbn',
                    as: 'buku',
                }
            },
            {
                $project: {
                    _id: 1,
                    idUser: 1,
                    buku: '$buku'
                }
            },
            {
                $match: {
                    _id: mongoose.Types.ObjectId(id)
                }
            }
        ]).exec((err, results) => {
            if (err) {
                sendResponse(res, false, 500, '', `Error: ${err}`, true);
            } else {
                if (results.length > 0) {
                    sendResponse(res, true, 200, results, 'Mendapatkan data pengunjung berhasil', true);
                } else {
                    sendResponse(res, true, 200, results, 'Data Temp Pinjam tidak ditemukan', true);
                }
            }
        });
    }
};