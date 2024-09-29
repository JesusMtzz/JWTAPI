require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports.JWTgenerator = (obj) => {
    return jwt.sign(obj, process.env.TOKEN_KEY, {
        expiresIn: 3 * 24 * 60 * 60,
    });
};