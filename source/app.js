const express = require("express");
const app = express();
const port = process.env.PORT || 4000;
require("./db/db")
const path = require("path");
const hbs = require("hbs");

// DATAStore
const Register = require("./datastore/DATAStore");
const { log } = require("console");
const { register } = require("module");

// for get data start
app.use(express.json());
app.use(express.urlencoded({ extended: false }))
// for get data end

// *************************************************************************

// run static file start
// const static_path = path.join(__dirname, "../public");
// app.use(express.static(static_path));
// run static file and

// *************************************************************************

// hbs fileon server start
const views_path = path.join(__dirname, "./templete/views");
const partials_path = path.join(__dirname, "./templete/partials");

app.set("view engine", "hbs");
app.set("views", views_path);

// run partial file
hbs.registerPartials(partials_path);

// hbs fileon server end

// *************************************************************************

app.get('/', (req, res) => {
    res.render("index");
})

app.get('/index', (req, res) => {
    res.render("index");
})

app.get('/registration', (req, res) => {
    res.render("registration");
})

app.get("/login", (req, res) => {
    res.render("login");
})

// *************************************************************************

// create a new user in our database (store data)
app.post('/registration', async (req, res) => {
    try {
        // res.send(req.body.firstname);

        const password = req.body.password;
        const cpassword = req.body.confirmpassword;

        if (password == cpassword) {
            const formData = new Register({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                password: req.body.password,
                confirmpassword: req.body.confirmpassword
            })

            const postData = await formData.save();
            res.send(postData);
        } else {
            res.send("password are not matching");
        }
    }
    catch (e) {
        res.status(400).send(e);
    }

})
// *************************************************************************

// login to your account start

app.post("/login", async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const useremail = await Register.findOne({ email: email });

        if (useremail.password === password) {
            res.status(201).render("index");
        } else {
            res.send("Invalid UserName and Password");
        }
    } catch (e) {
        res.status(400).send("Invalid email");
        console.log(e);
    }
})

// login to your account and


app.listen(port, () => {
    console.log(`server is running on the port no ${port}`);
})