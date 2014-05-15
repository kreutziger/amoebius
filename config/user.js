var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
var SALT_ROUNDS = 10;

var user_schema = new Schema({
    name: {type: String, required: true, unique: true},
    salted_pass: {type: String, required: true},
    email: {type: String, required: true},
    admin: {type: Boolean},
    login_session_id: {type: String}
});

user_schema.path('name').validate(function(name) {
    return name.length > 0;
}, 'user name cannot be blank');

user_schema.path('salted_pass').validate(function(salted_pass) {
    return salted_pass.length > 0;
}, 'user password cannot be blank');

user_schema.path('email').validate(function(email) {
    return email.length > 0;
}, 'user email addresse cannot be blank');

user_schema.path('admin').validate(function(admin) {
    return (typeof admin) === 'boolean';
}, 'admin value must be boolean');

user_schema.pre('save', function(next) {
    var self = this;

    if (!self.isModified('salted_pass')) {
        return next();
    }

    bcrypt.hash(self.salted_pass, SALT_ROUNDS, function(err, hash) {
        if (err) {
            return next(err);
        }
        self.salted_pass = hash;
        next();
    });
});

user_schema.methods.compare_pass = function(user_pass, callback) {
    var self = this;
    bcrypt.compare(user_pass, self.salted_pass, function(err, is_match) {
        if (err) {
            return callback(err);
        }
        callback(null, is_match);
    });
};

user_schema.statics.generate_login_id = (function() {
    function rand_str() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16)
            .substring(1);
    }
    return function() {
        return rand_str() + rand_str() + '-' + rand_str() + '-' + rand_str() +
            '-' + rand_str() + '-' + rand_str() + rand_str() + rand_str();
    };
}());

user_schema.methods.destroy_login_id = function(callback) {
    var self = this;
    self.login_session_id = '';
    self.save(callback);
};

user_schema.methods.create_login_id = function(callback) {
    var self = this;
    self.login_session_id = user_model.generate_login_id();
    self.save(callback);
};

user_schema.methods.update_email = function(email, callback) {
    var self = this;
    self.email = email;
    self.save(callback);
};

user_schema.methods.update_admin = function(admin, callback) {
    var self = this;
    if (typeof admin !== 'boolean') {
        admin = (admin === 'true');
    }
    self.admin = admin;
    self.save(callback);
};

user_schema.methods.update_password = function(password, callback) {
    var self = this;
    self.salted_pass = password;
    self.save(callback);
};

var user_model = mongoose.model('User', user_schema);
module.exports = user_model;
