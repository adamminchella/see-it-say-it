// Loads all posts
async function loadData() {
    await fetch('http://localhost:3000/api/posts').then(r=> r.json())
    .then(Data => {
        let numPosts = Data.length;
        for (let i = 0; i < numPosts; i ++) {
            createCard(Data[i].postId, i);
            writeToCard(Data[i].postId, i);
            emojiCount(Data[i].postId);
        }
        document.getElementById('postTemplate').style.display = 'none';
    })
}

// Adds data to card
function writeToCard(cardId, i) {
    fetch('http://localhost:3000/api/posts/').then(r => r.json())
    .then(Data => {let postData = Data[i]

    let post = document.getElementById(cardId);
    post.getElementsByClassName('postTitle')[0].textContent = postData.title;
    post.getElementsByClassName('postDate')[0].textContent = postData.date;
    post.getElementsByClassName('postLocation')[0].textContent = postData.location.postcode;
    post.getElementsByClassName('like')[0].textContent = postData.emojis.like;
    post.getElementsByClassName('dislike')[0].textContent = postData.emojis.dislike;
    post.getElementsByClassName('surprise')[0].textContent = postData.emojis.surprise;
    
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
    let text = document.createTextNode(postData.comments[numComments-1].text)
    comment.appendChild(text);
    post.getElementsByClassName('comments')[0].appendChild(comment);

    post.getElementsByClassName('postImage')[0].addEventListener('click', () => {
        window.location.href = `./html/post.html?id=${post.id}`;
    })
    
})
}


function createCard(id) {
    let post = document.getElementsByClassName('post')[0];
    let newCard = post.cloneNode(true);
    newCard.id = id;
    document.getElementsByTagName('main')[0].appendChild(newCard);
}

function emojiCount(cardId) {
    const post = document.getElementById(cardId);
    const emojis = post.getElementsByClassName('emoji');
    const likes = post.getElementsByClassName('like')[0];
    const dislikes = post.getElementsByClassName('dislike')[0];
    const surprised = post.getElementsByClassName('surprise')[0];
    const url = `http://localhost:3000/api/posts/${post.id}/emojis`;
    let emojiSelected = false;
    for (const emoji of emojis) {
        
        emoji.addEventListener('click', () => {
            if (emoji.classList.contains('liked') && emojiSelected == false) {
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
                emojiSelected = true;
            } 
            else if (emoji.classList.contains('disliked') && emojiSelected == false) {
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
                emojiSelected = true;
            } 
            else if (emoji.classList.contains('surprised') && emojiSelected == false){
                fetch(url, {
                    method: "PUT",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ emoji: "surprise" }),
                  })
                    .then((res) => res.json())
                    .then((data) => {
                      surprised.textContent = data.emojis.surprise;
                    });
                emojiSelected = true;
            }
        })
    }
}

window.addEventListener('load', loadData);

