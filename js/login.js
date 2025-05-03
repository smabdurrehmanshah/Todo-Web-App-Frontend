window.addEventListener('pageshow', () => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if(currentUser)
    window.location.href = '../home.html';
});

const form = document.getElementById('form');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const user = {
    email: event.target.floatingInput.value,
    password: event.target.floatingPassword.value
  }

  try {
    const response = await fetch('https://todo-web-app-backend.vercel.app/api/todoApp/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    });

    const data = await response.json();
    if (response.ok) {
      alert(data.message);
      event.target.reset();
      localStorage.setItem('currentUser', JSON.stringify(data.currentUser));
      window.location.href = '../home.html';
    }
    else {
      alert(data.message);
    }
  } 
  catch (error) {
    console.log('Error: ', error);
    alert('Something went wrong');
  }

});