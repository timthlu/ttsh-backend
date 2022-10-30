const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

const detectionClient = require('./azure-detection-client.js');
const translationClient = require('./azure-translation-client.js');

require('dotenv').config();
var curKeyIndex = 0;
var numKeys = process.env.NUM_KEYS;
var curKey = process.env[`API_KEY_${curKeyIndex}`];

app.use(express.json());
app.use(cors({
    origin: '*'
}));

app.post('/api/detect', async (req, res) => {
    if (!req.body.text) {
        return res.status(400).json({error: 'Request needs a text (string) parameter'});
    }

    //call microsoft language detection api
    const lang = await detectionClient(req.body.text, curKey);
    return res.json({lang: lang});
});

app.post('/api/translate', async (req, res) => {
    if (!req.body.text) {
        return res.status(400).json({error: 'Request needs a text (string) parameter'});
    }

    if (!req.body.lang) {
        return res.status(400).json({error: 'Request needs a lang (string) parameter'});
    }

    //call microsoft language detection api
    const translation = await translationClient(req.body.text, req.body.lang, curKey);
    return res.json({translation: translation});
});

app.patch('/api/rotatekey', async (req, res) => {
    if (curKeyIndex + 1 == numKeys) {
        return res.status(500).json({error: "No keys left, continuing using last key"});
    }

    curKeyIndex++;
    curKey = process.env[`API_KEY_${curKeyIndex}`];

    return res.json({key: curKeyIndex});
});

app.patch('/api/resetkey', async(req, res) => {
    curKeyIndex = 0;
    curKey = process.env[`API_KEY_${curKeyIndex}`];

    return res.json({key: curKeyIndex});
});

app.listen(port, () => {
    console.log('Server started on port', port);
});
