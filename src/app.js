var request = require('superagent')
var bcrypt = require('bcryptjs')

document.addEventListener("DOMContentLoaded", function(event) {

var getTasksBtn = document.getElementById('getTasksBtn')
getTasksBtn.addEventListener("click", getSavedTasks, false);

var saveTasksBtn = document.getElementById('saveTasksBtn')
saveTasksBtn.addEventListener("click", saveTasks, false);

var logIn = document.getElementById('logIn')
logIn.addEventListener("click", checkUser, false);

var signUp = document.getElementById('signUp')
signUp.addEventListener("click", addUser, false);


function addUser() {
  user = document.getElementById('userName').value
  pass = document.getElementById('userPass').value
  // bcrypt.genSalt(10, function(err, salt) {
  //   bcrypt.hash(pass, salt, function(err, hash){
  //
  //   })
  // })
  user = { name: user,
           pass: pass  }

  request
    .post('/signup')
    .send(user)
    .end(function (err, res) {
      if (err) console.log(err);
    })
}

function checkUser() {
  user = document.getElementById('userName').value
  pass = document.getElementById('userPass').value
  user = { name: user,
           pass: pass  }
  request
    .post('/login')
    .send(user)
    .end(function (err, res){
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
// update ?



//destroy ?
}); //DOM ready braces
