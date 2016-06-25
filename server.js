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

// How to login properly? does not seem to hit this at all.
passport.use(new LocalStrategy({
    usernameField: 'user',
    passwordField: 'pass'
  },
  function(username, password, done) {
      console.log('login process: ', username);
      return done('SELECT user_name FROM accounts WHERE user_name=$1 AND user_pass=$2', username, password)
    .then( function (result){
      console.log('login sucess ', username);
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
  done("SELECT user_id, user_name FROM accounts user_id  =$1", id)
  .then( function(user){
    done(null, user)
  })
  .catch(function (err){
    done(new Error('User with the id ${id} does not exist'))
  })
})


app.post('/login',
  passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/',
                                   failureFlash: true})
)

app.get('/', function (req, res){
  res.redirect('client/index.html')
})

app.get('/api/v1/tasks', function (req, res) {
  console.log('req etc ', req.user);
  knex('users')
    .join('tasks', 'user_name', '=', 'tasks.user')
    .select('*').where(user_name, 'John')//username:req.user ( ? )
    .then(function(data){
      res.send(data)
    })
    .catch(function (err) {
        console.log(err)
    })
})

app.post('/signup', function (req, res) {
  console.log('user written ', req.body.name, req.body.pass);
  knex('accounts')
    .insert({user_name: req.body.name, hash: req.body.pass})
    .then(function () {
      console.log('user written');
      res.redirect('/')
    })
})

app.post('/api/v1/save', function (req, res){
    var taskArr = req.body.tasks
    console.log('user? ',req);
    // username = req.body.user?
    console.log('taskArr ', taskArr);
    knex('tasks')
      .insert({task: taskArr, user: username})
      .then(function (data) {
      console.log("Tasks saved")
    })
    .catch(function(err){
      console.log(err);
    })
})

app.listen(port);
