// import library
const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const mysql = require("mysql")
const moment = require("moment")
const md5 = require("md5")
const cryptr = require("cryptr")
const crypt = new cryptr("19042002")

// call library
const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

// mysql connection
var db = mysql.createConnection({
    host: "localhost",
    // port: 8888,
    user: "root",
    password: "",
    database: "rent_car"
})

// check connection
db.connect(err => {
    if(err) throw console.log(error.message)
    console.log("Mysql Connected")
})

// run server
app.listen(8000, () => {
    console.log("running on port 8000")
});

// Utility
// Function Error, Result
let response = null
errFun = (error, result) => {
  if(!result){
    if(error) throw response = {message: error.message}
  } else {
    if(error) throw response = {message: error.message}
    response = {count: result.length, data: result}
  }
}

// ====================== TOKEN ======================
// End-point validasi token (authorization)
Token = () => {
    return (req, res, next) => {
        // Check "TOKEN" pada req header
        if(!req.get("Token")){
            // Jika token tidak ada
            res.json({
                message: "Access Forbidden"
            })
        } else {
            // Tampung input token from header
            let token = req.get("Token")

            // Decrypt token menjadi id_user
            let decryptToken = crypt.decrypt(token)

            // sql query cek id_karyawan
            let sql = "select * from karyawan where ?"

            // set parameter 
            let param = {
                id_karyawan: decryptToken
            }

            // run query
            db.query(sql, param, (error, result) => {
                if(error) throw error
                // check kebenaran id_karyawan
                if(result.length > 0){
                    // id_karyawan tersedia
                    next()
                } else {
                    // jika id_karyawan tidak tersedia
                    res.json({
                        message: "Invalid Token"
                    })
                }
            })
        }
    }
}

// End-point login karyawan (authentication/pengenalan)
app.post("/karyawan/auth", (req, res) => {
    // Tampung username dan password dari body
    let param = [
        req.body.username,
        md5(req.body.password)
    ]

    // create sql query
    let sql = "select * from karyawan where username = ? and password = ?"

    // run query
    db.query(sql, param, (error, result) => {
        if(error) throw error

        // check jumlah data hasil query
        if(result.length > 0) {
            // user tersedia
            res.json({
                message: "Logged",
                token: crypt.encrypt(result[0].id_karyawan),
                data: result
            })
        } else {
            // user tidak tersedia
            res.json({
                message: "Invalid username/password"
            })
        }
    })
})
// ====================== TOKEN ======================

// ====================== MOBIL ======================
// End-Point akses data mobil
app.get("/mobil", Token(), (req,res) => {
    // Create sql query
    let sql = "select * from mobil"

    // run query
    db.query(sql, (error, result) => {
        errFun(error,result)
        res.json(response)
    })
})

// end-point akses data mobil berdasarkan id_mobil tertentu
app.get("/mobil/:id", Token(), (req,res) => {
    let data = {
        id_mobil: req.params.id
    }

    // Create sql query
    let sql = "select * from mobil where ?"

    // run query
    db.query(sql, data, (error, result) => {
        errFun(error, result)
        res.json(response) // send response
    })
})

// end-point menyimpan data mobil
app.post("/mobil", Token(), (req,res) => {
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
        errFun(error)
        response = {
          message: result.affectedRows + " data inserted"
        }
        res.json(response) // send response
    })
})

// end-point mengubah data mobil
app.put("/mobil", Token(), (req,res) => {
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
        errFun(error)
        response = {
          message: result.affectedRows + " Data Updated"
        }
        res.json(response)
    })
})

// End-point menghapus data mobil berdasarkan id_mobil
app.delete("/mobil/:id", Token(), (req,res) => {
    // prepare data
    let data = {
        id_mobil: req.params.id
    }

    // create query sql delete
    let sql = "delete from mobil where ?"

    // run query
    connection.query(sql, data, (error,result) => {
        errFun(error)
        response = {
          message: result.affectedRows + " Data deleted"
        }
        res.json(response)
    })
})
// ====================== MOBIL ======================

