const landingScript = () => {
    if (decodeURIComponent(document.cookie)) {
        window.location.href = 'html/home.html'
    } else {
        document.cookie = 'visited=true'
    }
}
