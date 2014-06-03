exports.index = function(req, res) {
//    res.render('index', {user: req.user, message: req.session.messages});
    console.log('index', req.flash('info'));
    res.render('index', {user: req.user, message: req.flash('info')});
};

exports.partials = function(req, res) {
    var name = req.params.name;
    console.log('partials', req.flash('info'));
    res.render('partials/' + name, {user: req.user, 
//               message: req.session.messages});
              message: req.flash('info')});

};
