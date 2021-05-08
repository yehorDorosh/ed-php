const api = {
  read: {
    vars: ['testData', 'testDataGet']
  },
  write: {
    vars: {
      testWriteData: 99999,
      crash: 12,
      x: 23,
      mama: 'papa'
    }
  }
};

// fetch('http://localhost:7777/api.php/', {
//   method: 'POST',
//   body: JSON.stringify(api)
// })
// .then(response => {
//   if (response.ok) {
//     return response.json();
//   } else {
//     console.log("Ошибка HTTP: " + response.status);
//   }
// })
// .then(data => {
//   console.log(data);
// })
// .catch(error => console.log(error));

// fetch('http://localhost:7777/api.php?readVarName=testDataGet')
// .then(response => {
//   if (response.ok) {
//     return response.json();
//   } else {
//     console.log("Ошибка HTTP: " + response.status);
//   }
// })
// .then(data => {
//   console.log(data);
// })
// .catch(error => console.log(error));

const apiDelete = {
  all: true,
  vars: []
}

fetch('http://localhost:7777/api.php/', {
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