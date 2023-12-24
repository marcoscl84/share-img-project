let express = require("express");
let app = express();
let mongoose = require("mongoose");
let user = require("./models/user")

app.use(express.urlencoded({extended: false}));
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/guiapics").then(() => {
    // console.log("Conectado com sucesso!")
}).catch((error) => {
    console.log("Errosss: " + error)
});

let User = mongoose.model("User", user);

app.get("/", (req, res) => {
    res.json({});
});

app.post("/user", async (req, res) => {

    if(req.body.name == "" || req.body.email == "" || req.body.password == ""){
        res.sendStatus(400);
        return;
    }

    try {
        let user = await User.findOne({"email": req.body.email});
        if(user != undefined){
            res.statusCode(400);
            res.json({error: "E-mail já cadastrado"});
            
            return;
        }

        let newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        });
    
        await newUser.save();
        res.json({email: req.body.email});

    } catch (error) {
        res.sendStatus(500);
    }

});

module.exports = app;