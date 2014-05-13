var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var link_schema = new Schema({
    from_user: {type: Schema.ObjectId, required: true},
    to_user: {type: Schema.ObjectId, required: true},
    doc_id: {type: Schema.ObjectId, required: true},
    from_date: {type: Number},
    to_date: {type: Number, required: true},
    comment: {type: String}
});

link_schema.methods.create_link = function(from_user, to_user, doc_id, 
    from_date, to_date, comment, callback) {
    var self = this;
    // TODO check of input
    if (from_user !== "" && to_user !== "" && doc_id !== "" && 
        from_date !== "" && to_date !== "") {
        return self.model({from_user: from_user, to_user: to_user,
            doc_id: doc_id, from_date: from_date, to_date: to_date,
            comment: comment}).save(callback);
    }
};

link_schema.methods.update_comment = function (new_comment, callback) {
    var self = this;
    self.findById(self.id, function(err, link) {
        if (err) {
            return callback(err);
        }
        link.comment = new_comment;
        link.save(callback);
    });
};

link_schema.methods.update_to_date = function (new_date, callback) {
    var self = this;
    self.findById(self.id, function(err, link) {
        if (err) {
            return callback(err);
        }

        if (new_date !== "") {
            link.to_date = new_date;
        } else {
            link.to_date = Date.now();
        }
        link.save(callback);
    });
};

link_schema.methods.check_link = function (to_user, callback) {
    var self = this;
    self.findById(self.id, function(err, link) {
        if (err) {
            return callback(err);
        }

        if (link.to_user === to_user && link.to_date < Date.now()) {
            callback(null, true);
        } else {
            callback(null, false);
        }
    });
};

var link_model = mongoose.model('Link', link_schema);
exports.doc_link = link_model;
