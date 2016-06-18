var request = require('superagent')

document.addEventListener("DOMContentLoaded", function(event) {

var dayList = document.getElementsByClassName('new');// list elements
dayList.addEventListener('click', function (event) {

 if (event.target.tagName === 'LI' && event.target.style.backgroundColor != 'rgba(0, 188, 212, 0.631373)') {
   event.target.style.backgroundColor = 'rgba(0, 188, 212, 0.63)'
 }
 else {
   event.target.style.backgroundColor = ''
 }
}, false);


var submitTask = document.getElementById('taskForm')
submitTask.addEventListener("submit", function(e){
 e.preventDefault()
 addNewTodo()
}, false);


var getTasksBtn = document.getElementById('getTasksBtn')
getTasksBtn.addEventListener("click", getSavedTasks, false);

var saveTasksBtn = document.getElementById('saveTasksBtn')
saveTasksBtn.addEventListener("click", saveTasks, false);


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
    console.log('listener hooked up '+ taskData[i].innerHTML)
    taskArr[i] = taskData[i].innerHTML
  }
  return taskArr
}

function getSavedTasks() {
  request
  .get('/api/v1/tasks')
  .end(function(err, res){
    var savedTasks = JSON.parse(res.body)
    displayTasks(savedTasks)
  })
}

function displayTasks(savedTasks) {

  var loopLen = Object.keys(savedTasks.tasks).length
  for(var i = 0; i < loopLen; i++){
    addNewTodo(savedTasks.tasks[i])
  }
}

function addNewTodo(task){
  var newTask = task
  // if (!task){ newTask = document.querySelector('input[type=text]').value }

  var newTodo = document.createElement('li')
  newTodo.innerHTML = newTask

  var list = document.querySelector('ol')
  list.appendChild(newTodo)
}


}); //DOM ready braces
