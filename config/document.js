var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectID = Schema.ObjectId;

var doc_schema = new Schema({
    name: {type: String, required: true},
    type: {type: String},
    create_date: {type: Number},
    comment: {type: String},
    from_user: {type: String, required: true}
});

doc_schema.path('name').validate(function(name) {
    return name.length > 0;
}, 'invalid document name');

doc_schema.path('type').validate(function(type) {
    return type.length > 0;
}, 'invalid document type');

doc_schema.path('from_user').validate(function(from_user) {
    return from_user.length > 0;
}, 'invalid document creator');

doc_schema.path('create_date').validate(function(create_date) {
    return Date.now() > create_date || 0 > create_date;
}, 'invalid document create date');

doc_schema.methods.update_binary = function (new_path, callback) {
    var self = this;
    self.findById(self.id, function (err, doc) {
        if (err) {
            return callback(err);
        } 
        doc.path = new_path;
        doc.save(callback);
    });
};

doc_schema.methods.update_comment = function (new_comment, callback) {
    var self = this;
    self.findById(self.id, function(err, doc) {
        if (err) {
            return callback(err);
        }
        doc.comment = new_comment;
        doc.save(callback);
    });
};

module.exports = mongoose.model('Document', doc_schema);
