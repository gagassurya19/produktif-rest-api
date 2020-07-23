// Memanggil library
const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const app = express()

// Body-parser untuk extract data request JSON
app.use(bodyParser.json())

// Body-parser untuk extract data request dari body (Biar bisa :url)
app.use(bodyParser.urlencoded({extended: true}))

// Cors -> agar endPoint dapat diakses crossPlatform
app.use(cors())

// EndPoint KUBUS
app.post("/kubus/:hitung", (req,res) => {
    // Menampung data input -> body
    const sisi = Number(req.body.sisi)

    // Mengambil nilai :hitung
    const hitung = req.params.hitung

    // Membuat deklarasi response agar scope-nya global
    let response;

    // Membuat Decision untuk mengatur function yang dijalankan
    if (hitung == "vol") {
        const vol = Math.pow(sisi,3)
        response = {
            code: "vol",
            sisi: sisi,
            volume: vol,
            cara: "V = S x S x S"
        }
    } else if(hitung == "lp"){
        const lp = 6 * (sisi * sisi)
        response = {
            code: "lp",
            sisi: sisi,
            volume: lp,
            cara: "LP = 6 x (S x S)"
        }
    }

    // memberikan response JSON
    res.json(response)
})

// EndPoint Balok
app.post("/balok/:hitung", (req,res) => {
    // Menampung data input body
    const p = Number(req.body.panjang)
    const l = Number(req.body.lebar)
    const t = Number(req.body.tinggi)

    // Mengambil nilai :hitung
    const hitung = req.params.hitung

    // Deklarasi response scope global
    let response;

    // Decision :hitung
    if(hitung == "vol"){
        const vol = p * l * t
        response = {
            code: "vol",
            panjang: p,
            lebar: l,
            tinggi: t,
            volume: vol,
            cara: "V = p x l x t"
        }
    } else if(hitung == "lp"){
        const lp = 2 * ((p * l) + (l * t) + (p * t))
        response = {
            code: "lp",
            panjang: p,
            lebar: l,
            tinggi: t,
            luasPermukaan: lp,
            cara: "L = 2 x ( pl + lt + pt)"
        }
    }

    // Memberikan response JSON
    res.json(response)

})

// EndPoint Prisma Segitiga
app.post("/bola/:hitung", (req,res) => {
    // Menampung variable yang diinput
    const r = Number(req.body.r)

    // menampung nilai :hitung
    const hitung = req.params.hitung

    // deklarasi variable global
    let response

    // Decision dari nilai hitung
    if(hitung == "vol"){
        const vol = 4/3 * Math.PI * Math.pow(r,3)
        response = {
            code: "vol",
            r: r,
            vol: vol,
            cara: "V = 4/3 x π x r3"
        }
    } else if(hitung == "lp"){
        const lp = 4 * Math.PI * Math.pow(r,2)
        response = {
            code: "lp",
            r: r,
            luasPermukaan: lp,
            cara: "L = 4 x π x r2"
        }
    }

    // Memberi response JSON
    res.json(response)
})

// EndPoint Kerucut
app.post("/kerucut/:hitung", (req,res) => {
    // menampung input data
    const r = Number(req.body.r)
    const t = Number(req.body.tinggi)

    // Menampung data :hitung
    const hitung = req.params.hitung

    // deklarasi var scope global
    let response

    if(hitung == "vol"){
        const vol = 1/3 * Math.PI * Math.pow(r,2) * t
        response = {
            code: "vol",
            r: r,
            tinggi: t,
            vol: vol,
            cara: "V = 1/3 x π x r2 x t"
        }
    } else if(hitung == "lp"){
        const lp = (Math.PI * Math.pow(r,2)) + (Math.PI * r * Math.sqrt(Math.pow(r,2) + Math.pow(t,2)))
        response = {
            code: "lp",
            r: r,
            tinggi: t,
            lp: lp,
            cara: "L = ( π x r2 ) + ( π x r x s)"
        }
    }

    // Memberi response JSON
    res.json(response)
})

// Run Server
app.listen(8000, () => {
    console.log("Server running on port 8000")
})