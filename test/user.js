var assert = require('assert');
var db = require('../config/db');
var user = require('../config/user');

var test_user = 'test';

describe('user', function() {
    
    after(function() {
        user.findOneAndRemove({name:test_user}, function(err) {
            if (err) {
                console.log(err);
            }
        });
    });

    describe('#save', function() {
        it('should save without error', function(done){
            var my_user = new user({name: test_user, salted_pass:"test", 
                                   email: "test", admin: true});
            my_user.save(done);
        });
        it('should save with error (no duplicates)', function(done){
            var my_user = new user({name:test_user, salted_pass:"test", 
                                   email: "test", admin: true});
            assert.throws(my_user.save, Error, 'user.name is: ' +
                          my_user.name);
            done();
        });
    });

    describe('#compare', function() {
        it('same user password should compare', function(done){
            user.findOne({name: test_user}, function(err, user) {
                if (err) {
                    done(err);
                } else {
                    user.compare_pass("test", done);
                }
            });
        });
        it('different user password should not compare', function(done){
            user.findOne({name: test_user}, function(err, user) {
                if (err) {
                    done(err);
                }
                assert.throws(user.compare_pass("nottest", done), Error, 
                              'user.salted_pass is: ' + user.salted_pass);
            });
        });

    });

    describe('#login_session_id', function() {
        it('should create a login session id', function(done) {
            user.findOne({name: test_user}, function(err, user) {
                if (!err) {
                    user.create_login_id(function(err, user) {
                        if (!err) {
                            assert.notEqual(user.login_session_id, "", 
                                            'user.login_session_id is: ' +
                                                user.login_session_id);
                            done();
                        }
                    });
                }
            });
        });
        it('should destroy a login session id', function(done) {
            user.findOne({name: test_user}, function(err, user) {
                if (!err) {
                    user.destroy_login_id(function (err, user) {
                        if (!err) {
                            assert.equal(user.login_session_id, "",
                                        'user.login_session_id is: ' +
                                        user.login_session_id);
                            done();
                        }
                    });
                }
            });
        });
    });

    describe('#update', function() {
        it('should update the email', function(done) {
            user.findOne({name: test_user}, function(err, user) {
                if (!err) {
                    user.update_email("test@test.de", function(err, usr) {
                        if (!err) {
                            assert.equal(usr.email, "test@test.de", 
                                         'user.email is: ' + usr.email);
                            done();
                        }
                    });
                }
            });
        });
        it('should update the password', function(done) {
            user.findOne({name: test_user}, function(err, user) {
                if (!err) {
                    user.update_password("pass", function(err, usr) {
                        if (!err) {
                            assert.notEqual(usr.salted_pass, "pass",
                                    'user.salted_pass is :' + usr.salted_pass);
                            done();
                        }
                    });
                }
            });
        });    
        it('should cover the wrong admin status', function(done) {
            user.findOne({name: test_user}, function(err, user) {
                if (!err) {
                    user.update_admin("pass", function(err, usr) {                     
                        if (!err) {
                            assert.equal(usr.admin, false, 'user.admin is: ' +
                                         usr.admin);
                            done();
                        }
                    });
                }
            });
        });    
        it('should set the right admin status', function(done) {
            user.findOne({name: test_user}, function(err, user) {
                if (!err) {
                    user.update_admin(true, function(err, usr) {                     
                        if (!err) {
                            assert.equal(usr.admin, true, 'user.admin is: ' +
                                         usr.admin);
                            done();
                        }
                    });
                }
            });
        });    
    });
});
