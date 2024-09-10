require("dotenv").config()
const { sendEmail } = require("./mailHandler")

const express = require('express')


const app = express()

const PORT = process.env.PORT || 5501

app.use( express.static("public") )

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html")
})

app.get("/handle-form", async (req, res) => {

    try {
        // This below function will send an email to Admin
        await sendEmail(req.query)
        res.redirect("/")
    } catch (error) {
        console.log(error);
        res.end("<h1>Error in sending mail</h1>").status(501)
    }
    
    
})

app.listen(PORT, () => {
    console.log(`Server Started PORT: ${PORT}`);  
})