"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.secretKey = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.secretKey = 'qwertyuioplkjhgfdsazxcvbnmQWERTYUIOPLKJHGFDSAZXCVBNM.,1234567890!@#$%^&*()';
const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized: Token missing' });
    }
    const [, actualToken] = token.split(' ');
    try {
        const decodedToken = jsonwebtoken_1.default.verify(actualToken, exports.secretKey);
        next();
    }
    catch (error) {
        console.error('Error decoding token:', error);
        res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
};
exports.default = authenticateToken;
