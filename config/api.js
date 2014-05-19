var Docs = require('./document');

exports.docs = function(req, res) {
    var own_docs = true;
    if (req.originalUrl === '/api/other_docs') {
        own_docs = false;
    }

    var search_str = 'undefined';
    if (req.user) {
        search_str = req.user._id;
    }

    if (own_docs) {
        Docs.find({from_user: search_str}, function(err, docs) {
            if (!err && docs.length > 0) {
                res.send({
                    own_docs: docs
                });
            } else {
                res.send({
                    own_message: 'No documents there'
                });
            }
        });
    } else {
        Docs.find({to_user: search_str}, function(err, docs) {
            if (!err && docs.length > 0) {
                res.send({
                    other_docs: docs
                });
            } else {
                res.send({
                    other_message: 'No documents there'
                });
            }
        });
    }
};
