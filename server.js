const express = require('express')

const app = express()

const PORT = 5501

app.use( express.static("public") )

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html")
})

app.listen(PORT, () => {
    console.log(__dirname);  
})