window.addEventListener('pageshow', () => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if(currentUser)
    window.location.href = '../home.html';
});

const form = document.getElementById('form');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const user = {
    fullName: event.target.floatingName.value,
    email: event.target.floatingEmail.value,
    password: event.target.floatingPassword.value
  };

  try {
    const response = await fetch('https://todo-web-app-backend.vercel.app/api/todoApp/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    });

    const data = await response.json();

    if(response.ok) {
      alert(data.message);
      event.target.reset();
      window.location.href = '../login.html';
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