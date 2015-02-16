'use strict';

var path = require('path');
var fs = require('fs');

exports.apiController = function(req, res) {    
    var filePath = __dirname + '/../api/' + req.param('id');
    var normalizedPath = path.normalize(filePath);
    
    var obj = JSON.parse(fs.readFileSync(normalizedPath), 'utf8');
    
    res.json(obj);
};

exports.langsController = function(req, res) {    
    var filePath = __dirname + '/../api/langs/' + req.param('id');
    var normalizedPath = path.normalize(filePath);
    
    var obj = JSON.parse(fs.readFileSync(normalizedPath), 'utf8');
    
    res.json(obj);
};