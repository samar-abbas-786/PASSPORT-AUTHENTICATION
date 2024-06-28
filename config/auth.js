module.exports = {
  ensureAuthenticated: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    } else {
      req.flash("error_msg", "You need to Loggin to access this resource");
      res.redirect("/user/login");
    }
  },
};
