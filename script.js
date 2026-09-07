const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
addBtn.addEventListener("click", addTask);
function addTask() {
const taskText = taskInput.value.trim();
if (taskText === "") {
    return;
}
const li = document.createElement("li");
taskSpan.textContent = taskText;

taskList.appendChild(li);
taskInput.value = "";

const deleteBtn = document.createElement("button");
deleteBtn.textContent = "Delete";
li.appendChild(deleteBtn);
deleteBtn.addEventListener("click", function() {
    li.remove();
});
const taskSpan = document.createElement("span");
li.appendChild(taskSpan);
taskSpan.addEventListener("click", function() {
    taskSpan.classList.toggle("completed");
});
}