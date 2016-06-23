var express = require('express')
var app = express()
var port = process.env.PORT || 3000
var Knex = require('knex')
var passport = require('passport')
var flash = require('connect-flash')
var path = require('path')

var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var session = require('express-session')

var knexConfig = ('./knexfile.js')

var env = process.env.NODE_ENV || 'development'
var knex = Knex({
  client: 'postgresql',
  connection: {
    database: 'todo'
  }
});


app.use(cookieParser())
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'client')));

app.use(session({ secret: 'ilovesecrets' }))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

app.get('/', function (req, res){
  res.redirect('client/index.html')
})

app.get('/login', function (req, res) {
  
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

app.listen(port);