// ====================== Pelanggan ======================
// End-Point akses data pelanggan
app.get("/pelanggan", Token(), (req,res) => {
    // Create sql query
    let sql = "select * from pelanggan"

    // run query
    db.query(sql, (error, result) => {
        errFun(error,result)
        res.json(response)
    })
})

// end-point akses data pelanggan berdasarkan id_pelanggan tertentu
app.get("/pelanggan/:id", Token(), (req,res) => {
    let data = {
        id_pelanggan: req.params.id
    }

    // Create sql query
    let sql = "select * from pelanggan where ?"

    // run query
    db.query(sql, data, (error, result) => {
        let response = null
        errFun(error,result)
        res.json(response) // send response
    })
})

// end-point menyimpan data pelanggan
app.post("/pelanggan", Token(), (req,res) => {
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
        errFun(error)
        response = {
          message: result.affectedRows + " Data Inserted"
        }
        res.json(response) // send response
    })
})

// end-point mengubah data pelanggan
app.put("/pelanggan", Token(), (req,res) => {
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
        errFun(error)
        response = {
          message: result.affectedRows + " Data updated"
        }
        res.json(response)
    })
})

// End-point menghapus data pelanggan berdasarkan id_pelanggan
app.delete("/pelanggan/:id", Token(), (req,res) => {
    // prepare data
    let data = {
        id_pelanggan: req.params.id
    }

    // create query sql delete
    let sql = "delete from pelanggan where ?"

    // run query
    db.query(sql, data, (error,result) => {
        errFun(error)
        response = {
          message: result.affectedRows + " Data deleted"
        }
        res.json(response)
    })
})
// ====================== Pelanggan ======================

// ====================== Karyawan ======================
// End-Point akses data karyawan
app.get("/karyawan", Token(), (req,res) => {
    // Create sql query
    let sql = "select * from karyawan"

    // run query
    db.query(sql, (error, result) => {
        errFun(error, result)
        res.json(response)
    })
})

// end-point akses data karyawan berdasarkan id_karyawan tertentu
app.get("/karyawan/:id", Token(), (req,res) => {
    let data = {
        id_karyawan: req.params.id
    }

    // Create sql query
    let sql = "select * from karyawan where ?"

    // run query
    db.query(sql, data, (error, result) => {
        errFun(error,result)
        res.json(response) // send response
    })
})

// end-point menyimpan data karyawan
app.post("/karyawan", Token(), (req,res) => {
    // prepare data
    let data = {
        nama_karyawan: req.body.nama_karyawan,
        alamat_karyawan: req.body.alamat_karyawan,
        kontak: req.body.kontak,
        username: req.body.username,
        password: md5(req.body.password) // hash password ke md5
    }

    // Create sql query insert
    let sql = "insert into karyawan set ?"

    // Run query
    db.query(sql, data, (error,result) => {
        errFun(error)
          response = {
              message: result.affectedRows + " data inserted"
          }
        res.json(response) // send response
    })
})

// end-point mengubah data karyawan
app.put("/karyawan", Token(), (req,res) => {
    // prepare data
    let data = [
        {
            nama_karyawan: req.body.nama_karyawan,
            alamat_karyawan: req.body.alamat_karyawan,
            kontak: req.body.kontak,
            username: req.body.username,
            password: md5(req.body.password) // hash password ke md5
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
        errFun(error)
          response = {
              message: result.affectedRows + " data updated"
          }
        res.json(response)
    })
})

// End-point menghapus data karyawan berdasarkan id_karyawan
app.delete("/karyawan/:id", Token(), (req,res) => {
    // prepare data
    let data = {
        id_karyawan: req.params.id
    }

    // create query sql delete
    let sql = "delete from karyawan where ?"

    // run query
    db.query(sql, data, (error,result) => {
        errFun(error)
          response = {
              message: result.affectedRows + " data deleted"
          }
        res.json(response)
    })
})
// ====================== Karyawan ======================

