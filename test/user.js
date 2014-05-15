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

    describe('#save()', function() {
        it('should save without error', function(done){
            var my_user = new user({name: test_user, salted_pass:"test", 
                                   email: "test", admin: true});
            my_user.save(done);
        });
        it('should save with error (no duplicates)', function(){
            var my_user = new user({name:test_user, salted_pass:"test", 
                                   email: "test", admin: true});
            assert.throws(my_user.save, Error, "duplicate user");
        });
    });

    describe('#compare()', function() {
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
                assert.throws(user.compare_pass("nottest", done), Error, "wrong pass");
            });
        });

    });
});