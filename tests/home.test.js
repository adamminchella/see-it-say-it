const renderDom = require("./helpers");

let dom, document;

// Home page

describe("home.html", () => {

    beforeEach(async () => {
        dom = await renderDom("home.html")
        document= await dom.window.document
    })
    test("Cards appear on homepage", () => {
        const card = document.querySelector(".postInfo")
        expect(card).toBeTruthy();
    })
    
    test("It has a title which has text", () => {
        const title = document.querySelector("h2");
        expect(title).toBeTruthy()
        expect(title).toBeDefined();
    })

    test("It has a date which has text", () => {
        const date = document.querySelector(".postDate");
        expect(date).toBeTruthy();
        expect(date).toBeDefined();
    })

    test("It has a location which has text", () => {
        const location= document.querySelector(".postLocation");
        expect(location).toBeTruthy();
        expect(location).toBeDefined();
    })

    test("redirected when new post button is clicked", () => {
        const btn = document.querySelector("newPost");
        expect(btn).toBeTruthy();
        btn.dispatchEvent(new dom.window.Event("click"));
    })

    test("Emojis exists and they can be clicked", () => {
        const like = document.querySelector(".emoji icon like");
        const dislike = document.querySelector("emoji icon dislike");
        const shock = document.querySelector("emoji icon surprise");
        expect(like).toBeTruthy();
        expect(dislike).toBeTruthy();
        expect(shock).toBeTruthy();
    })
})
