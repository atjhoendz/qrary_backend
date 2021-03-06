const genInfoFromNPM = (npm) => {

    let dataFakultas = [{
            kode: '11',
            nama: 'Hukum',
            prodi: [{
                kode: '0110',
                nama: 'S1 Hukum'
            }]
        },
        {
            kode: '12',
            nama: 'Ekonomi dan Bisnis',
            prodi: [{
                    kode: '0110',
                    nama: 'S1 Akuntansi',
                },
                {
                    kode: '0210',
                    nama: 'S1 Ekonomi Pembangunan'
                },
                {
                    kode: '0310',
                    nama: 'S1 Manajemen'
                },
                {
                    kode: '0410',
                    nama: 'S1 Ekonomi Islam'
                },
                {
                    kode: '0510',
                    nama: 'S1 Bisnis Digital'
                },
                {
                    kode: '0104',
                    nama: 'D4 Akuntansi Perpajakan'
                },
                {
                    kode: '0204',
                    nama: 'D4 Akuntansi Sektor Publik'
                },
                {
                    kode: '0304',
                    nama: 'D4 Bisnis Internasional'
                },
                {
                    kode: '0404',
                    nama: 'D4 Pemasaran Digital'
                }
            ]
        },
        {
            kode: '24',
            nama: 'Teknologi Industri Pertanian',
            prodi: [{
                    kode: '0110',
                    nama: 'S1 Teknik Pertanian'
                },
                {
                    kode: '02',
                    nama: 'S1 Teknologi Pangan'
                },
                {
                    kode: '03',
                    nama: 'S1 Teknologi Industri Pertanian'
                }
            ]
        },
        {
            kode: '19',
            nama: 'Psikologi',
            prod: [{
                kode: '0110',
                nama: 'S1 Psikologi'
            }]
        },
        {
            kode: '20',
            nama: 'Peternakan',
            prodi: [{
                kode: '0110',
                nama: 'S1 Peternakan'
            }]
        },
        {
            kode: '16',
            nama: 'Kedokteran Gigi',
            prodi: [{
                kode: '0110',
                nama: 'S1 Kedokteran Gigi'
            }]
        },
        {
            kode: '27',
            nama: 'Teknik Geologi',
            prodi: [{
                kode: '0110',
                nama: 'S1 Teknik Geologi'
            }]
        },
        {
            kode: '26',
            nama: 'Farmasi',
            prodi: [{
                kode: '0110',
                nama: 'S1 Farmasi'
            }]
        },
        {
            kode: '22',
            nama: 'Keperawatan',
            prodi: [{
                kode: '0110',
                nama: 'S1 Keperawatan'
            }]
        },
        {
            kode: '21',
            nama: 'Ilmu Komunikasi',
            prodi: [{
                    kode: '0110',
                    nama: 'S1 Ilmu Komunikasi'
                },
                {
                    kode: '0210',
                    nama: 'S1 Ilmu Perpustakaan'
                },
                {
                    kode: '0310',
                    nama: 'S1 Hubungan Masyarakat'
                },
                {
                    kode: '0410',
                    nama: 'S1 Televisi dan Film'
                },
                {
                    kode: '0510',
                    nama: 'S1 Manajemen Komunikasi'
                },
                {
                    kode: '0610',
                    nama: 'S1 Jurnalistik'
                },
                {
                    kode: '0104',
                    nama: 'D4 Manajemen Produksi Media'
                }
            ]
        },
        {
            kode: '15',
            nama: 'Pertanian',
            prodi: [{
                    kode: '0510',
                    nama: 'S1 Agroteknologi'
                },
                {
                    kode: '0610',
                    nama: 'S1 Agribisnis'
                },
                {
                    kode: '0104',
                    nama: 'D4 Agrotekno-preneur'
                }
            ]
        },
        {
            kode: '23',
            nama: 'Perikanan dan Ilmu Kelautan',
            prodi: [{
                    kode: '0110',
                    nama: 'S1 Perikanan'
                },
                {
                    kode: '0210',
                    nama: 'S1 Ilmu Kelautan'
                },
                {
                    kode: '0204',
                    nama: 'D4 Pariwisata Bahari'
                }
            ]
        },
        {
            kode: '18',
            nama: 'Ilmu Budaya',
            prodi: [{
                    kode: '0110',
                    nama: 'S1 Sastra Indonesia'
                },
                {
                    kode: '0210',
                    nama: 'S1 Sastra Sunda'
                },
                {
                    kode: '0310',
                    nama: 'S1 Sejarah'
                },
                {
                    kode: '0410',
                    nama: 'S1 Sastra Inggris'
                },
                {
                    kode: '0510',
                    nama: 'S1 Sastra Perancis'
                },
                {
                    kode: '0610',
                    nama: 'S1 Sastra Jepang'
                },
                {
                    kode: '0710',
                    nama: 'S1 Sastra Rusia'
                },
                {
                    kode: '0810',
                    nama: 'S1 Sastra Jerman'
                },
                {
                    kode: '0910',
                    nama: 'S1 Sastra Arab'
                },
                {
                    kode: '0104',
                    nama: 'D4 Bahasa dan Budaya Tiongkok'
                }
            ]
        },
        {
            kode: '17',
            nama: 'Ilmu Sosial dan Ilmu Politik',
            prodi: [{
                    kode: '0110',
                    nama: 'S1 Administrasi Pemerintahan'
                },
                {
                    kode: '0210',
                    nama: 'S1 Hubungan Internasional'
                },
                {
                    kode: '0310',
                    nama: 'S1 Kesejahteraan Sosial'
                },
                {
                    kode: '0410',
                    nama: 'S1 Ilmu Pemerintahan'
                },
                {
                    kode: '0510',
                    nama: 'S1 Antropologi'
                },
                {
                    kode: '0610',
                    nama: 'S1 Administrasi Bisnis'
                },
                {
                    kode: '0710',
                    nama: 'S1 Sosiologi'
                },
                {
                    kode: '0810',
                    nama: 'S1 Ilmu Politik'
                },
                {
                    kode: '0104',
                    nama: 'D4 Administrasi Keuangan Publik'
                },
                {
                    kode: '0204',
                    nama: 'D4 Administrasi Pemerintahan'
                },
                {
                    kode: '0304',
                    nama: 'D4 Bisnis Logistik'
                },
                {
                    kode: '0404',
                    nama: 'D4 Kearsipan Digital'
                }
            ]
        },
        {
            kode: '13',
            nama: 'Kedokteran',
            prodi: [{
                    kode: '0110',
                    nama: 'S1 Kedokteran'
                },
                {
                    kode: '0210',
                    nama: 'S1 Kedokteran Hewan'
                },
                {
                    kode: '0104',
                    nama: 'D4 Kebidanan'
                }
            ]
        },
        {
            kode: '14',
            nama: 'Matematika dan Ilmu Pengetahuan Alam',
            prodi: [{
                    kode: '0110',
                    nama: 'S1 Matematika'
                },
                {
                    kode: '0210',
                    nama: 'S1 Kimia'
                },
                {
                    kode: '0310',
                    nama: 'S1 Fisika'
                },
                {
                    kode: '0410',
                    nama: 'S1 Biologi'
                },
                {
                    kode: '0610',
                    nama: 'S1 Statistika'
                },
                {
                    kode: '0710',
                    nama: 'S1 Geofisika'
                },
                {
                    kode: '0810',
                    nama: 'S1 Teknik Informatika'
                },
                {
                    kode: '0910',
                    nama: 'S1 Teknik Elektro'
                },
                {
                    kode: '1010',
                    nama: 'S1 Ilmu Aktuaria'
                }
            ]
        }
    ]

    let kodeFak = npm.substr(0, 2);
    let kodeProdi = npm.substr(2, 4);
    let angkatan = npm.substr(6, 2);

    let data = {};

    dataFakultas.forEach(fakultas => {
        if (fakultas.kode == kodeFak) {
            fakultas.prodi.forEach(prodi => {
                if (prodi.kode == kodeProdi) {
                    data = {
                        fakultas: fakultas.nama,
                        prodi: prodi.nama,
                        angkatan: `20${angkatan}`
                    }
                }
            });
        }
    });

    return data;
}

module.exports = genInfoFromNPM;