exports.index = function(req, res) {
    res.render('index', {user: req.user});
};

exports.partials = function(req, res) {
    var name = req.params.name;
    res.render('partials/' + name, {user: req.user});
};