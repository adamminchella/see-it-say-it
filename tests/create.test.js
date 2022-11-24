const renderDom = require("./helpers");

let dom, document;

// Create page

describe("home.html", () => {

    beforeEach(async () => {
        dom = await renderDom("home.html")
        document= await dom.window.document
    })
    test("h2 has an instruction message", () => {
        h2 = document.querySelector("h2")
        expect(h2).toBeTruthy()
        expect(h2).toContain("Please fill in the form below to create a new blog post:")
    })
})

// Test title to be no more than 200 characters
// Description to be no more than 500 characters
// Location to be no more than 4 characters