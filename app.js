// import modules
var express = require('express');
var path = require('path');
var app = express();
var mongoose = require('mongoose');
var session = require('express-session');
var flash = require('connect-flash');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

// connect Mongo DB
mongoose.connect(process.env.MONGO_DB);
var db = mongoose.connection;

db.once("open", function() {
  console.log("DB Connected");
});

db.on("error", function(e) {
  console.log("DB ERROR : ", e);
});

// view setting
app.set("view engine", 'ejs');

// set middlewares
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(flash());
app.use(session({
  secret:'MySecret',
  resave: true,
  saveUninitialized: true
}));

// passport
var passport = require('./config/passport');
app.use(passport.initialize());
app.use(passport.session());

// routes
app.use('/', require('./routes/home'));
app.use('/users', require('./routes/users'));
app.use('/posts', require('./routes/posts'));

// start server
var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log('Server On!');
});
