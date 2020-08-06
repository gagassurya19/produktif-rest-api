const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const app = express()
const mysql = require("mysql")
const crypto = require("crypto")
const moment = require("moment")

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

// Create mysql connection
var db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "rent_car"
})

db.connect(error => {
    if(error){
        console.log(error.message)
    } else {
        console.log("Mysql Connected")
    }
})

// ====================== MOBIL ======================
// End-Point akses data mobil
app.get("/mobil", (req,res) => {
    // Create sql query
    let sql = "select * from mobil"

    // run query
    db.query(sql, (error, result) => {
        let response = null
        if(error) {
            response = {
                message: error.message // pesan error
            }
        } else {
            response = {
                jumlah: result.length, // jumlah data
                mobil: result // isi data
            }
        }

        res.json(response)
    })
})

// end-point akses data mobil berdasarkan id_mobil tertentu
app.get("/mobil/:id", (req,res) => {
    let data = {
        id_mobil: req.params.id
    }

    // Create sql query
    let sql = "select * from mobil where ?"

    // run query
    db.query(sql, data, (error, result) => {
        let response = null
        if(error) {
            response = {
                message: error.message // pesan error
            }
        } else {
            response = {
                jumlah: result.length, // jumlah data
                mobil: result // isi data
            }
        }
        res.json(response) // send response
    })
})

// end-point menyimpan data mobil
app.post("/mobil", (req,res) => {
    // prepare data
    let data = {
        nomor_mobil: req.body.nomor_mobil,
        merk: req.body.merk,
        jenis: req.body.jenis,
        warna: req.body.warna,
        tahun_pembuatan: req.body.tahun_pembuatan,
        biaya_sewa_per_hari: req.body.biaya_sewa_per_hari,
        image: req.body.image
    }

    // Create sql query insert
    let sql = "insert into mobil set ?"

    // Run query
    db.query(sql, data, (error,result) => {
        let response = null
        if(error) {
            response = {
                message: error.message // pesan error
            }
        } else {
            response = {
                message: result.affectedRows + " data inserted"
            }
        }
        res.json(response) // send response
    })
})

// end-point mengubah data mobil
app.put("/mobil", (req,res) => {
    // prepare data
    let data = [
        {
            nomor_mobil: req.body.nomor_mobil,
            merk: req.body.merk,
            jenis: req.body.jenis,
            warna: req.body.warna,
            tahun_pembuatan: req.body.tahun_pembuatan,
            biaya_sewa_per_hari: req.body.biaya_sewa_per_hari,
            image: req.body.image
        },
        // Parameter (primary key)
        {
            id_mobil: req.body.id_mobil
        }
    ]

    // Create sql query update
    let sql = "update mobil set ? where ?"

    // run query
    db.query(sql, data, (error,result) => {
        let response = null
        if(error) {
            response = {
                message: error.message // pesan error
            }
        } else {
            response = {
                message: result.affectedRows + " data updated"
            }
        }
        res.json(response)
    })
})

// End-point menghapus data mobil berdasarkan id_mobil
app.delete("/mobil/:id", (req,res) => {
    // prepare data
    let data = {
        id_mobil: req.params.id
    }

    // create query sql delete
    let sql = "delete from mobil where ?"

    // run query
    connection.query(sql, data, (error,result) => {
        let response = null
        if(error){
            response = {
                message: error.message
            }
        } else {
            response = {
                message: result.affectedRows + " data deleted"
            }
        }
        res.json(response)
    })
})
// ====================== MOBIL ======================

// ====================== Pelanggan ======================
// End-Point akses data pelanggan
app.get("/pelanggan", (req,res) => {
    // Create sql query
    let sql = "select * from pelanggan"

    // run query
    db.query(sql, (error, result) => {
        let response = null
        if(error) {
            response = {
                message: error.message // pesan error
            }
        } else {
            response = {
                jumlah: result.length, // jumlah data
                pelanggan: result // isi data
            }
        }

        res.json(response)
    })
})

// end-point akses data pelanggan berdasarkan id_pelanggan tertentu
app.get("/pelanggan/:id", (req,res) => {
    let data = {
        id_pelanggan: req.params.id
    }

    // Create sql query
    let sql = "select * from pelanggan where ?"

    // run query
    db.query(sql, data, (error, result) => {
        let response = null
        if(error) {
            response = {
                message: error.message // pesan error
            }
        } else {
            response = {
                jumlah: result.length, // jumlah data
                pelanggan: result // isi data
            }
        }
        res.json(response) // send response
    })
})

