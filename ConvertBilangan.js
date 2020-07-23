const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(cors())

app.post("/bilangan/:a/:b/:nilai", (req,res) => {
    var a = String(req.params.a)
    var b = String(req.params.b)
    const nilai = String(req.params.nilai)

    let response
    if(a == "biner"){
        if(b == "decimal"){
            response = {
                convert: a + " -> " + b,
                result: parseInt(nilai,2).toString(10)
            }
        } 
        else if(b == "octal"){
            response = {
                convert: a + " -> " + b,
                result: parseInt(nilai,2).toString(8)
            }
        } 
        else if(b == "hexadecimal"){
            response = {
                convert: a + " -> " + b,
                result: parseInt(nilai,2).toString(16)
            }
        }
    } else if(a == "decimal"){
        if(b == "octal"){
            response = {
                convert: a + " -> " + b,
                result: parseInt(nilai,10).toString(8)
            }
        } 
        else if(b == "biner"){
            response = {
                convert: a + " -> " + b,
                result: parseInt(nilai,10).toString(2)
            }
        } 
        else if(b == "hexadecimal"){
            response = {
                convert: a + " -> " + b,
                result: parseInt(nilai,10).toString(16)
            }
        }
    } else if(a == "octal"){
        if(b == "decimal"){
            response = {
                convert: a + " -> " + b,
                result: parseInt(nilai,8).toString(10)
            }
        } 
        else if(b == "biner"){
            response = {
                convert: a + " -> " + b,
                result: parseInt(nilai,8).toString(2)
            }
        } 
        else if(b == "hexadecimal"){
            response = {
                convert: a + " -> " + b,
                result: parseInt(nilai,8).toString(16)
            }
        }
    } else if(a == "hexadecimal"){
        if(b == "decimal"){
            response = {
                convert: a + " -> " + b,
                result: parseInt(nilai,16).toString(10)
            }
        } 
        else if(b == "octal"){
            response = {
                convert: a + " -> " + b,
                result: parseInt(nilai,16).toString(8)
            }
        } 
        else if(b == "biner"){
            response = {
                convert: a + " -> " + b,
                result: parseInt(nilai,16).toString(2)
            }
        }
    }

    res.json(response)
})

app.listen(8000, () => {
    console.log("Running on 8000")
})