const localEnv = 'http://localhost:7777';
const prodEnv = 'http://35.178.207.100';
const host = window.ENV_MODE ? prodEnv : localEnv;

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
  fetch(`${host}/api/api.php/`, {
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
  fetch(`${host}/api/api.php/`, {
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
  fetch(`${host}/api/api.php?readVarName=egor`)
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
