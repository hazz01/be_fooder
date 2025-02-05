"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRole = exports.verifyToken = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const global_1 = require("../global");
const verifyToken = (req, res, next) => {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    if (!token) {
        return res.status(403).json({ message: 'Access denied. No token provided.' });
    }
    try {
        const secretKey = global_1.SECRET || "";
        const decoded = (0, jsonwebtoken_1.verify)(token, secretKey);
        req.body.user = decoded;
        next();
    }
    catch (error) {
        return res.status(401).json({ message: 'Invalid token.' });
    }
};
exports.verifyToken = verifyToken;
const verifyRole = (allowedRoles) => {
    return (req, res, next) => {
        const user = req.body.user;
        if (!user) {
            return res.status(403).json({ message: 'No user information available.' });
        }
        if (!allowedRoles.includes(user.role)) {
            return res.status(403)
                .json({ message: `Access denied. Requires one of the following roles: ${allowedRoles.join(', ')}` });
        }
        next();
    };
};
exports.verifyRole = verifyRole;
