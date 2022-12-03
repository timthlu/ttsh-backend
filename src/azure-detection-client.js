const axios = require('axios').default;
const { v4: uuidv4 } = require('uuid');
const OutOfCharactersException = require('./outofcharacterexception.js');

require('dotenv').config();
const endpoint = process.env.ENDPOINT;
const location = process.env.LOCATION;

async function detectionClient(text, key) {
    const response = await axios({
        baseURL: endpoint,
        url: '/detect',
        method: 'post',
        headers: {
            'Ocp-Apim-Subscription-Key': key,
            'Ocp-Apim-Subscription-Region': location,
            'Content-type': 'application/json',
            'X-ClientTraceId': uuidv4().toString()
        },
        params: {
            'api-version': '3.0'
        },
        data: [{
            'text': text
        }],
        responseType: 'json'
    })

    if (response.status === 200) {
        return response.data[0].language;
    } else if (response.status === 403) {
        throw new OutOfCharactersException('Detection failed');
    }
    
}

module.exports = detectionClient;
