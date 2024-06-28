const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts");
const PORT = process.env.PORT || 5000;
const { config } = require("dotenv");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const session = require("express-session");
// const passport = require("./config/passport");
const passport = require("passport");

config();

//Passport
require("./config/passport")(passport);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("DB Connected");
  })
  .catch((err) => {
    console.log(err);
  });

//EJS
app.use(expressLayouts);
app.set("view engine", "ejs");

//Bodyparser
app.use(express.urlencoded({ extended: false }));

//Flash
app.use(flash());

//express-session
app.use(
  session({
    secret: "My Secret",
    resave: true,
    saveUninitialized: true,
  })
);

//Passport

app.use(passport.initialize());
app.use(passport.session());

//Global Vars
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");

  next();
});

//Routes
app.use("/", require("./routes/index"));
app.use("/user", require("./routes/user"));

app.listen(PORT, () => {
  console.log(`App is Running on ${PORT}`);
});
