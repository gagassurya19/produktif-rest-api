const express = require("express")
const app = express()
const multer = require("multer") // untuk upload file
const path = require("path") // untuk memanggil path direktori
const fs = require("fs") // untuk manajemen file
const cors = require("cors")
const mysql = require("mysql")

// hash cryptr
const md5 = require("md5")
const cryptr = require("cryptr")
const crypt = new cryptr("19042002")

app.use(express.static(__dirname))
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors())

// variable konfigurasi proses upload file
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // set file storage
        cb(null, "./image")
    },
    filename: (req, file, cb) => {
        // generate file name
        cb(null, "image-" + Date.now() + path.extname(file.originalname))
    }
})

let upload = multer({storage: storage})

// variable konfigurasi koneksi database
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "olshop"
})

// ================ Barang ================
// End-point menambah data barang (insert)
app.post("/barang", upload.single("image"), (req,res) => {
    // tampung data input dari body
    let data = {
        nama_barang: req.body.nama_barang,
        harga: req.body.harga,
        stok: req.body.stok,
        deskripsi: req.body.deskripsi,
        image: req.file.filename
    }

    if(!req.file){
        // jika tidak ada file yang diupload
        res.json({
            message: "Tidak ada file yang dikirim"
        })
    } else {
        // create sql insert
        let sql = "insert into barang set ?"

        // run query
        db.query(sql, data, (error, result) => {
            if(error) throw error
            res.json({
                message: result.affectedRows + " Data berhasi disimpan"
            })
        })
    }
})

// End-point mengubah data barang (update)
app.put("/barang", upload.single("image"), (req, res) => {
    let data = null, sql = null;
    // parameter perubahan data
    let param = {
        kode_barang: req.body.kode_barang
    }

    if(!req.file){
        // jika tidak ada file yang dikirim = update data saja
        data = {
            nama_barang: req.body.nama_barang,
            harga: req.body.harga,
            stok: req.body.stok,
            deskripsi: req.body.deskripsi
        }
    } else {
        // jika mengirim file = update data + reupload
        data = {
            nama_barang: req.body.nama_barang,
            harga: req.body.harga,
            stok: req.body.stok,
            deskripsi: req.body.deskripsi,
            image: req.file.filename
        }

        // get data yang akan diupdate untuk 
        // mendapatkan nama file yang lama
        sql = "select * from barang where ?"

        // run query
        db.query(sql, param, (error, result) => {
            if(error) throw error
            // tampung nama file yang lama
            let fileName = result[0].image

            // hapus file yang lama
            let dir = path.join(__dirname, "image", fileName)
            fs.unlink(dir, (error) => {})
        })
    }

    // Create sql update
    sql = "update barang set ? where ?"

    // run sql update
    db.query(sql, [data, param], (error, result) => {
        if(error) {
            res.json({
                message: error.message
            })
        } else {
            res.json({
                message: result.affectedRows + " Data berhasil diubah"
            })
        }
    })
})

// End-point untuk menghapus data barang berdasarkan "kode_barang" (delete)
app.delete("/barang/:kode_barang", (req, res) => {
    let param = {
        kode_barang: req.params.kode_barang
    }

    // ambil data yang akan dihapus
    let sql = "select * from barang where ?"

    // run query
    db.query(sql, param, (error, result) => {
        if(error) throw error

        // tampung nama file yang lama
        let fileName = result[0].image

        // hapus file yang lama
        let dir = path.join(__dirname, "image", fileName)
        fs.unlink(dir, (error) => {})
    })

    // create sql delete
    sql = "delete from barang where ?"

    // run query
    db.query(sql, param, (error, result) => {
        if(error) {
            res.json({
                message: error.message
            })
        } else {
            res.json({
                message: result.affectedRows + " Data berhasil dihapus"
            })
        }
    })
}) 

// End-point tampilkan data barang
app.get("/barang", (req, res) => {
    // create sql query
    let sql = "select * from barang"

    // run query
    db.query(sql, (error, result) => {
        if(error) throw error
        res.json({
            count: result.length,
            data: result
        })
    })
})
// ================ Barang ================

// ================ Admin ================
// End-point tampilkan data admin (select)
app.get("/admin", (req, res) => {
    // Create sql query
    let sql = "select * from admin"

    // run query
    db.query(sql, (error, result) => {
        if(error) throw error
        res.json({
            count: result.length,
            data: result
        })
    })
})

