const jwt = require('jsonwebtoken');
const urlExist = require('url-exists');
const sendResponse = require('../utils/formatResponse');
const setUrlFoto = require('../utils/setUrlFoto');

module.exports = {
    isAuth: (req, res, next) => {
        try {
            const token = req.headers.token;
            let decoded = jwt.verify(token, process.env.SECRET_KEY);
            req.user = decoded;
            next();
        } catch (err) {
            sendResponse(res, false, 401, {}, "Token invalid, silahkan login terlebih dahulu", true);
        }
    },
    isAuthorized: (req, res, next) => {
        if (req.user.role == 'admin' || req.user.role == 'superadmin') {
            next();
        } else {
            sendResponse(res, false, 401, {}, 'User unAuthorized, forbidden access', true);
        }
    },
    isContainReqData: (req, res, next) => {
        if (Object.keys(req.body).length !== 0) {
            next();
        } else {
            sendResponse(res, false, 404, {}, 'Request data kosong', true);
        }
    },
    isValidNPM: (req, res, next) => {
        let url = setUrlFoto(req.body.npm, 'mahasiswa');
        urlExist(url, (err, exist) => {
            if (exist) {
                next();
            } else {
                sendResponse(res, true, 200, {}, 'NPM tidak valid', true);
            }
        });
    },
    isPageaNumber: (req, res, next) => {
        let page = Number(req.query.page);
        let limit = Number(req.query.limit);

        if (isNaN(page) || isNaN(limit)) {
            sendResponse(res, true, 200, {}, 'Page dan limit harus angka', true);
        } else {
            req.query.page = page;
            req.query.limit = limit;
            next();
        }
    },
    isValidNIP: (req, res, next) => {
        let url = setUrlFoto(req.body.nip, 'pegawai');
        urlExist(url, (err, exist) => {
            if (exist) {
                next();
            } else {
                sendResponse(res, true, 200, {}, 'NIP tidak valid', true);
            }
        });
    },
    isQueryValid: (req, res, next) => {
        let key = req.query.key;
        let value = req.query.value;

        if (typeof(key) == 'undefined' || typeof(value) == 'undefined') {
            sendResponse(res, true, 404, '', 'Route not found...', true);
        } else if (key == "" || value == "") {
            sendResponse(res, true, 200, [], 'Data tidak ditemukan', true);
        } else {
            next();
        }
    }
};