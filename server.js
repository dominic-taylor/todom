// var dotenv = require('dotenv').load()
var express = require('express')
var port = process.env.PORT || 3000
var Knex = require('knex')
var flash = require('connect-flash')
var path = require('path')
var bcrypt = require('bcryptjs')

var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var session = require('express-session')

var knexConfig = ('./knexfile.js')

process.env.NODE_ENV = process.env.NODE_ENV || 'development'
var knex = Knex(knexConfig[process.env.DATABASE_URL || 'development'])

var app = express()
// var knex = Knex({
//   client: 'postgresql',
//   connection: {
//     database: 'todo'
//   },
//   pool: {
//     min:2,
//     max:10
//   },
//   production: process.env.DATABASE_URL
// });


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
if (req.body.name === '') {
  console.log('no user name!');
  res.redirect('client/index.html')
}
  knex('accounts').where({user_name: req.body.name})
  .then (function (data) {
    console.log('userdata ', data);
    if (bcrypt.compareSync(req.body.pass, data[0].hash)){
      req.session.name = req.body.name
      req.session.userId = data[0].id
      console.log('user '+ req.session.userId +' in session!');
      res.redirect('client/index.html')
    }
    else {
      console.log('wrong password');
      res.redirect('client/index.html')
    }
  })
  .catch(function (err) {
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
          return knex('accounts').insert({user_name: req.body.name, hash: hash})
        }
      })

      res.redirect('client/index.html')
 // i think i have to be expliciti with redirect i.e '/client/index.html' ?
})

app.get('/api/v1/tasks', function (req, res) { // try to get latest tasks for user or..
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

app.post('/api/v1/save', function (req, res){ //check if user has tasks already and update data.
    var taskArr = req.body.tasks
    var newTasksEntry = true;

    knex.select('userId').from('tasks') // if undefined, insert, if found upodate
        .then(function (data){
          for(var i=0; i<data.length; i++){
            console.log('for loop data ', data);
            console.log('req.ses.userId ', req.session.userId);
            if (data[i].userId == req.session.userId){
              console.log('userId has already saved tasks ', data[i].user);
              newTasksEntry = false;
            }
          }
          if(newTasksEntry) {
            return knex('tasks')
                    .insert({user: req.session.name, userId: req.session.userId, task: taskArr})
                    .then(function (data) {
                    console.log("new tasks array saved for ",req.session.name )
                    console.log('userId ', req.session.userId);
                    })
          } else {
            return knex('tasks')
                        .where('userId', req.session.userId).update({task: taskArr})
                        .then(function (data) {
                        console.log("Tasks updated for username ",req.session.name )
                        console.log('and userId ', req.session.userId);
                      })
                      .catch(function(err){
                        console.log(err);
                      })
            }
          })
  res.redirect('client/index.html')

})

app.listen(port);
