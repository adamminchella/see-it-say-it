// Loads all posts
fetch('http://localhost:3000/api/posts').then(r=> r.json())
.then(Data => {
    let numPosts = Data.length;
    for (let i = 0; i < numPosts; i ++) {
        createCard(`post${i}`, i);
        writeToCard(`post${i}`, i);
    }
    document.getElementById('postTemplate').style.display = 'none'
})



// Adds data to card
function writeToCard(cardId, i) {
    fetch('http://localhost:3000/api/posts/').then(r => r.json())
    .then(Data => {let postData = Data[i]

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
    
})
}


function createCard(id) {
    let post = document.getElementsByClassName('post')[0];
    let newCard = post.cloneNode(true);
    newCard.id = id;
    document.getElementsByTagName('main')[0].appendChild(newCard);
}
