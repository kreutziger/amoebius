exports.index = function(req, res) {
    res.render('index', {user: req.user, message: req.flash('info')});
};

exports.partials = function(req, res) {
    res.render('partials/' + req.params.name, {user: req.user,
               message: req.flash('info')});
};
