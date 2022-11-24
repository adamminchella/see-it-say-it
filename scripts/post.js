const title = document.querySelector(".title");
const description = document.querySelector(".description");
const likes = document.querySelector(".likes");
const dislikes = document.querySelector(".dislikes");
const surprises = document.querySelector(".surprises");

const commentsHeader = document.querySelector(".comments-header");
const commentsContainer = document.querySelector(".comments-container");

const emojis = document.querySelectorAll(".emoji-container");

const commentInput = document.querySelector(".comment-input");
const commentButtons = document.querySelector(".comment-buttons-container");
const gifIconContainer = document.querySelector(".gif-icon-container");
const commentInputButton = document.querySelector(".comment-button");
const commentInputField = document.querySelector("#comment-input-field");
const exitButton = document.querySelector(".exit-gif-search");

const blurBackground = document.querySelector(".blur");

const tx = document.querySelector("textarea");

const postId = window.location.href.split("=")[1];

async function fetchData(postId) {
  const url = `http://localhost:3000/api/posts/${postId}`;
  let postData;
  await fetch(url)
    .then((res) => res.json())
    .then((data) => {
      postData = data;
    });
  console.log(postData);
  return postData;
}

function displayTitleData(postData) {
  title.textContent = postData.title;
  description.textContent = postData.description;
  likes.textContent = [postData.emojis.like];
  dislikes.textContent = [postData.emojis.dislike];
  surprises.textContent = [postData.emojis.surprise];
}

function displayComments(commentData) {
  const allComments = document.querySelectorAll(".comment-card");
  allComments.forEach((comment) => {
    comment.remove();
  });
  if (commentData.length === 0) {
    commentsHeader.textContent = "Be the first to comment!";
  } else {
    commentsHeader.textContent = "Comments";
    commentData.forEach((comment, index) => {
      const commentCard = document.createElement("div");
      commentCard.classList.add("comment-card");

      if (commentData.length > 1 && index < commentData.length - 1) {
        commentCard.classList.add("comment-card-border");
      }

      const commentId = document.createElement("p");
      commentId.classList.add("comment-id");
      commentId.textContent = `#${index + 1}`;

      const commentGif = document.createElement("img");
      if (comment.gif != "gif url...") {
        // console.log(commentGif);

        commentGif.src = comment.gif;
      } else {
        commentGif.classList.add("hidden");
      }

      const commentText = document.createElement("p");
      commentText.classList.add("comment-text");
      commentText.textContent = comment.text;

      const commentDate = document.createElement("p");
      commentDate.classList.add("comment-date");

      commentDate.textContent = new Date(comment.date).toString().slice(0, 21);

      commentCard.appendChild(commentId);

      commentCard.appendChild(commentGif);

      commentCard.appendChild(commentText);
      commentCard.appendChild(commentDate);

      commentsContainer.appendChild(commentCard);
    });
  }
}

async function displayPostData() {
  const postData = await fetchData(postId);
  const commentData = postData.comments;
  const labelData = postData.labels;
  displayTitleData(postData);
  displayEmojis();
  displayLabels(labelData);
  displayComments(commentData);
}

function displayLabels(labelData) {
  const labelsContainer = document.querySelector(".labels-container");
  if (labelData.length > 0) {
    labelData.forEach((label) => {
      const labelDiv = document.createElement("div");
      labelDiv.textContent = label;
      labelsContainer.appendChild(labelDiv);
    });
  }
}

function displayEmojis() {
  emojiSet(postId, "like", true);
  let emojiParam = JSON.parse(localStorage.getItem(postId));
  emojis.forEach((emoji) => {
    console.log(emojiParam);
    let classChange = emoji.children[0].className.replace("x bx-", "x bxs-");
    console.log(emoji.children[0]);
    if (emojiParam[emoji.classList[1]]) {
      emoji.children[0].className = classChange;
    }
    emoji.addEventListener("click", () => {
      emojiParam = JSON.parse(localStorage.getItem(postId));
      console.log(emojiParam);
      const url = `http://localhost:3000/api/posts/${postId}/emojis`;

      if (emoji.classList.contains("like") && emojiParam["like"] == false) {
        fetch(url, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ emoji: "like" }),
        })
          .then((res) => res.json())
          .then((data) => {
            likes.textContent = data.emojis.like;
          });
        emoji.children[0].className = classChange;
        emojiSet(postId, "like");
      } else if (
        emoji.classList.contains("dislike") &&
        emojiParam["dislike"] == false
      ) {
        fetch(url, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ emoji: "dislike" }),
        })
          .then((res) => res.json())
          .then((data) => {
            dislikes.textContent = data.emojis.dislike;
          });

        emoji.children[0].className = classChange;
        emojiSet(postId, "dislike");
      } else if (
        emoji.classList.contains("surprise") &&
        emojiParam["surprise"] == false
      ) {
        fetch(url, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ emoji: "surprise" }),
        })
          .then((res) => res.json())
          .then((data) => {
            surprises.textContent = data.emojis.surprise;
          });
        emoji.children[0].className = classChange;
        emojiSet(postId, "surprise");
      }
    });
  });
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

