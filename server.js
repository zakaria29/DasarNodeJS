const express = require("express") // npm install express
const jwt = require("jsonwebtoken") // npm install jsonwebtoken
const app = express()

middleware = (req,res,next) => {
    console.log(`Hai, i'm middleware`);
    next()
}

// proses authorization
verifyToken = (req, res, next) => {
    let headers = req.headers.authorization
    // Bearer [kode token]
    let token = null
    if (headers != null) {
        token = headers.split(" ")[1] // [kode token]
        // split digunakan utk mengubah string jadi array
    }

    if (token == null) {
        res.json({
            message: "Unauthorized"
        })
    } else {
        let headerJWT = {
            algorithm: "HS256"
        }
        let verifySignature = "MokletJoss"

        jwt.verify(token,verifySignature,headerJWT, (error) => {
            if(error){
                res.json({
                    message: "Invalid or Expired Token "
                })
            }else{
                next()
            }
        })
    }
}
app.use(express.urlencoded({extended: true}))
// membaca data yg dikirimkan melalui x-www-form-urlencoded
app.use(express.json())
// membaca data yg dikirimkan dg format json

app.use(middleware)
// app.get("endpoint","middleware","logic")
app.get("/moklet", verifyToken, (req, res) => {
    // logic process
    res.json({
        message: "Hai Mokleters"
    })
})

app.get("/test", verifyToken, (req,res) => {
    // logic process
    res.json({
        message: "Hai I'm test of request"
    })
})

app.get("/hello", (req,res) => {
    // logic process
    res.json({
        message: "Hello I'm hello request"
    })
})

app.post("/send", (req, res) => {
    res.json({
        name: req.body.name,
        city: req.body.city
    })
})

// proses authentication
app.post("/auth", (req, res) => {
    let username = req.body.username
    let password = req.body.password

    if (username == "moklet" && password == "123") {
        // login berhasil
        // proses generate token using jwt
        let headerJWT = {
            algorithm : "HS256",
            expiresIn : "2m" 
        }
        let payload = {
            name : "John Cena",
            address: "Berlin",
            age: 90
        }
        let verifySignature = "MokletJoss" // secret key
        let token = jwt.sign(payload, verifySignature, headerJWT) //generate

        res.json({
            data: payload,
            token: token
        })
    } else {
        // login gagal
        res.json({
            message: "Invalid username or password"
        })
    }
})

app.listen(8000, () => {
    console.log(`Server run on port 8000`);
})