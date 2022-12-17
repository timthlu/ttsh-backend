class AzureApiError extends Error {
    constructor(message) {
        super(message);
    }
}

module.exports = AzureApiError;