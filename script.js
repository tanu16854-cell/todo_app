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

function loadTasks() {

    fetch("http://localhost:3000/api/todos")
        .then(function(response) {
            return response.json();
        })
        .then(function(tasks) {

            console.log(tasks);

            taskList.innerHTML = "";

            tasks.forEach(function(todo) {

                const li = document.createElement("li");

                li.classList.add("task");

                li.dataset.id = todo.id;

                const taskSpan = document.createElement("span");

                taskSpan.textContent = todo.task;

                // Show completed status after refresh
                if (todo.completed === 1) {
                    taskSpan.classList.add("completed");
                }

                const deleteBtn = document.createElement("button");

                deleteBtn.classList.add("deleteBtn");

                deleteBtn.textContent = "×";

                const editBtn = document.createElement("button");

                editBtn.classList.add("editBtn");

                editBtn.textContent = "Edit";

                // Edit task
                editBtn.addEventListener("click", function() {

                    const currentText = taskSpan.textContent;

                    const newText = prompt("Edit your task:", currentText);

                    if (newText !== null && newText.trim() !== "") {

                        fetch("http://localhost:3000/api/todos/" + todo.id, {
                            method: "PUT",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                task: newText.trim(),
                                completed: todo.completed
                            })
                        })
                        .then(function(response) {
                            return response.json();
                        })
                        .then(function(result) {

                            console.log(result);

                            taskSpan.textContent = newText.trim();
                            todo.task = newText.trim();

                        })
                        .catch(function(error) {
                            console.log("Error updating task:", error);
                        });
                    }

                });

                // Delete task
                deleteBtn.addEventListener("click", function() {

                    fetch("http://localhost:3000/api/todos/" + todo.id, {
                        method: "DELETE"
                    })
                    .then(function(response) {
                        return response.json();
                    })
                    .then(function(result) {

                        console.log(result);

                        li.remove();

                        updateTaskCount();

                    })
                    .catch(function(error) {
                        console.log("Error deleting task:", error);
                    });

                });

                // Complete / Uncomplete task
                taskSpan.addEventListener("click", function() {

                    const newCompleted = todo.completed === 0 ? 1 : 0;

                    fetch("http://localhost:3000/api/todos/" + todo.id, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            task: todo.task,
                            completed: newCompleted
                        })
                    })
                    .then(function(response) {
                        return response.json();
                    })
                    .then(function(result) {

                        console.log(result);

                        todo.completed = newCompleted;

                        taskSpan.classList.toggle("completed");

                    })
                    .catch(function(error) {
                        console.log("Error updating completed status:", error);
                    });

                });

                li.appendChild(taskSpan);

                li.appendChild(deleteBtn);

                li.appendChild(editBtn);

                taskList.appendChild(li);

            });

            updateTaskCount();

        })
        .catch(function(error) {
            console.log("Error loading tasks:", error);
        });
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

    fetch("http://localhost:3000/api/todos", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            task: taskText
        })
    })
    .then(function(response) {
        return response.json();
    })
    .then(function(todo) {

        console.log(todo);

        const li = document.createElement("li");

        li.classList.add("task");

        li.dataset.id = todo.id;

        const taskSpan = document.createElement("span");

        taskSpan.textContent = todo.task;

        taskInput.value = "";

        const deleteBtn = document.createElement("button");

        deleteBtn.classList.add("deleteBtn");

        deleteBtn.textContent = "×";

        const editBtn = document.createElement("button");

        editBtn.classList.add("editBtn");

        editBtn.textContent = "Edit";

        // Edit new task
        editBtn.addEventListener("click", function() {

            const currentText = taskSpan.textContent;

            const newText = prompt("Edit your task:", currentText);

            if (newText !== null && newText.trim() !== "") {

                fetch("http://localhost:3000/api/todos/" + todo.id, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        task: newText.trim(),
                        completed: todo.completed
                    })
                })
                .then(function(response) {
                    return response.json();
                })
                .then(function(result) {

                    console.log(result);

                    taskSpan.textContent = newText.trim();

                    todo.task = newText.trim();

                })
                .catch(function(error) {
                    console.log("Error updating task:", error);
                });

            }

        });

        // Delete new task
        deleteBtn.addEventListener("click", function() {

            fetch("http://localhost:3000/api/todos/" + todo.id, {
                method: "DELETE"
            })
            .then(function(response) {
                return response.json();
            })
            .then(function(result) {

                console.log(result);

                li.remove();

                updateTaskCount();

            })
            .catch(function(error) {
                console.log("Error deleting task:", error);
            });

        });

        // Complete / Uncomplete new task
        taskSpan.addEventListener("click", function() {

            const newCompleted = todo.completed === 0 ? 1 : 0;

            fetch("http://localhost:3000/api/todos/" + todo.id, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    task: todo.task,
                    completed: newCompleted
                })
            })
            .then(function(response) {
                return response.json();
            })
            .then(function(result) {

                console.log(result);

                todo.completed = newCompleted;

                taskSpan.classList.toggle("completed");

            })
            .catch(function(error) {
                console.log("Error updating completed status:", error);
            });

        });

        li.appendChild(taskSpan);

        li.appendChild(deleteBtn);

        li.appendChild(editBtn);

        taskList.appendChild(li);

        updateTaskCount();

    })
    .catch(function(error) {
        console.log("Error adding task:", error);
    });
}

loadTasks();

console.log("Frontend connected");