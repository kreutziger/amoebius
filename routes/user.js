var db = require('../config/db');
var passport = require('passport');
var User = require('../config/user.js');

//exports.account

exports.get_login = function(req, res) {
    res.render('partials/login', {user: req.user, 
               message: req.session.messages});
};

//exports.admin

exports.post_login = function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err) {
            return next(err);   
        }
        if (!user) {
            req.session.messages = [info.message];
            return res.redirect('/login');
        }

        req.logIn(user, function(err) {
            if (err) {
                return next(err);
            }
            User.findOne({name: user.name}, function(err, user) {
                if (err) {
                    next(err);
                } else {
                    user.create_login_id();
                }
            });
            return res.redirect('/');
        });
    }) (req, res, next);
};

exports.logout = function(req, res, next) {
    if (req.user && req.user.username !== ""){
        User.findOne({name: req.user.name}, function(err, user) {
            if (err) {
                next(err);
            } else {
                user.destroy_login_id();
            }
        });
    }
    req.logout();
    res.redirect('/');
};
