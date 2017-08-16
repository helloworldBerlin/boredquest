var express = require('express'),
    router = express.Router(),
    path = require('path');

router.get('/', function(req, res){
    res.render('index');
});

//expected query-string:
// /getQuest?outdoor=<true/false> action=<0-10> persZahl=<'1'/ '2'/ '3-5'/ '5 oder mehr'> spassFaktor=<1-10>
router.get('/getQuest', function(req, res){
    var db = req.db;
    var collection = db.get('quests');
    if(!inputCheck('getQuest', req)) next('error');
    collection.find({'outdoor': req.query.outdoor,
                     'action': req.query.action,
                     'personenZahl': req.query.persZahl,
                     'spassFaktor': req.query.spassFaktor},
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

router.get('/submit', function(req, res){
    res.render('submit');
});

//expected query-string:
// /submitQuest?quest=<string <= 40 length> outdoor=<true/false> action=<0-10> persZahl=<'1'/ '2'/ '3-5'/ '5 oder mehr'> spassFaktor=<1-10>
router.get('/submitQuest', function(req, res){
    var db = req.db;
    var collection = db.get('quests');
    if(!inputCheck('submitQuest', req)) next('error');
    var insertObj = {quest: req.query.quest,
                     outdoor: req.query.outdoor,
                     action: req.query.action,
                     personenZahl: req.query.persZahl,
                     spassFaktor: req.query.spassFaktor,
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

function inputCheck(type, req){
    if(type == 'submitQuest') {
        var quest = req.query.quest;
        console.log(quest);
        if(quest.length > 40 || quest.length < 0) return 0;
    }
    var outdoor = req.query.outdoor;
    if(!(outdoor == 'true' || outdoor == 'false')) return 0;
    var action = req.query.action;
    if(typeof(action) != 'number' && (action > 10 || action < 0)) return 0;
    var persZahl = req.query.persZahl;
    switch(persZahl){
        case '1':
            break;
        case '2':
            break;
        case '3-5':
            break;
        case '6 oder mehr':
            break;
        default:
            return 0;
    }
    var spassFaktor = req.query.spassFaktor;
    if(typeof(spassFaktor) != 'number' && (spassFaktor > 10 || spassFaktor < 0)) return 0;
    return 1;
}

module.exports = router;
