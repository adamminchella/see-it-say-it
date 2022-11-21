

function writeToCard(cardId) {
    fetch('http://localhost:3000/api/posts/efgh').then(r => r.json())
    .then(Data => {let postData = Data

    let post = document.getElementById(cardId);
    post.setAttribute('data-id', postData.postId)
    post.getElementsByClassName('postTitle')[0].textContent = postData.title;
    post.getElementsByClassName('postDate')[0].textContent = postData.date;
    post.getElementsByClassName('postLocation')[0].textContent = postData.location.postcode;
    post.getElementsByClassName('like')[0].textContent = postData.emojis.like;
    post.getElementsByClassName('dislike')[0].textContent = postData.emojis.dislike;
    post.getElementsByClassName('surprise')[0].textContent = postData.emojis.surprise;
    
    let numLabels = postData.labels.length;
    for (let i = 0; i < numLabels; i++) {
        let label = document.createElement('li')
        let text = document.createTextNode(postData.labels[i])
        label.appendChild(text);
        post.getElementsByClassName('labels')[0].appendChild(label);
    }

    for (let i = 0; i < 3; i++) {
        let comment = document.createElement('p')
        comment.className = 'comment';
        let text = document.createTextNode(postData.comments[i].text)
        comment.appendChild(text);
        post.getElementsByClassName('comments')[0].appendChild(comment);
    }
})
}

function createCard(id) {
    let post = document.getElementsByClassName('post')[0];
    let newCard = post.cloneNode(true);
    newCard.id = id;
    document.getElementsByTagName('main')[0].appendChild(newCard);
}

createCard("newCard")
writeToCard("newCard")
