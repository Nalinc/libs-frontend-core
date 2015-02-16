var express = require('express');
var path = require('path');
var controllers = require('./controllers/main');

var app = express();

//Set the port of our application
//process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 8080;

//Register API controller
app.get('/api/langs/:id', controllers.langsController);
app.get('/api/:id', controllers.apiController);

//Serve Static content
app.use(express.static(path.normalize(__dirname + '/../../'))); 

app.listen(port, function() {
    console.log("Express server started");
});


