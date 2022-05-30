const fs = require('fs');
const path = require('path');
const express = require('express');

const ssc = fs.readFileSync(path.join(__dirname, '../ssc.prod.js')).toString();
const html = fs.readFileSync(path.join(__dirname, './index.html')).toString();

const app = express();
const port = 3232;

function setup() {
    app.use(express.static('test'));
    app.get('/ssc.js', (req, res) => res.send(ssc));
    app.get('/:script', (req, res) => res.send(html.replace('{{ INJECT }}', req.params.script)));
    app.listen(port, () => console.log(`app listening on port ${port}`));
}

async function test(script, expected) {
    await browser.url(`http://localhost:${port}/${script}`);
    const result = await browser.executeAsync(function(done) {
        top.done = done;
    });
    expect(result).toBe(expected);
}

setup();

describe('test communication works', async () => {
    it('should successfully send and receive a message from script legit', async () => {
        await test('legit', 'GOT MESSAGE FROM SCRIPT "legit" : PONG');
    });

    it('should fail to impersonate script legit by doing nothing', async () => {
        await test('naive', 'GOT MESSAGE FROM SCRIPT "naive" : PONG');
    });

    it('should fail to impersonate script legit by attempting to change current script src using .src setter', async () => {
        await test('set-src', 'GOT NO MESSAGES');
    });

    it('should fail to impersonate script legit by attempting to change current script src using setAttribute()', async () => {
        await test('set-attribute', 'GOT NO MESSAGES');
    });

    it('should fail to impersonate script legit by attempting to change current script src using setAttributeNS()', async () => {
        await test('set-attribute-ns', 'GOT NO MESSAGES');
    });

    it('should fail to impersonate script legit by attempting to change current script src using setAttributeNode()', async () => {
        await test('set-attribute-node', 'GOT NO MESSAGES');
    });

    it('should fail to impersonate script legit by attempting to change current script src using setAttributeNodeNS()', async () => {
        await test('set-attribute-node-ns', 'GOT NO MESSAGES');
    });

    it('should fail to impersonate script legit by attempting to change current script src attribute node value', async () => {
        await test('set-attribute-node-value', 'GOT MESSAGE FROM SCRIPT "set-attribute-node-value" : PONG');
    });

    it('should fail to impersonate script legit by attempting to change current script src attribute node value via setNamedItem()', async () => {
        await test('set-attribute-named-item', 'GOT MESSAGE FROM SCRIPT "set-attribute-named-item" : PONG');
    });

    it('should fail to impersonate script legit by attempting to change current script src attribute node value via setNamedItemNS()', async () => {
        await test('set-attribute-named-item-ns', 'GOT MESSAGE FROM SCRIPT "set-attribute-named-item-ns" : PONG');
    });
});