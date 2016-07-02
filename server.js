process.env.NODE_ENV = process.env.NODE_ENV || 'development'
var dotenv = require('dotenv').load()
var express = require('express')
var path = require('path')
var bodyParser = require('body-parser')
var flash = require('connect-flash')
var bcrypt = require('bcryptjs')
var Knex = require('knex')
var cookieParser = require('cookie-parser')
var session = require('express-session')

var knexConfig = require('./knexfile')
var knex = Knex(knexConfig[process.env.NODE_ENV || 'development'])

var app = express()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.static(path.join(__dirname, 'client')));

app.use(session({secret: 'ilovesecrets', resave: false, saveUninitialized: true}))
app.use(flash())

app.get('/logout', function (req, res) {
  req.session.destroy()
  res.redirect('/')
})

app.post('/login', function (req, res) {
  knex('accounts').where({user_name: req.body.name})
  .then (function (data) {
    if (bcrypt.compareSync(req.body.pass, data[0].hash)){
      req.session.name = req.body.name
      req.session.userId = data[0].id
      return res.json({user: req.session.name, notUser: ''})
    }
    else {
      return res.json({user: '', notUser: "True"})
    }
  })
  .catch(function (err) {
    req.session.destroy()
    console.log('error: ', err);
    res.sendStatus(403)
  })
})

app.post('/signup', function (req, res) {
  var usernameTaken = false;
  var hash = bcrypt.hashSync(req.body.pass)
  knex.select('user_name').from('accounts')
      .then(function (data){
        for(var i=0; i<data.length; i++){
          if (data[i].user_name == req.body.name){
            usernameTaken = true;
          }
        }
        if(!usernameTaken){
          req.session.name = req.body.name
          req.session.userId = data.length + 1
          req.session.save()
          res.json({user: req.body.name})
          return knex('accounts').insert({user_name: req.body.name, hash: hash})
        }
        else return res.json({user: req.body.name+' username taken'})
      })
})

app.get('/api/v1/tasks', function (req, res) {
  knex('accounts')
  .join('tasks', 'accounts.id', '=', 'tasks.userid')
  .select('*').where('userid', req.session.userId)
  .then(function(data){
    res.json(data[0].task)
  })
  .catch(function (err) {
    console.log(err)
  })
})

app.post('/api/v1/save', function (req, res){ //check if user has tasks already and update data.
    var taskArr = req.body.tasks
    var newTasksEntry = true;
    knex.select('userid').from('tasks') // if undefined, insert, if found upodate
        .then(function (data){
          for(var i=0; i<data.length; i++){
            if (data[i].userid == req.session.userId){
              newTasksEntry = false;
            }
          }
          if(newTasksEntry) {
            return knex('tasks')
                    .insert({username: req.session.name, userid: req.session.userId, task: JSON.stringify(taskArr)})
          } else {
            return knex('tasks')
                        .where('userid', req.session.userId).update({task: JSON.stringify(taskArr)})
                        .catch(function(err){
                        console.log(err);
                        })
            }
          })
          res.end()

})

var port = process.env.PORT || 3000
app.listen(port);
