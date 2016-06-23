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
  knex.select('*').from('tasks').where({id: 1})
    .then(function(data){
      res.send(data)
    })
    .catch(function (err) {
        console.log(err)
    })
})

app.post('/api/v1/save', function (req, res){
    var taskArr = req.body.tasks
    console.log('taskArr ', taskArr);
    knex('tasks')
      .where('id', '=', 1)
      .update({task: taskArr})
      .then(function (data) {
      console.log("Tasks saved")
    })
    .catch(function(err){
      console.log(err);
    })
})

var port = app.listen(process.env.PORT || 3000)
app.listen(port);
