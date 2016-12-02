var express = require("express");
var app     = express();
var path    = require("path");
var fs = require('fs');

var bodyParser = require('body-parser');
app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static('public'));
app.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/index.html'));
});

app.get('/html',function(req,res){
  res.sendFile(path.join(__dirname+'html/index.html'));
});

app.post('/createFile',function(req,res){
	console.log("Called /createFile");
	fs.writeFile('testng.xml', req.body.xmlData, function (err) {
        if (err) throw err;
          console.log('It\'s saved! in same location.');

		console.log('Batch file Start');
		require('child_process').exec('cmd /c start "" cmd /c run.bat', function(data){
			console.log("ChilProcess has finished running the .bat file.");
		});
    });
	res.end();

});


app.listen(3000,'localhost');

console.log("Running at Port 3000");


















/**
 * Module dependencies.
 */
/*
var express = require('express')
  , serveStatic = require('serve-static');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.all('/*', function(req, res, next) {
  // Just send the index.html for other files to support HTML5Mode
  res.sendFile('/index.html', { root: __dirname });
});

app.use(modRewrite([
    '!/api|/assets|\\.png|\\.jpeg|\\.gif|\\.html|\\.less|\\.js|\\.css|\\woff|\\ttf|\\swf$ /index.html [L]'
  ]));
*/