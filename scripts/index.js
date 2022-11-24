// Loads all posts
async function loadData() {
  await fetch("http://localhost:3000/api/posts")
    .then((r) => {
      if (!r.ok) {
        throw new Error("Network response was not OK");
      }
      return r.json();
    })
    .then((Data) => {
      let numPosts = Data.length;
      for (let i = numPosts - 1; i >= 0; i--) {
        createCard(Data[i].postId, i);
        writeToCard(Data[i].postId, i);
        emojiCount(Data[i].postId);
      }
      document.getElementById("postTemplate").style.display = "none";
    })
    .catch((error) => {
      console.error(
        "There has been a problem with your fetch operation:",
        error
      );
    });
}

// Adds data to card
function writeToCard(cardId, i) {
  fetch("http://localhost:3000/api/posts/")
    .then((r) => {
      if (!r.ok) {
        throw new Error("Network response was not OK");
      }
      return r.json();
    })
    .then((Data) => {
      let postData = Data[i];
      console.log(postData);
      let post = document.getElementById(cardId);
      post.getElementsByClassName("postTitle")[0].textContent = postData.title;
      post.getElementsByClassName("postDate")[0].textContent = new Date(
        postData.date
      )
        .toString()
        .slice(0, 24);
      post.getElementsByClassName("postLocation")[0].textContent =
        postData.location.postcode;

      let random = Math.floor(Math.random() * 5);
      post
        .getElementsByClassName("postImage")[0]
        .setAttribute("src", `../assets/images/stock${random}.jpg`);

      post.getElementsByClassName("likeCount")[0].textContent =
        postData.emojis.like;
      post.getElementsByClassName("dislikeCount")[0].textContent =
        postData.emojis.dislike;
      post.getElementsByClassName("surpriseCount")[0].textContent =
        postData.emojis.surprise;

      let numLabels = postData.labels.length;
      for (let i = 0; i < numLabels; i++) {
        let label = document.createElement("li");
        let text = document.createTextNode(postData.labels[i]);
        label.appendChild(text);
        post.getElementsByClassName("labels")[0].appendChild(label);
      }

      let numComments = postData.comments.length;
      let comment = document.createElement("p");
      comment.className = "comment";
      recentComment = postData.comments[numComments - 1];
      if (recentComment) {
        if (recentComment.text == "") {
          recentComment.text = "GIF";
        }
      }
      let text = document.createTextNode(recentComment.text);
      console.log(text);

      comment.appendChild(text);
      post.getElementsByClassName("comments")[0].appendChild(comment);

      post
        .getElementsByClassName("postImage")[0]
        .addEventListener("click", () => {
          window.location.href = `./post.html?id=${post.id}`;
        });
    })
    .catch((error) => {
      console.error(
        "There has been a problem with your fetch operation:",
        error
      );
    });
}

function createCard(id) {
  let post = document.getElementsByClassName("post")[0];
  let newCard = post.cloneNode(true);
  newCard.id = id;
  document.getElementsByTagName("main")[0].appendChild(newCard);
}

function emojiCount(cardId) {

  const post = document.getElementById(cardId);
  const emojis = post.getElementsByClassName("emoji");

  emojiSet(cardId, "like", true);
  let emojiParam = JSON.parse(localStorage.getItem(cardId));

  for (const emoji of emojis) {
    let classChange = emoji.childNodes[0].className.replace("x bx-", "x bxs-");

    if (emojiParam[emoji.classList[2]]) {
      emoji.childNodes[0].className = classChange;
    }

    emoji.addEventListener("click", () => {
      emojiParam = JSON.parse(localStorage.getItem(cardId));
      if (emoji.classList.contains("like") && emojiParam["like"] == false) {
        emojiUpdate(cardId, "like");
        emoji.childNodes[0].className = classChange;
        emojiSet(cardId, "like");
      } else if (
        emoji.classList.contains("dislike") &&
        emojiParam["dislike"] == false
      ) {
        emojiUpdate(cardId, "dislike");
        emoji.childNodes[0].className = classChange;
        emojiSet(cardId, "dislike");
      } else if (
        emoji.classList.contains("surprise") &&
        emojiParam["surprise"] == false
      ) {
        emojiUpdate(cardId, "surprise");
        emoji.childNodes[0].className = classChange;
        emojiSet(cardId, "surprise");
      }
    });

  }
}

function emojiUpdate(cardId, emoji) {
  const post = document.getElementById(cardId);

  const count = post.getElementsByClassName(`${emoji}Count`)[0];

  fetch(`http://localhost:3000/api/posts/${post.id}/emojis`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ emoji: emoji }),
  })
    .then((res) => res.json())
    .then((data) => {
      count.textContent = data.emojis[emoji];
    });
}

function emojiSet(cardId, emoji, set) {
  let emojiToggles = {
    like: false,
    dislike: false,

    surprise: false,
  };
  let emojis = JSON.parse(localStorage.getItem(cardId));
  if (!emojis) {
    localStorage.setItem(cardId, JSON.stringify(emojiToggles));
  } else if (!set) {
    emojis[emoji] = true;
    localStorage.setItem(cardId, JSON.stringify(emojis));
  }
}

window.addEventListener("load", loadData);




window.onscroll = function (ev) {
  if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
    document.getElementById('newPost').style.display = 'none'
  }
  else {
    document.getElementById('newPost').style.display = 'inline'

  }
};

