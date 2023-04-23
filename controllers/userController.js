const User = require("../models/user");
const Event = require("../models/meetupEvent");
const Rsvp = require("../models/rsvp");

exports.new = (req, res) => 
{
    res.render("./user/new");
};

exports.create = (req, res, next) => 
{
    let user = new User(req.body);
    user.save()
    .then((user) => res.redirect("/users/login"))
      .catch((err) => 
      {
        if (err.name === "ValidationError") 
        {
          req.flash("error", err.message);
          return res.redirect("/users/new");
        }

        if (err.code === 11000)
        {
          req.flash("error", "Email has been used.");
          return res.redirect("/users/new");
        }

        next(err);
      });
};

exports.getUserLogin = (req, res, next) => 
{
    res.render("./user/login");
};

exports.login = (req, res, next) => 
{
    let email = req.body.email;
    let password = req.body.password;
        User
          .findOne({ email: email })
          .then((user) => {
            if (!user) 
            {
              console.log("wrong email address");
              req.flash("error", "Email address not found.");
              res.redirect("/users/login");
            }
            else 
            {
              user.comparePassword(password).then((result) => {
                if (result) 
                {
                  req.session.user = user._id;
                  req.flash("success", "You have successfully logged in!");
                  res.redirect("/users/profile");
                }
                else
                {
                  req.flash("error", "Password does not match records.");
                  res.redirect("/users/login");
                }
              });
            }
          })
          .catch((err) => next(err));
};

exports.profile = (req, res, next) => 
{
  let id = req.session.user;
  // using all promises and order doesn't matter instead of chaining
  Promise.all([User.findById(id), Event.find({ hostName: id }), Rsvp.find({hostName: id}).populate('event')])
    .then((results) => 
    {
      const [user, events, rsvps] = results;
      console.log(user, events, rsvps);
      res.render("./user/profile", { user, events, rsvps });
    })
    .catch((err) => next(err));
};

exports.logout = (req, res, next) => 
{
  req.session.destroy((err) => 
  {
    if (err) 
    {
      return next(err);
    }
    else 
    {
      res.redirect("/");
    }
  });
};
