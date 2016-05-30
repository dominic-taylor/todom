document.addEventListener("DOMContentLoaded", function(event) {
   console.log("DOM fully loaded and parsed");

function addNewTodo(){
  var newTask = document.querySelector('input[type=text]').value
  var newTodo = document.createElement('li')
  newTodo.innerHTML = newTask

  var list = document.querySelector('ol')
  list.appendChild(newTodo)
}

function removeTask() {
  var list = document.querySelector('ol')
  var doneItems = document.getElementsByTagName('li')
  var looplen = doneItems.length;
  for(var i =0; i<looplen; i++) {
    if (doneItems[i].style.backgroundColor == 'rgba(0, 188, 212, 0.631373)'){
      list.removeChild(doneItems[i]);
    }
  }
}

var listAdder = document.getElementById('add');
listAdder.addEventListener("click", addNewTodo, false);

var taskList = document.getElementById('list');
taskList.addEventListener('click', function (event) {

    if (event.target.tagName === 'LI' && event.target.style.backgroundColor != 'rgba(0, 188, 212, 0.631373)') {
        event.target.style.backgroundColor = 'rgba(0, 188, 212, 0.63)'
    }
    else {
      event.target.style.backgroundColor = ''
    }
}, false);

var doneBtn = document.getElementById('done');
doneBtn.addEventListener("click", removeTask, false);
}); //DOM ready braces
