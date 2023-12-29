let express = require("express");
let app = express();
let mongoose = require("mongoose");
let user = require("./models/user");
let bcrypt = require("bcrypt");
let jwt = require("jsonwebtoken");
let jwtSecret = "umsegredoqualquerparagerarotaldotoken"

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

        let password = req.body.password;
        let salt = await bcrypt.genSalt(10);
        let hash = await bcrypt.hash(password, salt);

        let newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: hash
        });
    
        await newUser.save();
        res.json({email: req.body.email});

    } catch (error) {
        res.sendStatus(500);
    }

});

app.post("/auth", async (req, res) => {
    let {email, password} = req.body;

    let user = await User.findOne({email: email});

    if(user == undefined){
        res.statusCode = 403;
        res.json({errors: {email: "E-mail não cadastrado"}});
        return;
    }

    let isPasswordOk = await bcrypt.compare(password, user.password);

    if(!isPasswordOk){
        res.statusCode = 403;
        res.json({errors: {password: "Senha incorreta..."}});
        return;
    }

    jwt.sign({email, name: user.name, id: user._id}, jwtSecret, {expiresIn: '48h'}, (error, token) => {
        if(error){
            res.sendStatus(500);
            console.log(error);
        } else {
            res.json({ token })
        }
    })
})

// Rota de exclusão de user apenas para uso em teste
app.delete("/user", async (req, res) => {
    await User.deleteOne({email: req.params.email});
    res.statusCode(200);
});

module.exports = app;