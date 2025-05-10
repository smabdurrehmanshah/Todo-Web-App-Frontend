const currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (!currentUser) {
  window.location.href = "../login.html";
} else {
  userName.textContent = currentUser.Full_Name;
}

let currentTodos = [];

(async function getTodos() {
  try {
    const response = await fetch(
      `https://todo-web-app-backend.vercel.app/api/todoApp/getTodos?userId=${currentUser.User_ID}`
    );
    const data = await response.json();

    if (data.success) {
      currentTodos = [...data.todos];
      renderTodos();
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.log("Error: ", error);
    alert("Something went wrong");
  }
})();

const form = document.getElementById("form");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const todo = {
    todoText: event.target.todoInput.value.trim(),
    reference: currentUser.User_ID,
  };

  const response = await fetch(
    "https://todo-web-app-backend.vercel.app/api/todoApp/addTodo",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(todo),
    }
  );

  const data = await response.json();

  if (data.success) {
    currentTodos.push(data.todo);
    renderTodos();
  } else {
    alert(data.message);
  }

  event.target.reset();
});

async function renderTodos() {
  const ulElement = document.querySelector(".list-group");
  ulElement.innerHTML = "";

  currentTodos.forEach((item) => {
    const iconClass = item.IsCompleted
      ? "fa-solid fa-circle-check text-success fs-4"
      : "fa-regular fa-circle text-secondary fs-4";
    const textDecoration = item.IsCompleted ? "line-through" : "none";
    const textColor = item.IsCompleted ? "grey" : "#545454";

    ulElement.innerHTML += ` <li class="list-group-item mb-2">
                              <div class="first-div d-flex align-items-center column-gap-2">
                                <i role="button" class="${iconClass}"></i>
                                <input class="w-100 todo-input" type="text" value="${item.Todo}" style="text-decoration: ${textDecoration}; color: ${textColor}" disabled>
                              </div>
                              <div>
                                <button class="btn btn-success edit-btn">Edit</button>
                                <button class="btn btn-danger delete-btn">Delete</button>
                              </div>
                            </li>`;
  });

  // Todo Completion Status

  const checkboxes = document.querySelectorAll(".first-div > i");
  const todoInputs = document.querySelectorAll(".first-div > input");

  checkboxes.forEach((checkbox, index) => {
    checkbox.addEventListener("click", async () => {
      const todoId = currentTodos[index].Todo_ID;
      const input = todoInputs[index];

      let IsCompleted = false;

      if (checkbox.classList.contains("fa-regular")) {
        checkbox.className = "fa-solid fa-circle-check text-success fs-4";
        input.style.textDecoration = "line-through";
        input.style.color = "grey";
        IsCompleted = true;
      } else {
        checkbox.className = "fa-regular fa-circle text-secondary fs-4";
        input.style.textDecoration = "none";
        input.style.color = "#545454";
        IsCompleted = false;
      }

      try {
        const response = await fetch(
          "https://todo-web-app-backend.vercel.app/api/todoApp/editTodo",
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              todoId,
              newTodoText: input.value,
              IsCompleted,
            }),
          });

        const data = await response.json();

        if(data.success) {
          currentTodos[index].Todo = data.updatedTodo.newTodoText;
          currentTodos[index].IsCompleted = data.updatedTodo.IsCompleted;
          renderTodos();
        }
        else {
          alert(data.message);
        }
      }
      catch (error) {
        console.log('Error: ', error);
      }
    });
  });

  // DELETE TODO

  const deleteBtn = document.querySelectorAll(".delete-btn");

  deleteBtn.forEach((button, index) => {
    button.addEventListener("click", async () => {
      const todoId = currentTodos[index].Todo_ID;

      try {
        const response = await fetch(
          "https://todo-web-app-backend.vercel.app/api/todoApp/deleteTodo",
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ todoId }),
          }
        );

        const data = await response.json();

        if (data.success) {
          currentTodos.splice(index, 1);
          renderTodos();
        } else {
          alert(data.message);
        }
      } catch (error) {
        console.log("Error: ", error);
        alert("Something went wrong while deleting the todo");
      }
    });
  });

  // EDIT TODO

  const editButtons = document.querySelectorAll(".edit-btn");
  const inputFields = document.querySelectorAll(".todo-input");

  editButtons.forEach((editBtn, index) => {
    editBtn.addEventListener("click", async () => {
      const todoId = currentTodos[index].Todo_ID;
      const inputField = inputFields[index];

      if (editBtn.innerText === "Edit") {
        inputField.disabled = false;
        inputField.focus();
        editBtn.innerText = "Save";
      } else {
        inputField.disabled = true;

        try {
          const response = await fetch(
            "https://todo-web-app-backend.vercel.app/api/todoApp/editTodo",
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                todoId: todoId,
                newTodoText: inputField.value,
                IsCompleted: 0,
              }),
            }
          );

          const data = await response.json();

          if (data.success) {
            currentTodos[index].Todo = data.updatedTodo.newTodoText;
            editBtn.innerText = "Edit";
            renderTodos();
          } else {
            alert(data.message);
          }
        } catch (error) {
          console.log("Error: ", error);
          alert("Something went wrong while editing the todo");
        }
      }
    });
  });
}

const logoutBtn = document.getElementById("logout-btn");

logoutBtn.addEventListener("click", (event) => {
  localStorage.removeItem("currentUser");
  window.location.href = "../login.html";
});
