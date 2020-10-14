const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(cors())

app.post("/bmi", (req,res) => {
    const t = Number(req.body.tinggi)
    const b = Number(req.body.berat)

    const bmi = b / Math.pow(t/100,2)
    var status;
    
    if(bmi < 18.5){
        status = "kekurangan Berat Badan"
    } else if(bmi >= 18.5 && bmi <= 24.9){
        status = "Normal (ideal)"
    } else if(bmi >= 25 && bmi <= 29.9){
        status = "Kelebihan Berat Badan"
    } else if(bmi >= 30){
        status = "kegemukan (Obesitas)"
    }

    let response = {
        tinggi: t,
        berat: b,
        result: {
            bmi: bmi,
            status: status
        }
    }

    res.json(response)
})

app.listen(8000, () => {
    console.log("Running 8000")
})