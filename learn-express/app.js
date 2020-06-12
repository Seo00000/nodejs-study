var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var flash = require('connect-flash'); 

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//추가한 부분
app.use(function(req, res, next){
  console.log(req.url, '저도 미들웨어입니다.');
  next();
})

app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public'))); //자체적으로 정적 파일 라우터 기능을 수행하므로 최대한 위쪽에 배치, morgan 보다 위로 올리면 정적 파일 요청이 기록되지 않음.
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('secret code'));
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: 'secret code', //cookie parser 값과 같음
  cookie: {
    httpOnly: true,
    secure: false //https가 아닌 환경에서도 사용 가능.
  }
}));
app.use(flash()); //cookie-parser와 express-session을 사용하므로 그 뒤에 위치해야함.

app.use('/', indexRouter);
app.use('/users', usersRouter);

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
