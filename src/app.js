var request = require('superagent')

document.addEventListener("DOMContentLoaded", function(event) {

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
  console.log('taskData ', taskData);
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
    var saved = JSON.parse(res.body)
    console.log('res.body cli ', res.body);
    console.log('saved.tasks ', saved.tasks[8]);
    displayTasks(saved)
  })
}

function displayTasks(savedTasks) {
  var loopLen = Object.keys(savedTasks.tasks).length
  for(var i = 0; i < loopLen; i++){
    addNewTodo(savedTasks.tasks[i])
  }
}

function addNewTodo(task){ // need to change this in new set up
  var dayPoints = document.getElementsByClassName('new')
  console.log('task ', task);
  console.log('daypoints  ', dayPoints);
  for (var i = 0; i < dayPoints.length; i++) {
    dayPoints[i].value = task[i]
  }
}


}); //DOM ready braces
