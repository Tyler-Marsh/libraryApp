var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//var indexRouter = require('./routes/index');
var booksRouter = require('./routes/books');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
/*
app.use(app.router);
routes.initialize(app);
*/

//app.use('/', indexRouter);
app.use('/', booksRouter);


// catch 404 
// call next to use the built in error handler
app.use( (req, res, next) => {
  next(createError(404));
});
// error handler
app.use((err, req, res, next) => {
  // set locals to be available to views
  // only in development
  console.log("INSIDE GLOBAL ERROR HANDLER")
  console.log(err);
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  // if status 404 render page not found view
  /*
THE ELSE CLAUSE WOULD NEVER GO THROUGH
  */
  if (err.status === 404) {
    console.log("404")
    res.render('page-not-found', { title: 'page-not-found'});
  } else {
    console.log("@@@@@@@@@@@@@@@@@")
    res.status(err.status || 500);
    res.render('error');
  }
});

module.exports = app;