const detectionClient = require('./azuredetectionclient.js');
const translationClient = require('./azuretranslationclient.js');
const OutOfCharactersException = require('./outofcharacterserror.js');
require('dotenv').config();

class TTSService {
    constructor() {
        this.curKeyIndex = 0;
        this.numKeys = process.env.NUM_STANDARD_KEYS;
        this.curKey = process.env[`API_KEY_${this.curKeyIndex}`];
    }

    async translate(text, lang) {
        return await this.rotateKeyMakeRequest(async () => { return await translationClient(text, lang, this.curKey) });
    }

    async detect(text) {
        return await this.rotateKeyMakeRequest(async () => { return await detectionClient(text, this.curKey) });
    }

    rotateKey() {
        this.curKeyIndex = (this.curKeyIndex + 1) % this.numKeys;
        this.curKey = process.env[`API_KEY_${this.curKeyIndex}`];
    }

    setToPayAsYouGoKey() {
        console.log('here');
        this.curKeyIndex = 0;
        this.curKey = process.env[`PAY_AS_YOU_GO_KEY`];
    }

    resetKey() {
        this.curKeyIndex = 0;
        this.curKey = process.env[`API_KEY_${this.curKeyIndex}`];
        return this.curKeyIndex;
    }

    async rotateKeyMakeRequest(requestFunc) {
        for (let i = 0; i < this.numKeys; i++) {
            try {
                return await requestFunc();
            } catch (e) {
                if (OutOfCharactersException.prototype.isPrototypeOf(e)) {
                    this.rotateKey();
                } else { //actual azure api error
                    throw e;
                }
            }
        }

        this.setToPayAsYouGoKey();
        return await requestFunc();
    }   
}

module.exports = TTSService;