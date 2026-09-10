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

        const taskSpan = li.querySelector("span");
        const deleteBtn = li.querySelector(".deleteBtn");
        const editBtn = li.querySelector(".editBtn");

        editBtn.addEventListener("click", function() {

            const currentText = taskSpan.textContent;
            const newText = prompt("Edit your task:", currentText);

            if (newText !== null && newText.trim() !== "") {

                taskSpan.textContent = newText.trim();

                localStorage.setItem("tasks", taskList.innerHTML);
            }
        });

        taskSpan.addEventListener("click", function() {

            taskSpan.classList.toggle("completed");

            localStorage.setItem("tasks", taskList.innerHTML);
        });

        deleteBtn.addEventListener("click", function() {

            li.remove();

            localStorage.setItem("tasks", taskList.innerHTML);

            updateTaskCount();
        });
    });

    updateTaskCount();
}

function updateTaskCount() {

    const totalTasks = taskList.querySelectorAll(".task").length;

    taskCount.textContent = "Total Tasks: " + totalTasks;

    if (totalTasks === 0) {
        taskList.innerHTML =
            "<li class='empty-message'>📝 No tasks yet. Add your first task!</li>";
    }
}

function addTask() {

    const taskText = taskInput.value.trim();

    if (taskList.querySelector(".empty-message")) {
        taskList.innerHTML = "";
    }

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

    deleteBtn.textContent = "×";

    const editBtn = document.createElement("button");

    editBtn.classList.add("editBtn");

    editBtn.textContent = "Edit";

    // Task text, then Delete, then Edit
    li.appendChild(taskSpan);
    li.appendChild(deleteBtn);
    li.appendChild(editBtn);

    editBtn.addEventListener("click", function() {

        const currentText = taskSpan.textContent;

        const newText = prompt("Edit your task:", currentText);

        if (newText !== null && newText.trim() !== "") {

            taskSpan.textContent = newText.trim();

            localStorage.setItem("tasks", taskList.innerHTML);
        }
    });

    deleteBtn.addEventListener("click", function() {

        li.remove();

        localStorage.setItem("tasks", taskList.innerHTML);

        updateTaskCount();
    });

    taskSpan.addEventListener("click", function() {

        taskSpan.classList.toggle("completed");

        localStorage.setItem("tasks", taskList.innerHTML);
    });

    taskList.appendChild(li);

    localStorage.setItem("tasks", taskList.innerHTML);

    updateTaskCount();
}