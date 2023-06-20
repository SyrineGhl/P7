const http = require("http");
const dotenv = require("dotenv");
dotenv.config({path: ".env"});
const otherPort = process.env.PORT;
const server = http.createServer ((req,res) => {
    res.end("coucou cest moi");
});

server.listen(otherPort || 3000);