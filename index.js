const http = require("http")
const fs = require("fs")

const server = http.createServer( handleServer )


// http://localhost:5501/
const hostname = "localhost";
const PORT = 5501;

server.listen(PORT, hostname)

function handleServer(req, res) {
    const html = fs.readFileSync("./index.html").toString("utf-8")

    res.setHeader("content-type", "text/html")
    

    
    
    res.write(html)
    res.end()
}








