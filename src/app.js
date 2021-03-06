require('dotenv').config()
const express = require('express')
const path = require("path")
const app = express();
const hbs = require('hbs')
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");
require('./db/conn')
const Register = require('./models/registers');

const port = process.env.PORT || 3000;
const static_path = path.join(__dirname, "../public")
const template_path = path.join(__dirname, "../templates/views")
const partials_path = path.join(__dirname, "../templates/partials")

app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(express.static(static_path))
app.set("view engine", "hbs")
app.set("views", template_path)
hbs.registerPartials(partials_path)

console.log(process.env.SECRET_KEY)
app.get("/", (req, res)=>{
    res.render("index")
})
app.get("/register",(req, res)=>{
    res.render("registration")
})
app.get("/login",(req, res)=>{
    res.render("login")
})

app.post("/register", async (req, res)=>{
    try {
       const password = req.body.password;
       const cpassword = req.body.confirmpassword;
       console.log(password, cpassword)
       if(password === cpassword){
        const registerEmployee = new Register({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            gender: req.body.gender,
            phone: req.body.phone,
            age: req.body.age,
            password: req.body.password,
            confirmpassword: req.body.confirmpassword

        })
        console.log("the success part"+ registerEmployee)
        const token = await registerEmployee.generateAuthToken();
        console.log("the token part"+ token)
        const registered = await registerEmployee.save();
        console.log("the page part"+ registered)
        res.status(201).render("index")
       }else {
        res.send("Password do not match")
       }

    }catch(e){
        res.status(400).send(e)
        console.log("the error part page")
    }
})

app.post("/login", async(req, res)=>{
    try {
        const email = req.body.email;
        const password = req.body.password;
        
        const useremail = await Register.findOne({email:email});
         console.log(useremail.password, password)
         const isMatch = bcrypt.compare(password, useremail.password)

         const token = await useremail.generateAuthToken();
         console.log("The token part" + token)
        if(isMatch){
            res.status(201).render("index")
        } else {
            res.send("Invalid Credentials")
        }
    
    }catch(e){
        res.status(400).send("Invalid about Credentials")
    }
})


// const jwt = require("jsonwebtoken");

// const createToken = async ()=> {
//     const token = await jwt.sign({_id:"62ca3fd3ada33f4ff63ee585"}, "mynameissohaibabdullahstudentofwebdevelopment",{
//         expiresIn: "2 seconds"
//     })
//     console.log(token)

//     const userVer = await jwt.verify(token, "mynameissohaibabdullahstudentofwebdevelopment");
//     console.log(userVer)
// }

// createToken();

// const bcrypt = require("bcryptjs");
// const securePassword = async (password)=>{
//     const passwordHash = await bcrypt.hash(password, 10);
//     console.log(passwordHash);

//     const passwordmatch = await bcrypt.compare("thapa@123", passwordHash);
//     console.log(passwordHash);
// }

// securePassword("thapa@123")

app.listen(port, ()=>{
    console.log(`server is listening at port ${port}`)
})
