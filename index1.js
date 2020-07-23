// memanggil library
const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const app = express();

// Memanggil function pada library
// penggunaan body-parser untuk extract data request berformat JSON
app.use(bodyParser.json())

// Penggunaan body-parser untuk extract data request dari body
app.use(bodyParser.urlencoded({extended: true}))

// Penggunaan cors agar end point dapat diakses oleh cross platform
app.use(cors())


// EndPoint "/test" dengan method GET
app.get("/test", (req,res) => {
    // req -> Merupakan variable yang berisi data request
    // res -> Merupakan variable yang berisi data response dari end-point

    // Membuat object yang berisi data yang akan dijadikan response
    let response = {
        message: "Ini end-point pertama ku",
        method: req.method,
        code: res.statusCode
    }

    // Memberikan response dengan format JSON yang berisi object diatas
    res.json(response)
})

// End-point "/profile/nama/umur" dengan method GET
app.get("/profile/:name/:age", (req,res) => {
    // :name dan :age -> diberi : menunjukan bersifat dinamis (diganti saat melakukan request)

    // Menampung data yang dikirimkan
    let name = req.params.name // mengambil nilai dari parameter "name"
    let age = req.params.age // mengambil nilai dari parameter "age"

    // Membuat objek yang berisi data yang akan dijadikan response
    // Response berisi data nama dan umur sesuai dengan nilai parameter
    let response = {
        nama: name,
        umur: age
    }

    // Memberikan response dengan format JSON yang berisi objek diatas
    res.json(response)
})

// End-point "/bujur_sangkar" dengan method POST
app.post("/bujur_sangkar", (req,res) => {
    // Menampung data yang diberikan dan mengkonversi menjadi tipe numerik
    let panjang = Number(req.body.panjang) // Mengambil nilai panjang body
    let lebar = Number(req.body.lebar) // mengambil nilai lebar body

    let luas = panjang * lebar
    let keliling = 2 * (panjang + lebar)

    // Membuat objek yang berisi data yang akan dijadikan response
    let response = {
        panjang: panjang,
        lebar: lebar,
        luas: luas,
        keliling: keliling
    }

    // Memberikan response dengan format JSON yang berisi Object diatas
    res.json(response)
})

// Fungsi untuk menjalankan server pada port tertentu
// RUN server pada port 8000
app.listen(8000, () => {
    console.log("Server run on port 8000")
})