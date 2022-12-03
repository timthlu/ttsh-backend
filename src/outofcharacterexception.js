class OutOfCharactersException extends Error {
    constructor(message) {
        this.message = message;
    }
}

module.exports = OutOfCharactersException;