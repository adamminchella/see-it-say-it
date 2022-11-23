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
      commentDate.textContent = new Date(comment.date).toString().slice(0, 24);

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
  displayComments(commentData);
}

emojis.forEach((emoji) => {
  emoji.addEventListener("click", () => {
    const emojiType = emoji.children[1].classList.value;
    const url = `http://localhost:3000/api/posts/${postId}/emojis`;
    if (emojiType == "likes") {
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
    } else if (emojiType == "dislikes") {
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
    } else if (emojiType == "surprises") {
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
    }
  });
});

commentInputField.addEventListener("click", () => {
  gifIconContainer.classList.remove("hidden");
  commentInputButton.classList.remove("hidden");
});

commentInputField.addEventListener("input", () => {
  if (
    commentInputField.value != "" &&
    commentInputButton.classList.contains("comment-button-inactive")
  ) {
    commentInputButton.classList.remove("comment-button-inactive");
  } else if (commentInputField.value == "") {
    commentInputButton.classList.add("comment-button-inactive");
  }
});

document.addEventListener("click", (e) => {
  console.log(e.target);
  if (
    !e.target.classList.contains("gif-icon") &&
    !e.target.classList.contains("comment-button") &&
    e.target.id != "comment-input-field" &&
    commentInputField.value == "" &&
    !e.target.classList.contains("exit-gif-search") &&
    !e.target.classList.contains("gif-search-input-field") &&
    !e.target.classList.contains("gif-search-button") &&
    !e.target.classList.contains("search-icon") &&
    !e.target.classList.contains("gifImg") &&
    !e.target.classList.contains("selected-gif-container")
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
    commentInputField.value === ""
    // selectedGifContainer.children.length == 0
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
        const gifImg = document.querySelector(".gifImg");
        if (gifImg) {
          gifImg.remove();
        }
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
  console.log(selectedGifContainer.children);
  if (selectedGifContainer.children.length > 0) {
    return;
  }
  const gifSearchContainer = document.querySelector(".gif-search-container");
  gifSearchContainer.classList.remove("hidden");
});

gifSearchButton.addEventListener("click", () => {
  const gifContainer = document.querySelector(".gif-container");
  const gifSearchInput = document.querySelector(".gif-search-input-field");
  const url = `http://api.giphy.com/v1/gifs/search?q=${gifSearchInput.value}&api_key=LdS1Lnx8uwLjE30dp797RTX5JA9L7YxD`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      data.data.forEach((element) => {
        const src = element.images.fixed_height_small.url;
        const gif = document.createElement("img");
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
          selectedGifContainer.appendChild(gif);
          gifSearchContainer.classList.add("hidden");
          gifSearchInput.value = "";
          gifContainer.replaceChildren();
        });
      });
    });
});

exitButton.addEventListener("click", () => {
  const gifSearchContainer = document.querySelector(".gif-search-container");
  gifSearchContainer.classList.add("hidden");
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
