const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for port 465, false for other ports
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

module.exports.sendEmail = async function (query) {
    return new Promise(async (resolve, reject) => {
        try {
            const info = await transporter.sendMail({
                from: process.env.EMAIL_ID, // sender address
                to: process.env.EMAIL_ID, // list of receivers
                subject: "Copy of query from website", // Subject line
                text: formatMessage(query), // plain text body
            });
            resolve()
        } catch (error) {
            reject(error)
        }
    })
}

function formatMessage(query) {
    const message = `
    First Name: ${query.fname} \n
    Last Name: ${query.lname} \n
    Contact no: ${query.contact} \n
    Email: ${query.email} \n
    Student Name: ${query.studentName} \n
    Grade Level: ${query.gradeLevel} \n
    Remark: ${query.remark} \n
    `;

    return message
}