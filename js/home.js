const currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (!currentUser) {
  window.location.href = "../login.html";
} else {
  userName.textContent = currentUser.Full_Name;
}

let currentTodos = [];

(async function getTodos() {
  try {
    const response = await fetch(`https://todo-web-app-backend.vercel.app/api/todoApp/getTodos?userId=${currentUser.User_ID}`);
    const data = await response.json();
  
    if (data.success) {
      currentTodos = [...data.todos];
      renderTodos();
    }
    else {
      alert(data.message);
    }
  }
  catch (error) {
    console.log('Error: ', error);
    alert('Something went wrong');
  }
})();


const form = document.getElementById("form");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const todo = {
    todoText: event.target.todoInput.value.trim(),
    reference: currentUser.User_ID
  };

  const response = await fetch('https://todo-web-app-backend.vercel.app/api/todoApp/addTodo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(todo)
  });

  const data = await response.json();

  if (data.success) {
    alert(data.message);
    currentTodos.push(data.todo);
    renderTodos();
  }
  else {
    alert(data.message);
  }

  event.target.reset();
});


async function renderTodos() {
  const ulElement = document.querySelector(".list-group");
  ulElement.innerHTML = "";
  
  currentTodos.forEach(item => {
    ulElement.innerHTML += ` <li class="list-group-item mb-2">
                              <input class="todo-input" type="text" value="${item.Todo}" disabled>
                              <div>
                                <button class="btn btn-success edit-btn">Edit</button>
                                <button class="btn btn-danger delete-btn">Delete</button>
                              </div>
                            </li>`;
  });

  // DELETE TODO 
  
  const deleteBtn = document.querySelectorAll(".delete-btn");

  deleteBtn.forEach((button, index) => {
    button.addEventListener("click", async () => {
      const todoId = currentTodos[index].Todo_ID;
  
      try {
        const response = await fetch('https://todo-web-app-backend.vercel.app/api/todoApp/deleteTodo', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({todoId})
        });
  
        const data = await response.json();
  
        if (data.success) {
          currentTodos.splice(index,1);
          renderTodos();
        }
        else {
          alert(data.message);
        }
      }
      catch (error) {
        console.log('Error: ', error);
        alert('Something went wrong while deleting the todo');
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
          const response = await fetch('https://todo-web-app-backend.vercel.app/api/todoApp/editTodo', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              todoId: todoId,
              newTodoText: inputField.value
            })
          });

          const data = await response.json();
        
          if(data.success) {
            currentTodos[index].Todo = data.updatedTodoText;
            editBtn.innerText = 'Edit';
            renderTodos();
          }
          else {
            alert(data.message);
          }
        }
        catch (error) {
          console.log('Error: ', error);
          alert('Something went wrong while editing the todo');
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
