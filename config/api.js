var Docs = require('./document');
var Links = require('./link.js');
var fs = require('fs');

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
        Links.find({to_user: search_str}, function(err, links) {
            if (!err && links.length > 0) {
                var docs = [];
                links.map(function(link) { 
                    Docs.findById(link._id, function(err, doc) {
                        if (!err) {
                            docs.push(doc);
                        }
                    });
                });
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
