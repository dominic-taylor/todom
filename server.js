var express = require('express')
var app = express()
var port = process.env.PORT || 3000
var Knex = require('knex')
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


// app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.static(path.join(__dirname, 'client')));

app.use(session({secret: 'ilovesecrets', resave: false, saveUninitialized: true}))
app.use(flash())

app.get('/logout', function (req, res) {
  console.log('logging out...');
  req.session.destroy()
  res.redirect('client/index.html')
})

app.get('/', function (req, res){
  console.log('res.ses', res.session);
  res.redirect('client/index.html')
})

app.post('/login', function (req, res) {
console.log('loged');
  knex('accounts').where({user_name: req.body.name})
  .then (function (data) {
    console.log('userdata ', data);
    if (req.body.name === '') {
      console.log('no user name!');
      res.redirect('/')
    }
    else if (req.body.pass == data[0].hash){
      req.session.name = req.body.name
      req.session.userId = data[0].id
      console.log('user '+ req.session.userId +' in session!');
      res.redirect('/')
    }
    else {
      console.log('wrong password');
      res.redirect('/')
    }
  })
  .catch(function (err) {
    console.log('error: ', err);
    res.sendStatus(403)
  })
})

app.post('/signup', function (req, res) {
  var usernameTaken = false;

  knex.select('user_name').from('accounts')
      .then(function (data){
        for(var i=0; i<data.length; i++){
          if (data[i].user_name == req.body.name){
            console.log('data.username taken ', data[i].user_name);
            usernameTaken = true;
          }
        }
        if(!usernameTaken){
          console.log(data.length);
          req.session.name = req.body.name
          req.session.userId = data.length + 1
          console.log('req.ses.uId ', req.session);
          req.session.save()
          return knex('accounts').insert({user_name: req.body.name, hash: req.body.pass})
        }
      })

 res.redirect('/login')
})

app.get('/api/v1/tasks', function (req, res) {
  console.log('req.session.userId ', req.session.userId);
  knex('accounts')
  .join('tasks', 'accounts.id', '=', 'tasks.userId')
  .select('*').where('userId', req.session.userId)
  .then(function(data){
    console.log('i think it is getting');
    res.send(data)
  })
  .catch(function (err) {
    console.log(err)
  })
})

app.post('/api/v1/save', function (req, res){ 
    var taskArr = req.body.tasks
    console.log('taskArr ', taskArr);
    console.log('req.ses ', req.session);
    knex('tasks')
      .insert({task: taskArr, user: req.session.name, userId: req.session.userId})
      .then(function (data) {
      console.log("Tasks saved for username ",req.session.name )
      console.log('and userId ', req.session.userId);
    })
    .catch(function(err){
      console.log(err);
    })
})

app.listen(port);
