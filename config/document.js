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

doc_schema.methods.create_doc = function(name, type, comment, from_user,
    callback) {
    var self = this;
    // TODO from_user check
    if (name !== "" && type !== "" && from_user !== "") {
        var create_date = Date.now();
        return self.model({name: name, type: type, comment: comment,
            from_user: from_user, create_date: create_date}).save(callback);
    }
};

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

var doc_model = mongoose.model('Doc', doc_schema);
exports.doc_model = doc_model;
