var request = require('superagent')

document.addEventListener("DOMContentLoaded", function(event) {
   console.log("DOM fully loaded and parsed");

   var taskList = document.getElementById('list');
   taskList.addEventListener('click', function (event) {

     if (event.target.tagName === 'LI' && event.target.style.backgroundColor != 'rgba(0, 188, 212, 0.631373)') {
       event.target.style.backgroundColor = 'rgba(0, 188, 212, 0.63)'
     }
     else {
       event.target.style.backgroundColor = ''
     }
   }, false);

   var taskDoneBtn = document.getElementById('done');
   taskDoneBtn.addEventListener("click", removeTask, false);

   var taskForm = document.getElementById('taskForm')
   taskForm.addEventListener("submit", function(e){
     e.preventDefault()
     addNewTodo()
   }, false);

   var getTasks = document.getElementById('getTasks')
   getTasks.addEventListener("click", getSavedTasks, false);

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
  if (!task){ newTask = document.querySelector('input[type=text]').value  }

  var newTodo = document.createElement('li')
  newTodo.innerHTML = newTask

  var list = document.querySelector('ol')
  list.appendChild(newTodo)
}

function removeTask() {
  var list = document.querySelector('ol')
  var doneItems = document.getElementsByTagName('li')
  var listLength = doneItems.length;
  var i = 0;
  while(i<listLength) {
    if (doneItems[i].style.backgroundColor == 'rgba(0, 188, 212, 0.631373)'){
      list.removeChild(doneItems[i]);
    }
    i++
  }
}

}); //DOM ready braces
