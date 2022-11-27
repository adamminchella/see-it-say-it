const cardElement = document.querySelector("#postTemplate").cloneNode(true)

function applySkeleton() {
	const postTemplate = document.querySelector("#postTemplate")
	postTemplate.querySelector("img").style.display = "none"
	let imageSkeleton = document.createElement("div")
	imageSkeleton.id = "image-skeleton"
	imageSkeleton.classList.add("skeleton-box")
	postTemplate.prepend(imageSkeleton)
	postTemplate.querySelector(".postTitle").classList.add("skeleton-box")
	let icons = postTemplate.querySelectorAll(".icon")
	icons.forEach((icon) => {
		icon.style.visibility = "hidden"
	})
	postTemplate.querySelector(".postDate").classList.add("skeleton-box")
	postTemplate.querySelector(".postLocation").classList.add("skeleton-box")
	postTemplate.querySelector(".likeCount").classList.add("skeleton-box")
	postTemplate.querySelector(".dislikeCount").classList.add("skeleton-box")
	postTemplate.querySelector(".surpriseCount").classList.add("skeleton-box")
	let emojis = postTemplate.querySelectorAll("li")
	emojis.forEach((emoji) => {
		// emoji.children[0].style.visibility = "hidden"
		emoji.classList = "skeleton-box"
	})
}

// Loads all posts
function loadData() {
	applySkeleton()

	fetch("https://see-it-say-it-api.herokuapp.com/api/posts")
		.then((res) => res.json())
		.then((data) => {
			if (data) {
				let numPosts = data.length
				for (let i = numPosts - 1; i >= 0; i--) {
					createCard(data[i].postId)
					writeToCard(data[i])
					showEmojiCount(data[i].postId)
				}
				document.querySelector("#postTemplate").style.display = "none"
			}
		})
		.catch((error) => {
			console.error("There has been a problem with your fetch operation:", error)
		})
}

function createCard(id) {
	let newCard = cardElement.cloneNode(true)
	newCard.id = id
	document.querySelector("main").appendChild(newCard)
}

// Adds data to card
function writeToCard(post) {
	let cardElement = document.getElementById(post.postId)
	cardElement.querySelector(".postTitle").textContent = post.title
	cardElement.querySelector(".postDate").textContent = new Date(post.date)
		.toString()
		.slice(0, 24)
	cardElement.querySelector(".postLocation").textContent =
		post.location.postcode.toUpperCase()

	let random = Math.floor(Math.random() * 5)
	cardElement
		.querySelector(".postImage")
		.setAttribute("src", `../assets/images/stock${random}.jpg`)

	cardElement.querySelector(".emojis").id = post.postId
	cardElement.querySelector(".likeCount").textContent = post.emojis.like
	cardElement.querySelector(".dislikeCount").textContent = post.emojis.dislike
	cardElement.querySelector(".surpriseCount").textContent = post.emojis.surprise

	let numLabels = post.labels.length
	for (let i = 0; i < numLabels; i++) {
		let label = document.createElement("li")
		let text = document.createTextNode(post.labels[i])
		label.appendChild(text)
		cardElement.querySelector(".labels").appendChild(label)
	}

	let numComments = post.comments.length
	let comment = document.createElement("div")
	let commentText = document.createElement("p")
	let commentTime = document.createElement("p")
	let gif = document.createElement("img")
	comment.className = "comment"
	recentComment = post.comments[numComments - 1]
	if (recentComment) {
		let time = document.createTextNode(
			new Date(recentComment.date).toString().slice(0, 21)
		)
		commentTime.appendChild(time)
		let text = document.createTextNode(recentComment.text)
		commentText.appendChild(text)
		gif.setAttribute("src", recentComment.gif)
		comment.appendChild(commentTime)
		comment.appendChild(commentText)
		comment.appendChild(gif)
	}
	cardElement.querySelector(".comments").appendChild(comment)

	cardElement.querySelector(".postImage").addEventListener("click", () => {
		window.location.href = `./post.html?id=${post.postId}`
	})
}

function showEmojiCount(postId) {
	//Initialise session storage
	let session = JSON.parse(sessionStorage.getItem(postId))
	if (!session)
		sessionStorage.setItem(
			postId,
			JSON.stringify({
				like: false,
				dislike: false,
				surprise: false,
			})
		)

	const post = document.getElementById(postId)
	const emojiElements = post.querySelectorAll(".emoji")

	for (const emojiSpan of emojiElements) {
		if (session[emojiSpan.classList[2]]) {
			emojiSpan.children[0].className = updateIconStyle(emojiSpan.children[0])
		}
		emojiSpan.addEventListener("click", (event) => onClickEmoji(event, postId))
	}
}

function updateIconStyle(emojiElement) {
	return emojiElement.className.replace(
		/bx-(?=\w{4,})/, //find 'bx-' only where prefixes icon name
		"bxs-" //change to solid style
	)
}

async function onClickEmoji(event, postId) {
	let clickedEmoji = event.currentTarget.className.split(" ")[2]
	let isAlreadyClicked = event.target.classList[1].includes("bxs")
	if (!isAlreadyClicked) {
		//only update locally if server response ok
		try {
			const newEmojiData = await emojiUpdate(postId, clickedEmoji)
			let countElement = event.target.parentNode.nextElementSibling
			countElement.textContent = newEmojiData[clickedEmoji]
			event.target.className = updateIconStyle(event.target)
			setEmojiSessionStorage(postId, clickedEmoji)
		} catch (err) {
			console.warn(err)
		}
	}
}

function setEmojiSessionStorage(postId, emoji) {
	let emojis = JSON.parse(sessionStorage.getItem(postId))
	emojis[emoji] = true
	sessionStorage.setItem(postId, JSON.stringify(emojis))
}

function emojiUpdate(postId, emoji) {
	return new Promise((res, rej) => {
		fetch(`https://see-it-say-it-api.herokuapp.com/api/posts/${postId}/emojis`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ emoji: emoji }),
		})
			.then((res) => res.json())
			.catch((err) => rej(err))
			.then((data) => res(data.emojis))
	})
}

window.addEventListener("load", loadData)

if ((document.body.querySelector(".post").length = 0)) {
	document.getElementById("newPost").style.display = "inline"
} else {
	window.onscroll = function (ev) {
		if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
			document.getElementById("newPost").style.display = "none"
		} else {
			document.getElementById("newPost").style.display = "inline"
		}
	}
}
