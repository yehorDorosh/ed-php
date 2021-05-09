const api = {
  read: {
    vars: ['y', 'z']
  },
  write: {
    vars: {
      y: 99999,
      z: 12,
    }
  }
};

const apiDelete = {
  all: false,
  vars: ['y', 'z']
}

function checkApi() {
  fetch('http://localhost:7777/api/api.php/', {
    method: 'POST',
    body: JSON.stringify(api)
  })
  .then(response => {
    if (response.ok) {
      return response.json();
    } else {
      console.log("Ошибка HTTP: " + response.status);
    }
  })
  .then(data => {
    console.log(data);
  })
  .catch(error => console.log(error));
}

function checkApiDelete() {
  fetch('http://localhost:7777/api/api.php/', {
    method: 'DELETE',
    body: JSON.stringify(apiDelete)
  })
  .then(response => {
    if (response.ok) {
      return response.json();
    } else {
      console.log("Ошибка HTTP: " + response.status);
    }
  })
  .then(data => {
    console.log(data);
  })
  .catch(error => console.log(error));
}

function checkApiGet() {
  fetch('http://localhost:7777/api/api.php?readVarName=egor')
  .then(response => {
    if (response.ok) {
      return response.json();
    } else {
      console.log("Ошибка HTTP: " + response.status);
    }
  })
  .then(data => {
    console.log(data);
  })
  .catch(error => console.log(error));
}
