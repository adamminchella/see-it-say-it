(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const createScript = () => {
  const button = document.getElementsByClassName("button");
  const form = document.querySelector("form");

  console.log(button);

  let labels = [];

  Array.from(button).forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      const clickedButton = button.value;

      if (!isButtonClicked(clickedButton)) {
        if (labels.length < 3) {
          labels.push(clickedButton);

          button.style.backgroundColor = "rgb(" + 54 + "," + 98 + "," + 121 + ")";
        }
      } else {
        labels.splice(labels.indexOf(clickedButton), 1);
        button.style.backgroundColor = "rgb(" + 71 + "," + 128 + "," + 157 + ")";
      }
      console.log(labels);
    });
  });

  function isButtonClicked(clickedButton) {
    for (let value of labels) {
      if (value == clickedButton) {
        return true;
      }
    }
    return false;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    let titleText = document.getElementById("myTitle").value;
    let descriptionText = document.getElementById("myDescription").value;
    let locationText = document.getElementById("myLocation").value;

    let dataToSend = {
      title: titleText,
      description: descriptionText,
      location: locationText,
      labels: labels,
    };

    console.log(dataToSend);

    fetch("http://localhost:3000/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToSend),
    })
      .then((response) => response.json())
      .then((data) => {
        return (window.location.href = `./post.html?id=${data.postId}`);
      })

      .catch((error) => console.log(error));
  });
}
module.exports = createScript

},{}],2:[function(require,module,exports){
const landingScript = require('./landing')
const postScript = require('./post')
const createScript = require('./create_page')
landingScript()
// postScript()
// createScript()

// Loads all posts
async function loadData() {
  await fetch("http://localhost:3000/api/posts")
    .then((r) => {
      if (!r.ok) {
        throw new Error("Network response was not OK");
      }
      return r.json();
    })
    .then(Data => {
      let numPosts = Data.length;
      for (let i = numPosts - 1; i >= 0; i--) {
        createCard(Data[i].postId, i);
        writeToCard(Data[i].postId, i);
        emojiCount(Data[i].postId);
      }
      document.getElementById('postTemplate').style.display = 'none';
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
    .then(Data => {
      let postData = Data[i]
      let post = document.getElementById(cardId);
      post.getElementsByClassName('postTitle')[0].textContent = postData.title;
      post.getElementsByClassName('postDate')[0].textContent = postData.date;
      post.getElementsByClassName('postLocation')[0].textContent = postData.location.postcode;

      let random = Math.floor(Math.random() * 5);
      post.getElementsByClassName('postImage')[0].setAttribute('src', `../assets/images/stock${random}.jpg`)

      post.getElementsByClassName('likeCount')[0].textContent = postData.emojis.like;
      post.getElementsByClassName('dislikeCount')[0].textContent = postData.emojis.dislike;
      post.getElementsByClassName('surpriseCount')[0].textContent = postData.emojis.surprise;



      let numLabels = postData.labels.length;
      for (let i = 0; i < numLabels; i++) {
        let label = document.createElement('li');
        let text = document.createTextNode(postData.labels[i]);
        label.appendChild(text);
        post.getElementsByClassName('labels')[0].appendChild(label);
      }

      let numComments = postData.comments.length;
      let comment = document.createElement('p')
      comment.className = 'comment';


      recentComment = postData.comments[numComments - 1].text
      if (recentComment == "") {
        recentComment = 'GIF'
      }
      let text = document.createTextNode(recentComment)


      comment.appendChild(text);
      post.getElementsByClassName('comments')[0].appendChild(comment);

      post.getElementsByClassName('postImage')[0].addEventListener('click', () => {


        window.location.href = `./post.html?id=${post.id}`;


      })

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
  const emojis = post.getElementsByClassName('emoji');


  emojiSet(cardId, 'like', true);
  let emojiParam = JSON.parse(localStorage.getItem(cardId));



  for (const emoji of emojis) {

    let classChange = emoji.childNodes[0].className.replace('x bx-', 'x bxs-');
    if (emojiParam[emoji.classList[2]]) {
      emoji.childNodes[0].className = classChange;
    }


    emoji.addEventListener('click', () => {
      emojiParam = JSON.parse(localStorage.getItem(cardId));
      if (emoji.classList.contains('like') && emojiParam['like'] == false) {
        emojiUpdate(cardId, 'like')
        emoji.childNodes[0].className = classChange;
        emojiSet(cardId, 'like');
      }
      else if (emoji.classList.contains('dislike') && emojiParam['dislike'] == false) {
        emojiUpdate(cardId, 'dislike')
        emoji.childNodes[0].className = classChange;
        emojiSet(cardId, 'dislike');
      }
      else if (emoji.classList.contains('surprise') && emojiParam['surprise'] == false) {
        emojiUpdate(cardId, 'surprise')
        emoji.childNodes[0].className = classChange;
        emojiSet(cardId, 'surprise');
      }
    })
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
    surprise: false
  }
  let emojis = JSON.parse(localStorage.getItem(cardId))
  if (!emojis) {
    localStorage.setItem(cardId, JSON.stringify(emojiToggles))
  } else if (!set) {
    emojis[emoji] = true;
    localStorage.setItem(cardId, JSON.stringify(emojis))
  }
}


window.addEventListener('load', loadData);


},{"./create_page":1,"./landing":3,"./post":4}],3:[function(require,module,exports){
const landingScript = () => {
    if (decodeURIComponent(document.cookie) && ((window.location.href).includes('index') || !(window.location.href).includes('html'))) {
        window.location.href = 'html/home.html'
    } else {
        if ((window.location.href).includes('index') || !(window.location.href).includes('html')) document.cookie = 'visited=true'
    }
}

module.exports = landingScript

},{}],4:[function(require,module,exports){
const postScript = () => {


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
    console.log(commentData);
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
    console.log(labelData);
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
      emoji.addEventListener("click", () => {
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
}
module.exports = postScript

},{}]},{},[2]);