// end-point menyimpan data pelanggan
app.post("/pelanggan", (req,res) => {
    // prepare data
    let data = {
        nama_pelanggan: req.body.nama_pelanggan,
        alamat_pelanggan: req.body.alamat_pelanggan,
        kontak: req.body.kontak
    }

    // Create sql query insert
    let sql = "insert into pelanggan set ?"

    // Run query
    db.query(sql, data, (error,result) => {
        let response = null
        if(error) {
            response = {
                message: error.message // pesan error
            }
        } else {
            response = {
                message: result.affectedRows + " data inserted"
            }
        }
        res.json(response) // send response
    })
})

// end-point mengubah data pelanggan
app.put("/pelanggan", (req,res) => {
    // prepare data
    let data = [
        {
            nama_pelanggan: req.body.nama_pelanggan,
            alamat_pelanggan: req.body.alamat_pelanggan,
            kontak: req.body.kontak
        },
        // Parameter (primary key)
        {
            id_pelanggan: req.body.id_pelanggan
        }
    ]

    // Create sql query update
    let sql = "update pelanggan set ? where ?"

    // run query
    db.query(sql, data, (error,result) => {
        let response = null
        if(error) {
            response = {
                message: error.message // pesan error
            }
        } else {
            response = {
                message: result.affectedRows + " data updated"
            }
        }
        res.json(response)
    })
})

// End-point menghapus data pelanggan berdasarkan id_pelanggan
app.delete("/pelanggan/:id", (req,res) => {
    // prepare data
    let data = {
        id_pelanggan: req.params.id
    }

    // create query sql delete
    let sql = "delete from pelanggan where ?"

    // run query
    db.query(sql, data, (error,result) => {
        let response = null
        if(error){
            response = {
                message: error.message
            }
        } else {
            response = {
                message: result.affectedRows + " data deleted"
            }
        }
        res.json(response)
    })
})
// ====================== Pelanggan ======================

// ====================== Karyawan ======================
// End-Point akses data karyawan
app.get("/karyawan", (req,res) => {
    // Create sql query
    let sql = "select * from karyawan"

    // run query
    db.query(sql, (error, result) => {
        let response = null
        if(error) {
            response = {
                message: error.message // pesan error
            }
        } else {
            response = {
                jumlah: result.length, // jumlah data
                karyawan: result // isi data
            }
        }

        res.json(response)
    })
})

// end-point akses data karyawan berdasarkan id_karyawan tertentu
app.get("/karyawan/:id", (req,res) => {
    let data = {
        id_karyawan: req.params.id
    }

    // Create sql query
    let sql = "select * from karyawan where ?"

    // run query
    db.query(sql, data, (error, result) => {
        let response = null
        if(error) {
            response = {
                message: error.message // pesan error
            }
        } else {
            response = {
                jumlah: result.length, // jumlah data
                karyawan: result // isi data
            }
        }
        res.json(response) // send response
    })
})

// end-point menyimpan data karyawan
app.post("/karyawan", (req,res) => {
    // prepare data
    let data = {
        nama_karyawan: req.body.nama_karyawan,
        alamat_karyawan: req.body.alamat_karyawan,
        kontak: req.body.kontak,
        username: req.body.username,
        // hash password ke md5 dengan library cryptoJS
        password: crypto.createHash('md5').update(req.body.password).digest("hex")
    }

    // Create sql query insert
    let sql = "insert into karyawan set ?"

    // Run query
    db.query(sql, data, (error,result) => {
        let response = null
        if(error) {
            response = {
                message: error.message // pesan error
            }
        } else {
            response = {
                message: result.affectedRows + " data inserted"
            }
        }
        res.json(response) // send response
    })
})

