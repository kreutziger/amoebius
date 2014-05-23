var Users = require('./user');
var Docs = require('./document');
var Links = require('./link');

exports.update_user = function(req, res) {
    if (req.body.authenticate) {
        Users.findById(req.session.passport.user, function(err, user) {
            if (!err && user !== null) {
                user.compare_pass(req.body.authenticate, function(err, is_match) {
                    if (!err && is_match) {
                        if (req.body.email && req.body.email !== '') {
                            user.email = req.body.email;
                        }
                        if (req.body.password && req.body.password2 &&
                           req.body.password === req.body.password2) {
                            user.salted_pass = req.body.password;
                        }
                        user.save(function(err, user, rows) {
                            if (!err && user !== null &&  rows === 1) {
                                req.session.messages = ['user updated'];
                            } else {
                                req.session.messages = ['error: db error'];
                            }
                            res.redirect('/');
                        });
                    } else {
                        req.session.messages = ['error: wrong password'];
                        res.redirect('/');
                    }
                });
            } else {
                req.session.messages = ['error: user not found'];
                res.redirect('/');
            }
        });
    } else {
        req.session.messages = ['no password given'];
        res.redirect('/');
    }
};

exports.create_user = function create_user(req, res) {
    if (req.body && req.body.name && req.body.email) {
        if (req.body.password && req.body.password2 && 
            req.body.password === req.body.password2) {
            Users.findOne({name: req.body.name}, function(err, user) {
                if (!err && user === null) {
                    var new_user = new Users();
                    new_user.name = req.body.name;
                    new_user.email = req.body.email;
                    new_user.salted_pass = req.body.password;
                    if (req.body.admin && req.body.admin === 'on') {
                        new_user.admin = true;
                    } else {
                        new_user.admin = false;
                    }
                    new_user.save();
                    req.session.messages = ['user saved'];
                    res.redirect('/');
                } else {
                    req.session.messages = ['user name must be unique'];
                    res.redirect('/');
                }
            });
        } else {
            req.session.messages = ['user password verification failed'];
            res.redirect('/');
        }
    } else {
        req.session.messages = ['missing data'];
        res.redirect('/');
    }
};

exports.delete_user = function delete_user(req, res) {
    var ids = [];
    var property;
    for (property in req.body) {
        if (req.body.hasOwnProperty(property)) {
                ids.push(property);
            }
    }

    var own_id = ids.indexOf(req.session.passport.user);
    // if (~own_id) would work too
    if (own_id > 0) {
        ids.splice(own_id, 1);
    }
    
    Users.find({_id: {$in: ids}}, function(err, users) {
        if (!err && users !== null && users.length > 0) {
            Users.remove({_id: {$in: ids}}).exec();
            Docs.remove({from_user: {$in: ids}}).exec();
            Links.remove({from_user: {$in: ids}}).exec();
            req.session.messages = ['user(s) deleted'];
            res.redirect('/');
        } else {
            req.session.messages = ['no user(s) found'];
            res.redirect('/#/admin');
        }
    });
};

exports.users = function users(req, res) {
    Users.find({_id: {$ne: req.session.passport.user}}, 'name email _id admin',
                function(err, users) {
        if (!err &&  users !== null) {
            res.send({
                users: users
            });
        } else {
            res.send({
                message: 'No users there'
            });
        }
    });
};

exports.user = function user(req, res) {
    Users.findById(req.params.id, 'name email _id admin',
                function(err, user) {
        if (!err &&  user !== null) {
            res.send({
                user: user
            });
        } else {
            res.send({
                message: 'No user available'
            });
        }
    });
};

exports.modify_user = function modify_user(req, res) {
    if (req.params.id !== req.session.passport.user) {
        Users.findById(req.params.id, function(err, user) {
            if (!err && user !== null) {
                if (req.body.name && req.body.name !== '') {
                    user.name = req.body.name;
                }
                if (req.body.email && req.body.email !== '') {
                    user.email = req.body.email;
                }
                if (req.body.password && req.body.password2 &&
                   req.body.password === req.body.password2 &&
                   req.body.password !== '') {
                    user.salted_pass = req.body.password;
                }
                if (req.body.admin && req.body.admin === 'on') {
                    user.admin = true;
                } else {
                    user.admin = false;
                }
                user.save(function(err, user, rows) {
                    if (!err && user !== null && rows === 1) {
                        req.session.messages = ['user modified'];                        
                    } else {
                        req.session.messages = ['no changes done'];
                    }                       
                    res.redirect('/');
                });
            } else {
                req.session.messages = ['user not found'];
                res.redirect('/');
            }
        });
    } else {
        res.redirect('/');
    }
};
