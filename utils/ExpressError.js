class ExpressError extends Error {
    constructor(statusCode, message) {
        super(message); // ✅ Pass the message to the parent Error constructor
        this.statusCode = statusCode;
        this.name = "ExpressError"; // (Optional) Give your error a name for easier debugging
    }
}

module.exports = ExpressError;
