document.addEventListener("DOMContentLoaded", function(event) {
   console.log("DOM fully loaded and parsed");




function addNewTodo(){
  var newTask = document.querySelector('input[type=text]').value
  var newTodo = document.createElement('li')
  newTodo.innerHTML = newTask + " <input type='radio' name='task' value=''>"

  var list = document.querySelector('ol')
  list.appendChild(newTodo)
}

function toDoComplete(todo){
  var taskList = document.getElementsById('tasks')
  for(i=0;i<taskList.length;i++){
      if(taskList.child[i]hasAttribute('checked'){
        remove[i]
      }
  }    
}

var listAdder = document.getElementById('add');
listAdder.addEventListener("click", addNewTodo, false);

var doneBtn = document.getElementById('done');
doneBtn.addEventListener("click", toDoComplete, false);
}); //DOM ready braces
