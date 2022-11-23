// Loads all posts
async function loadData() {
    await fetch('http://localhost:3000/api/posts').then(r=> {
        if (!r.ok) {
            throw new Error('Network response was not OK');
          }    
        return r.json()
    })
    .then(Data => {
        let numPosts = Data.length;
        for (let i = 0; i < numPosts; i ++) {
            createCard(Data[i].postId, i);
            writeToCard(Data[i].postId, i);
            emojiCount(Data[i].postId);
        }
        document.getElementById('postTemplate').style.display = 'none';
    })
    .catch((error) => {
        console.error('There has been a problem with your fetch operation:', error);
      });
}

// Adds data to card
function writeToCard(cardId, i) {
    fetch('http://localhost:3000/api/posts/').then(r=> {
        if (!r.ok) {
            throw new Error('Network response was not OK');
          }    
        return r.json()
    })
    .then(Data => {
        let postData = Data[i]
        let post = document.getElementById(cardId);
        post.getElementsByClassName('postTitle')[0].textContent = postData.title;
        post.getElementsByClassName('postDate')[0].textContent = postData.date;
        post.getElementsByClassName('postLocation')[0].textContent = postData.location.postcode;
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
        recentComment = postData.comments[numComments-1].text
        if (recentComment == undefined) {
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
        console.error('There has been a problem with your fetch operation:', error);
    });
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

    const likes = post.getElementsByClassName('likeCount')[0];
    const dislikes = post.getElementsByClassName('dislikeCount')[0];
    const surprised = post.getElementsByClassName('surpriseCount')[0];
    const url = `http://localhost:3000/api/posts/${post.id}/emojis`;
    
    let emojiSelected = false;
    let emojiParam = localStorage.getItem(cardId);

    if (emojiParam) {
            emojiSelected = true;
        } 
    for (const emoji of emojis) {
        
        let classChange = emoji.childNodes[0].className.replace('x bx-', 'x bxs-');

        if (emoji.classList.contains(`${emojiParam}`)) {
            emoji.childNodes[0].className = classChange;
        } 
        else if (emoji.classList.contains('surprise') && emojiParam == 'shocked') {
            emoji.childNodes[0].className = classChange;
        }
             

        emoji.addEventListener('click', () => {
            if (emoji.classList.contains('like') && emojiSelected == false) {
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
                      emoji.childNodes[0].className = classChange;
                      localStorage.setItem(cardId, 'like');
                    });
                emojiSelected = true;
            } 
            else if (emoji.classList.contains('dislike') && emojiSelected == false) {
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
                      emoji.childNodes[0].className = classChange;
                      localStorage.setItem(cardId, 'dislike');
                    });
                emojiSelected = true;
            } 
            else if (emoji.classList.contains('surprise') && emojiSelected == false) {
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
                      emoji.childNodes[0].className = classChange;
                      localStorage.setItem(cardId, 'surprise');
                    });
                emojiSelected = true;
            }
        })
    }
}


window.addEventListener('load', loadData);

