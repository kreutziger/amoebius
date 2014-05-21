var assert = require('assert');
var db = require('../config/db');
var link = require('../config/link');
var test_id= '5374b9cff45171b635c891cd';

describe('link', function() {

    after(function() {
        link.findOneAndRemove({from_user: test_id}, function(err) {
            if (err) {
                console.log(err);
            }
        });
    });
    
    describe('#create', function() {
        it('should create a link without error', function(done) {
            var my_link = new link({from_user: test_id, 
                to_user: test_id, doc_id: test_id, from_date: 123123123,
                to_date: 123123123, comment: ''});
            my_link.save(done);
        });
    });

    describe('#update', function() {
        it('should update the comment', function(done) {
            link.findOne({from_user: test_id}, function(err, link) {
                if (!err) {
                    link.update_comment('test', function(err, link) {
                        if (!err) {
                            assert.equal('test', link.comment, 
                                         'link.comment is: ' + link.comment);
                            done();
                        }
                    });
                }
            });
        });
        it('should update the to_date', function(done) {
            link.findOne({from_user: test_id}, function(err, link) {
                if (!err) {
                    var now = Date.now();
                    link.update_to_date(now, function(err, link) {
                        if (!err) {
                            assert.equal(now, link.to_date, 
                                         'link.to_date is: ' + link.to_date);
                            done();
                        }
                    });
                }
            });
        });
    });

    describe('#check', function() {
        it('should return false because the to_date is in the past', 
            function(done) {
            link.findOne({from_user: test_id}, function(err, link) {
                if (!err) {
                    link.check_link(test_id, function(err, is_valid) {
                        if (!err) {
                            assert.equal(false, is_valid, 'check_link is: ' +
                                        is_valid);
                            done();
                        }
                    }); 
                }
            });
        });
    });
});
