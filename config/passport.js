var db = require('./db');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./user');

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

passport.use(new LocalStrategy(
    function(username, password, done) {
        User.findOne({name: username}, function(err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false, {message: 'incorrect user/pw'});
            }
            user.compare_pass(password, function(err, is_match) {
                if (err) {
                    return done(err);
                }                 
                if (!is_match) {
                    return done(null, false, {message: 'incorrect user/pw'});
                }
                return done(null, user);
            });
        });
    })
);

exports.ensure_auth = function ensure_auth(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
};

exports.ensure_admin = function ensure_admin(req, res, next) {
    if (req.user && req.user.admin === true) {
        next();
    } else {
        res.send(403);
    }
};
