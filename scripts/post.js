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

const postId = window.location.href.split("=")[1];

async function fetchData(postId) {
  const url = `http://localhost:3000/api/posts/${postId}`;
  let postData;
  await fetch(url)
    .then((res) => res.json())
    .then((data) => {
      postData = data;
    });

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
  console.log(commentData);
  displayTitleData(postData);
  displayEmojis();
  displayComments(commentData);
}

function displayEmojis() {
  let isEmojiSelected = false;
  emojis.forEach((emoji) => {
    let selectedEmoji = localStorage.getItem(postId);
    if (selectedEmoji) {
      isEmojiSelected = true;
    }
    let classChange = emoji.children[0].className.replace("x bx-", "x bxs-");
    if (emoji.classList.contains(`${selectedEmoji}`)) {
      emoji.children[0].className = classChange;
    } else if (
      emoji.classList.contains("surprise") &&
      selectedEmoji == "shocked"
    ) {
      emoji.childNodes[0].className = classChange;
    }
    emoji.addEventListener("click", (isEmojiSelected) => {
      // const emojiType = emoji.children[1].classList.value;
      const url = `http://localhost:3000/api/posts/${postId}/emojis`;
      if (emoji.classList.contains("like") && !isEmojiSelected) {
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
            emoji.children[0].className = classChange;
            localStorage.setItem(postId, "like");
          });
        isEmojiSelected = true;
      } else if (emoji.classList.contains("dislike") && !isEmojiSelected) {
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
            emoji.children[0].className = classChange;
            localStorage.setItem(postId, "dislike");
          });
        isEmojiSelected = true;
      } else if (emoji.classList.contains("surprise") && !isEmojiSelected) {
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
            emoji.children[0].className = classChange;
            localStorage.setItem(postId, "surprise");
          });
        isEmojiSelected = true;
      }
    });
  });
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

const tx = document.getElementsByTagName("textarea");
for (let i = 0; i < tx.length; i++) {
  tx[i].setAttribute(
    "style",
    "height:" + tx[i].scrollHeight + "px;overflow-y:hidden;"
  );
  tx[i].addEventListener("input", OnInput, false);
}

function OnInput() {
  this.style.height = 0;
  this.style.height = this.scrollHeight + "px";
}

window.addEventListener("load", displayPostData);
