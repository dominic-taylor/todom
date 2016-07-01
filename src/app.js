document.addEventListener("DOMContentLoaded", function(event) {

var request = require('superagent')

document.querySelector('body').addEventListener('click', function(e){
  if(e.target.id === 'logIn'){
    e.target.addEventListener("click", checkUser, false);
  }
  if(e.target.id == 'signUp'){
  signUp.addEventListener("click", addUser, false);
  }
  if(e.target.id == 'getTasksBtn'){
    e.target.addEventListener("click", getSavedTasks, false);
  }
  if(e.target.id === 'saveTasksBtn'){
    e.target.addEventListener("click", saveTasks, false);
  }
  if(e.target.id === 'logOutBtn'){
    e.target.addEventListener("click", logOutUser, false);
  }
})

var inSess = "<form id='taskForm'> <button id='getTasksBtn' class='btn' type='button' name='name' value=''>My List</button>   <button id='saveTasksBtn' class='btn' type='button' name='name' value=''>Save List</button> <button id='logOutBtn' class='btn' type='button' name='name' value=''>Logout</button> </div> "

var outSess = "<div id='inSession'>      <form action='/login' method='post'>        <input id='userName' ='text' name='username' onclick='this.select()' value='username'> <input id='userPass' type='password' name='password' onclick='this.select()'  value='password'>  </form>  <button id='logIn' class='btn' type='button' name='email'>Login</button> <button id='signUp' class='btn' type='button' name='email'>Sign Up</button>  </div> </div> "

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
         document.getElementById('buttons').innerHTML = inSess
         setMessage('Hey, '+ res.body.user)
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
      document.getElementById('buttons').innerHTML = inSess
      setMessage(res.body.user+"'s week")
    })
}

function logOutUser() {
  console.log('logout route hit');
  request
    .get('/logout')
    .end(function (err, res) {
      if(err) console.log(err);
      setMessage('Logged Out!')
      document.getElementById('buttons').innerHTML = outSess
      document.getElementsByClassName("new").reset()
    })
}
function setMessage(message) {
  var indicator = document.getElementById('message')
  indicator.innerHTML = message

}
function saveTasks(){
  var list = getTaskData()
  request
    .post('/api/v1/save')
    .send({"tasks":list})
    .end(function(err, res){
      if(err) console.log(err);
      message = document.getElementById('message')
      message.innerHTML = 'Tasks Saved'
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
