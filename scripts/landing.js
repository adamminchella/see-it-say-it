const landingScript = () => {
    if (decodeURIComponent(document.cookie) && ((window.location.href).includes('index') || !(window.location.href).includes('html'))) {
        window.location.href = 'html/home.html'
    } else {
        if ((window.location.href).includes('index') || !(window.location.href).includes('html')) document.cookie = 'visited=true'
    }
}

module.exports = landingScript
