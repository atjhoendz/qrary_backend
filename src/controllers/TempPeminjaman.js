const TempPeminjaman = require('../models/tempPeminjaman');
const Pengunjung = require('../models/pengunjung');
const User = require('../models/user');
const Buku = require('../models/buku');
const FormatResponse = require('../utils/formatResponse');

module.exports = {
    getAllTempPinjam: (req, res) => {
        TempPeminjaman.find({}).then(result => {
            res.status(200).json(
                FormatResponse(true, 200, result, 'Mendapatkan Data Temp pinjam berhasil', true)
            );
        }).catch(err => {
            res.status(500).json(
                FormatResponse(false, 500, '', `Error: ${err.message}`, true)
            );
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
                                    if (resultUpdateUser) {
                                        res.status(200).json(
                                            FormatResponse(true, 200, resultUpdateUser, 'Data pengunjung berhasil didapatkan', true)
                                        );
                                    } else {
                                        res.status(200).json(
                                            FormatResponse(true, 200, {}, 'Data pengunjung tidak berhasil didapatkan', true)
                                        );
                                    }
                                }).catch(err => {
                                    res.status(500).json(
                                        FormatResponse(false, 500, '', `Error: ${err.message}`, true)
                                    );
                                });
                            }
                        }).catch(err => {
                            res.status(500).json(
                                FormatResponse(false, 500, '', `Error: ${err.message}`, true)
                            );
                        });
                    } else {
                        res.status(200).json(
                            FormatResponse(true, 200, {}, 'NPM belum terdaftar sebagai pengunjung', true)
                        );
                    }
                }).catch(err => {
                    res.status(500).json(
                        FormatResponse(false, 500, '', `Error: ${err.message}`, true)
                    );
                });
            } else {
                res.status(200).json(
                    FormatResponse(true, 200, '', 'Npm belum terdaftar sebagai user', true)
                );
            }
        }).catch(err => {
            res.status(500).json(
                FormatResponse(false, 500, '', `Error: ${err.message}`, true)
            );
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
                                    return res.status(200).json(
                                        FormatResponse(true, 200, '', 'Buku sudah ditambahkan', true)
                                    );
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
                                res.status(200).json(
                                    FormatResponse(true, 200, resultBuku, 'Buku berhasil ditambahkan', true)
                                );
                            } else {
                                res.status(200).json(
                                    FormatResponse(true, 200, {}, 'User pada temp tidak ditemukan', true)
                                );
                            }
                        }).catch(err => {
                            res.status(500).json(
                                FormatResponse(false, 500, '', `Error: ${err.message}`, true)
                            );
                        })
                    } else {
                        res.status(200).json(
                            FormatResponse(true, 200, {}, 'User pada temp tidak ditemukan', true)
                        );
                    }
                }).catch(err => {
                    res.status(500).json(
                        FormatResponse(false, 500, '', `Error: ${err.message}`, true)
                    );
                });
            } else {
                res.status(200).json(
                    FormatResponse(true, 200, {}, 'Buku tidak ditemukan, silahkan daftarkan buku terlebih dahulu', true)
                );
            }
        }).catch(err => {
            res.status(500).json(
                FormatResponse(false, 500, '', `Error: ${err.message}`, true)
            );
        });
    },
    deleteBukuAtTemp: (req, res) => {
        let isbn = req.params.isbn;
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
                    res.status(200).json(
                        FormatResponse(true, 200, {}, 'List buku kosong tidak ada yang dihapus', true)
                    );
                }

                if (tersedia) {
                    TempPeminjaman.findByIdAndUpdate(id, {
                        $set: {
                            isbnBuku: newBuku
                        }
                    }).then(resultUpdate => {
                        if (resultUpdate) {
                            res.status(200).json(
                                FormatResponse(true, 200, resultUpdate, 'Buku berhasil dihapus', true)
                            );
                        } else {
                            res.status(200).json(
                                FormatResponse(true, 200, {}, 'Data temp pinjam tidak ditemukan', true)
                            );
                        }
                    }).catch(err => {
                        res.status(500).json(
                            FormatResponse(false, 500, '', `Error: ${err.message}`, true)
                        );
                    });
                } else {
                    res.status(200).json(
                        FormatResponse(true, 200, {}, 'Buku tidak ditemukan', true)
                    );
                }

            } else {
                res.status(200).json(
                    FormatResponse(true, 200, {}, 'Data temp pinjam tidak ditemukan', true)
                );
            }
        }).catch(err => {
            res.status(500).json(
                FormatResponse(false, 500, '', `Error: ${err.message}`, true)
            )
        });
    }
};