// inisiasi library
const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const mysql = require("mysql")
const crypto = require("crypto")
const moment = require("moment")

// implementation
const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

// Create mysql connection
var db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "pelanggaran_siswa"
})

db.connect(error => {
    if(error){
        console.log(error.message)
    } else {
        console.log("Mysql Connected")
    }
})

// End-point menampilkan data pelanggaran siswa
app.get("/pelanggaran_siswa", (req,res) => {
    // Create sql query
    let sql = "select p.id_pelanggaran_siswa, p.id_siswa,p.waktu, s.nis, s.nama_siswa, p.id_user, u.nama_user " +
            "from pelanggaran_siswa p join siswa s on p.id_siswa = s.id_siswa " +
            "join user u on p.id_user = u.id_user"
    
    // Run query
    db.query(sql, (error,result) => {
        if(error) {
            res.json({
                message: error.message
            })
        } else {
            res.json({
                count: result.length,
                pelanggaran_siswa: result
            })
        }
    })
})

// End-point menambahkan data pelanggaran siswa
app.post("/pelanggaran_siswa", (req,res) => {
    // tampung data input body
    let data = {
        id_siswa: req.body.id_siswa,
        id_user: req.body.id_user,
        // Mendapatkan waktu saat input data
        waktu: moment().format('YYYY-MM-DD HH:mm:ss')
    }

    // Parse ke JSON
    let pelanggaran = JSON.parse(req.body.pelanggaran)

    // Create query insert ke pelanggaran_siswa
    let sql = "insert into pelanggaran_siswa set ?"

    // Run query
    db.query(sql, data, (error,result) => {
        // let response = null // karena tidak dipakai saya "comment"
        if(error){
            res.json({
                message: error.message
            })
        } else {
            // Get last inserted id_pelanggaran
            let lastID = result.insertId

            // Prepare data to detaiil_pelanggaran
            let data = []
            for(let i = 0; i < pelanggaran.length; i++) {
                data.push([
                    lastID, pelanggaran[i].id_pelanggaran
                ])
            }

            // Create query insert detail_pelanggaran
            let sql = "insert into detail_pelanggaran_siswa values ?"

            // Run query
            db.query(sql, [data], (error,result) =>{
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
        }
    })
})

// End-point untuk menampilkan data detail pelanggaran
app.get("/pelanggaran_siswa/:id_pelanggaran_siswa", (req,res) => {
    let param = {
        id_pelanggaran_siswa: req.params.id_pelanggaran_siswa
    }

    // Create sql query
    let sql = "select p.nama_pelanggaran, p.poin " +
            "from detail_pelanggaran_siswa dps join pelanggaran p " +
            "on p.id_pelanggaran = dps.id_pelanggaran " +
            "where ?"
    
    // Run query
    db.query(sql, param, (error,result) => {
        if(error) {
            res.json({
                message: error.message
            })
        } else {
            res.json({
                count: result.length,
                detail_pelanggaran_siswa: result
            })
        }
    })
})

// End-point untuk menghapus data pelanggaran_siswa
app.delete("/pelanggaran_siswa/:id_pelanggaran_siswa", (req,res) => {
    let param = {
        id_pelanggaran_siswa: req.params.id_pelanggaran_siswa
    }

    // Create sql query delete detail_pelanggaran
    let sql = "delete from detail_pelanggaran_siswa where ?"

    // Run SQL
    db.query(sql, param, (error,result) => {
        if(error) {
            res.json({
                message: error.message
            })
        } else {
            let param = {
                id_pelanggaran_siswa: req.params.id_pelanggaran_siswa
            }

            // Create sql query delete pelanggaran_siswa
            let sql = "delete from pelanggaran_siswa where ?"

            // Run SQL
            db.query(sql, param, (error, result) => {
                if(error) {
                    res.json({
                        message: error.message
                    })
                } else {
                    res.json({
                        message: "Data has been deleted"
                    })
                }
            })
        }
    })
})

// End-point akses data user
app.get("/user", (req,res) => {
    // Create sql query
    let sql = "select * from user" 

    // Run query
    db.query(sql, (error, result) => {
        let response = null
        if(error) {
            response = {
                message: error.message // pesan error
            }
        } else {
            response = {
                count: result.length, // jumlah data
                user: result // isi data
            }
        }
        res.json(response)
    })
})

// End-point akses data user sesuai id_user
app.get("/siswa/:id", (req,res) => {
    // Menangkap input id
    let data = {
        id_siswa: res.params.id
    }

    // Create sql query
    let sql = "select * from user where ?"

    // Run query
    db.query(sql, data, (error,result) => {
        let response = null
        if(error) {
            response = {
                message: error.message
            }
        } else {
            response = {
                count: result.length,
                siswa: result
            }
        }
        res.json(response)
    })
})

// End-point menyimpan data user
app.post("/user", (req,res) => {
    // tampung data dari input body
    let data = {
        nama_user: req.body.nama_user,
        username: req.body.username,
        // hash password ke md5 dengan library cryptoJS
        password: crypto.createHash('md5').update(req.body.password).digest("hex")
    }

    // Create sql query insert
    let sql = "insert into user set ?"

    // Run query
    db.query(sql, data, (error, result) => {
        let response = null
        if(error) {
            response = {
                message: error.message
            }
        } else {
            response = {
                message: result.affectedRows + " Data inserted"
            }
        }
        res.json(response)
    })
})

// End-point Mengubah data user
app.put("/user", (req,res) => {
    // Tampung data dari body
    let data = [{
        nama_user: req.body.nama_user,
        username: req.body.username,
        password: crypto.createHash('md5').update(req.body.password).digest("hex")
    },
    {
        id_user: req.body.id_user
    }]

    // Create sql query update
    let sql = "update user set ? where ?"

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

// End-point menghapus data user berdasarkan id_user
app.delete("/user/:id", (req,res) => {
    // Tampung data input dari body
    let data ={
        id_user: req.params.id
    }

    // Create sql query delete
    let sql = "delete from user where ?"

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

// End-Point akses data siswa
app.get("/siswa", (req,res) => {
    // Create sql query
    let sql = "select * from siswa"

    // run query
    db.query(sql, (error, result) => {
        let response = null
        if(error) {
            response = {
                message: error.message // pesan error
            }
        } else {
            response = {
                count: result.length, // jumlah data
                siswa: result // isi data
            }
        }

        res.json(response)
    })
})

// end-point akses data siswa berdasarkan id_siswa tertentu
app.get("/siswa/:id", (req,res) => {
    let data = {
        id_siswa: res.params.id
    }

    // Create sql query
    let sql = "select * from siswa where ?"

    // run query
    db.query(sql, data, (error, result) => {
        let response = null
        if(error) {
            response = {
                message: error.message // pesan error
            }
        } else {
            response = {
                count: result.length, // jumlah data
                siswa: result // isi data
            }
        }
        res.json(response) // send response
    })
})

// end-point menyimpan data siswa
app.post("/siswa", (req,res) => {
    // prepare data
    let data = {
        nis: req.body.nis,
        nama_siswa: req.body.nama_siswa,
        kelas: req.body.kelas,
        poin: req.body.poin
    }

    // Create sql query insert
    let sql = "insert into siswa set ?"

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

// end-point mengubah data siswa
app.put("/siswa", (req,res) => {
    // prepare data
    let data = [
        {
            nis: req.body.nis,
            nama_siswa: req.nody.nama_siswa,
            kelas: req.body.kelas,
            poin: req.body.poin
        },
        // Parameter (primary key)
        {
            id_siswa: req.body.id_siswa
        }
    ]

    // Create sql query update
    let sql = "update siswa set ? where ?"

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

// End-point menghapus data siswa berdasarkan id_siswa
app.delete("/siswa/:id", (req,res) => {
    // prepare data
    let data = {
        id_siswa: req.params.id
    }

    // create query sql delete
    let sql = "delete from siswa where ?"

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

app.listen(8000, () => {
    console.log("running on port 8000")
})