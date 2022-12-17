class OutOfCharactersError extends Error {
    constructor(message) {
        super(message);
    }
}

module.exports = OutOfCharactersError;