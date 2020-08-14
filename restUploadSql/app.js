const express = require("express")
const multer = require("multer") // untuk upload file
const path = require("path") // untuk memanggil path direktori
const fs = require("fs") // untuk manajemen file
const cors = require("cors")
const mysql = require("mysql")
const moment = require("moment")

// hash cryptr
const md5 = require("md5")
const cryptr = require("cryptr")
const crypt = new cryptr("19042002")

// panggil library
const app = express()
app.use(express.static(__dirname))
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors())

// variable konfigurasi koneksi database
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "olshop"
})

// Check connection
db.connect(err => {
    if(err) throw console.log(err.message)
    console.log("Mysql Connected")
})

// Run server
app.listen(8000, () => {
    console.log("Running on 8000")
})

// Utility
// Error Function
let response
errFun = (error, result) => {
    if(!result){
        if(error) throw response = {message: error.message}
    } else {
        if(error) throw response = {message: error.message}
        response = {count: result.length, data: result}
    }
}

// TOKEN
Token = () => {
    return (req, res, next) => {
        // check token di request header
        if(!req.get("Token")) {
            res.json({
                message: "Access Forbidden"
            })
        } else {
            let token = req.get("Token") // tampung inputan token
            let decToken = crypt.decrypt(token) // convert md5 ke text id_admin
            let sql = "select * from admin where id_admin = ?"
            let param = [decToken]
            // run query
            db.query(sql, param, (error, result) => {
                if(error) throw error
                if(result.length > 0){
                    next() // FUNGSI INI BUAT APA PAK ?
                } else {
                    rsult.json({
                        message: "Invalid Token"
                    })
                }
            })
        }
    }
} 

// End-point authentication
app.post("/admin/auth", (req, res) => {
    let param = [
        req.body.username,
        md5(req.body.password)
    ]

    let sql = "SELECT * from admin where username = ? and password = ?"

    // run query
    db.query(sql, param, (error, result) => {
        if(error) throw error.message
        if(result.length > 0){
            // jika user ada
            res.json({
                message: "Logged",
                token: crypt.encrypt(result[0].id_admin), // convert id_admin to md5
                data: result
            })
        } else {
            // jika user ga ada
            res.json({
                message: "Invalid username/password"
            })
        }
    })
})

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

// ================ Barang ================
// End-point menambah data barang (insert)
app.post("/barang", Token(), upload.single("image"), (req,res) => {
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
            errFun(error)
            response = {
                message: result.affectedRows + " Data berhasi disimpan"
            }
            res.json(response)
        })
    }
})

// End-point mengubah data barang (update)
app.put("/barang", Token(), upload.single("image"), (req, res) => {
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
        errFun(error,result)
        response = {
            message: result.affectedRows + " Data berhasil diubah"
        }
        res.json(response)
    })
})

// End-point untuk menghapus data barang berdasarkan "kode_barang" (delete)
app.delete("/barang/:kode_barang", Token(), (req, res) => {
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
        errFun(error,result)
        response = {
            message: result.affectedRows + " Data berhasil dihapus"
        }
        res.json(response)
    })
}) 

// End-point tampilkan data barang
app.get("/barang", Token(), (req, res) => {
    // create sql query
    let sql = "select * from barang"

    // run query
    db.query(sql, (error, result) => {
        errFun(error, result)
        res.json(response)
    })
})
// ================ Barang ================

// ================ Admin ================
// End-point tampilkan data admin (select)
app.get("/admin", Token(), (req, res) => {
    // Create sql query
    let sql = "select * from admin"

    // run query
    db.query(sql, (error, result) => {
        errFun(error,result)
        res.json(response)
    })
})

// End-point tambah data admin (insert)
app.post("/admin", Token(), (req, res) => {
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
        errFun(error,result)
        response = {
            message: result.affectedRows + " Data tersimpan"
        }
        res.json(response)
    })
})

// End-point edit data admin (update)
app.put("/admin", Token(), (req, res) => {
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
        errFun(error,result)
        response = {
            message: result.affectedRows + " Data update"
        }
        res.json(response)
    })
})

