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


app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.static(path.join(__dirname, 'client')));

app.use(session({
  secret: 'ilovesecrets', resave: true, saveUninitialized: true}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

// How to login properly? does not seem to hit this at all.
passport.use('local-login', new LocalStrategy(
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
  done("SELECT user_id, user_name FROM accounts user_id=$1", id)
  .then( function(user){
    done(null, user)
  })
  .catch(function (err){
    done(new Error('User with the id ${id} does not exist'))
  })
})

//
// app.post('/login',
//   passport.authenticate('local-login', { successRedirect: '/',
//                                    failureRedirect: '/fail.html',
//                                    failureFlash: true})
// )

app.post('/login', function (req, res) {
  knex('accounts').where({user_name: req.body.name})
  .then (function (data) {
    console.log('userdata ', data);
    if (req.body.name === '') {
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
app.get('logout', function (req, res) {
  req.session.destroy()
  res.redirect('/')
})
app.get('/', function (req, res){
  res.redirect('client/index.html')
})


app.post('/signup', function (req, res) {
  console.log('user written ', req.body.name, req.body.pass);
  knex('accounts')
    .insert({user_name: req.body.name, hash: req.body.pass})
    .then(function (data) {
      console.log('signup data ', data);
      req.session.userId = data[0].id
      req.session.name = req.body.name

      console.log('user written ', req.session);
      res.redirect('/')
    })
})

app.get('/api/v1/tasks', function (req, res) {
  console.log('req.session.user ', req.session.userId);
  knex('accounts')
  .join('tasks', 'user_name', '=', 'tasks.user')
  .select('*').where('userId', req.session.userId)//username:req.user ( ? )
  .then(function(data){
    console.log('i think it is getting, but no saved data yet');
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
      .insert({task: taskArr, user: req.session.name, userId: req.session.userId})
      .then(function (data) {
      console.log("Tasks saved")
    })
    .catch(function(err){
      console.log(err);
    })
})

app.listen(port);
