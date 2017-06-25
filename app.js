var express = require('express'),
    path = require('path');
    mongo = require('mongodb'),
    monk = require('monk');

var db = monk('localhost:27017/db_01');

var router = require('./router');

var app = express();

app.set('views', './views');
app.set('view engine', 'pug');

app.use(function(req, res, next){
    req.db = db;
    next();
})

app.use('/', router);
app.use('/get', router);
app.use('/something', router);

app.listen(3000, function () {
  console.log('Bored app listening on port 3000!');
});

console.log('beep');