// ====================== SEWA ======================
// End-point menampilkan data SEWA
app.get("/sewa", Token(), (req,res) => {
    // Create sql query
    let sql = "select * from sewa"
    
    // Run query
    db.query(sql, (error,result) => {
        errFun(error,result)
        res.json(response)
    })
})

// End-point menghapus data sewa berdasarkan id_sewa
app.delete("/sewa/:id", Token(), (req,res) => {
    // Tampung data input dari body
    let data = {id_sewa: req.params.id}

    // Create sql query delete
    let sql = "delete from sewa where ?"

    // Run query
    db.query(sql, data, (error,result) => {
      errFun(error)
          response = {
              message: result.affectedRows + " Data deleted"
          }
      res.json(response)
    })
})

// End-point input sewa
app.post("/sewa", Token(), (req, res) => {
  // input data hari (tahun, bulan, hari) with momentJS
  const sewa = moment(req.body.tgl_sewa) 
  const balik = moment(req.body.tgl_kembali)
  const hari = balik.diff(sewa, 'days')

  // tampung id_mobil
  let datam = {
    id_mobil: req.body.id_mobil
  }

  // query biaya sewa
  let sqlm = "select biaya_sewa_per_hari from mobil where ?"

  // run query
  db.query(sqlm, datam, (error, result) => {

    let total
    if(hari != 0) {
      total =  result[0].biaya_sewa_per_hari * hari
    } else {
      total =  result[0].biaya_sewa_per_hari
    }
    
    let data = {
      id_mobil: req.body.id_mobil,
      id_karyawan: req.body.id_karyawan,
      id_pelanggan: req.body.id_pelanggan,
      tgl_sewa: req.body.tgl_sewa,
      tgl_kembali: req.body.tgl_kembali,
      total_bayar: total
    }

    let sql = "insert into sewa set ?"

    db.query(sql, data, (error, result) => {
      errFun(error)
      response = {
        message: result.affectedRows + " Data inserted"
      }
      res.json(response)
    })
  })
})
// ====================== SEWA ======================

// ====================== DETAIL SEWA ======================
// End-point detail sewa
app.get("/detail_sewa", Token(), (req,res) => {
  // sql query
  let sql = "SELECT s.id_sewa, s.tgl_sewa, s.tgl_kembali, s.total_bayar, " +
  "m.id_mobil, m.nomor_mobil,m.merk, p.id_pelanggan, p.nama_pelanggan, " +
  "k.id_karyawan, k.nama_karyawan " + 
  "FROM sewa s JOIN mobil m ON s.id_mobil = m.id_mobil " +
  "JOIN pelanggan p ON s.id_pelanggan = p.id_pelanggan " + 
  "JOIN karyawan k ON s.id_karyawan = k.id_karyawan"

  // run query
  db.query(sql, (error,result) => {
    errFun(error,result)
    res.json(response)
  })
})

// End-point detail dengan id_sewa
app.get("/detail_sewa/:id", Token(), (req,res) => {
  // sql query
  let sql = "SELECT s.id_sewa, s.tgl_sewa, s.tgl_kembali, s.total_bayar, " +
  "m.id_mobil, m.nomor_mobil, m.merk, p.id_pelanggan, p.nama_pelanggan, " +
  "k.id_karyawan, k.nama_karyawan " + 
  "FROM sewa s JOIN mobil m ON s.id_mobil = m.id_mobil " +
  "JOIN pelanggan p ON s.id_pelanggan = p.id_pelanggan " + 
  "JOIN karyawan k ON s.id_karyawan = k.id_karyawan " +
  "WHERE id_sewa = ?"

  // tampung id_sewa
  let id = req.params.id

  // run query
  db.query(sql, id, (error,result) => {
    errFun(error,result)
    res.json(response)
  })
})
// ====================== DETAIL SEWA ======================