// End-point hapus data admin (delete)
app.delete("/admin/:id_admin", Token(), (req, res) => {
    // tampung data params
    let data = {
        id_admin: req.params.id_admin
    }

    // create query
    let sql = "delete from admin where ?"

    // run query
    db.query(sql, data, (error, result) => {
        errFun(error)
        response = {
            message: result.affectedRows + " Data terhapus"
        }
        res.json(response)
    })
})
// ================ Admin ================

// ================ Users ================
// End-point tampilkan data users (select)
app.get("/users", Token(), (req, res) => {
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
app.post("/users", Token(), upload.single("image"), (req, res) => {
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
            errFun(error)
            response = {
                message: result.affectedRows + " Data disimpan"
            }
            res.json(response)
        })
    }
})

// End-point ubah data users (update)
app.put("/users", Token(), upload.single("image"), (req, res) => {
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
        errFun(error)
        response = {
            message: result.affectedRows + " Data berhasil diubah"
        }
        res.json(response)
    })
})

// End-point untuk hapus data users berdasarkan "id_users" (delete)
app.delete("/users/:id_users", Token(), (req, res) => {
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
        errFun(error)
        response = {
            message: result.affectedRows + " Data berhasil dihapus"
        }
        res.json(response)
    })
})
// ================ Users ================

// ================ Transaksi ================
// End-point tampilkan data Transaksi
app.get("/transaksi", Token(), (req, res) => {
    // query select
    let sql = "select * from transaksi"

    // run query
    db.query(sql, (error, result) => {
        errFun(error,result)
        res.json(response)
    })
})

// End-poin tambah data transaksi
app.post("/transaksi", Token(), (req,res) => {
    let data1 = {
        id_user: req.body.id_user, // input
        tgl_transaksi: moment().format('YYYY-MM-DD HH:mm:ss')
    }

    let sql1 = "insert into transaksi set ?"

    db.query(sql1, data1, (error,result) => {
        let data2 = {
            id_user: req.body.id_user
        }

        let sql2 = "select * from transaksi where ?"

        db.query(sql2, data2, (error, result) => {
            // tampung input
            let kode_transaksi = result[0].kode_transaksi

            let data3 = {
                kode_barang: req.body.kode_barang // input
            }

            let sql3 = "select * from barang where ?"

            db.query(sql3, data3, (error, result) => {
                let harga = result[0].harga
                let jumlah = req.body.jumlah
                let total = harga * jumlah

                let data4 = {
                    kode_transaksi: kode_transaksi,
                    kode_barang: result[0].kode_barang,
                    jumlah: jumlah, // input
                    harga_beli: total
                }

                let sql4 = "insert into detail_transaksi set ?"

                db.query(sql4, data4,(error, result) => {
                    errFun(error)
                    res.json({message: result.affectedRows + " Data inserted"})
                })
            })
        })
    })
})

// End-point tampilin detail transaksi
app.get("/detail_transaksi", Token(), (req,res) => {
    // sql query
    let sql = "SELECT t.kode_transaksi, t.id_user, t.tgl_transaksi, " + 
    "d.kode_barang, b.nama_barang, d.jumlah, d.harga_beli " + 
    "FROM transaksi t JOIN detail_transaksi d ON t.kode_transaksi = d.kode_transaksi " + 
    "JOIN barang b ON d.kode_barang = b.kode_barang "

    db.query(sql, (error, result) => {
        errFun(error,result)
        res.json(response)
    })
})

// End-point tampilin detail transaksi berdasar id_user
app.get("/detail_transaksi/:id", Token(), (req,res) => {
    let id = req.params.id
    // sql query
    let sql = "SELECT t.kode_transaksi, t.id_user, t.tgl_transaksi, " + 
    "d.kode_barang, b.nama_barang, d.jumlah, d.harga_beli " + 
    "FROM transaksi t JOIN detail_transaksi d ON t.kode_transaksi = d.kode_transaksi " + 
    "JOIN barang b ON d.kode_barang = b.kode_barang " +
    "WHERE id_user = ?"

    db.query(sql, id, (error, result) => {
        errFun(error,result)
        res.json(response)
    })
})
// ================ Transaksi ================