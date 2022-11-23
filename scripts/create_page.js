

const form = document.querySelector("form");


form.addEventListener("submit", function(e) {
   e.preventDefault();

   const formData = new FormData(form);
   const data = Object.fromEntries(formData);

   fetch("http://localhost:3000/api/posts", {
      method: "POST",
      headers: {
         "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
   })
      .then(response => response.json()
      .then(data => console.log(data)))
      .catch(error => console.error());

      let postID = data.postID
      window.location.href = ``
});

