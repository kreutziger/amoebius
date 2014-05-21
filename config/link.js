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

link_schema.path('from_user').validate(function(from_user) {
    return String(from_user).length > 0;
}, 'invalid from_user');

link_schema.path('to_user').validate(function(to_user) {
    return String(to_user).length > 0;
}, 'invalid to_user');

link_schema.path('doc_id').validate(function(doc_id) {
    return String(doc_id).length > 0;
}, 'invalid doc_id');

link_schema.path('from_date').validate(function(from_date) {
    return (typeof from_date === 'number') && from_date > 0;
}, 'invalid from_date');

link_schema.path('to_date').validate(function(to_date) {
    return (typeof to_date === 'number') && to_date > 0;
}, 'invalid to_date');

link_schema.methods.update_comment = function (new_comment, callback) {
    var self = this;
    self.comment = new_comment;
    self.save(callback);
};

link_schema.methods.update_to_date = function (new_date, callback) {
    var self = this;
    if (new_date !== "") {
        self.to_date = new_date;
    } else {
        self.to_date = Date.now();
    }
    self.save(callback);
};

link_schema.methods.check_link = function (to_user, callback) {
    var self = this;

    if (self.to_user === to_user && self.to_date < Date.now()) {
        callback(null, true);
    } else {
        callback(null, false);
    }
};

var link_model = mongoose.model('Link', link_schema);
module.exports = link_model;
