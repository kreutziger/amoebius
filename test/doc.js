var assert = require('assert');
var db = require('../config/db');
var doc = require('../config/document');

var test_doc = "test";

describe('doc', function() {
    
    after(function() {
        doc.findOneAndRemove({name:test_doc}, function(err) {
            if (err) {
                console.log(err);
            }
        });
    });
    
    describe('#save', function() {
        it('should save without error', function(done) {
            var my_doc = new doc({name: test_doc, type: 'test',
            create_date: Date.now(), comment: '', from_user: 'test'});
            my_doc.save(done);
        });
    });

    describe('#update', function() {
        it('should update the comment', function(done) {
            doc.findOne({name: test_doc}, function(err, my_doc) {
                if (!err) {
                    my_doc.update_comment('comment', function (err, doc) {
                        assert.equal(doc.comment, 'comment', 'comment is: ' + doc.comment);
                        done();
                    });
                }
            });
        });
        it('should update the path', function(done) {
            doc.findOne({name: test_doc}, function(err, my_doc) {
                if (!err) {
                    my_doc.update_path('comment', function (err, doc) {
                        assert.equal(doc.path, 'comment', 'path is: ' + doc.path);
                        done();
                    });
                }
            });
        });

    });
});
