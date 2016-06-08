var express = require('express');
var path = require('path');
var app = express();
var mongoose = require('mongoose');

// connect Mongo DB
mongoose.connect(process.env.MONGO_DB);
var db = mongoose.connection;

db.once("open", function() {
  console.log("DB Connected");
});

db.on("error", function(e) {
  console.log("DB ERROR : ", e);
});

var dataSchema = mongoose.Schema({
  name:String,
  count:Number
});

var Data = mongoose.model('data', dataSchema);

Data.findOne( {name:"myData"}, function(e, data) {

    if (e) return console.log("Data ERROR : ", e);

    if (!data)
    {
      Data.create( {name:"myData", count:0}, function(e, data) {
        if (e) return console.log("Data create ERROR : ", e);

        console.log("Counter initialized : ", data);
      });
    }
});

app.set("view engine", 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
  Data.findOne( {name:"myData"}, function(e, data) {
    if (e) return console.log("Data ERROR", e);
    data.count++;

    data.save(function (e) {
      if (e) return console.log("Data Save ERROR", e);
      res.render("my_first_ejs", data);
    });
  });
});

app.get('/reset', function (req, res) {
  setCounter(res, 0);
});

app.get('/set/count', function (req, res) {
  if (req.query.count) setCounter(res, req.query.count);
  else getCounter(res);
});

app.get('/set/:num', function (req, res) {
  if (req.params.num) setCounter(res, req.params.num);
  else getCounter(res);
});

function setCounter(res, num)
{
  console.log("setCounter");

  Data.findOne( {name:"myData"}, function(e, data) {
    if (e) return console.log("Data ERROR", e);
    data.count = num;

    data.save(function (e) {
      if (e) return console.log("Data Save ERROR", e);
      res.render("my_first_ejs", data);
    });
  });
}

function getCounter(res)
{
  console.log("getCounter");

  Data.findOne( {name:"myData"}, function(e, data) {
    if (e) return console.log("Data ERROR", e);

    res.render("my_first_ejs", data);
  });
}

app.listen(3000, function() {
  console.log('Server On!');
});
