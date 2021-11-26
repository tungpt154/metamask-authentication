const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    let token = req.headers["authorization"];
    if (!token) {
        return res.status(403).send({error: "A token is required for authentication"});
    }
    try {
        token = token.replace("Bearer ", "");
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = decoded;
    } catch (err) {
        console.log(err)
        return res.status(401).send({error: "Invalid Token"});
    }
    return next();
};

module.exports = verifyToken;