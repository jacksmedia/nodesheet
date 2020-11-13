var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var fs              = require('fs');
var readline        = require('readline');
var {google}        = require('googleapis');
var request         = require('request');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// retrieve google sheet data
app.get('/v3', function(req, res){
	// my URL, no more options att
	var options = {
		url: 'https://spreadsheets.google.com/feeds/cells/2PACX-1vQgB1MdWL3Cd3X6hgp4xLLIEZTh7YpbCTQSrXuUuFuLJ1DPPtrwyu-JaTfuisHq2xy2v4jhjBKsCP1_/1/public/values?alt=json'
	}
	// give request package the sheet options
	request(options, callback)
	// callback function makes request, writes to console
	function callback(error, response, body){
		if (!error && response.statusCode == 200){
			console.log(body);
			// renders test template w response object
			res.render('test', {response: response})
		} else {
			console.log(error);
		}
	}
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
