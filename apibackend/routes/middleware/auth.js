const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        console.log(req.headers);
        const token = req.headers.token;
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        const customerId = decodedToken.customerId;
        if (!decodedToken || !customerId) {
            res.status(403).send("Unauthorized Access");
        } else {
            // res.locals.session = req.session;
            // res.locals.session.isLoggedIn = true;
            // req.customerId = customerId;
            next();
        }
    } catch (err) {
        res.status(403).send(err);
    }
};