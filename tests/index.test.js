const renderDom = require("./helpers");

let dom, document;

// Landing page?

describe("index.html", () => {
    beforeEach(async () => {
        dom = await renderDom("index.html")
        document= await dom.window.document
    })
    test("p has welcome message", () => {
        const p = document.querySelector('p');
        expect(p.textContent).toContain("A platform for discovering the trendiest establishments throughout London.");
    })
    test("Has 'Enter' button", () => {
        const button = document.querySelector("button");
        expect(button).toBeTruthy(); 
    })
    // Enter button redirects to home page
})


// test("h2 is updated when button is clicked", () => {
//     const btn = document.querySelector("#updateTitle");
//     btn.dispatchEvent(new dom.window.Event("click"));
//     const h2 = document.querySelector("h2");
//     expect(h2.textContent).toContain("Button Clicked");
// })