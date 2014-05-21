var express = require('express');

var qr = require('qr-image');

var db = require('./config/db');
var pass = require('./config/passport');
var api = require('./config/api');

var https = require('https');
var http = require('http');
var fs = require('fs');
var passport = require('passport');

//middleware for express
var compress = require('compression');
var logger = require('morgan');
var cookie_parser = require('cookie-parser');
var serve_static = require('serve-static');
var express_session = require('express-session');
var error_handler = require('errorhandler');
var body_parser = require('body-parser');
var multipart = require('connect-multiparty');

var routes = require('./routes/index');
var user_routes = require('./routes/user');

var app = express();

var ssl_options = {
    key: fs.readFileSync('./ssl/key.pem'),
    cert: fs.readFileSync('./ssl/cacert.pem'),
};

//configuring
app.set('port', 8080);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.set('view options', {
    layout: false
});

app.use(logger({
    format: 'dev',
    immediate: true
}));
app.use(compress({
    threshhold: 512
}));
app.use(body_parser());
app.use(multipart());
app.use(cookie_parser());
app.use(express_session({
    name: 'doculink',
    secret: 'that-really-secret-key'
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(serve_static(__dirname + '/public'));

if ('development' === app.get('env')) {
    app.use(error_handler({
        dumpExceptions: true,
        showStack: true
    }));
}

app.get('/', routes.index);
app.get('/partials/:name', routes.partials);

app.post('/api/create_doc', api.create_doc);
app.post('/api/edit_doc/:id', api.edit_doc);
app.post('/api/link_doc/:id', api.link_doc);
app.post('/api/delete_doc/:id', api.delete_doc);

app.get('/api/linked_users/:id', api.linked_users);
app.get('/api/doc/:id', api.doc);
app.get('/api/own_docs', api.docs);
app.get('/api/other_docs', api.docs);
app.get('/download/:id', api.download);
app.get('/api/sticker/:id', function(req, res) {
    var code = qr.image(req.params.id, {type: 'png'});
    res.type('png');
    code.pipe(res);
});

app.get('/login', user_routes.get_login);
app.post('/login', user_routes.post_login);
app.get('/logout', user_routes.logout);

app.get('*', routes.index);

var server = http.createServer(app).listen(8080);
https.createServer(ssl_options, app).listen(8443);
console.log('server runs on port %d, in mode %s', app.get('port'), 
            app.settings.env);
