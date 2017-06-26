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
    var questForm = req.query.questForm;
    questForm = questForm.split("");
    for(var i = 0; i < questForm.length; i++){
        if(questForm[i] == 1) questForm[i] = true;
        else questForm[i] = false;
    }
    collection.find({'outdoor': questForm[0], 'sport': questForm[1]}, function(err, quests){
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
