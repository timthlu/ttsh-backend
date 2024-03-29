const axios = require('axios').default;
const { v4: uuidv4 } = require('uuid');
const OutOfCharactersError = require('./outofcharacterserror.js');
const AzureApiError = require('./azureapierror.js');

require('dotenv').config();
const endpoint = process.env.ENDPOINT;
const location = process.env.LOCATION;

async function translationClient(text, lang, key) {
    const response = await axios({
        baseURL: endpoint,
        url: '/translate',
        method: 'post',
        headers: {
            'Ocp-Apim-Subscription-Key': key,
            'Ocp-Apim-Subscription-Region': location,
            'Content-type': 'application/json',
            'X-ClientTraceId': uuidv4().toString()
        },
        params: {
            'api-version': '3.0',
            'to': lang
        },
        data: [{
            'text': text
        }],
        responseType: 'json'
    });

    if (response.status === 200) {
        return response.data[0].translations[0].text;
    } else if (response.status === 403) {
        throw new OutOfCharactersError('Translation failed');
    } else {
        throw new AzureApiError('Azure API call failed');
    }
}

module.exports = translationClient;
