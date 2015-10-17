var express = require('express');
var http = require('http');

var app = express();

app.get('/hello', function(req, res) {
  console.log('Returning Hello World!');
  res.send('Hello World!');
});

app.listen(8000);