function emojiSet(postId, emoji, set) {
  let emojiToggles = {
    like: false,
    dislike: false,
    surprise: false,
  };
  let emojis = JSON.parse(localStorage.getItem(postId));
  if (!emojis) {
    localStorage.setItem(postId, JSON.stringify(emojiToggles));
  } else if (!set) {
    emojis[emoji] = true;
    localStorage.setItem(postId, JSON.stringify(emojis));
  }
}

commentInputField.addEventListener("click", () => {
  gifIconContainer.classList.remove("hidden");
  commentInputButton.classList.remove("hidden");
});

// commentInputField.addEventListener("input", () => {
//   if (
//     commentInputField.value != "" &&
//     commentInputButton.classList.contains("comment-button-inactive")
//   ) {
//     commentInputButton.classList.remove("comment-button-inactive");
//   } else if (commentInputField.value == "") {
//     commentInputButton.classList.add("comment-button-inactive");
//   }
// });

document.addEventListener("click", (e) => {
  if (
    e.target.id != "comment-input-field" &&
    commentInputField.value == "" &&
    !e.target.classList.contains("gif-icon") &&
    !e.target.classList.contains("comment-button") &&
    !e.target.classList.contains("exit-gif-search") &&
    !e.target.classList.contains("close-icon") &&
    !e.target.classList.contains("gif-search-input-field") &&
    !e.target.classList.contains("gif-search-button") &&
    !e.target.classList.contains("search-icon") &&
    !e.target.classList.contains("gifImg") &&
    !e.target.classList.contains("blur") &&
    !e.target.classList.contains("selected-gif-container") &&
    !e.target.classList.contains("gif-container") &&
    !e.target.classList.contains("gif-search-container") &&
    !e.target.classList.contains("gif-img-delete-button")
  ) {
    if (!gifIconContainer.classList.contains("hidden")) {
      gifIconContainer.classList.add("hidden");
    }
    if (!commentInputButton.classList.contains("hidden")) {
      commentInputButton.classList.add("hidden");
    }
  }
});

commentInputButton.addEventListener("click", () => {
  const selectedGifContainer = document.querySelector(
    ".selected-gif-container"
  );

  if (
    commentInputField.value === "" &&
    selectedGifContainer.children.length == 0
  ) {
    return;
  } else {
    let gifUrl;
    if (selectedGifContainer.children.length > 0) {
      gifUrl = selectedGifContainer.firstChild.src;
    } else {
      gifUrl = "gif url...";
    }
    const url = `http://localhost:3000/api/posts/${postId}/comments`;
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: commentInputField.value,
        gif: gifUrl,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        selectedGifContainer.replaceChildren();
        const commentData = data.comments;
        console.log(commentData);
        displayComments(commentData);
      });
  }
  commentInputField.value = "";
  commentInputButton.classList.add("hidden");
  gifIconContainer.classList.add("hidden");
  OnInput(tx);
});

const gifSearchButton = document.querySelector(".gif-search-button");

gifIconContainer.addEventListener("click", () => {
  const selectedGifContainer = document.querySelector(
    ".selected-gif-container"
  );
  if (selectedGifContainer.children.length > 0) {
    return;
  }
  const gifSearchContainer = document.querySelector(".gif-search-container");
  blurBackground.classList.remove("hidden");
  gifSearchContainer.classList.remove("hidden");
});

gifSearchButton.addEventListener("click", () => {
  const gifContainer = document.querySelector(".gif-container");
  const gifSearchInput = document.querySelector(".gif-search-input-field");
  const url = `https://api.giphy.com/v1/gifs/search?q=${gifSearchInput.value}&api_key=LdS1Lnx8uwLjE30dp797RTX5JA9L7YxD`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      data.data.forEach((element) => {
        const src = element.images.fixed_height_small.url;
        const gif = document.createElement("img");
        const gifDeleteButton = document.createElement("img");
        gifDeleteButton.classList.add("gif-img-delete-button");
        gifDeleteButton.setAttribute("src", "../assets/images/close-icon.png");
        gif.classList.add("gifImg");
        gif.setAttribute("src", src);
        gifContainer.appendChild(gif);
        gif.addEventListener("click", () => {
          const gifSearchContainer = document.querySelector(
            ".gif-search-container"
          );
          const selectedGifContainer = document.querySelector(
            ".selected-gif-container"
          );
          gif.style.cursor = "default";

          gifDeleteButton.addEventListener("click", () => {
            selectedGifContainer.replaceChildren();
          });

          selectedGifContainer.appendChild(gif);
          selectedGifContainer.appendChild(gifDeleteButton);
          gifSearchContainer.classList.add("hidden");

          blurBackground.classList.add("hidden");
          gifSearchInput.value = "";
          gifContainer.replaceChildren();
        });
      });
    });
});

exitButton.addEventListener("click", () => {
  const gifSearchContainer = document.querySelector(".gif-search-container");
  gifSearchContainer.classList.add("hidden");
  blurBackground.classList.add("hidden");
});

tx.setAttribute("style", "height:" + tx.scrollHeight + "px;overflow-y:hidden;");
tx.addEventListener(
  "input",
  () => {
    OnInput(tx);
  },
  false
);

function OnInput(tx) {
  tx.style.height = 0;
  tx.style.height = tx.scrollHeight + "px";
}

window.addEventListener("load", displayPostData);
