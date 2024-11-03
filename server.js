require("dotenv").config()
const { sendEmail } = require("./mailHandler")
const fileUpload = require('express-fileupload');
const path = require('path');

const express = require('express');
const { writeFile, writeFileSync } = require("fs");

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


app.post("/user/cms", async (req, res)=> {
    
    // wrapper function to create a promise
    const mvFile = (file, path) => {
        return new Promise((resolve, reject) => {
          file.mv(path, (err) => {
            if (err) {
              return reject(err);
            }
            resolve();
          });
        });
    };
      
    
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    // The name of the input field (i.e. "myFile") is used to retrieve the uploaded file
    let uploadedFiles = req.files;

    console.log(req.files);
    // res.send(req.body)

    // Define the upload path
    let uploadPath = null

    for (const key of Object.keys(uploadedFiles)) {
        if (key === "logo_square") {
            uploadPath = path.join(__dirname, '/public/img/', "logo-square.png");
            await mvFile(uploadedFiles[key], uploadPath)
        }
        else if (key === "prePrimaryCardImage") {
            let prePrimaryCardImageFiles = uploadedFiles[key]
            for (let i = 0; i < prePrimaryCardImageFiles.length; i++) {
                const file = prePrimaryCardImageFiles[i];
                uploadPath = path.join(__dirname, '/public/img/activities/', `prePrimaryActivityImage${i+1}.png`);
                await mvFile(file, uploadPath)
            }
        }
        else if (key === "primaryCardImage") {
            let primaryCardImageFiles = uploadedFiles[key]
            for (let i = 0; i < primaryCardImageFiles.length; i++) {
                const file = primaryCardImageFiles[i];
                uploadPath = path.join(__dirname, '/public/img/activities/', `primaryActivityImage${i+1}.png`);
                await mvFile(file, uploadPath)
            }
        }
    }

    // write form data to content.json file
    writeFileSync(`${__dirname}/content/content.json`, JSON.stringify(req.body))
        
    res.send(`<h1>Success: Changes made successfully </h1>`);
    
    
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