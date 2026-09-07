const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
addBtn.addEventListener("click", addTask);
taskInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
    addTask();
}
});
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
});

li.appendChild(taskSpan);
taskSpan.addEventListener("click", function() {
    taskSpan.classList.toggle("completed");
});
taskList.appendChild(li);
}