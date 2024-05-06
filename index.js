const express = require("express")
const app = express();
const server = require("http").createServer(app)
var cors = require('cors');
const mongoose = require("mongoose");

require('./component/setup/mongoose')
require('./component/models/index')

require('dotenv').config()


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})

const port = 3001;

app.use('/user', require('./component/routes/users'))
app.use('/chats', require('./component/routes/chat'))

app.get("/",(req,res)=>{
    res.send("Hello world")
})

process.on('uncaughtException', function (err) {
    console.log('Caught exception: ' + err);
});

server.listen(port, () => {
    console.log("server started at " + port)
})