const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/jwtConfig');

const noAuthUrls = ['/register'];
const adminAuthUrls = [];
const applicationAuthUrls = [];

module.exports = (req, res, next) => {
    const path = req.originalUrl;

    if (noAuthUrls.includes(path)) return next();

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) return res.status(401).json({ message: 'No token provided' });

    const token = authHeader.replace('Bearer ', '');
    let decoded;
    try { decoded = jwt.verify(token, jwtSecret); }
    catch (err) { return res.status(401).json({ message: 'Invalid token' }); }

    req.body.reqesterObj = { requesterId: decoded.id, role: decoded.role };

    if (decoded.role === 'user') {
        if (applicationAuthUrls.includes(path)) return next();
        return res.status(403).json({ message: 'Forbidden for user' });
    } else if (decoded.role === 'admin') {
        if (adminAuthUrls.includes(path) || applicationAuthUrls.includes(path)) return next();
        return res.status(403).json({ message: 'Forbidden for admin' });
    } else return res.status(401).json({ message: 'Invalid role' });
};
