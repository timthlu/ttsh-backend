const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = 3000;

const TTSService = require('./ttsservice.js');
const ttsService = new TTSService();

app.use(express.json());
app.use(cors({
    origin: process.env.CORS_URL
}));

app.post('/api/detect', async (req, res) => {
    //console.log(req.get('origin'));
    if (!req.body.text) {
        return res.status(400).json({error: 'Request needs a text (string) parameter'});
    }

    try {
        const lang = await ttsService.detect(req.body.text);
        return res.json({lang: lang});
    } catch (e) {
        //send message to discord bot about azure api failing
        return res.status(500).json({error: e.message});
    }
});

app.post('/api/translate', async (req, res) => {
    if (!req.body.text) {
        return res.status(400).json({error: 'Request needs a text (string) parameter'});
    }

    if (!req.body.lang) {
        return res.status(400).json({error: 'Request needs a lang (string) parameter'});
    }

    try {
        const translation = await ttsService.translate(req.body.text, req.body.lang);
        return res.json({translation: translation});
    } catch (e) {
        //send message to discord bot about azure api failing
        return res.status(500).json({error: e.message});
    }
});

// app.patch('/api/rotatekey', async (req, res) => {
//     if (curKeyIndex + 1 == numKeys) {
//         return res.status(500).json({error: "No keys left, continuing using last key"});
//     }

//     curKeyIndex++;
//     curKey = process.env[`API_KEY_${curKeyIndex}`];

//     return res.json({key: curKeyIndex});
// });

// app.patch('/api/resetkey', async(req, res) => {
//     const key = ttsService.resetKey();
//     return res.json({key: key});
// });

app.listen(port, () => {
    console.log('Server started on port', port);
});