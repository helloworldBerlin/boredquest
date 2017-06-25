var express = require('express'),
    router = express.Router(),
    path = require('path');

router.get('/', function(req, res){
    res.render('index');
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

router.get('/something', function(req, res){
    var db = req.db;
    var collection = db.get('quests');
    collection.find({}, function(err, quests){
        if (err) {
            res.send('much error');
        }
        else {
            var keys = Object.keys(quests);
            var result = quests[keys[keys.length * Math.random() << 0]];
            res.send(result.quest);
        }
    });
});

module.exports = router;
