const setUrlFoto = (npm, type) => {
    let prefixUrl = `https://media.unpad.ac.id/photo/${type}/`;

    if (type == 'mahasiswa') {
        let prodi = npm.substring(0, 6);
        let angkatan = `20${npm.substring(6, 8)}`;
        return `${prefixUrl + prodi}/${angkatan}/${npm}.JPG`;
    } else if (type == 'pegawai') {
        return `${prefixUrl + npm}.jpg`;
    }
};

module.exports = setUrlFoto;