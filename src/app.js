let express = require("express");
let app = express();
let mongoose = require("mongoose");

app.use(express.urlencoded({extended: false}));
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/guiapics").then(() => {
    // console.log("Conectado com sucesso!")
}).catch((error) => {
    console.log("Errosss: " + error)
});

app.get("/", (req, res) => {
    res.json({});
});

module.exports = app;