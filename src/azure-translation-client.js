const axios = require('axios').default;
const { v4: uuidv4 } = require('uuid');

require('dotenv').config();
const key = process.env.API_KEY;
const endpoint = process.env.ENDPOINT;
const location = process.env.LOCATION;

async function translationClient(text, lang) {
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
    
    return response.data[0].translations[0].text;
}

module.exports = translationClient;
