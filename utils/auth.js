// middleware/auth.js
const jwt = require('jsonwebtoken');
const { client } = require('../config')

let db = client.db("users")

async function auth(req, res, next) {
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    const token = authHeader.split(' ')[1];

    const exist = await db.collection('jwt').findOne({ jwt: token });
    if (!exist) {
        return res.status(401).json({ msg: 'No existe token' });
    }

    try {
        const decoded = jwt.verify(token, process.env.TOKEN_KEY);
        req.user = decoded.user;
        next();
    } catch (error) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
}

module.exports = auth;