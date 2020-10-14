const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(cors())

app.get("/convert/:suhu/:input", (req,res) => {
    const suhu = req.params.suhu
    const input = Number(req.params.input)

    let response
    if (suhu == "celcius") {
        response = {
            celcius: input,
            result: {
                reamur: (4/5) * input,
                fahrenheit: (9/5) * input + 32,
                kelvin: 273 + input
            }
        }
    } else if(suhu == "reamur"){
        response = {
            reamur: input,
            result: {
                celcius: (5/4) * input,
                fahrenheit: (9/4) * input + 32,
                kelvin: (5/4) * input + 273
            }
        }
    } else if(suhu == "kelvin"){
        response = {
            kelvin: input,
            result: {
                celcius: input - 273,
                fahrenheit: input * 1.8 - 459.67,
                reamur: (4/5) * (input - 273)
            }
        }
    } else if(suhu == "fahrenheit"){
        response = {
            fahrenheit: input,
            result: {
                celcius: (5/9) * (input - 32),
                reamur: (4/9) * (input - 32),
                kelvin: (input + 459.67) / 1.8
            }
        }
    }

    res.json(response)
})

app.listen(8000, () => {
    console.log("Server running on port 8000")
})