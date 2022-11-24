const renderDom = require('./helpers')

let dom, document;

describe('index.html', () => {
    beforeEach(async () => {
        dom = await renderDom('index.html')
        document = await dom.window.document
    })

    test('it has a title', () => {
        let title = document.querySelector('title')
        expect(title).toBeTruthy()
    })

    test('p has text', () => {
        const p = document.querySelector('p')
        expect(p.textContent).toMatch(/platform/)
    })

    test.skip('button changes h2', () => {
        const btn = document.querySelector('#updateTitle')
        btn.dispatchEvent(new dom.window.Event('click'))
        const h2 = document.querySelector('h2')
        expect(h2.textContent).toContain('button clicked')
    })
})
