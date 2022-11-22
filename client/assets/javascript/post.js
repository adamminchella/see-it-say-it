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

      if (commentData.length > 2 && index < commentData.length - 1) {
        commentCard.classList.add("comment-card-border");
      }

      const commentId = document.createElement("p");
      commentId.classList.add("comment-id");
      commentId.textContent = `#${index + 1}`;

      const commentText = document.createElement("p");
      commentText.classList.add("comment-text");
      commentText.textContent = comment.text;

      const commentDate = document.createElement("p");
      commentDate.classList.add("comment-date");
      commentDate.textContent = comment.date;

      commentCard.appendChild(commentId);
      commentCard.appendChild(commentText);
      commentCard.appendChild(commentDate);

      commentsContainer.appendChild(commentCard);
    });
  }
}

async function displayPostData() {
  const postData = await fetchData("efgh");
  const commentData = postData.comments;
  displayTitleData(postData);
  displayComments(commentData);
}

emojis.forEach((emoji) => {
  emoji.addEventListener("click", () => {
    const emojiType = emoji.children[1].classList.value;
    const url = `http://localhost:3000/api/posts/efgh/emojis`;
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

commentInput.addEventListener("click", () => {
  gifIconContainer.classList.remove("hidden");
  commentInputButton.classList.remove("hidden");
});

document.addEventListener("click", (e) => {
  if (
    !e.target.classList.contains("gif-icon") &&
    !e.target.classList.contains("comment-button") &&
    e.target.id != "comment-input-field"
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
  if (commentInputField.value === "") {
    return;
  } else {
    const url = `http://localhost:3000/api/posts/efgh/comments`;
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: commentInputField.value,
        gif: "unknown",
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        const commentData = data.comments;
        displayComments(commentData);
      });
  }
});

window.addEventListener("load", displayPostData);