// end-point mengubah data karyawan
app.put("/karyawan", (req,res) => {
    // prepare data
    let data = [
        {
            nama_karyawan: req.body.nama_karyawan,
            alamat_karyawan: req.body.alamat_karyawan,
            kontak: req.body.kontak,
            username: req.body.username,
            // hash password ke md5 dengan library cryptoJS
            password: crypto.createHash('md5').update(req.body.password).digest("hex")
        },
        // Parameter (primary key)
        {
            id_karyawan: req.body.id_karyawan
        }
    ]

    // Create sql query update
    let sql = "update karyawan set ? where ?"

    // run query
    db.query(sql, data, (error,result) => {
        let response = null
        if(error) {
            response = {
                message: error.message // pesan error
            }
        } else {
            response = {
                message: result.affectedRows + " data updated"
            }
        }
        res.json(response)
    })
})

// End-point menghapus data karyawan berdasarkan id_karyawan
app.delete("/karyawan/:id", (req,res) => {
    // prepare data
    let data = {
        id_karyawan: req.params.id
    }

    // create query sql delete
    let sql = "delete from karyawan where ?"

    // run query
    db.query(sql, data, (error,result) => {
        let response = null
        if(error){
            response = {
                message: error.message
            }
        } else {
            response = {
                message: result.affectedRows + " data deleted"
            }
        }
        res.json(response)
    })
})
// ====================== Karyawan ======================

// ====================== SEWA ======================
// End-point menampilkan data SEWA
app.get("/sewa", (req,res) => {
    // Create sql query
    let sql = "select * " +
            "from sewa "
    
    // Run query
    db.query(sql, (error,result) => {
        if(error) {
            res.json({
                message: error.message
            })
        } else {
            res.json({
                count: result.length,
                sewa: result
            })
        }
    })
})

// End-point menampilkan data SEWA berdasar id_sewa
app.get("/sewa/:id", (req,res) => {
    let data = {
        id_sewa: req.params.id
    }
    
    // Create sql query
    let sql = "select * " +
            "from sewa where ?"
    
    // Run query
    db.query(sql, data, (error,result) => {
        if(error) {
            res.json({
                message: error.message
            })
        } else {
            res.json({
                count: result.length,
                sewa: result
            })
        }
    })
})

// End-point menambahkan data SEWA
app.post("/sewa", (req,res) => {
    // tampung data input body
    let data = {
        id_mobil: req.body.id_mobil,
        id_pelanggan: req.body.id_pelanggan,
        id_karyawan: req.body.id_karyawan,
        // Mendapatkan waktu saat input data
        tgl_sewa: moment().format('YYYY-MM-DD HH:mm:ss'),
        tgl_kembali: moment().format('YYYY-MM-DD HH:mm:ss'),
        total_bayar: req.body.total_bayar
    }

    // Create query insert ke sewa
    let sql = "insert into sewa set ?"

    // Run query
    db.query(sql, data, (error,result) => {
        // let response = null // karena tidak dipakai saya "comment"
        if(error){
            res.json({
                message: error.message
            })
        } else {
            res.json({
                message: "Data has been inserted"
            })
        }
    })
})

// End-point Mengubah data sewa
app.put("/sewa", (req,res) => {
    // Tampung data dari body
    let data = [{
        id_mobil: req.body.id_mobil,
        id_pelanggan: req.body.id_pelanggan,
        id_karyawan: req.body.id_karyawan,
        // Mendapatkan waktu saat input data
        tgl_sewa: moment().format('YYYY-MM-DD HH:mm:ss'),
        tgl_kembali: moment().format('YYYY-MM-DD HH:mm:ss'),
        total_bayar: req.body.total_bayar
    },
    {
        id_sewa: req.body.id_sewa
    }]

    // Create sql query update
    let sql = "update sewa set ? where ?"

    // Run query
    db.query(sql, data, (error, result) => {
        let response = null
        if(error){
            response = {
                message: error.message
            }
        } else {
            response = {
                message: result.affectedRows + " data Updated"
            }
        }
        res.json(response)
    })
})

// End-point menghapus data sewa berdasarkan id_sewa
app.delete("/sewa/:id", (req,res) => {
    // Tampung data input dari body
    let data ={
        id_sewa: req.params.id
    }

    // Create sql query delete
    let sql = "delete from sewa where ?"

    // Run query
    db.query(sql, data, (error,result) => {
        let response = null
        if(error) {
            response = {
                message: error.message
            }
        } else {
            response = {
                message: result.affectedRows + " Data deleted"
            }
        }
        res.json(response)
    })
})
// ====================== SEWA ======================
app.listen(8000, () => {
    console.log("running on port 8000")
});