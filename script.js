const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");
addBtn.addEventListener("click", addTask);
taskInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
    addTask();
}
});
const savedTasks = localStorage.getItem("tasks");
if (savedTasks) {
    taskList.innerHTML = savedTasks;
    const savedTaskItems = taskList.querySelectorAll(".task");
    savedTaskItems.forEach(function(li) {
const deleteBtn = li.querySelector(".deleteBtn");
const taskSpan = li.querySelector("span");
taskSpan.addEventListener("click", function() {
taskSpan.classList.toggle("completed");
localStorage.setItem("tasks", taskList.innerHTML);
});
deleteBtn.addEventListener("click", function() {
li.remove();
localStorage.setItem("tasks", taskList.innerHTML);
});
});
updateTaskCount();
}
function updateTaskCount() {
const totalTasks = taskList.children.length;
taskCount.textContent = "Total Tasks: " + totalTasks;
}
function addTask() {
const taskText = taskInput.value.trim();
if (taskText === "") {
    return;
}
const li = document.createElement("li");

li.classList.add("task");

const taskSpan = document.createElement("span");
taskSpan.textContent = taskText;


taskInput.value = "";

const deleteBtn = document.createElement("button");
deleteBtn.classList.add("deleteBtn");
deleteBtn.textContent = "Delete";
li.appendChild(deleteBtn);
deleteBtn.addEventListener("click", function() {
    li.remove();
    localStorage.setItem("tasks", taskList.innerHTML);
});

li.appendChild(taskSpan);
taskSpan.addEventListener("click", function() {
    taskSpan.classList.toggle("completed");
    localStorage.setItem("tasks", taskList.innerHTML);
});
taskList.appendChild(li);
localStorage.setItem("tasks", taskList.innerHTML);
updateTaskCount();
}