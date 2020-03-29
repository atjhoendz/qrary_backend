const jwt = require('jsonwebtoken');
const urlExist = require('url-exists');
const FormatResponse = require('../utils/formatResponse');

const setUrlFoto = (npm) => {
    let prefixUrl = "https://media.unpad.ac.id/photo/mahasiswa/";
    let prodi = npm.substring(0, 6);
    let angkatan = `20${npm.substring(6, 8)}`;
    return `${prefixUrl + prodi}/${angkatan}/${npm}.JPG`;
};

module.exports = {
    isAuth: (req, res, next) => {
        try {
            const token = req.headers.token;
            let decoded = jwt.verify(token, process.env.SECRET_KEY);
            req.user = decoded;
            next();
        } catch (err) {
            res.status(401).json(
                FormatResponse(false, 401, '', "Token invalid, silahkan login terlebih dahulu", true)
            );
        }
    },
    isAuthorized: (req, res, next) => {
        if (req.user.role == 'admin') {
            next();
        } else {
            res.status(401).json(
                FormatResponse(false, 401, '', 'User unAuthorized, forbidden access', true)
            );
        }
    },
    isContainReqData: (req, res, next) => {
        if (Object.keys(req.body).length !== 0) {
            next();
        } else {
            res.status(404).json(
                FormatResponse(false, 404, '', 'Request data kosong', true)
            );
        }
    },
    isValidNPM: (req, res, next) => {
        let url = setUrlFoto(req.body.npm);
        urlExist(url, (err, exist) => {
            if (exist) {
                next();
            } else {
                res.status(200).json(
                    FormatResponse(true, 200, '', 'NPM tidak valid', true)
                );
            }
        });
    }
};