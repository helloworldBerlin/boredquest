var express = require('express'),
    path = require('path');
    mongo = require('mongodb'),
    monk = require('monk');

var db = monk('mongodb://User1:user1@ds013310.mlab.com:13310/boredquest');

var router = require('./router');

var app = express();

app.set('views', './views');
app.set('view engine', 'pug');

app.use(function(req, res, next){
    req.db = db;
    next();
})

app.use('/', router);
app.use('/quest', router);
app.use('/getQuest', router);
app.use('/submitQuest', router);

app.listen(3000, function () {
  console.log('Bored app listening on port 3000!');
});

console.log('beep');
