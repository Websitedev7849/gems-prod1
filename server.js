require("dotenv").config()
const { sendEmail } = require("./mailHandler")
const fileUpload = require('express-fileupload');
const path = require('path');

const express = require('express')

const app = express()

const PORT = process.env.PORT || 5501

app.use( express.static("public") )
app.set('view engine', 'ejs')

// Middleware to parse JSON and URL-encoded form data
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

app.use(fileUpload())

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html")
})

app.get("/user/cms", (req, res)=> {
    res.render("cms_form.ejs")
})


app.post("/user/cms", (req, res)=> {
    
    
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    // The name of the input field (i.e. "myFile") is used to retrieve the uploaded file
    let uploadedFile = req.files.logo_square;

    // Define the upload path
    const uploadPath = path.join(__dirname, '/public/img/', "logo-square.png");

    // Use the mv() method to place the file somewhere on your server
    uploadedFile.mv(uploadPath, function(err) {
        if (err) {
            return res.status(500).send(err);
        }
        console.log(req.body);
        
        res.send(`File uploaded to ${uploadPath}`);
        // res.redirect("/user/cms")
    });
    
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
    console.log(`Server Started at PORT: ${PORT}`);  
})