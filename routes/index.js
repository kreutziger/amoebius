exports.index = function(req, res) {
    res.render('index', {user: req.user, message: req.session.messages});
};

exports.partials = function(req, res) {
    var name = req.params.name;
    console.log('partials', req.session.messages);
//    console.log('partials', res);
    res.render('partials/' + name, {user: req.user, 
               message: req.session.messages});
};
