const {rateLimit} = require('express-rate-limit');

exports.loginLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 min limit window
    max: 5,
    // message: 'Too many login requests. Please try again later.',
    handler: (req, res, next) =>
    {
        let err = new Error("Too many login requests. Please try again later.");
        err.status = 429;
        return next(err);
    }
})