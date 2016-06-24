var express = require('express')
var app = express()
var port = process.env.PORT || 3000
var Knex = require('knex')
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
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


passport.use(new LocalStrategy({
    usernameField: 'user',
    passwordField: 'pass'
  },
  function(username, password, done) {
      console.log('login process: ', username);
      return done('SELECT user_id, user_name FROM users WHERE user_name=$1 AND user_pass=$2', username, password)
    .then( function (result){
      return done(null, result)
    })
  .catch( function (err){
      console.log("/login: " + err);
      return done(null, false, {message: 'wrong username or password'})
    })
}))

passport.serializeUser(function(user, done){
  done(null, user.user_id)
})

passport.deserializeUser(function(id, done) {
  done("SELECT user_id, user_name FROM users user_id  =$1", id)
  .then( function(user){
    done(null, user)
  })
  .catch(function (err){
    done(new Error('User with the id ${id} does not exist'))
  })
})

app.post('/',
  passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/',
                                   failureFlash: true}))


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

app.listen(port);
