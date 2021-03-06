var express = require('express'),
    router = express.Router(),
    path = require('path');

router.get('/', function(req, res){
    res.render('index', {hi: 'hi'});
});

router.get('/quest', function(req, res){
    var db = req.db;
    var collection = db.get('quests');
    collection.find({}, function(err, quests){
        if (err) {
            res.send('much error');
        }
        else {
            res.render('quest', {
                'questlist': quests
            });
        }
    })
});


module.exports = router;
