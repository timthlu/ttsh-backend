const detectionClient = require('./azuredetectionclient.js');
const translationClient = require('./azuretranslationclient.js');
require('dotenv').config();

class TTSService {
    constructor() {
        this.key = process.env.AZURE_KEY;
    }

    async translate(text, lang) {
        return await this.rotateKeyMakeRequest(async () => { return await translationClient(text, lang, this.key) });
    }

    async detect(text) {
        return await this.rotateKeyMakeRequest(async () => { return await detectionClient(text, this.key) });
    }
}

module.exports = TTSService;