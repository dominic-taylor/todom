document.addEventListener("DOMContentLoaded", function(event) {

var request = require('superagent')
var sessionButtons = require('../views/sessButtons.hbs')
var ready = false;
if (ready) {
var getTasksBtn = document.getElementById('getTasksBtn')
getTasksBtn.addEventListener("click", getSavedTasks, false);

var saveTasksBtn = document.getElementById('saveTasksBtn')
saveTasksBtn.addEventListener("click", saveTasks, false);

var logOut = document.getElementById('logOutBtn')
logOut.addEventListener("click", logOutUser, false);
}
var logIn = document.getElementById('logIn')
logIn.addEventListener("click", checkUser, false);

var signUp = document.getElementById('signUp')
signUp.addEventListener("click", addUser, false);
 var sess = '<div id='inSession'>
   <button id='getTasksBtn' class='btn' type="button" name="name" value="">My List</button>
   <button id='saveTasksBtn' class='btn' type="button" name="name" value="">Save List</button>
   <button id='logOutBtn' class='btn' type="button" name="name" value="">Logout</button>
 </div>'


function parseUser() {
  var  user = document.getElementById('userName').value
  var  pass = document.getElementById('userPass').value
  // if(user.length || pass.length<1) {
  //   return 'Invalid user or pass'
  // }
  return { name: user, pass: pass  }

}
function addUser() {
var user = parseUser()

  request
    .post('/signup')
    .send(user)
    .end(function (err, res) {
        if (res.body.user){
         console.log('res.body', res.body);
         ready = true;
         var matches = document.querySelectorAll('div#outSession');
         matches.innerHTML = sess
       }
     })
}

function checkUser() {
var user = parseUser()

  request
    .post('/login')
    .send(user)
    .end(function (err, res){
      console.log('res.body', res.body);
      var matches = document.querySelectorAll('div#outSession');
      console.log(matches);
      matches.innerHTML =   sessionButtons
    })
}

function logOutUser() {
  console.log('logout route hit');
  request
    .get('/logout')
    .end(function (err, res) {
      if(err) console.log(err);
    })
}

function saveTasks(){
  var list = getTaskData()
  request
    .post('/api/v1/save')
    .send({"tasks":list})
    .end(function(err, res){
      if(err) console.log(err);
    })
}

function getTaskData() {
  var taskData = document.getElementsByClassName('new')
  var taskArr = []
  for (var i=0; i<taskData.length; i++){
    console.log('listener hooked up '+ taskData[i].value)
    taskArr[i] = taskData[i].value
  }
  return taskArr
}

function getSavedTasks() {
  request
  .get('/api/v1/tasks')
  .end(function(err, res){
    if (err) console.log(err);
    var saved = res.body[0].task
    savedarr = saved.substring(1, saved.length-1).split(",")
    displayTasks(savedarr)
  })
}

function displayTasks(savedTasks) {
  var dayPoints = document.getElementsByClassName('new')
  var loopLen = savedTasks.length
  for(var i = 0; i < loopLen; i++){
    dayPoints[i].value = savedTasks[i].replace(/"/g, "")
  }
}


}); //DOM ready braces