// End-point tambah data admin (insert)
app.post("/admin", (req, res) => {
    // tampung input dari body
    let data = {
        nama_admin: req.body.nama_admin,
        username: req.body.username,
        password: md5(req.body.password)
    }

    // Create sql query
    let sql = "insert into admin set ?"

    // run query
    db.query(sql, data, (error, result) => {
        if(error) throw error
        res.json({
            message: result.affectedRows + " Data tersimpan"
        })
    })
})

// End-point edit data admin (update)
app.put("/admin", (req, res) => {
    // tampung data input body
    let data = [{
        nama_admin: req.body.nama_admin,
        username: req.body.username,
        password: md5(req.body.password)
    },
    {
        id_admin: req.body.id_admin
    }]

    // Create sql query
    let sql = "update admin set ? where ?"

    // run query
    db.query(sql, data, (error, result) => {
        if(error) throw error
        res.json({
            message: result.affectedRows + " Data update"
        })
    })
})

// End-point hapus data admin (delete)
app.delete("/admin/:id_admin", (req, res) => {
    // tampung data params
    let data = {
        id_admin: req.params.id_admin
    }

    // create query
    let sql = "delete from admin where ?"

    // run query
    db.query(sql, data, (error, result) => {
        if(error) throw error
        res.json({
            message: result.affectedRows + " Data terhapus"
        })
    })
})
// ================ Admin ================

// ================ Users ================
// End-point tampilkan data users (select)
app.get("/users", (req, res) => {
    // query select
    let sql = "select * from users"

    // run query
    db.query(sql, (error, result) => {
        if(error) throw error
        res.json({
            count: result.length,
            data: result
        })
    })
})

// End-point tambahkan data users (insert)
app.post("/users", upload.single("image"), (req, res) => {
    // tampung data input dari body
    let data = {
        nama_users: req.body.nama_users,
        alamat: req.body.alamat,
        username: req.body.username,
        password: md5(req.body.password),
        image: req.file.filename
    }

    if(!req.file){
        // jika tidak ada file yang diupload
        res.json({
            message: "Tidak ada file yang dikirim"
        })
    } else {
        // create sql query
        let sql = "insert into users set ?"

        // run query
        db.query(sql, data, (error, result) => {
            if(error) throw error
            res.json({
                message: result.affectedRows + " Data disimpan"
            })
        })
    }
})

// End-point ubah data users (update)
app.put("/users", upload.single("image"), (req, res) => {
    let data = null, sql = null
    // parameter perubahan data
    let param = {
        id_users: req.body.id_users
    }

    if(!req.file) {
        // jika tidak ad file yang diupload = update data only
        data = {
            nama_users: req.body.nama_users,
            alamat: req.body.alamat,
            username: req.body.username,
            password: md5(req.body.password)
        }
    } else {
        // jika mengirim file = update data + reupload
        data = {
            nama_users: req.body.nama_users,
            alamat: req.body.alamat,
            username: req.body.username,
            password: md5(req.body.password),
            image: req.file.filename
        }

        // get data yang akan diupdate untuk
        // mendapatkan nama file yang lama
        sql = "select * from users where ?"

        // run query
        db.query(sql, param, (error, result) => {
            if(error) throw error
            // tampun nama file yang lama
            let fileName = result[0].image

            // hapus file yang lama
            let dir = path.join(__dirname, "image", fileName)
            fs.unlink(dir, (error) => {})
        })
    }

    // Create sql query update
    sql = "update users set ? where ?"
    
    // run sql update
    db.query(sql, [data, param], (error, result) => {
        if(error) throw error
        res.json({
            message: result.affectedRows + " Data berhasil diubah"
        })
    })
})

// End-point untuk hapus data users berdasarkan "id_users" (delete)
app.delete("/users/:id_users", (req, res) => {
    // tampung data params
    let param = {
        id_users: req.params.id_users
    }

    // ambil data yang akan dihapus
    let sql = "select * from users where ?"

    // run query
    db.query(sql, param, (error, result) => {
        if(error) throw error

        // tampung nama file lama
        let fileName = result[0].image

        // hapus file lama
        let dir = path.join(__dirname, "image", fileName)
        fs.unlink(dir, (error) => {})
    })

    // create sql delete
    sql = "delete from users where ?"

    // run query
    db.query(sql, param, (error, result) => {
        if(error) throw error
        res.json({
            message: result.affectedRows + " Data berhasil dihapus"
        })
    })
})
// ================ Users ================

// ================ Transaksi ================

// ================ Transaksi ================


// Run server
app.listen(8000, () => {
    console.log("Running 8000")
})