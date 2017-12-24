var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var crypto = require('crypto');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

app.get('/newUser', (req, res) => {
	  let username = req.query.username || '';
	    const password = req.query.password || '';

	      username = username.replace(/[!@#$%^&*]/g, '');

	        if (!username || !password || users.username) {
			    return res.sendStatus(400);
			      }

		  const salt = crypto.randomBytes(128).toString('base64');
		    const hash = crypto.pbkdf2Sync(password, salt, 10000, 512);

		      users[username] = { salt, hash };

		        res.sendStatus(200);
});

app.get('/auth', (req, res) => {
	  let username = req.query.username || '';
	    const password = req.query.password || '';

	      username = username.replace(/[!@#$%^&*]/g, '');

	        if (!username || !password || !users[username]) {
			    return res.sendStatus(400);
			      }

		  const hash = crypto.pbkdf2Sync(password, users[username].salt, 10000, 512);

		    if (users[username].hash.toString() === hash.toString()) {
			        res.sendStatus(200);
				  } else {
					      res.sendStatus(401);
					        }
});



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
