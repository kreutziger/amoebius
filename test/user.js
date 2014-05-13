var assert = require('assert');
var db = require('../config/db');
var user = require('../config/user');

describe('user', function() {
    
    before(function() {
        console.log('preparing db');
        user.findOneAndRemove({name:"test"}, function(err) {
            if (err) {
                console.log(err);
            }
        });
    });

    describe('#save()', function() {
        it('should save without error', function(done){
            var my_user = new user({name:"test", salted_pass:"test", 
                                   email: "test", admin: true});
            my_user.save(done);
        });
        it('should save with error (no duplicates)', function(){
            var my_user = new user({name:"test", salted_pass:"test", 
                                   email: "test", admin: true});
            assert.throws(my_user.save, Error, "duplicate user");
        });
    });

    describe('#compare()', function() {
        it('same user password should compare', function(done){
            user.findOne({name: "test"}, function(err, user) {
                if (err) {
                    done(err);
                } else {
                    done(user.compare_pass("test"));
                }
            });
        });
    });
});
