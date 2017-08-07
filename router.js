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

//expectet questForm query:
//  -4 hex numbers, each representing an attribut (outdoor, sport, personenZahl, spassFaktor; in that order)
//  -for example questForm=<n1><n2><n3><n4>
router.get('/getQuest', function(req, res){
    var db = req.db;
    var collection = db.get('quests');
    var questForm = req.query.questForm;
    if(questForm.length != 4) res.status(400).send('Dude wat?');
    questForm = questForm.split("");
    for(var i = 0; i < questForm.length; i++){
        questForm[i] = parseInt(questForm[i], 16);
    }
    collection.find({'outdoor': questForm[0],
                     'sport': questForm[1]},
                     'personenZahl': questForm[2],
                     'spassFaktor': questForm[3],
                     function(err, quests){
        if (err) {
            res.send('Keine Tätigkeit gefunden...');
        }
        else {
            var keys = Object.keys(quests);
            var result = quests[keys[keys.length * Math.random() << 0]];
            result.count++;
            res.send(result.quest);
        }
    });
});

//expectet submitForm Query:
//  -a string (questName), a '-' seperating the string from 4 hex-numbers
//  -each hex-number represents an attribut (outdoor, sport, personenZahl, spassFaktor; in that order)
//  -for example:  submitForm=<QuestName>-<n1><n2><n3><n4>
router.get('/submitQuest', function(req, res){
    var db = req.db;
    var collection = db.get('quests');
    var submitForm = req.query.submitForm;
    submitForm = submitForm.split('-');
    if(typeof(submitForm[0]) != 'string' && submitForm[1].length != 4) res.status(400).send('Something went wrong...');
    var subSubmitForm = submitForm[1].split('');
    var insertObj = {quest: submitForm[0],
                     outdoor: parseInt(subSubmitForm[0], 16),
                     sport: parseInt(subSubmitForm[1], 16),
                     personenZahl: parseInt(subSubmitForm[2], 16),
                     spassFaktor: parseInt(subSubmitForm[3], 16),
                     count: 0,
                     rating: 0};
    collection.insert(insertObj, function(err, result){
        if(err) {
            res.send('Upload not successful.')
        }
        else {
            console.log("Inserted a document into the quests collection.");
            res.send('Quest uploaded successfully');
        }
    });
});

module.exports = router;
