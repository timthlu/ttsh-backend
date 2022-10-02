const express = require('express');
const app = express();
const port = 3000;

const detectionClient = require('./azure-detection-client.js');
const translationClient = require('./azure-translation-client.js');

app.use(express.json());

app.get('/api/detect', async (req, res) => {
    if (!req.body.text) {
        return res.status(400).json({error: 'Request needs a text (string) parameter'});
    }

    //call microsoft language detection api
    const lang = await detectionClient(req.body.text);
    return res.json({lang: lang});
});

app.get('/api/translate', async (req, res) => {
    if (!req.body.text) {
        return res.status(400).json({error: 'Request needs a text (string) parameter'});
    }

    if (!req.body.lang) {
        return res.status(400).json({error: 'Request needs a lang (string) parameter'});
    }

    //call microsoft language detection api
    const translation = await translationClient(req.body.text, req.body.lang);
    return res.json({translation: translation});
});

app.listen(port, () => {
    console.log('Server started on port', port);
});
