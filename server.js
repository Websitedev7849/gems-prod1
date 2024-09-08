const express = require('express')

const app = express()

const PORT = 5501

app.use( express.static("public") )

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html")
})

app.get("/handle-form", (req, res) => {
    console.log(req.query)
    res.redirect("/")
    
})

app.listen(PORT, () => {
    console.log(__dirname);  
})