const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server.js');

chai.use(chaiHttp);

const Translator = require('../components/translator.js');
const translator = new Translator();

suite('Functional Tests', () => {
    suite('Test POST requests to /api/transate', () => {
        test('Translation with text and locale fields', done => {
            const text = 'bog-standard bone-idle burgle by-election car boot sale';
            chai
            .request(server)
            .post("/api/translate")
            .send({
                text: text,
                locale: 'british-to-american'
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.type, "application/json");
                assert.equal(res.body.translation, translator.translate(text, 'british-to-american').translation);
                done();
            });
        });
        test('Translation with text and invalid locale field', done => {
            chai
            .request(server)
            .post("/api/translate")
            .send({
                text: 'text',
                locale: 'croatian-to-arabic'
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.type, "application/json");
                assert.equal(res.body.error, 'Invalid value for locale field');
                done();
            });
        });
        test('Translation with missing text field', done => {
            chai
            .request(server)
            .post("/api/translate")
            .send({
                locale: 'british-to-american'
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.type, "application/json");
                assert.equal(res.body.error, 'Required field(s) missing');
                done();
            });
        });
        test('Translation with missing locale field', done => {
            chai
            .request(server)
            .post("/api/translate")
            .send({
                text: 'text',
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.type, "application/json");
                assert.equal(res.body.error, 'Required field(s) missing');
                done();
            });
        });
        test('Translation with empty text', done => {
            chai
            .request(server)
            .post("/api/translate")
            .send({
                text: '',
                locale: 'british-to-american'
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.type, "application/json");
                assert.equal(res.body.error, 'No text to translate');
                done();
            });
        });
        test('Translation with text that needs no translation', done => {
            chai
            .request(server)
            .post("/api/translate")
            .send({
                text: 'Yes.',
                locale: 'british-to-american'
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.type, "application/json");
                assert.equal(res.body.translation, 'Everything looks good to me!');
                done();
            });
        });
    });
});
