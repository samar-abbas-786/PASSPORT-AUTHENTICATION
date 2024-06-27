const express = require("express");
const router = express.Router();
const User = require("../model/User");
const bcrypt = require("bcryptjs");

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/Register", (req, res) => {
  res.render("register");
});
router.post("/register", async (req, res) => {
  let errors = [];
  const { name, email, password, password2 } = req.body;
  if (!name || !email || !password || !password2) {
    errors.push({ msg: "Please Provide all the field" });
  }
  if (password !== password2) {
    errors.push({ msg: "Password does not Match" });
  }
  if (password.length < 6) {
    errors.push({ msg: "Password must contain atleast 6 characters" });
  }

  if (errors.length > 0) {
    res.render("register", {
      name,
      email,
      password,
      password2,
      errors,
    });
  } else {
    //Validation Passed
    const user = await User.findOne({ email: email });
    if (user) {
      errors.push({ msg: "Email is already taken" });
      res.render("register", {
        name,
        email,
        password,
        password2,
        errors,
      });
    } else {
      const newUser = new User({
        name,
        email,
        password,
      });
      //Hash Password
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(() => {
              req.flash("success_msg", "You are Registered & can log in");
              res.redirect("/user/login");
            })
            .catch((err) => {
              console.log(err);
            });
        });
      });
    }
  }
});

module.exports = router;
