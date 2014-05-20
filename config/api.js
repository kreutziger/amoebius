var Docs = require('./document');
var Links = require('./link.js');
var Users = require('./user.js');
var fs = require('fs');
var moment = require('moment');

exports.create_doc = function(req, res) {
    //TODO input satinization
    if (req.user) {
        if (req.files) {
            fs.readFile(req.files.file.path, function(err, data) {
                var path = './uploads/' + req.user._id + '/';
                fs.stat(path, function(err, stats) {
                    if (err && err.code === 'ENOENT') {
                        fs.mkdir('./uploads/' + req.user._id);
                    }
                });
                path += req.files.file.originalFilename;
                var file_there = true;
                var stats, path_arr, file_num;
                while (file_there) {
                    try {
                        stats = fs.statSync(path);
                        path_arr = path.split('__');
                        if (path_arr.length === 1) {
                            path = path + '__1';
                        } else {
                            file_num = path_arr.pop();
                            file_num = String(parseInt(file_num, 10) + 1);
                            path_arr.push(file_num);
                            path = path_arr.join('__');
                        }
                    } catch (error) {
                        file_there = false; 
                    }
                }
                fs.writeFile(path, data, function(err) {
                    if (err) {                      
                        console.log(err);
                    }
                });
                Docs({name: req.body.name, type: req.body.type,
                from_user: req.user._id, create_date: Date.now(),
                comment: req.body.comment, path: path}).save();
            });
        } else { 
            Docs({name: req.body.name, type: req.body.type,
            from_user: req.user._id, create_date: Date.now(),
            comment: req.body.comment, path: ''}).save();
        }
    }

    res.redirect('/');
};

exports.doc = function(req, res) {
    Docs.findById(req.params.id, function(err, doc) {
        res.send({
            doc: doc
        });
    });
};

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
        // TODO filter old links
        Links.find({to_user: search_str}, function(err, links) {
            if (!err && links !== null && links.length > 0) {
                var ids = links.map(function(link) {
                    return link.doc_id;
                });
                Docs.find({_id: {$in: ids}}, function(err, docs) {
                    res.send({
                        other_docs: docs
                    });
                });
            } else {
                res.send({
                    other_message: 'No documents there'
                });
            }
        });
    }
};

exports.link_doc = function(req, res) {
    if (req.user) {
        Users.findOne({name: req.body.user}, function(err, user) {
            if (!err && user !== null) {
                //TODO check date, user, document
                if (user === null) {
                    // stuff
                }
                var now = Date.now();
                var date = moment(req.body.date, 'YYYY-MM-DD', true);
                if (!date.isValid() && (date.unix() * 1000) > now) {
                    // stuff
                }
                Links({from_user: req.session.passport.user, to_user: user.id,
                      from_date: now, doc_id: req.body.id, 
                      to_date: date.unix() * 1000, comment: req.body.comment
                }).save();
                req.session.message = ['link successfully created'];
            } else {
                req.session.message = ['link could not be created'];
            }
        });
    }
    res.redirect('/');
};
