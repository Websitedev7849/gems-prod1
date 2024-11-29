require("dotenv").config()
const { sendEmail } = require("./mailHandler")
const fileUpload = require('express-fileupload');

const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const path = require('path');

const fileHandler = require("./utils/fileHandlers")

const express = require('express');
const { writeFile, writeFileSync, readFileSync } = require("fs");

const app = express()

const PORT = process.env.PORT || 5501

app.use( express.static("public") )

app.use(cookieParser()); // Middleware to parse cookies

app.set('view engine', 'ejs')

// Middleware to parse JSON and URL-encoded form data
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

app.use(fileUpload())

app.get("/", function (req, res) {
    const contentJsonString = readFileSync(__dirname + "/content/content.json")
    const contentJson = JSON.parse(contentJsonString)
    res.render("index.ejs", {contentJson: contentJson, emailSuccess: req.query["emailsuccess"]})
})


app.get("/login", (req, res) => {
    res.render("login")
})
app.post("/login", (req, res) => {
    // { username: 'SAM_WINCHESTER', password: '123' }
    if (req.body.username === process.env.ADMIN_USERNAME && req.body.password === process.env.ADMIN_PASSWORD) {
        const token = jwt.sign({ username: req.body.username, password: req.body.password }, process.env.JWT_SECRET_KEY, { expiresIn: '5m' });
        res.cookie('jwt', token, { maxAge: 300000 }); // Expires in 5 min
        res.redirect("/user/cms")
    }
    else {
        res.send("<h1>Invalid Credentials</h1>")
    }
})

app.get("/user/cms", (req, res)=> {
    
    if (req.cookies.jwt && jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY)) {
        res.render("cms_form.ejs")
    } else {
        res.redirect("/login")
    }
    
})


app.post("/user/cms", async (req, res)=> {
    const contentJsonString = readFileSync(__dirname + "/content/content.json")
    const contentJson = JSON.parse(contentJsonString)

    // Save files If any
    if (req.files && Object.keys(req.files).length > 0) {
        
        // The name of the input field (i.e. "myFile") is used to retrieve the uploaded file
        let uploadedFiles = req.files;


        // Define the upload path
        let uploadPath = null

        for (const key of Object.keys(uploadedFiles)) {
            if (key === "logo_square") {
                uploadPath = path.join(__dirname, '/public/img/', "logo-square.png");
                await fileHandler.mvFile(uploadedFiles[key], uploadPath)
            }
            else if (key === "sliderBg") {
                uploadPath = path.join(__dirname, '/public/img/', "slider-bg.png");
                await fileHandler.mvFile(uploadedFiles[key], uploadPath)
            }
            else if (key === "prePrimaryCardImage") {
                await fileHandler.deleteFilesInDirectory(__dirname + "/public/img/activities/prePrimaryActivityImages")

                let prePrimaryCardImageFiles = uploadedFiles[key]
                for (let i = 0; i < prePrimaryCardImageFiles.length; i++) {
                    const file = prePrimaryCardImageFiles[i];
                    uploadPath = path.join(__dirname, '/public/img/activities/prePrimaryActivityImages', `prePrimaryActivityImage${i+1}.png`);
                    await fileHandler.mvFile(file, uploadPath)
                }
            }
            else if (key === "primaryCardImage") {
                await fileHandler.deleteFilesInDirectory(__dirname + "/public/img/activities/primaryActivityImages")

                let primaryCardImageFiles = uploadedFiles[key]
                for (let i = 0; i < primaryCardImageFiles.length; i++) {
                    const file = primaryCardImageFiles[i];
                    uploadPath = path.join(__dirname, '/public/img/activities/primaryActivityImages', `primaryActivityImage${i+1}.png`);
                    await fileHandler.mvFile(file, uploadPath)
                }
            }
            else if (key === "aboutUsImage") {
                uploadPath = path.join(__dirname, '/public/img/', "about-img.jpg");
                await fileHandler.mvFile(uploadedFiles[key], uploadPath)
            }
            else if (key === "philosophyImage") {
                uploadPath = path.join(__dirname, '/public/img/', "inspiration.png");
                await fileHandler.mvFile(uploadedFiles[key], uploadPath)
            }
            else if (key === "testimonialProfilePic") {
                await fileHandler.deleteFilesInDirectory(__dirname + "/public/img/testimonials/")

                let testimonialProfilePic = uploadedFiles[key]
                for (let i = 0; i < testimonialProfilePic.length; i++) {
                    const file = testimonialProfilePic[i];
                    uploadPath = path.join(__dirname, '/public/img/testimonials/', `testimonialProfilePic${i+1}.png`);
                    await fileHandler.mvFile(file, uploadPath)
                }
            }
        }
    }
    
    for (let key of Object.keys(req.body)) {
        if (req.body[key] !== "") {
            contentJson[key] = req.body[key] 
        }
    }

    // write form data to content.json file
    writeFileSync(`${__dirname}/content/content.json`, JSON.stringify(contentJson))
        
    res.send(`<h1>Success: Changes made successfully </h1>`);
    
    
})

app.get("/handle-form", async (req, res) => {

    try {
        // This below function will send an email to Admin
        await sendEmail(req.query)
        res.redirect("/?emailsuccess=true#contact-us")
    } catch (error) {
        res.send(`
            <h1> Error in sending enquiry!!! </h1> <br>
            <a href="/"> Go to Home Page </a>
        `).status(501)
    }
    
    
})

app.listen(PORT, () => {
    console.log(`Server Started at PORT: ${PORT}`);  
})