var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var fs = require('fs');
var Knex = require('knex')

var knexConfig = ('./knexfile.js')
var env = process.env.NODE_ENV || 'development'
var knex = Knex({
  client: 'postgresql',
  connection: {
    database: 'todo'
  }
});

var app = express();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'client')));

app.get('/', function (req, res){
  res.redirect('client/index.html')
})

app.get('/api/v1/tasks', function (req, res) {
  fs.readFile('data/db.json', 'utf8', function (err, data){
      if (err) throw err
      res.json(data)
    }
  )
})

app.post('/api/v1/save', function (req, res){


console.log('req.body ', req.body);
    var taskArr = req.body.tasks
console.log('taskarr ', taskArr[0]);
    knex.insert({task: taskArr}).into('tasks')
    .then(function (data) {
      console.log("Tasks saved")
    })
    .catch(function(err){
      console.log(err);
    })
     // var tasks = JSON.stringify(req.body)
    // fs.writeFile('data/db.json', tasks, 'utf-8', function (err){
    // if (err) throw err
})

var port = app.listen(process.env.PORT || 3000)
app.listen(port);

//
// var server = app.listen(app.get('port'), function() {
//   var port = server.address().port;
//   console.log('Server is up on port '+port);
// });
