let button = document.getElementsByClassName("button");
const form = document.querySelector("form");

let labels = []

Array.from(button).forEach(button => {
   button.addEventListener("click", (e) => {
      e.preventDefault()
      const clickedButton = button.value;
      console.log(labels);

      if (labels.length <= 3) {
         console.log("test")
         for (let value of labels) {
            if (value == clickedButton) {
               console.log(labels.indexOf(value))
               labels.splice(labels.indexOf(value), 1)
               console.log(labels)
            }
            else {
               labels.push(clickedButton)
               console.log(clickedButton)
            }
         }
      }
      else {
         console.log("Please select max 3 labels")
      }
   })
})



form.addEventListener("submit", function(e) {
   e.preventDefault();

   let titleText = document.getElementById("myTitle").value;
   let descriptionText = document.getElementById("myDescription").value;
   let locationText = document.getElementById("myLocation").value;

   let dataToSend = {
      title: titleText,
      description: descriptionText,
      location: locationText,
      labels: labels
   }

   console.log(dataToSend)

   fetch("http://localhost:3000/api/posts", {
      method: "POST",
      headers: {
         "Content-Type": "application/json"
      },
      body: JSON.stringify(dataToSend)
   })
      .then(response => response.json())
      // .then(data => { 
      //    return (
      //    window.location.href = `post.html?${data.postId}`)})

      .catch(error => console.log(error));
});



