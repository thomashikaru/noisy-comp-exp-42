var jsonData = [
  {
    name: "John Doe",
    email: "john.doe@example.com",
  },
];

var xhr = new XMLHttpRequest();
xhr.open(
  "POST",
  "https://noisy-comp-server-311aa565092d.herokuapp.com/api/submit_experiment/3",
  true
);
xhr.setRequestHeader("Content-Type", "application/json");

xhr.onload = function () {
  if (xhr.status >= 200 && xhr.status < 300) {
    console.log("Success:", xhr.responseText);
  } else {
    console.error("Request failed with status: " + xhr.status);
  }
};

xhr.send(JSON.stringify(jsonData));
