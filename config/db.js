var mongoose = require('mongoose');
// TODO outsource configuration details for db
mongoose.connect('mongodb://localhost/doculink');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
