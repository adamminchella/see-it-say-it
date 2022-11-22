const title = document.querySelector(".title");
const description = document.querySelector(".description");
const likes = document.querySelector(".likes");
const dislikes = document.querySelector(".dislikes");
const surprises = document.querySelector(".surprises");

const commentsHeader = document.querySelector(".comments-header");
const commentsContainer = document.querySelector(".comments-container");

const emojis = document.querySelectorAll(".emoji-container");

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
      commentId.textContent = `#${comment.id}`;

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
    const emojiTypeClass = emoji.children[1].classList;
    const url = `http://localhost:3000/api/posts/efgh/emojis`;
    if (emojiTypeClass.contains("likes")) {
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
    } else if (emojiTypeClass.contains("dislikes")) {
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
    } else if (emojiTypeClass.contains("surprises")) {
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

window.addEventListener("load", displayPostData);
